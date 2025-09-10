// config/database.ts — SQLite en dev (par défaut), Postgres en prod
export default ({ env }) => {
  const isProd = env('NODE_ENV') === 'production' || env.bool('USE_POSTGRES', false);
  if (isProd || env('DATABASE_CLIENT') === 'postgres') {
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: env('DATABASE_HOST'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME'),
          user: env('DATABASE_USERNAME'),
          password: env('DATABASE_PASSWORD'),
          ssl: env.bool('DATABASE_SSL', true) ? { rejectUnauthorized: false } : false,
        },
        pool: { min: 0, max: 10 },
        acquireConnectionTimeout: 60000,
      },
    };
  }

  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      useNullAsDefault: true,
    },
  };
};
