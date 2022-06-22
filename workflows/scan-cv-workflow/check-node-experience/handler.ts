import { Context } from "aws-lambda";
import { ScanCvEvent } from "../types";
import S3 from "aws-sdk/clients/s3";
import { CheckNodeExperienceLambdaEnvironmentVariables, createConfig } from "./config";

export const checkNodeExperience = async (
  event: ScanCvEvent,
  config: CheckNodeExperienceLambdaEnvironmentVariables,
  s3Client: S3,
) => {

  
  const nodeExperience = 0;

  return {
    ...event,
    nodeExperience,
  };
};


export const handle = async (event: ScanCvEvent, _context: Context) => {
  const config = createConfig(process.env);
  const s3Client = new S3();
  return checkNodeExperience(event, config, s3Client);
};