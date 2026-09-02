// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  redirects: {
    '/kunjungan-direktorat-kelembagaan-monitoring-dan-evaluasi-program-penguatan-pendidikan-tinggi-vokasi-pts': '/berita/kunjungan-direktorat-kelembagaan-monitoring-dan-evaluasi-program-penguatan-pendidikan-tinggi-vokasi-pts',
    '/pengukuhan-dan-penyerahan-sk-pembina-politeknik-baja-tegal-kepada-bapak-agus-solichin-s-psi': '/berita/pengukuhan-dan-penyerahan-sk-pembina-politeknik-baja-tegal-kepada-bapak-agus-solichin-s-psi',
    '/kegiatan-kuliah-kerja-lapangan-kkl-politeknik-baja-tegal-2025-menggali-wawasan-industri-dan-teknologi': '/berita/kegiatan-kuliah-kerja-lapangan-kkl-politeknik-baja-tegal-2025-menggali-wawasan-industri-dan-teknologi',
    '/monitoring-dan-evaluasi-kinerja-bapak-slamet-riyadi-mt-direktur-politeknik-baja-tegal-refleksi-lima-tahun-kepemimpinan-dan-arah-masa-depan': '/berita/monitoring-dan-evaluasi-kinerja-bapak-slamet-riyadi-mt-direktur-politeknik-baja-tegal-refleksi-lima-tahun-kepemimpinan-dan-arah-masa-depan',
    '/sumpah-jabatan-dan-pelantikan-direktur-politeknik-baja-tegal-periode-2025-2030-momentum-baru-menuju-pendidikan-vokasi-unggul': '/berita/sumpah-jabatan-dan-pelantikan-direktur-politeknik-baja-tegal-periode-2025-2030-momentum-baru-menuju-pendidikan-vokasi-unggul',
    '/rapat-awal-perkuliahan-semester-genap-ta-2024-2025-politeknik-baja-tegal': '/berita/rapat-awal-perkuliahan-semester-genap-ta-2024-2025-politeknik-baja-tegal',
    '/ldkk-2025-politeknik-baja-tegal-sukses-membentuk-jiwa-kepemimpinan-dan-wirausaha-mahasiswaldkk-2025': '/berita/ldkk-2025-politeknik-baja-tegal-sukses-membentuk-jiwa-kepemimpinan-dan-wirausaha-mahasiswaldkk-2025',
    '/aspirator-kip-kuliah-kunjungi-politeknik-baja-tegal-wawancarai-langsung-calon-mahasiswa-baru': '/berita/aspirator-kip-kuliah-kunjungi-politeknik-baja-tegal-wawancarai-langsung-calon-mahasiswa-baru',
    '/penandatanganan-mou-politeknik-baja-tegal-dengan-pt-international-study-bridge-dan-sosialisasi-magang-internasional': '/berita/penandatanganan-mou-politeknik-baja-tegal-dengan-pt-international-study-bridge-dan-sosialisasi-magang-internasional',
    '/politeknik-baja-tegal-resmi-bekerja-sama-dengan-pt-kemika-sugih-artha': '/berita/politeknik-baja-tegal-resmi-bekerja-sama-dengan-pt-kemika-sugih-artha',
    '/politeknik-baja-tegal-laksanakan-pemberkasan-akhir-calon-mahasiswa-baru-kip-kuliah-gelombang-1': '/berita/politeknik-baja-tegal-laksanakan-pemberkasan-akhir-calon-mahasiswa-baru-kip-kuliah-gelombang-1'
  }
});