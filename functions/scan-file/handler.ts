import { Context, S3Event } from "aws-lambda";
import { SNS, StepFunctions } from "aws-sdk";
import { winstonLogger } from "../../shared/logger";
import { createConfig } from "./config";


const config = createConfig(process.env);
const snsClient = new SNS();
const sf = new StepFunctions();

export const handle = async (event: S3Event, _context: Context): Promise<any> => {
  winstonLogger.info(`Config: ${JSON.stringify(config)}`);
  winstonLogger.info(`Event: ${JSON.stringify(event)}`);

  const key = event.Records[0].s3.object.key;
  const etag = event.Records[0].s3.object.eTag;
  const extension = key.split(".").pop();

  const params = {
    stateMachineArn: config.stateMachineArn,
    input: JSON.stringify({'key': key}),
    name: `${key}-${etag}`
  }

  winstonLogger.info(`Execution params`, JSON.stringify(params));

  const executeResult = await sf.startExecution(params).promise()

  winstonLogger.info(`Execution result`, JSON.stringify(executeResult));

  if (["doc", "docx"].includes(extension!)) {
    winstonLogger.info(`Publishing failed file ${key} to topic ${config.scanFailedTopicArn}`);
    await snsClient
      .publish({
        Message: JSON.stringify({ key }),
        TopicArn: config.scanFailedTopicArn,
      })
      .promise();

    return;
  }
};
