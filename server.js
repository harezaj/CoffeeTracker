import * as esbuild from 'esbuild';
import { createRequire } from 'module';

esbuild.buildSync({
  entryPoints: ['src/server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node14',
  outfile: 'dist/server.js',
  external: ['express', 'cors', 'better-sqlite3', 'path'],
});

const require = createRequire(import.meta.url);
require('./dist/server.js');