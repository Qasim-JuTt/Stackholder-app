// controllers/stakeholderController.js
import Stakeholder from '../models/Stakeholder.js';
import { createNotification } from '../utils/notificationUtils.js';
import mongoose from "mongoose";

export const getAllStakeholders = async (req, res) => {
  const { userId } = req.query;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid or missing userId" });
  }

  try {
    const stakeholders = await Stakeholder.find({ user: userId });
    res.json(stakeholders);
  } catch (error) {
    console.error("Error fetching stakeholders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getStakeholderById = async (req, res) => {
  try {
    const stakeholder = await Stakeholder.findById(req.params.id).populate('project', 'name');
    if (!stakeholder) return res.status(404).json({ message: "Not found" });
    res.json(stakeholder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createStakeholder = async (req, res) => {
  try {
    const newStakeholder = new Stakeholder(req.body); // includes `user` field
    const saved = await newStakeholder.save();
    const populated = await saved.populate('project', 'name');

    await createNotification('👥 Stakeholder added to project "{name}"', populated.project.name);

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



export const updateStakeholder = async (req, res) => {
  try {
    const updated = await Stakeholder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('project', 'name');

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteStakeholder = async (req, res) => {
  try {
    const deleted = await Stakeholder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// controller/stakeholderController.js
export const getStakeholderStats = async (req, res) => {
  const { userId } = req.query;

  try {
    const total = await Stakeholder.countDocuments({ user: userId });
    const active = await Stakeholder.countDocuments({ user: userId, isActive: true });
    const inactive = await Stakeholder.countDocuments({ user: userId, isActive: false });
    const newCount = await Stakeholder.countDocuments({
      user: userId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // last 7 days
    });

    res.json({ total, active, inactive, new: newCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};



