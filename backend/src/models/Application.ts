import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: {
    type: String,
    enum: ["Applied", "Phone Screen", "Interview", "Offer", "Rejected"],
    default: "Applied",
  },
  dateApplied: { type: Date, default: Date.now },
  jdLink: { type: String },
  notes: { type: String },
  salaryRange: { type: String },
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
