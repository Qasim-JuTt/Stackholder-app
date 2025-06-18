// controllers/stakeholderController.js
import Stakeholder from '../models/Stakeholder.js';

export const getAllStakeholders = async (req, res) => {
  try {
    const stakeholders = await Stakeholder.find()
      .populate('project', 'name')
      .sort({ createdAt: -1 }); // Latest first
    res.json(stakeholders);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const newStakeholder = new Stakeholder(req.body);
    await newStakeholder.save();
    const populated = await newStakeholder.populate('project', 'name');
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


