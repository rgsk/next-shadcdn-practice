import { S3Client } from "@aws-sdk/client-s3";
import env from "./env";

export const s3ClientRegion = "ap-south-1";
export const s3ClientBuckets = {
  orangewood: "skartner",
};

const s3Client = new S3Client({
  region: s3ClientRegion,
  credentials: {
    accessKeyId: env.AWS_VAR_ACCESS_KEY,
    secretAccessKey: env.AWS_VAR_SECRET_ACCESS_KEY,
  },
});

export default s3Client;
