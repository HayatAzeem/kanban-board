import { Router, Response } from "express";
import Application from "../models/Application";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { parseJobDescription, generateResumeSuggestions } from "../services/aiService";

const router = Router();
router.use(authenticateToken);

// Get all applications for the logged-in user
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching applications" });
  }
});

// Create a new application
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const application = new Application({
      ...req.body,
      userId: req.userId,
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to create application" });
  }
});

// Update an application (e.g., status drag and drop)
router.patch("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to update application" });
  }
});

// Delete an application
router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    res.json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete application" });
  }
});

// AI: Parse Job Description
router.post("/parse", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {
      res.status(400).json({ error: "Job description is required" });
      return;
    }
    const parsedData = await parseJobDescription(jobDescription);
    res.json(parsedData);
  } catch (error: any) {
    console.error("AI Parse Error:", error);
    res.status(500).json({ error: "Failed to parse job description" });
  }
});

// AI: Generate Resume Suggestions
router.post("/suggestions", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobDescription, role, company } = req.body;
    if (!jobDescription) {
      res.status(400).json({ error: "Job description is required" });
      return;
    }
    const suggestions = await generateResumeSuggestions(jobDescription, role, company);
    res.json({ suggestions });
  } catch (error: any) {
    console.error("AI Suggestion Error:", error);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
});

export default router;
