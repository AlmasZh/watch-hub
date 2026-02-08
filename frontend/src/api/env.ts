const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  WS_URL: process.env.NEXT_PUBLIC_WS_URL,
};

if (!env.API_URL || !env.WS_URL) {
  throw new Error('Missing environment variables');
}

export default env;
