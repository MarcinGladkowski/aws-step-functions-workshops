import Joi from "joi";
import { pipeline } from "ts-pipe-compose";

interface CalculateScoreLambdaEnvironmentVariables {
  inputBucketName: string;
}

const loadEnvs = (env: NodeJS.ProcessEnv) => ({
  inputBucketName: env.S3_INPUT_BUCKET_NAME,
});

const validateConfig = (config: ReturnType<typeof loadEnvs>): CalculateScoreLambdaEnvironmentVariables => {
  const schema = Joi.object().keys({
    inputBucketName: Joi.string().required(),
  });

  const { error, value } = schema.validate(config);

  if (error) {
    throw error;
  }

  return value;
};

export const createConfig = pipeline(loadEnvs, validateConfig);
