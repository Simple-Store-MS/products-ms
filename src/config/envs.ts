import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  DATABASE_URL: string;
  NATS_SERVERS: string[];
  PORT: number;
}

const envsSchema = joi
  .object({
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    PORT: joi.number().required(),
  })
  .unknown(true);

const result = envsSchema.validate({
  ...process.env,
  NATS_SERVERS:
    process.env.NATS_SERVERS?.split(',').map((server: string) =>
      server.trim(),
    ) || [],
});

if (result.error) {
  throw new Error(`Config validations error ${result.error.message}`);
}

const envVars = result.value as EnvVars;

export const envs = {
  databaseUrl: envVars.DATABASE_URL,
  natsServers: envVars.NATS_SERVERS,
  port: envVars.PORT,
};
