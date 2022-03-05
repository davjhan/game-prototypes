const theme = require('broth-css/dist/tailwind.theme.cjs')
module.exports = {
    content: ['./src/**/*.{svelte,js,ts,jsx,tsx,html}',],
    theme: {

        extend: {
            ...theme,
            borderWidth: {
                3: '3px'
            },
            animation: {
                'wiggle': 'wiggle 2s linear ',
                'bulge': 'bulge 1s ease infinite',
            },
            width: {
                'mobile': 375,
            },
            keyframes: {
                wiggle: {
                    from: {
                        transformOrigin: '50% 50%',
                        transform: 'scale(1)',
                    },
                    to: {
                        transformOrigin: '50% 50%',
                        transform: 'scale(2)',
                    },
                },
                bulge: {
                    '0%, 100%': {
                        transform: 'scale(1)',
                    },
                    '50%': {
                        transform: 'scale(1.05)',
                    },
                }
            }
        },

    }
}