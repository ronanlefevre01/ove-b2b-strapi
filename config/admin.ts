export default ({ env }) => ({
  apiToken: { salt: env('API_TOKEN_SALT', 'dev_api_salt') },
  auth: { secret: env('ADMIN_JWT_SECRET', 'dev_admin_secret') },
});
