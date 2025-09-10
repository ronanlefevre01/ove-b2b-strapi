export default ({ env }) => ({
  apiToken: {
    // requis pour les tokens API en dev
    salt: env('API_TOKEN_SALT', 'dev_api_salt'),
  },
  auth: {
    // secret pour l’auth de l’admin
    secret: env('ADMIN_JWT_SECRET', 'dev_admin_secret'),
  },
});
