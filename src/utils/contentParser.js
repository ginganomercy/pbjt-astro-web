// Parser cerdas untuk mengekstrak bagian-bagian penting dari teks mentah WordPress
export function parseProdiContent(html) {
    if (!html) return { deskripsi: '', prospek: '', visi: '', misi: '', tujuan: '' };

    // 1. Bersihkan sampah awal
    let clean = html.replace(/<img[^>]*>/g, '');
    clean = clean.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '');
    clean = clean.replace(/<div class="wp-block-media-text__content">[\s\S]*?<\/div>/gi, '');
    clean = clean.replace(/-Sertifikat Akreditasi[^<]*(?:<br\s*\/?>|<\/p>)/gi, '');

    // 2. Ekstrak Deskripsi (Semua sebelum Prospek Kerja atau VISI)
    let deskripsi = clean;
    const prospekIdx = clean.search(/<strong>Prospek Kerja<\/strong>/i);
    const visiIdx = clean.search(/<h2[^>]*>VISI &amp; MISI<\/h2>|<strong>Visi\s*:\s*<\/strong>/i);
    
    let firstCut = clean.length;
    if (prospekIdx !== -1 && prospekIdx < firstCut) firstCut = prospekIdx;
    if (visiIdx !== -1 && visiIdx < firstCut) firstCut = visiIdx;
    
    deskripsi = clean.substring(0, firstCut);

    // 3. Ekstrak Prospek Kerja
    let prospek = '';
    if (prospekIdx !== -1) {
        const endIdx = visiIdx !== -1 ? visiIdx : clean.length;
        let chunk = clean.substring(prospekIdx, endIdx);
        // Hapus judul "Prospek Kerja" karena kita pakai judul dari Astro
        chunk = chunk.replace(/<p[^>]*><strong>Prospek Kerja<\/strong>.*?<\/p>/is, '');
        
        // FLAWLESS PARSER: Menangani ketidakkonsistenan tag <em> dan <strong> dari WordPress
        
        // a. Bersihkan semua tag <em> dan <strong> agar judul menjadi teks polos murni
        chunk = chunk.replace(/<\/?(?:em|strong)[^>]*>/gi, "");
        
        // b. Temukan Outer <li> yang punya anak <ul (karena <ul penanda mulainya deskripsi).
        // Regex ini membungkus Judul Pekerjaan dengan desain flex & ikon svg biru.
        // ((?:(?!<li|<\/li>).)*?) memastikan kita tidak kebablasan mencaplok <li> lain.
        chunk = chunk.replace(/(<li[^>]*>)((?:(?!<li|<\/li>).)*?)(<ul)/gis, (match, p1, p2, p3) => {
            let cleanTitle = p2.trim();
            // Jika ada teks kosong karena salah format HTML, kasih default
            if (!cleanTitle) cleanTitle = "Pilihan Karir";
            
            return `${p1}
            <div class="flex items-start text-slate-900 font-extrabold mb-3 mt-1 text-lg">
                <svg class="w-6 h-6 mr-3 text-blue-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                <span>${cleanTitle}</span>
            </div>
            ${p3}`;
        });
        
        prospek = chunk;
    }

    // 4. Ekstrak Visi
    let visi = '';
    const visiMatch = clean.match(/<strong>Visi\s*:\s*<\/strong>\s*<\/p>\s*<p[^>]*>([\s\S]*?)<\/p>/i) || clean.match(/<strong>Visi\s*:\s*<\/strong>([\s\S]*?)(?=<strong>Misi)/i);
    if (visiMatch) {
        visi = visiMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
    }

    // 5. Ekstrak Misi
    let misi = '';
    const misiBlock = clean.split(/<strong>Misi\s*:\s*<\/strong><\/p>/i)[1] || clean.split(/<strong>Misi\s*:\s*<\/strong>/i)[1];
    if (misiBlock) {
        let chunk = misiBlock.split(/<strong>Tujuan/i)[0];
        chunk = chunk.replace(/<ol/gi, '<ol class="space-y-3 list-decimal list-inside text-slate-600"');
        misi = chunk;
    }

    // 6. Ekstrak Tujuan
    let tujuan = '';
    const tujuanBlock = clean.split(/<strong>Tujuan\s*:\s*<\/strong><\/p>/i)[1] || clean.split(/<strong>Tujuan\s*:\s*<\/strong>/i)[1];
    if (tujuanBlock) {
        let chunk = tujuanBlock;
        chunk = chunk.replace(/<ol/gi, '<ol class="space-y-3 list-decimal list-inside text-slate-600"');
        tujuan = chunk;
    }

    return { deskripsi, prospek, visi, misi, tujuan };
}
