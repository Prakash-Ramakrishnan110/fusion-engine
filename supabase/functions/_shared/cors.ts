// supabase/functions/_shared/cors.ts

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  'https://fusionengine.in',
  'https://www.fusionengine.in',
  Deno.env.get('FRONTEND_URL') || '',
].filter(Boolean);

export const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get('Origin') || '';
  const isAllowed = ALLOWED_ORIGINS.some((allowed) => 
    origin === allowed || origin.endsWith('.vercel.app') || origin.endsWith('.pages.dev')
  );

  const allowOrigin = isAllowed ? origin : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
  };
};
