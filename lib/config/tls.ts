export const TLS =
  process.env.NODE_ENV === 'production'
    ? {
        key: Bun.file('/usr/src/app/privkey.pem'),
        cert: Bun.file('/usr/src/app/fullchain.pem'),
      }
    : {};
