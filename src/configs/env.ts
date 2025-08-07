import dotenv from 'dotenv';

dotenv.config();

interface Environment {
  readonly SUPABASE_URL: string;
  readonly SERVICE_KEY: string;
  readonly BACKUP_DIR: string;
  readonly BUCKET_IDS: string;
}

const env: Environment = {
  SUPABASE_URL: process.env.SUPABASE_URL ?? 'https://yourproject.supabase.co',
  SERVICE_KEY: process.env.SERVICE_KEY ?? 'your-service-key',
  BACKUP_DIR: process.env.BACKUP_DIR ?? 'backups',
  BUCKET_IDS: process.env.BUCKET_IDS ?? '',
};

export default env;
