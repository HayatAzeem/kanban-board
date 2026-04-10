"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const applicationSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
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
exports.default = mongoose_1.default.model("Application", applicationSchema);
