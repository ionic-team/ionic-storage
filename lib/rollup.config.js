import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'dist/esm/index.js',
  output: [
    {
      file: 'dist/ionic-storage.js',
      format: 'iife',
      name: 'ionicStorage',
      globals: {
      },
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/ionic-storage.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  plugins: [nodeResolve(), commonjs()]
};
