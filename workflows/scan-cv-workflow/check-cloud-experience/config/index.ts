import Joi from "joi";
import { pipeline } from "ts-pipe-compose";

export interface CheckCloudExperienceLambdaEnvironmentVariables {
  extractedFilesBucketName: string;
}

const loadEnvs = (env: NodeJS.ProcessEnv) => ({
  extractedFilesBucketName: env.S3_EXTRACTED_FILES_BUCKET_NAME,
});

const validateConfig = (config: ReturnType<typeof loadEnvs>): CheckCloudExperienceLambdaEnvironmentVariables => {
  const schema = Joi.object().keys({
    extractedFilesBucketName: Joi.string().required(),
  });

  const { error, value } = schema.validate(config);

  if (error) {
    throw error;
  }

  return value;
};

export const createConfig = pipeline(loadEnvs, validateConfig);
