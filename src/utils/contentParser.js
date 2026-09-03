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
        // Hapus judul "Prospek Kerja" dari dalam blok itu sendiri karena kita akan pakai judul buatan Astro
        chunk = chunk.replace(/<p[^>]*><strong>Prospek Kerja<\/strong>.*?<\/p>/is, '');
        
        // 1. Ubah nested <ul><li> (deskripsi pekerjaan) menjadi tag <p> biasa agar tidak tumpang tindih
        chunk = chunk.replace(/<ul[^>]*>\s*<li[^>]*>([\s\S]*?)<\/li>\s*<\/ul>/gi, '<p class="text-slate-600 text-base leading-relaxed">$1</p>');
        
        // 2. Format tag <ul> terluar menjadi Grid
        chunk = chunk.replace(/<ul[^>]*>/gi, '<ul class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">');
        
        // 3. Format tag <li> terluar menjadi desain Kartu (Card) dengan mengekstrak judul pekerjaannya
        chunk = chunk.replace(/<li[^>]*>([\s\S]*?)<p/gi, (match, p1) => {
            // p1 berisi judul pekerjaan (misal: <em>Software Engineer</em>)
            let jobTitle = p1.replace(/<\/?[^>]+(>|$)/g, "").trim(); // Bersihkan dari tag <em> dll
            
            return `<li class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div class="flex items-start text-slate-900 font-extrabold mb-3 text-lg">
                    <svg class="w-6 h-6 mr-3 text-blue-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                    <span>${jobTitle}</span>
                </div>
                <p`;
        });
        
        prospek = chunk;
    }

    // 4. Ekstrak Visi
    let visi = '';
    const visiMatch = clean.match(/<strong>Visi\s*:\s*<\/strong>\s*<\/p>\s*<p[^>]*>([\s\S]*?)<\/p>/i) || clean.match(/<strong>Visi\s*:\s*<\/strong>([\s\S]*?)(?=<strong>Misi)/i);
    if (visiMatch) {
        visi = visiMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
    }

    // 5. Ekstrak Misi (sebagai raw HTML string list)
    let misi = '';
    const misiBlock = clean.split(/<strong>Misi\s*:\s*<\/strong><\/p>/i)[1] || clean.split(/<strong>Misi\s*:\s*<\/strong>/i)[1];
    if (misiBlock) {
        let chunk = misiBlock.split(/<strong>Tujuan/i)[0];
        // Inject tailwind
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
