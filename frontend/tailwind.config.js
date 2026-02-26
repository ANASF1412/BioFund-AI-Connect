/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable dark mode
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#34d399', // Mint green
                    600: '#10b981', // Leaf green
                    700: '#047857', // Dark green
                    800: '#065f46',
                    900: '#064e3b', // Deep forest
                },
                cream: {
                    50: '#fdfbf7',
                    100: '#f9f5e9',
                    200: '#efe6d5',
                    500: '#dac8a0',
                },
                earth: {
                    500: '#b4835a',
                    700: '#7a5135',
                    900: '#4a3320',
                },
                dark: {
                    DEFAULT: '#0f172a',
                    100: '#1e293b',
                    200: '#334155',
                    800: '#0a0d14',
                    900: '#05070a' // Very dark
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
