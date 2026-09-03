// Parser Khusus untuk mengekstrak konten per prodi tanpa regex backtracking

function findStartOfBlock(text, keywordIndex) {
    if (keywordIndex === -1) return -1;
    
    // Potong string dari awal sampai keyword
    const beforeKeyword = text.substring(0, keywordIndex);
    
    // Cari tag penutup terakhir sebelum keyword (</p>, </div>, </h2>, </h3>, </ul>, </ol>)
    const matches = [...beforeKeyword.matchAll(/<\/(?:p|div|h\d|ul|ol|li)>/gi)];
    
    if (matches.length > 0) {
        // Blok baru dimulai tepat setelah tag penutup terakhir
        const lastMatch = matches[matches.length - 1];
        return lastMatch.index + lastMatch[0].length;
    }
    
    // Jika tidak ada tag penutup sebelumnya, berarti ini di awal dokumen
    return 0;
}

// Helper: Membuang Label Visi/Misi/Tujuan yang Menempel di Awal String tanpa regex jahat
function stripLabel(text) {
    // Ambil sebagian awal untuk mencari label
    const prefix = text.substring(0, 500);
    const match = prefix.match(/\b(?:VISI\s*&amp;\s*MISI|VISI\s*DAN\s*MISI|VISI|MISI|TUJUAN|STRATEGI|SASARAN|STRUKTUR ORGANISASI)\s*(?::)?/i);
    
    if (match) {
        // Hapus label persis yang ditemukan
        let labelRegex = new RegExp(match[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        text = text.replace(labelRegex, '');
    }
    
    // Hapus <hr> berlebih di awal
    text = text.replace(/^(?:\s*<hr[^>]*>\s*)+/i, '');
    
    // Hapus tag kosong seperti <h2></h2> atau <p><strong></strong></p> yang tertinggal
    text = text.replace(/^(?:\s*<[^>]+>\s*<\/[^>]+>\s*)+/i, '');
    
    return text.trim();
}

function extractProspek(chunk) {
    if (!chunk) return '';
    
    // Hapus judul "Prospek Kerja" aslinya (beserta tag pembungkusnya)
    chunk = chunk.replace(/^(?:<[^>]+>|\s)*(?:Prospek Kerja)\s*(?::)?\s*(?:<\/[^>]+>|\s)*/i, '');
    
    // Bersihkan semua tag <em> dan <strong> agar judul menjadi teks polos murni
    chunk = chunk.replace(/<\/?(?:em|strong)[^>]*>/gi, "");
    
    // Desain UI Kartu Flex
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

function parseGenericContent(html, keys) {
    let clean = html.replace(/<div class="wp-block-media-text[^>]*>.*?<\/div><\/div>/gis, '');
    let result = { deskripsi: '', prospek: '' };
    keys.forEach(k => result[k] = '');

    const keywordRegexes = {
        'visi': /\b(?:VISI\s*&amp;\s*MISI|VISI\s*DAN\s*MISI|VISI)\b/i,
        'misi': /\bMISI\b/i,
        'tujuan': /\bTUJUAN\b/i,
        'strategi': /\bSTRATEGI\b/i,
        'sasaran': /\bSASARAN\b/i,
        'struktur': /\bSTRUKTUR\s*ORGANISASI\b/i,
        'prospek': /\bPROSPEK\s*KERJA\b/i
    };

    const blockStarts = {};
    
    // Khusus untuk menghindari Misi di dalam "VISI & MISI", kita cari secara berurutan atau hapus dulu
    // Tapi karena kita mencari indeks aktual, jika MISI ditemukan dengan indeks yang sangat dekat dengan VISI,
    // kita bisa mengabaikannya.
    
    keys.forEach(key => {
        let match = clean.match(keywordRegexes[key]);
        if (match) {
            // Jika ini 'misi', pastikan ia bukan bagian dari "VISI & MISI"
            if (key === 'misi' && blockStarts['visi'] !== undefined) {
                // Cek apakah MISI ini berada di dalam blok yang sama dengan VISI
                let visiKeywordIdx = clean.match(keywordRegexes['visi']).index;
                if (match.index > visiKeywordIdx && match.index < visiKeywordIdx + 20) {
                    // Cari MISI berikutnya
                    let nextMatch = clean.substring(match.index + 5).match(keywordRegexes['misi']);
                    if (nextMatch) {
                        match = { index: match.index + 5 + nextMatch.index };
                    } else {
                        match = null;
                    }
                }
            }
        }
        
        if (match) {
            blockStarts[key] = findStartOfBlock(clean, match.index);
        } else {
            blockStarts[key] = -1;
        }
    });

    let prospekMatch = clean.match(keywordRegexes['prospek']);
    let prospekStart = prospekMatch ? findStartOfBlock(clean, prospekMatch.index) : -1;

    let validStarts = Object.values(blockStarts).filter(idx => idx !== -1);
    if (prospekStart !== -1) validStarts.push(prospekStart);
    
    // Sort agar kita bisa memotong dari satu blok ke blok berikutnya
    validStarts.sort((a, b) => a - b);
    
    // Deskripsi
    let firstCut = validStarts.length > 0 ? validStarts[0] : clean.length;
    result.deskripsi = clean.substring(0, firstCut);

    keys.forEach(key => {
        const startIdx = blockStarts[key];
        if (startIdx !== -1) {
            // Cari potongan berikutnya
            let nextStarts = validStarts.filter(idx => idx > startIdx);
            let nextCut = nextStarts.length > 0 ? nextStarts[0] : clean.length;
            
            let chunk = clean.substring(startIdx, nextCut);
            result[key] = stripLabel(chunk);
        }
    });

    if (prospekStart !== -1) {
        let nextStarts = validStarts.filter(idx => idx > prospekStart);
        let nextCut = nextStarts.length > 0 ? nextStarts[0] : clean.length;
        let chunk = clean.substring(prospekStart, nextCut);
        result.prospek = extractProspek(chunk);
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
