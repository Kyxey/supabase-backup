import ENV from './configs/env.js';
import BucketConfig from './configs/bucket.js';
import fs from 'fs';
import path from 'path';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabase: SupabaseClient = createClient(
  ENV.SUPABASE_URL,
  ENV.SERVICE_KEY
);

interface FileObject {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  last_accessed_at?: string;
  metadata?: Record<string, unknown>;
}

async function downloadBucket(bucketId: string): Promise<void> {
  console.log(`📦 Connecting to bucket: ${bucketId}`);

  const { data: list, error } = await supabase.storage
    .from(bucketId)
    .list('', { limit: 1000, offset: 0 });

  if (error) {
    console.error(
      `❌ Failed to list files in bucket '${bucketId}':`,
      error.message
    );
    return;
  }

  if (list.length === 0) {
    console.log(`ℹ️  Bucket '${bucketId}' is empty.`);
    return;
  }

  console.log(`📄 Found ${list.length} files in bucket '${bucketId}'`);

  let completed = 0;

  await Promise.all(
    list.map(async (obj: FileObject): Promise<void> => {
      try {
        const { data, error: dlErr } = await supabase.storage
          .from(bucketId)
          .download(obj.name);

        if (dlErr !== null) {
          console.error(
            `⚠️ Failed to download '${obj.name}': ${dlErr.message}`
          );
          return;
        }

        if (data === null) {
          console.error(`⚠️ No data received for '${obj.name}'`);
          return;
        }

        const localPath: string = path.join(ENV.BACKUP_DIR, bucketId, obj.name);
        fs.mkdirSync(path.dirname(localPath), { recursive: true });
        const buffer: ArrayBuffer = await data.arrayBuffer();
        fs.writeFileSync(localPath, Buffer.from(buffer));

        completed++;
        console.log(`✅ [${completed}/${list.length}] Saved: ${obj.name}`);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(
          `❌ Unexpected error downloading '${obj.name}':`,
          errorMessage
        );
      }
    })
  );

  console.log(`🎉 Completed download for bucket '${bucketId}'`);
}

async function main(): Promise<void> {
  // downloads the buckets specified in the config or all buckets if none are specified
  const bucketIDs: readonly string[] =
    BucketConfig.bucketIDs.length > 0
      ? BucketConfig.bucketIDs
      : ((await supabase.storage.listBuckets()).data?.map(
          bucket => bucket.id
        ) ?? []);

  console.log(`📦 Buckets to process: ${bucketIDs.join('\n')}`);

  if (bucketIDs.length === 0) {
    console.warn('⚠️ No buckets found to process.');
    return;
  }

  // Ensure backup directory exists
  fs.mkdirSync(ENV.BACKUP_DIR, { recursive: true });
  console.log(`📂 Backup directory: ${ENV.BACKUP_DIR}`);

  for (const id of bucketIDs) {
    console.log(`🚀 Starting download for bucket: ${id}`);
    try {
      await downloadBucket(id);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`❌ Error processing bucket '${id}':`, errorMessage);
    }
  }
}

main().catch((err: unknown) => {
  const errorMessage = err instanceof Error ? err.message : String(err);
  console.error('❌ Fatal error:', errorMessage);
  process.exit(1);
});
