import SyncLog from "./models/SyncLog";

export async function logSyncStatus(status: string) {
  const logEntry = new SyncLog({ status });
  await logEntry.save();
  console.log(`📝 Log saved: ${status}`);
}
