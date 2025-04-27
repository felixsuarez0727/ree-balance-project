import mongoose from "mongoose";

const syncLogSchema = new mongoose.Schema({
  status: String,
  timestamp: { type: Date, default: Date.now },
});

const SyncLog = mongoose.model("SyncLog", syncLogSchema, "syncLog");

export default SyncLog