import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user: { _id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, user: { _id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/profile", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const updateData: any = {};
    
    if (username !== undefined) {
      updateData.username = username;
    }
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true }
    ).select("-password");
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
