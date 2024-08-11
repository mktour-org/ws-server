export const TLS =
  process.env.NODE_ENV === 'production'
    ? {
        key: Bun.file('/etc/letsencrypt/live/ws.mktour.org/privkey.pem'),
        cert: Bun.file('/etc/letsencrypt/live/ws.mktour.org/fullchain.pem'),
      }
    : {};
