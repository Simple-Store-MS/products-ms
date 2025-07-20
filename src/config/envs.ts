import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  DATABASE_URL: string;
  PORT: number;
}

const envsSchema = joi
  .object({
    DATABASE_URL: joi.string().required(),
    PORT: joi.number().required(),
  })
  .unknown(true);

const result = envsSchema.validate(process.env);

if (result.error) {
  throw new Error(`Config validations error ${result.error.message}`);
}

const envVars = result.value as EnvVars;

export const envs = {
  databaseUrl: envVars.DATABASE_URL,
  port: envVars.PORT,
};
