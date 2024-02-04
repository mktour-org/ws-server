export {};

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        PORT: string;
        DATABASE_URL: string;
        DATABASE_AUTH_TOKEN: string;
        UPSTASH_REDIS_REST_TOKEN: string;
        UPSTASH_REDIS_REST_URL: string;
    }
  }
}
  