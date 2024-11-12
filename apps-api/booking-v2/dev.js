import { tsupDevServer } from '@softnetics/dev-server'
import { build } from 'tsup'

build({
  watch: [
    './src',
    // '../../packages/rest/dist',
    // '../../packages/iam/src',
    // '../../packages/common/src',
  ],
  onSuccess: tsupDevServer({
    command: 'exec node --enable-source-maps dist/index.js',
  }),
})
