import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  splitting: true,
  noExternal: ['@jong-hong/grpc'],
  external: ['kafkajs'],
  clean: true,
  format: ['esm'],
  sourcemap: 'inline',
  minify: true,
  banner: {
    js: `
import topLevelPath from 'path';
import { fileURLToPath } from 'url';
import { createRequire as topLevelCreateRequire } from 'module';
const require = topLevelCreateRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = topLevelPath.dirname(__filename);
    `,
  },
}))
