import * as esbuild from 'esbuild';

esbuild.buildSync({
  entryPoints: ['src/server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node14',
  outfile: 'dist/server.js',
});

import('./dist/server.js');