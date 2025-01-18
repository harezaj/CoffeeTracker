require('esbuild').buildSync({
  entryPoints: ['src/server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node14',
  outfile: 'dist/server.js',
});

require('./dist/server.js');