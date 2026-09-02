/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#1e40af', // Blue 800 (Premium Navy)
					light: '#3b82f6',   // Blue 500
					dark: '#1e3a8a',    // Blue 900 (Deep Navy)
				},
				secondary: {
					DEFAULT: '#f59e0b', // Amber 500 (Rich Gold)
					light: '#fbbf24',   // Amber 400
					dark: '#d97706',    // Amber 600
				},
				background: '#f8fafc', // Slate 50 (Light Mode)
				text: '#0f172a', // Slate 900
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			animation: {
				'marquee': 'marquee 25s linear infinite',
			},
			keyframes: {
				marquee: {
					'0%': { transform: 'translateX(100vw)' },
					'100%': { transform: 'translateX(-100%)' },
				}
			}
		},
	},
	plugins: [],
}
