import postsData from '../data/posts.json';
import pagesData from '../data/pages.json';
import dosenData from '../data/dosen.json';

/**
 * Ekstrak URL gambar pertama dari string HTML (digunakan sebagai fallback thumbnail)
 */
export function extractFirstImage(htmlString) {
    if (!htmlString) return null;
    const match = htmlString.match(/<img[^>]+src="([^">]+)"/i);
    return match ? match[1] : null;
}

/**
 * Mengambil daftar berita terbaru (Posts)
 */
export async function getPosts(limit = 6) {
    return postsData.slice(0, limit);
}

/**
 * Mengambil detail satu berita berdasarkan Slug
 */
export async function getPostBySlug(slug) {
    const post = postsData.find(p => p.slug === slug);
    return post || null;
}

/**
 * Mengambil daftar semua Halaman (Pages)
 */
export async function getPages() {
    return pagesData;
}

/**
 * Mengambil detail satu Halaman berdasarkan Slug
 */
export async function getPageBySlug(slug) {
    const page = pagesData.find(p => p.slug === slug);
    return page || null;
}

/**
 * Mengambil daftar Dosen
 */
export async function getDosen(limit = 100) {
    return dosenData.slice(0, limit);
}

/**
 * Mengambil detail Dosen berdasarkan Slug
 */
export async function getDosenBySlug(slug) {
    const dosen = dosenData.find(d => d.slug === slug);
    return dosen || null;
}

/**
 * Super Fetcher: Mengambil daftar data untuk sembarang Custom Post Type
 */
export async function getDynamicPosts(postType, limit = 100) {
    console.warn(`Dynamic fetch for ${postType} is disabled in decoupled mode.`);
    return [];
}

/**
 * Super Fetcher: Mengambil detail satu pos dari sembarang Custom Post Type
 */
export async function getDynamicPostBySlug(postType, slug) {
    console.warn(`Dynamic fetch for ${postType} by slug is disabled in decoupled mode.`);
    return null;
}
