import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-porter';
import copy from 'rollup-plugin-cpy';
import pkg from './package.json';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';

export default [
    {
        input: 'index.js',
        output: { 
            file: pkg.browser,
            format: 'iife',
            sourcemap: true,
            name: 'Slider',            
        },
        plugins: [
            svelte({            
                skipIntroByDefault: true,
                nestedTransitions: true,            
                dev: true,
                css: css => {
                    css.write('public/main.css');
                }
            }),
            resolve({ jsnext: true, main: true, module: false, browser: false }),
            // commonjs(),            
            // copy({
            //     files: [ 'src/*.png' ],
            //     dest: 'dist',
            // }),
            babel({include: ['src/**','node_modules/svelte/shared.js']}),
            // terser(),
        ],
    },
    {
        input: 'index.js',
        output: { 
            file: pkg.module,
            format: 'cjs',
        },
        plugins: [
            svelte({            
                skipIntroByDefault: true,
                nestedTransitions: true,            
                dev: true,
                css: css => {
                    css.write('dist/scanex-slider-widget.css');
                }
            }),
            resolve({ jsnext: true, main: true, module: false, browser: false }),
            // commonjs(),            
            // copy({
            //     files: [ 'src/*.png' ],
            //     dest: 'dist',
            // }),
            babel({include: ['src/**','node_modules/svelte/shared.js']}),
            // terser(),
        ],
    },
];