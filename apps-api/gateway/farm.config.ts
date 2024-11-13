import { defineConfig } from '@farmfe/core';

import NestPlugin from './index.plugin';

export default defineConfig({
  plugins: [NestPlugin()],
  compilation: {
    output: {
      format: 'esm',
      targetEnv: 'node-next',
    },
  },
});
