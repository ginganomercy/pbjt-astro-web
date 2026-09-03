const API_URL = 'https://wp.pbjt.ac.id/wp-json/wp/v2';

/**
 * Mengambil daftar berita terbaru (Posts)
 */
export async function getPosts(limit = 6) {
    try {
        const response = await fetch(`${API_URL}/posts?_embed&per_page=${limit}`);
        if (!response.ok) throw new Error('Gagal menarik data berita');
        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

/**
 * Mengambil detail satu berita berdasarkan Slug
 */
export async function getPostBySlug(slug) {
    try {
        const response = await fetch(`${API_URL}/posts?_embed&slug=${slug}`);
        if (!response.ok) throw new Error('Gagal menarik detail berita');
        const posts = await response.json();
        return posts.length > 0 ? posts[0] : null;
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
}

/**
 * Mengambil daftar semua Halaman (Pages)
 */
export async function getPages() {
    try {
        // Fetch up to 100 pages
        const response = await fetch(`${API_URL}/pages?_embed&per_page=100`);
        if (!response.ok) throw new Error('Gagal menarik halaman');
        return await response.json();
    } catch (error) {
        console.error('Error fetching pages:', error);
        return [];
    }
}

/**
 * Mengambil detail satu Halaman berdasarkan Slug
 */
export async function getPageBySlug(slug) {
    try {
        const response = await fetch(`${API_URL}/pages?_embed&slug=${slug}`);
        if (!response.ok) throw new Error('Gagal menarik detail halaman');
        const pages = await response.json();
        return pages.length > 0 ? pages[0] : null;
    } catch (error) {
        console.error('Error fetching page by slug:', error);
        return null;
    }
}

/**
 * Mengambil daftar Dosen
 */
export async function getDosen(limit = 100) {
    try {
        const response = await fetch(`${API_URL}/dosen?_embed&per_page=${limit}`);
        if (!response.ok) throw new Error('Gagal menarik data dosen');
        return await response.json();
    } catch (error) {
        console.error('Error fetching dosen:', error);
        return [];
    }
}

/**
 * Mengambil detail Dosen berdasarkan Slug
 */
export async function getDosenBySlug(slug) {
    try {
        const response = await fetch(`${API_URL}/dosen?_embed&slug=${slug}`);
        if (!response.ok) throw new Error('Gagal menarik detail dosen');
        const dosenList = await response.json();
        return dosenList.length > 0 ? dosenList[0] : null;
    } catch (error) {
        console.error('Error fetching dosen by slug:', error);
        return null;
    }
}

/**
 * Super Fetcher: Mengambil daftar data untuk sembarang Custom Post Type
 * @param {string} postType - Slug dari tipe pos (misal: 'fasilitas', 'ukm')
 * @param {number} limit - Batas jumlah data yang diambil
 */
export async function getDynamicPosts(postType, limit = 100) {
    try {
        const response = await fetch(`${API_URL}/${postType}?_embed&per_page=${limit}`);
        if (!response.ok) throw new Error(`Gagal menarik data ${postType}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${postType}:`, error);
        return [];
    }
}

/**
 * Super Fetcher: Mengambil detail satu pos dari sembarang Custom Post Type
 * @param {string} postType - Slug dari tipe pos
 * @param {string} slug - Slug URL spesifik item
 */
export async function getDynamicPostBySlug(postType, slug) {
    try {
        const response = await fetch(`${API_URL}/${postType}?_embed&slug=${slug}`);
        if (!response.ok) throw new Error(`Gagal menarik detail ${postType}`);
        const items = await response.json();
        return items.length > 0 ? items[0] : null;
    } catch (error) {
        console.error(`Error fetching ${postType} by slug:`, error);
        return null;
    }
}
