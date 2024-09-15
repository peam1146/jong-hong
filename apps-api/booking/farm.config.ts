import { defineConfig } from '@farmfe/core';
import NestPlugin from './index.plugin';

export default defineConfig({
  plugins: [NestPlugin()],
  server: {
    port: 50052,
  },
});
