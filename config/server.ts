export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('URL'),
  app: { keys: env.array('APP_KEYS', ['dev1','dev2','dev3','dev4']) },
});
