import { defineConfig } from '@farmfe/core';

import NestPlugin from './index.plugin';

export default defineConfig({
  plugins: [NestPlugin()],
  compilation: {
    external: ['@prisma/client'],
    output: {
      format: 'esm',
      targetEnv: 'node-next',
    },
  },
  server: {
    port: 50052,
  },
});
