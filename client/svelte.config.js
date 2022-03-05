import adapter from '@sveltejs/adapter-static'
import path from 'path'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: [
        preprocess({
            postcss: true
        }),
    ],
    kit: {
        adapter: adapter({
            fallback: '404.html'
        }),
        prerender: {
            enabled: false
        },
        vite: {
            optimizeDeps: {
                exclude: ['broth-css']
            },
            resolve: {
                alias: {
                    $static: path.resolve('/static'),
                    $bagger: path.resolve('/src/bagger'),
                    $common: path.resolve('/src/common')
                }
            },
            server: {
                host: '0.0.0.0',
                watch: {
                    followSymlinks: true
                },
                fs: {
                    allow: ['.yalc']
                }
            },
            ssr: false
        }
    },
}

export default config