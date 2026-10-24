/**
 * @file navigation.js
 * @description Single Source of Truth (SSOT) untuk seluruh konfigurasi menu & navigasi PBJT
 * Digunakan secara konsisten oleh Header (Desktop & Mobile) dan Footer.
 */

export const navLinks = {
    profil: [
        { title: 'Tentang PBJT', href: '/tentang-pbjt', desc: 'Visi vokasi & profil perguruan tinggi' },
        { title: 'Profil Kampus', href: '/profil-politeknik-baja-tegal', desc: 'Sejarah, legalitas & yayasan' },
        { title: 'Struktur Organisasi', href: '/struktur-politeknik-baja-tegal', desc: 'Pimpinan & bagan resmi institusi' },
        { title: 'Biro (BAAK & BAUK)', href: '/biro', desc: 'Layanan administrasi akademik & umum' },
    ],

    prodi: [
        {
            name: 'D3 Teknik Informatika',
            shortName: 'D3 Teknik Informatika',
            href: '/d3-teknik-informatika',
            rps: '/d3-teknik-informatika/rps',
            modul: '/d3-teknik-informatika/modul',
            icon: '/image/logo-prodi/l-teknik-informatika.webp'
        },
        {
            name: 'D3 Teknik Mesin',
            shortName: 'D3 Teknik Mesin',
            href: '/d3-teknik-mesin',
            rps: '/d3-teknik-mesin/rps',
            modul: '/d3-teknik-mesin/modul',
            icon: '/image/logo-prodi/l-teknik-mesin.webp'
        },
        {
            name: 'D3 Teknik Otomotif',
            shortName: 'D3 Teknik Otomotif',
            href: '/d3-teknik-otomotif',
            rps: '/d3-teknik-otomotif/rps',
            modul: '/d3-teknik-otomotif/modul',
            icon: '/image/logo-prodi/l-teknik-otomotif.webp'
        },
        {
            name: 'D3 Teknik Elektronika Industri',
            shortName: 'D3 T. Elektronika',
            href: '/d3-teknik-elektronika-industri',
            rps: '/d3-teknik-elektronika-industri/rps',
            modul: '/d3-teknik-elektronika-industri/modul',
            icon: '/image/logo-prodi/l-teknik-elektronika-industri.webp'
        }
    ],

    kemahasiswaan: [
        { name: 'BEM', href: '/bem', logo: '/image/logo-ukm/logo-bem.png', fallbackLogo: '/image/logo-ukm/logo-polbaja.png' },
        { name: 'HMTI', href: '/hmti', logo: '/image/logo-prodi/l-teknik-informatika.webp', fallbackLogo: '/image/logo-ukm/logo-polbaja.png' },
        { name: 'ROHIS', href: '/rohis', logo: '/image/logo-ukm/logo-rohis.png', fallbackLogo: '/image/logo-ukm/logo-polbaja.png' },
        { name: 'RACANA', href: '/racana', logo: '/image/logo-ukm/logo-racana.png', fallbackLogo: '/image/logo-ukm/logo-polbaja.png' },
        { name: 'BAJAPALA', href: '/bajapala', logo: '/image/logo-ukm/logo-bajapala.png', fallbackLogo: '/image/logo-ukm/logo-polbaja.png' },
        { name: 'BADMINTON', href: '/badminton', logo: '/image/logo-ukm/logo-badminton.png', fallbackLogo: '/image/logo-ukm/logo-polbaja.png' },
        { name: 'FUTSAL', href: '/futsal', logo: '/image/logo-ukm/logo-polbaja.png', fallbackLogo: '/image/logo-ukm/logo-polbaja.png' },
        { name: 'PADUAN SUARA', href: '/paduan-suara', logo: '/image/logo-ukm/logo-padus.png', fallbackLogo: '/image/logo-ukm/logo-polbaja.png' },
        { name: 'FOSIL', href: '/forum-studi-ilmiah-fosil', logo: '/image/logo-ukm/logo-fosil.png', fallbackLogo: '/image/logo-ukm/logo-polbaja.png' }
    ],

    pmb: [
        { title: 'Info PMB', href: '/pmb' },
        { title: 'Alur Pendaftaran', href: '/alur-pendaftaran' },
        { title: 'Biaya Perkuliahan', href: '/biaya-perkuliahan' },
        { title: 'Beasiswa KIP Kuliah', href: '/beasiswa-kip-kuliah' }
    ],

    external: [
        { title: 'Siakad', href: 'https://siakad.pbjt.ac.id' },
        { title: 'E-Learning', href: 'https://edlink.id/login' }
    ]
};
