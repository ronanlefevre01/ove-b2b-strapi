// config/database.ts
export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL', true)
        ? { rejectUnauthorized: false }  // Neon accepte ça, simple et efficace
        : false,
    },
    pool: { min: 0, max: 10 },
    acquireConnectionTimeout: 60000,
  },
});
