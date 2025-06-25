// controllers/stakeholderController.js
import Stakeholder from '../models/Stakeholder.js';
import { createNotification } from '../utils/notificationUtils.js';
import { logChange } from '../utils/logChange.js';

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
    const { user, project } = req.body;

    // Validate required fields
    if (!user || !project) {
      return res.status(400).json({ message: "Missing required fields: user or project" });
    }

    // Create stakeholder
    const newStakeholder = new Stakeholder(req.body);
    const saved = await newStakeholder.save();

    // Populate project name
    const populated = await saved.populate('project', 'name');

    // 🔍 Log the creation
    await logChange({
      modelName: 'Stakeholder',
      documentId: saved._id,
      operation: 'create',
      updatedBy: user,
      createdData: saved.toObject(),
    });

    // 🔔 Create notification
    await createNotification(
      `👥 Stakeholder added to project "${populated.project.name}"`,
      populated.project.name
    );

    // Respond with populated stakeholder
    res.status(201).json(populated);
  } catch (err) {
    console.error("Error creating stakeholder:", err);
    res.status(400).json({ message: err.message });
  }
};




// ✅ Update Stakeholder with logging
export const updateStakeholder = async (req, res) => {
  try {
    const { id } = req.params;

    const oldStakeholder = await Stakeholder.findById(id);
    if (!oldStakeholder) return res.status(404).json({ message: "Not found" });

    const updated = await Stakeholder.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).populate('project', 'name');

    await logChange({
      modelName: 'Stakeholder',
      documentId: id,
      operation: 'update',
      updatedBy: req.userId || 'unknown',
      before: oldStakeholder.toObject(),
      after: updated.toObject(),
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete Stakeholder with logging
export const deleteStakeholder = async (req, res) => {
  try {
    const { id } = req.params;

    const stakeholder = await Stakeholder.findById(id);
    if (!stakeholder) return res.status(404).json({ message: "Not found" });

    await logChange({
      modelName: 'Stakeholder',
      documentId: id,
      operation: 'delete',
      updatedBy: req.userId || 'unknown',
      deletedData: stakeholder.toObject(),
    });

    await stakeholder.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📊 Stakeholder stats (unchanged)
export const getStakeholderStats = async (req, res) => {
  const { userId } = req.query;

  try {
    const total = await Stakeholder.countDocuments({ user: userId });
    const active = await Stakeholder.countDocuments({ user: userId, isActive: true });
    const inactive = await Stakeholder.countDocuments({ user: userId, isActive: false });
    const newCount = await Stakeholder.countDocuments({
      user: userId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    res.json({ total, active, inactive, new: newCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
