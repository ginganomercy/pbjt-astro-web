/**
 * @file api.js
 * @description Data access layer untuk konten berita, halaman, dan dosen lokal PBJT.
 */

import postsData from '../data/posts.json';
import pagesData from '../data/pages.json';
import dosenData from '../data/dosen.json';

/**
 * Ekstrak URL gambar pertama dari string HTML (digunakan sebagai fallback thumbnail)
 * @param {string} htmlString 
 * @returns {string|null}
 */
export function extractFirstImage(htmlString) {
    if (!htmlString) return null;
    const match = htmlString.match(/<img[^>]+src="([^">]+)"/i);
    return match ? match[1] : null;
}

/**
 * Ekstrak gambar unggulan (Featured Image) dari objek payload WordPress
 * @param {object} item Objek post / page / dosen dari WP REST API
 * @param {string} fallback Path gambar fallback default jika tidak ada
 * @returns {string} URL gambar
 */
export function getFeaturedImage(item, fallback = '/image/placeholder-gallery.svg') {
    if (!item) return fallback;
    const mediaArray = item?._embedded?.['wp:featuredmedia'];
    if (Array.isArray(mediaArray) && mediaArray.length > 0 && mediaArray[0]?.source_url) {
        return mediaArray[0].source_url;
    }
    return fallback;
}

/**
 * Mengambil daftar berita terbaru (Posts)
 * @param {number} limit 
 */
export async function getPosts(limit = 6) {
    return postsData.slice(0, limit);
}

/**
 * Mengambil detail satu berita berdasarkan Slug
 * @param {string} slug 
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
 * @param {string} slug 
 */
export async function getPageBySlug(slug) {
    const page = pagesData.find(p => p.slug === slug);
    return page || null;
}

/**
 * Mengambil daftar Dosen
 * @param {number} limit 
 */
export async function getDosen(limit = 100) {
    return dosenData.slice(0, limit);
}

/**
 * Mengambil detail Dosen berdasarkan Slug
 * @param {string} slug 
 */
export async function getDosenBySlug(slug) {
    const dosen = dosenData.find(d => d.slug === slug);
    return dosen || null;
}

/**
 * Super Fetcher: Mengambil daftar data untuk sembarang Custom Post Type
 * @param {string} postType
 * @param {number} limit
 */
export async function getDynamicPosts(postType, limit = 100) {
    console.warn(`Dynamic fetch for ${postType} is disabled in decoupled mode.`);
    return [];
}

/**
 * Super Fetcher: Mengambil detail satu pos dari sembarang Custom Post Type
 * @param {string} postType
 * @param {string} slug
 */
export async function getDynamicPostBySlug(postType, slug) {
    console.warn(`Dynamic fetch for ${postType} by slug is disabled in decoupled mode.`);
    return null;
}
