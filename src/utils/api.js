const API_URL = 'https://wp.pbjt.ac.id/wp-json/wp/v2';
const FETCH_OPTIONS = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
    }
};

// IN-MEMORY CACHE: Mencegah Astro membombardir server WordPress dengan request berulang saat build
const apiCache = new Map();

async function fetchWithCache(url) {
    if (apiCache.has(url)) {
        return apiCache.get(url);
    }
    
    // Fallback sederhana jika WordPress butuh waktu lama
    const response = await fetch(url, FETCH_OPTIONS);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const data = await response.json();
    apiCache.set(url, data);
    return data;
}

/**
 * Mengambil daftar berita terbaru (Posts)
 */
export async function getPosts(limit = 6) {
    try {
        return await fetchWithCache(`${API_URL}/posts?_embed&per_page=${limit}`);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

/**
 * Ekstrak URL gambar pertama dari string HTML (digunakan sebagai fallback thumbnail)
 */
export function extractFirstImage(htmlString) {
    if (!htmlString) return null;
    const match = htmlString.match(/<img[^>]+src="([^">]+)"/i);
    return match ? match[1] : null;
}

/**
 * Mengambil detail satu berita berdasarkan Slug
 */
export async function getPostBySlug(slug) {
    try {
        const response = await fetchWithCache(`${API_URL}/posts?_embed&slug=${slug}`);
        const posts = response;
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
        return await fetchWithCache(`${API_URL}/pages?_embed&per_page=100`);
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
        const response = await fetchWithCache(`${API_URL}/pages?_embed&slug=${slug}`);
        const pages = response;
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
        return await fetchWithCache(`${API_URL}/dosen?_embed&per_page=${limit}`);
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
        const response = await fetchWithCache(`${API_URL}/dosen?_embed&slug=${slug}`);
        const dosenList = response;
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
        return await fetchWithCache(`${API_URL}/${postType}?_embed&per_page=${limit}`);
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
        const response = await fetchWithCache(`${API_URL}/${postType}?_embed&slug=${slug}`);
        const items = response;
        return items.length > 0 ? items[0] : null;
    } catch (error) {
        console.error(`Error fetching ${postType} by slug:`, error);
        return null;
    }
}
