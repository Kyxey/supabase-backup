import ENV from "./configs/env.js";
import BucketConfig from "./configs/bucket.js";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(ENV.SUPABASE_URL, ENV.SERVICE_KEY);

async function downloadBucket(bucketId) {
  console.log(`📦 Connecting to bucket: ${bucketId}`);

  const { data: list, error } = await supabase.storage
    .from(bucketId)
    .list("", { limit: 1000, offset: 0 });

  if (error) {
    console.error(
      `❌ Failed to list files in bucket '${bucketId}':`,
      error.message
    );
    return;
  }

  if (!list || list.length === 0) {
    console.log(`ℹ️  Bucket '${bucketId}' is empty.`);
    return;
  }

  console.log(`📄 Found ${list.length} files in bucket '${bucketId}'`);

  let completed = 0;

  await Promise.all(
    list.map(async (obj) => {
      try {
        const { data, error: dlErr } = await supabase.storage
          .from(bucketId)
          .download(obj.name);

        if (dlErr) {
          console.error(
            `⚠️ Failed to download '${obj.name}': ${dlErr.message}`
          );
          return;
        }

        const localPath = path.join(ENV.BACKUP_DIR, bucketId, obj.name);
        fs.mkdirSync(path.dirname(localPath), { recursive: true });
        const buffer = await data.arrayBuffer();
        fs.writeFileSync(localPath, Buffer.from(buffer));

        completed++;
        console.log(`✅ [${completed}/${list.length}] Saved: ${obj.name}`);
      } catch (err) {
        console.error(`❌ Unexpected error downloading '${obj.name}':`, err);
      }
    })
  );

  console.log(`🎉 Completed download for bucket '${bucketId}'`);
}

(async () => {
  for (const id of BucketConfig.bucketIDs) {
    console.log(`🚀 Starting download for bucket: ${id}`);
    try {
      await downloadBucket(id);
    } catch (err) {
      console.error(`❌ Error processing bucket '${id}':`, err.message || err);
    }
  }
})();
