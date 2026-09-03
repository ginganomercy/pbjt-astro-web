// Parser Khusus untuk mengekstrak konten per prodi yang tahan banting (Bulletproof)

// Helper: Membersihkan tag judul Prospek Kerja agar hanya kotak CSS yang tersisa
function extractProspek(clean) {
    const prospekMatch = clean.match(/<p[^>]*>(?:<strong>|<em>)?\s*Prospek Kerja.*?(?:<\/strong>|<\/em>)?<\/p>/i);
    if (!prospekMatch) return '';
    const prospekIdx = clean.indexOf(prospekMatch[0]);
    
    let chunk = clean.substring(prospekIdx);
    // Hapus judul aslinya
    chunk = chunk.replace(/<p[^>]*>(?:<strong>|<em>)?\s*Prospek Kerja.*?(?:<\/strong>|<\/em>)?<\/p>/i, '');
    
    // a. Bersihkan semua tag <em> dan <strong> agar judul menjadi teks polos murni
    chunk = chunk.replace(/<\/?(?:em|strong)[^>]*>/gi, "");
    
    // b. Desain UI Kartu Flex
    chunk = chunk.replace(/(<li[^>]*>)((?:(?!<li|<\/li>).)*?)(<ul)/gis, (match, p1, p2, p3) => {
        let cleanTitle = p2.trim();
        if (!cleanTitle) cleanTitle = "Pilihan Karir";
        
        return `${p1}
        <div class="flex items-start text-slate-900 font-extrabold mb-3 mt-1 text-lg">
            <svg class="w-6 h-6 mr-3 text-blue-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
            <span>${cleanTitle}</span>
        </div>
        ${p3}`;
    });
    return chunk;
}

// Helper: Membuang Label Visi/Misi/Tujuan yang Menempel di Awal String
function stripLabel(text) {
    // Membuang label "Visi :", "Misi", "Tujuan :" di awal string jika masih tertinggal
    return text.replace(/^(?:<[^>]+>)*\s*(?:VISI\s*&amp;\s*MISI|VISI|MISI|TUJUAN)\s*(?::)?\s*(?:<\/[^>]+>)*/i, '').trim();
}


// 1. Parser D3 Teknik Informatika
export function parseInformatikaContent(html) {
    if (!html) return { deskripsi: '', prospek: '', visi: '', misi: '', tujuan: '' };
    
    let clean = html.replace(/<div class="wp-block-media-text[^>]*>.*?<\/div><\/div>/gis, '');
    let deskripsi = '', visi = '', misi = '', tujuan = '', prospek = '';

    // Menjadi Toleran: Bisa <strong>Visi</strong> atau Visi : atau VISI &amp; MISI
    const visiMatch = clean.match(/<p[^>]*>.*?(?:<strong>)?Visi(?:<\/strong>)?\s*:?.*?<\/p>|<h[^>]*>.*?VISI\s*&amp;\s*MISI.*?<\/h[^>]*>/i);
    const misiMatch = clean.match(/<p[^>]*>.*?(?:<strong>)?Misi(?:<\/strong>)?\s*:?.*?<\/p>/i);
    const tujuanMatch = clean.match(/<p[^>]*>.*?(?:<strong>)?Tujuan(?:<\/strong>)?\s*:?.*?<\/p>/i);
    const prospekMatch = clean.match(/<p[^>]*>(?:<strong>)?Prospek Kerja(?:<\/strong>)?.*?<\/p>/i);

    let vIdx = visiMatch ? clean.indexOf(visiMatch[0]) : clean.length;
    let mIdx = misiMatch ? clean.indexOf(misiMatch[0]) : clean.length;
    let tIdx = tujuanMatch ? clean.indexOf(tujuanMatch[0]) : clean.length;
    let pIdx = prospekMatch ? clean.indexOf(prospekMatch[0]) : clean.length;

    deskripsi = clean.substring(0, Math.min(vIdx, mIdx, tIdx, pIdx));
    
    if (visiMatch) {
        visi = clean.substring(vIdx, Math.min(mIdx, tIdx, pIdx));
        visi = visi.replace(/<p[^>]*>.*?(?:<strong>)?Visi(?:<\/strong>)?\s*:?.*?<\/p>|<h[^>]*>.*?VISI\s*&amp;\s*MISI.*?<\/h[^>]*>/i, '').trim();
        visi = stripLabel(visi);
    }
    if (misiMatch) {
        misi = clean.substring(mIdx, Math.min(tIdx, pIdx));
        misi = misi.replace(/<p[^>]*>.*?(?:<strong>)?Misi(?:<\/strong>)?\s*:?.*?<\/p>/i, '').trim();
        misi = stripLabel(misi);
    }
    if (tujuanMatch) {
        tujuan = clean.substring(tIdx, pIdx);
        tujuan = tujuan.replace(/<p[^>]*>.*?(?:<strong>)?Tujuan(?:<\/strong>)?\s*:?.*?<\/p>/i, '').trim();
        tujuan = stripLabel(tujuan);
    }
    if (prospekMatch) {
        prospek = extractProspek(clean);
    }
    return { deskripsi, prospek, visi, misi, tujuan };
}


// 2. Parser D3 Teknik Mesin
export function parseMesinContent(html) {
    if (!html) return { deskripsi: '', prospek: '', visi: '', misi: '', tujuan: '' };
    let clean = html.replace(/<div class="wp-block-media-text[^>]*>.*?<\/div><\/div>/gis, '');
    let deskripsi = '', visi = '', misi = '', tujuan = '', prospek = '';

    const visiMatch = clean.match(/<p[^>]*>(?:<strong>)?Visi(?:<\/strong>)?.*?<\/p>/i);
    const misiMatch = clean.match(/<p[^>]*>(?:<strong>)?Misi(?:<\/strong>)?.*?<\/p>/i);
    const tujuanMatch = clean.match(/<p[^>]*>(?:<strong>)?Tujuan(?:<\/strong>)?.*?<\/p>/i);
    const prospekMatch = clean.match(/<p[^>]*>(?:<strong>)?Prospek Kerja(?:<\/strong>)?.*?<\/p>/i);

    let vIdx = visiMatch ? clean.indexOf(visiMatch[0]) : clean.length;
    let mIdx = misiMatch ? clean.indexOf(misiMatch[0]) : clean.length;
    let tIdx = tujuanMatch ? clean.indexOf(tujuanMatch[0]) : clean.length;
    let pIdx = prospekMatch ? clean.indexOf(prospekMatch[0]) : clean.length;

    deskripsi = clean.substring(0, Math.min(vIdx, mIdx, tIdx, pIdx));
    
    if (visiMatch) {
        visi = clean.substring(vIdx, Math.min(mIdx, tIdx, pIdx));
        visi = visi.replace(/<p[^>]*>(?:<strong>)?Visi(?:<\/strong>)?.*?<\/p>/i, '').trim();
        visi = stripLabel(visi);
    }
    if (misiMatch) {
        misi = clean.substring(mIdx, Math.min(tIdx, pIdx));
        misi = misi.replace(/<p[^>]*>(?:<strong>)?Misi(?:<\/strong>)?.*?<\/p>/i, '').trim();
        misi = stripLabel(misi);
    }
    if (tujuanMatch) {
        tujuan = clean.substring(tIdx, pIdx);
        tujuan = tujuan.replace(/<p[^>]*>(?:<strong>)?Tujuan(?:<\/strong>)?.*?<\/p>/i, '').trim();
        tujuan = stripLabel(tujuan);
    }
    if (prospekMatch) {
        prospek = extractProspek(clean);
    }
    return { deskripsi, prospek, visi, misi, tujuan };
}


// 3. Parser D3 Teknik Otomotif (Menangani "Visi :")
export function parseOtomotifContent(html) {
    if (!html) return { deskripsi: '', prospek: '', visi: '', misi: '', tujuan: '' };
    let clean = html.replace(/<div class="wp-block-media-text[^>]*>.*?<\/div><\/div>/gis, '');
    let deskripsi = '', visi = '', misi = '', tujuan = '', prospek = '';

    const visiMatch = clean.match(/<p[^>]*>.*?Visi\s*:.*?<\/p>/i);
    const misiMatch = clean.match(/<p[^>]*>.*?Misi\s*:.*?<\/p>/i);
    const tujuanMatch = clean.match(/<p[^>]*>.*?Tujuan\s*:.*?<\/p>/i);
    const prospekMatch = clean.match(/<p[^>]*>.*?Prospek Kerja.*?<\/p>/i);

    let vIdx = visiMatch ? clean.indexOf(visiMatch[0]) : clean.length;
    let mIdx = misiMatch ? clean.indexOf(misiMatch[0]) : clean.length;
    let tIdx = tujuanMatch ? clean.indexOf(tujuanMatch[0]) : clean.length;
    let pIdx = prospekMatch ? clean.indexOf(prospekMatch[0]) : clean.length;

    deskripsi = clean.substring(0, Math.min(vIdx, mIdx, tIdx, pIdx));
    
    if (visiMatch) {
        visi = clean.substring(vIdx, Math.min(mIdx, tIdx, pIdx));
        visi = visi.replace(/<p[^>]*>.*?Visi\s*:.*?<\/p>/i, '').trim();
        visi = stripLabel(visi);
    }
    if (misiMatch) {
        misi = clean.substring(mIdx, Math.min(tIdx, pIdx));
        misi = misi.replace(/<p[^>]*>.*?Misi\s*:.*?<\/p>/i, '').trim();
        misi = stripLabel(misi);
    }
    if (tujuanMatch) {
        tujuan = clean.substring(tIdx, pIdx);
        tujuan = tujuan.replace(/<p[^>]*>.*?Tujuan\s*:.*?<\/p>/i, '').trim();
        tujuan = stripLabel(tujuan);
    }
    if (prospekMatch) {
        prospek = extractProspek(clean);
    }
    return { deskripsi, prospek, visi, misi, tujuan };
}


// 4. Parser D3 Teknik Elektronika Industri (Menangani format <br> dan blok ekstra)
export function parseElektronikaContent(html) {
    if (!html) return { deskripsi: '', prospek: '', visi: '', misi: '', tujuan: '', strategi: '', sasaran: '', struktur: '' };
    let clean = html.replace(/<div class="wp-block-media-text[^>]*>.*?<\/div><\/div>/gis, '');
    let deskripsi = '', visi = '', misi = '', tujuan = '', strategi = '', sasaran = '', struktur = '', prospek = '';

    const visiMatch = clean.match(/(?:<p[^>]*>.*?<strong>\s*VISI\s*<\/strong>\s*<br\s*\/?>|<p[^>]*>\s*<strong>\s*VISI\s*<\/strong>\s*<\/p>)/i);
    const misiMatch = clean.match(/<p[^>]*>\s*<strong>\s*MISI\s*<\/strong>\s*<\/p>/i);
    const tujuanMatch = clean.match(/<p[^>]*>\s*<strong>\s*TUJUAN\s*<\/strong>\s*<\/p>/i);
    const strategiMatch = clean.match(/<p[^>]*>\s*<strong>\s*STRATEGI\s*<\/strong>\s*<\/p>/i);
    const sasaranMatch = clean.match(/<p[^>]*>\s*<strong>\s*SASARAN\s*<\/strong>\s*<\/p>/i);
    const strukturMatch = clean.match(/<p[^>]*>\s*<strong>\s*STRUKTUR ORGANISASI.*?<\/strong>\s*<\/p>/i);
    const prospekMatch = clean.match(/<p[^>]*>(?:<strong>)?\s*Prospek Kerja.*?(?:<\/strong>)?<\/p>/i);

    let vIdx = visiMatch ? clean.indexOf(visiMatch[0]) : clean.length;
    let mIdx = misiMatch ? clean.indexOf(misiMatch[0]) : clean.length;
    let tIdx = tujuanMatch ? clean.indexOf(tujuanMatch[0]) : clean.length;
    let stIdx = strategiMatch ? clean.indexOf(strategiMatch[0]) : clean.length;
    let saIdx = sasaranMatch ? clean.indexOf(sasaranMatch[0]) : clean.length;
    let orIdx = strukturMatch ? clean.indexOf(strukturMatch[0]) : clean.length;
    let pIdx = prospekMatch ? clean.indexOf(prospekMatch[0]) : clean.length;

    deskripsi = clean.substring(0, Math.min(vIdx, mIdx, tIdx, stIdx, saIdx, orIdx, pIdx));

    if (visiMatch) {
        visi = clean.substring(vIdx, Math.min(mIdx, tIdx, stIdx, saIdx, orIdx, pIdx));
        visi = visi.replace(/(?:<p[^>]*>.*?<strong>\s*VISI\s*<\/strong>\s*<br\s*\/?>|<p[^>]*>\s*<strong>\s*VISI\s*<\/strong>\s*<\/p>)/i, '').trim();
        visi = stripLabel(visi);
    }
    if (misiMatch) {
        misi = clean.substring(mIdx, Math.min(tIdx, stIdx, saIdx, orIdx, pIdx));
        misi = misi.replace(/<p[^>]*>\s*<strong>\s*MISI\s*<\/strong>\s*<\/p>/i, '').trim();
        misi = stripLabel(misi);
    }
    if (tujuanMatch) {
        tujuan = clean.substring(tIdx, Math.min(stIdx, saIdx, orIdx, pIdx));
        tujuan = tujuan.replace(/<p[^>]*>\s*<strong>\s*TUJUAN\s*<\/strong>\s*<\/p>/i, '').trim();
        tujuan = stripLabel(tujuan);
    }
    if (strategiMatch) {
        strategi = clean.substring(stIdx, Math.min(saIdx, orIdx, pIdx));
        strategi = strategi.replace(/<p[^>]*>\s*<strong>\s*STRATEGI\s*<\/strong>\s*<\/p>/i, '').trim();
        strategi = stripLabel(strategi);
    }
    if (sasaranMatch) {
        sasaran = clean.substring(saIdx, Math.min(orIdx, pIdx));
        sasaran = sasaran.replace(/<p[^>]*>\s*<strong>\s*SASARAN\s*<\/strong>\s*<\/p>/i, '').trim();
        sasaran = stripLabel(sasaran);
    }
    if (strukturMatch) {
        struktur = clean.substring(orIdx, pIdx);
        struktur = struktur.replace(/<p[^>]*>\s*<strong>\s*STRUKTUR ORGANISASI.*?<\/strong>\s*<\/p>/i, '').trim();
        struktur = stripLabel(struktur);
    }
    if (prospekMatch) {
        prospek = extractProspek(clean);
    }
    return { deskripsi, prospek, visi, misi, tujuan, strategi, sasaran, struktur };
}
