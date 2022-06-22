import { ScanCvEvent } from "../types";
import S3 from "aws-sdk/clients/s3";
import { CheckExcludeListsLambdaEnvironmentVariables, createConfig } from "./config";
import { winstonLogger as logger } from "../../../shared/logger";
import { Context } from "aws-lambda";


export const checkExcludeLists = async (
  event: ScanCvEvent,
  config: CheckExcludeListsLambdaEnvironmentVariables,
  s3Client: S3,
) => {
  const { Body: body } = await s3Client
  .getObject({
    Bucket: config.extractedFilesBucketName,
    Key: event.key,
  })
  .promise();  

  const parsedBody = body!.toString().toLocaleLowerCase();

  const isExcluded = (parsedBody.includes('janusz') && parsedBody.includes('kowalski') && parsedBody.includes("chrzaszczyzewoszyce"));

  logger.info("isExcluded value", isExcluded);

  return {
    ...event,
    isExcluded,
  };
};


export const handle = async (event: ScanCvEvent, _context: Context) => {
  const config = createConfig(process.env);
  const s3Client = new S3();
  return checkExcludeLists(event, config, s3Client);
};