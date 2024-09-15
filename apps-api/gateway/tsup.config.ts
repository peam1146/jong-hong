import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/main.ts'],
  splitting: true,
  clean: true,
  format: ['esm'],
  sourcemap: true,
  minify: false,
  noExternal: ['@jong-hong/grpc'],
  esbuildOptions: (esbuildOptions) => {
    if (options.watch) {
      return;
    }
    if (esbuildOptions.drop === undefined) {
      esbuildOptions.drop = [];
    }
    esbuildOptions.drop?.push('console', 'debugger');
  },
}));
