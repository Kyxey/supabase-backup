import ENV from "./env.js";

const bucketConfig = {
  bucketIDs: ENV.BUCKET_IDS
    ? ENV.BUCKET_IDS.split(",").map((id) => id.trim())
    : [],
};

export default bucketConfig;
