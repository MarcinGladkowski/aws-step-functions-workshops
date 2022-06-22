import { ScanCvEvent } from "../types";
import S3 from "aws-sdk/clients/s3";
import { CheckExcludeListsLambdaEnvironmentVariables } from "./config";
import { winstonLogger as logger } from "../../../shared/logger";


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

  logger.info("Handling event: %o", event);

  return {
    ...event,
    isExcluded,
  };
};
