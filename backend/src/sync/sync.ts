import dotenv from 'dotenv';
import cron from 'node-cron';
import mongoose from 'mongoose';
import { fetchData } from './fetchData';
import { saveData } from './saveData';
import { logSyncStatus } from './syncLog';
import SyncLog from './models/SyncLog';

dotenv.config();

mongoose.connect(process.env.MONGO_URI ?? '')
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ Error connecting to MongoDB", err);
    process.exit(1);
  });

async function syncData() {
  const now = new Date();

  let startDate = new Date('2025-01-01T00:00:00');

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const existingSync = await SyncLog.findOne({
    status: 'Sync completed successfully',
    timestamp: { $gte: todayStart }
  });

  if (existingSync) {
    console.log('✅ Sync already completed today, skipping...');
    return;
  }

  const lastSync = await SyncLog.findOne({
    status: 'Sync completed successfully'
  }).sort({ timestamp: -1 });

  if (lastSync) {
    startDate = new Date(lastSync.timestamp);
    console.log(`🕒 Starting sync from last sync date: ${startDate}`);
  } else {
    console.log('🕒 No previous sync found, starting from the beginning of 2025.');
  }

  try {
    await logSyncStatus('Sync started');

    const data = await fetchData(startDate, now);

    await saveData(data);

    await logSyncStatus('Sync completed successfully');
  } catch (error) {
    console.error('❌ Error during sync:', JSON.stringify(error, null, 2));

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logSyncStatus(`Sync failed: ${errorMessage}`);
  }
}

cron.schedule('0 0 * * *', async () => {
  console.log('🌟 Starting sync process...');
  try {
    await syncData();
    console.log('✅ Sync completed successfully.');
  } catch (error) {
    console.error('❌ Error during sync:', error);
  }
});

(async () => {
  console.log('🚀 Sync is running immediately on app start');
  await new Promise(resolve => setTimeout(resolve, 30000));

  try {
    await syncData();
    console.log('✅ Initial sync completed successfully.');
  } catch (error) {
    console.error('❌ Initial sync failed:', error);
  }
})();
