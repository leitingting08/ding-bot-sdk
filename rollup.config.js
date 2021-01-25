/** @format */

import typescript from 'rollup-plugin-typescript2' // 处理typescript
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import { DEFAULT_EXTENSIONS } from '@babel/core'
const isDev = process.env.NODE_ENV === 'dev'

export default {
    input: './src/index.ts', // 入口文件
    output: [
        {
            file: `lib/dingBot.main.js`, // 打包之后的文件名以及存放位置
            format: 'umd', // 以什么模式打包，支持umd,cmd,esm...
            name: 'dingBot'
        },
        {
            file: `lib/logHub.module.js`, // 打包之后的文件名以及存放位置
            format: 'es', // 以什么模式打包，支持umd,cmd,esm...
            name: 'dingBot'
        }
    ],
    plugins: [
        // https://github.com/rollup/rollup-plugin-babel/issues/318
        // put TS plugin before babel plugin in your plugins array
        typescript({
            exclude: 'node_modules/**',
            typescript: require('typescript')
        }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'runtime',
            // babel 默认不支持 ts 需要手动添加
            extensions: [...DEFAULT_EXTENSIONS, '.ts']
        }),
        nodeResolve({
            mainField: ['jsnext:main', 'browser', 'module', 'main'],
            browser: true
        }),
        commonjs(),
        !isDev && terser()
    ]
}
