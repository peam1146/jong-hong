import { IncomingMessage } from 'http';
import { environment } from '../enviroment';

export const getProfile = async (req: IncomingMessage) => {
  const headers = req.headers;
  const response = await fetch(`${environment.AUTH_SERVICE_URL}/auth/profile`, {
    headers: {
      authorization: headers.authorization,
    },
  });
  return (await response.json()) as {
    _id: string;
    email: string;
    name: string;
  };
};
