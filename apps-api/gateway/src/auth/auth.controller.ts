import { All, Controller, Next, Req, Res } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { environment } from '../enviroment';

const proxy = createProxyMiddleware({
  router: (req) => {
    console.log(req.url, `${environment.AUTH_SERVICE_URL}${req.url}`);
    return `${environment.AUTH_SERVICE_URL}${req.url}`;
  },
  ignorePath: true,
  changeOrigin: true,
});

@Controller('auth')
export class AuthController {
  constructor() {}

  @All(['/', '*'])
  get(@Req() req, @Res() res, @Next() next) {
    proxy(req, res, next);
  }
}
