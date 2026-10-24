/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
    theme: {
        fontFamily: {
            roboto: ['Roboto', ...defaultTheme.fontFamily.sans],
            dosis: ['Dosis', ...defaultTheme.fontFamily.sans],
            outfit: ['Outfit', ...defaultTheme.fontFamily.sans],
        },
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        'h1 a': { textDecoration: 'none' },
                        'h2 a': { textDecoration: 'none' },
                        'h3 a': { textDecoration: 'none' },
                        'h4 a': { textDecoration: 'none' },
                        'h5 a': { textDecoration: 'none' },
                        'h6 a': { textDecoration: 'none' },
                        'th a': { textDecoration: 'none' },
                    },
                },
            },
        },
    },
    plugins: [require('daisyui'), require('@tailwindcss/typography')],
    daisyui: {
        themes: [
            {
                winter: {
                    ...require('daisyui/src/theming/themes')['[data-theme=winter]'],
                    primary: '#0764CE',
                },
            },
            'night',
        ],
        darkTheme: 'night',
        base: true,
        styled: true,
        utils: true,
        logs: true,
    },
}
