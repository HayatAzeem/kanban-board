"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Application_1 = __importDefault(require("../models/Application"));
const auth_1 = require("../middleware/auth");
const aiService_1 = require("../services/aiService");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
// Get all applications for the logged-in user
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield Application_1.default.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(applications);
    }
    catch (error) {
        res.status(500).json({ error: "Server error fetching applications" });
    }
}));
// Create a new application
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const application = new Application_1.default(Object.assign(Object.assign({}, req.body), { userId: req.userId }));
        yield application.save();
        res.status(201).json(application);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create application" });
    }
}));
// Update an application (e.g., status drag and drop)
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const application = yield Application_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true });
        if (!application) {
            res.status(404).json({ error: "Application not found" });
            return;
        }
        res.json(application);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update application" });
    }
}));
// Delete an application
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const application = yield Application_1.default.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!application) {
            res.status(404).json({ error: "Application not found" });
            return;
        }
        res.json({ message: "Application deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete application" });
    }
}));
// AI: Parse Job Description
router.post("/parse", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            res.status(400).json({ error: "Job description is required" });
            return;
        }
        const parsedData = yield (0, aiService_1.parseJobDescription)(jobDescription);
        res.json(parsedData);
    }
    catch (error) {
        console.error("AI Parse Error:", error);
        res.status(500).json({ error: "Failed to parse job description" });
    }
}));
// AI: Generate Resume Suggestions
router.post("/suggestions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobDescription, role, company } = req.body;
        if (!jobDescription) {
            res.status(400).json({ error: "Job description is required" });
            return;
        }
        const suggestions = yield (0, aiService_1.generateResumeSuggestions)(jobDescription, role, company);
        res.json({ suggestions });
    }
    catch (error) {
        console.error("AI Suggestion Error:", error);
        res.status(500).json({ error: "Failed to generate suggestions" });
    }
}));
exports.default = router;
