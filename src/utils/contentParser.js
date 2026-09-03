// Parser Khusus untuk mengekstrak konten per prodi yang sangat amat tahan banting (Bulletproof)

// Helper: Membuang Label Visi/Misi/Tujuan yang Menempel di Awal String
function stripLabel(text) {
    // Membuang label "Visi :", "Misi", "Tujuan :" di awal string jika masih tertinggal
    return text.replace(/^(?:<[^>]+>|\s)*(?:VISI\s*&amp;\s*MISI|VISI|MISI|TUJUAN|STRATEGI|SASARAN|STRUKTUR ORGANISASI)\s*(?::)?\s*(?:<\/[^>]+>|\s)*/i, '').trim();
}

function extractProspek(clean, prospekIdx) {
    if (prospekIdx === -1) return '';
    
    let chunk = clean.substring(prospekIdx);
    
    // Hapus judul "Prospek Kerja" aslinya (beserta tag pembungkusnya seperti <h3> atau <strong>)
    chunk = chunk.replace(/^(?:<[^>]+>|\s)*(?:Prospek Kerja)\s*(?::)?\s*(?:<\/[^>]+>|\s)*/i, '');
    
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

// Fungsi utama pemisah string menggunakan index regex murni (tanpa mempedulikan tag HTML)
function parseGenericContent(html, keys) {
    let clean = html.replace(/<div class="wp-block-media-text[^>]*>.*?<\/div><\/div>/gis, '');
    let result = { deskripsi: '', prospek: '' };
    keys.forEach(k => result[k] = '');

    const indices = {};
    keys.forEach(key => {
        let regex;
        if (key === 'visi') regex = /(?:<[^>]+>|\s)*(?:VISI\s*&amp;\s*MISI|VISI)\s*(?::)?\s*(?:<[^>]+>|\s)*/i;
        else if (key === 'struktur') regex = /(?:<[^>]+>|\s)*STRUKTUR\s*ORGANISASI\s*(?::)?\s*(?:<[^>]+>|\s)*/i;
        else regex = new RegExp(`(?:<[^>]+>|\\s)*${key}\\s*(?::)?\\s*(?:<[^>]+>|\\s)*`, 'i');
        
        let match = clean.match(regex);
        indices[key] = match ? match.index : -1;
    });

    const prospekMatch = clean.match(/(?:<[^>]+>|\s)*PROSPEK\s*KERJA\s*(?::)?\s*(?:<[^>]+>|\s)*/i);
    const prospekIdx = prospekMatch ? prospekMatch.index : -1;

    // Dapatkan semua index yang valid (tidak -1)
    let validIndices = Object.values(indices).filter(idx => idx !== -1);
    if (prospekIdx !== -1) validIndices.push(prospekIdx);
    
    // Deskripsi adalah teks dari 0 sampai index valid terkecil
    let firstCut = validIndices.length > 0 ? Math.min(...validIndices) : clean.length;
    result.deskripsi = clean.substring(0, firstCut);

    // Proses setiap key
    keys.forEach(key => {
        const idx = indices[key];
        if (idx !== -1) {
            // Cari index berikutnya setelah idx ini
            let nextIndices = validIndices.filter(i => i > idx);
            let nextCut = nextIndices.length > 0 ? Math.min(...nextIndices) : clean.length;
            
            let chunk = clean.substring(idx, nextCut);
            result[key] = stripLabel(chunk);
        }
    });

    // Proses Prospek Kerja
    if (prospekIdx !== -1) {
        result.prospek = extractProspek(clean, prospekIdx);
    }

    return result;
}


export function parseInformatikaContent(html) {
    if (!html) return { deskripsi: '', prospek: '', visi: '', misi: '', tujuan: '' };
    return parseGenericContent(html, ['visi', 'misi', 'tujuan']);
}

export function parseMesinContent(html) {
    if (!html) return { deskripsi: '', prospek: '', visi: '', misi: '', tujuan: '' };
    return parseGenericContent(html, ['visi', 'misi', 'tujuan']);
}

export function parseOtomotifContent(html) {
    if (!html) return { deskripsi: '', prospek: '', visi: '', misi: '', tujuan: '' };
    return parseGenericContent(html, ['visi', 'misi', 'tujuan']);
}

export function parseElektronikaContent(html) {
    if (!html) return { deskripsi: '', prospek: '', visi: '', misi: '', tujuan: '', strategi: '', sasaran: '', struktur: '' };
    return parseGenericContent(html, ['visi', 'misi', 'tujuan', 'strategi', 'sasaran', 'struktur']);
}
