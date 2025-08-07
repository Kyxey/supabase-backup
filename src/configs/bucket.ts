import ENV from "./env.js";

interface BucketConfig {
  readonly bucketIDs: readonly string[];
}

const bucketConfig: BucketConfig = {
  bucketIDs: ENV.BUCKET_IDS
    ? ENV.BUCKET_IDS.split(",").map((id: string) => id.trim())
    : [],
};

export default bucketConfig;
