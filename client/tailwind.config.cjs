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
                'wiggle': 'wiggle 1s linear ',
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
                }
            }
        },

    }
}