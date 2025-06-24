import Project from "../models/Project.js";
import Finance from "../models/ProjectFinance.js";
import Stakeholder from "../models/Stakeholder.js";
import { createNotification } from "../utils/notificationUtils.js";
import { logChange } from '../utils/logChange.js';
import mongoose from 'mongoose';

export const getProjects = async (req, res) => {
  try {
    const { userId } = req.query;

    // If no userId is provided, return an error
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find projects created by this user
    const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};


export const createProject = async (req, res) => {
  try {
    const { name, description, value, completion, user } = req.body;

    const newProject = new Project({
      name,
      description,
      value,
      completion,
      user, // 👈 Save userId from request body
    });

    const saved = await newProject.save();

    await createNotification(
      '🆕 Project "{name}" created successfully.',
      saved.name
    );

    res.status(201).json({
      message: "✅ Project created successfully",
      project: saved,
    });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(400).json({ error: "❌ Failed to create project" });
  }
};

// controllers/projectController.js

// ✅ Update Project with logging
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const oldProject = await Project.findById(id);
    if (!oldProject) return res.status(404).json({ error: "Project not found" });

    const updated = await Project.findByIdAndUpdate(id, req.body, { new: true });
    
    await logChange({
      modelName: 'Project',
      documentId: id,
      operation: 'update',
      updatedBy: req.userId || 'unknown',
      before: oldProject.toObject(),
      after: updated.toObject(),
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update project" });
  }
};

// ✅ Delete Project with logging
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    await logChange({
      modelName: 'Project',
      documentId: id,
      operation: 'delete',
      updatedBy: req.userId || 'unknown',
      deletedData: project.toObject(),
    });

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};


export const getProjectName = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in query" });
  }

  try {
    // Return only _id and name for projects that belong to the user
    const projects = await Project.find({ user: userId }, "_id name");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};



// Get projects with populated stakeholders
export const getProjectsWithStakeholders = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "Missing userId in query" });

  try {
    const projects = await Project.find({ user: userId })
      .populate("stakeholders")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects with stakeholders" });
  }
};
export const getProjectsWithTotalExpense = async (req, res) => {
  const { userId } = req.query;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid or missing userId" });
  }

  try {
    const projects = await Project.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "finances", // collection name in DB
          localField: "_id",
          foreignField: "project",
          as: "finances",
        },
      },
      {
        $addFields: {
          totalExpenditure: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$finances",
                    as: "f",
                    cond: { $eq: ["$$f.type", "expense"] },
                  },
                },
                as: "e",
                in: "$$e.amount",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          value: 1,
          completion: 1,
          totalExpenditure: 1,
        },
      },
    ]);

    res.status(200).json(projects);
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({
      message: "Failed to fetch projects with total expense",
      error: error.message,
    });
  }
};

// Controller to get all projects with profit distribution and expenditure details
export const getAllProjectsWithProfitDistribution = async (req, res) => {
  const { userId } = req.query;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid or missing userId" });
  }

  try {
    // 1. Get all project IDs with stakeholders
    const stakeholderProjects = await Stakeholder.distinct("project");

    // 2. Filter projects that belong to this user and have stakeholders
    const projects = await Project.find({
      _id: { $in: stakeholderProjects },
      user: userId,
    });

    const result = [];

    for (const project of projects) {
      // 3. Fetch all expense transactions for this project
      const expenseTransactions = await Finance.find({
        project: project._id,
        type: "expense",
      });

      // 4. Calculate total expenditure
      const totalExpenditure = expenseTransactions.reduce(
        (sum, entry) => sum + entry.amount,
        0
      );

      // 5. Calculate profit
      const profit = project.value - totalExpenditure;

      // 6. Get project stakeholders
      const stakeholders = await Stakeholder.find({ project: project._id });

      // 7. Calculate total share
      const totalShare = stakeholders.reduce((sum, s) => sum + s.share, 0);

      // 8. Calculate each stakeholder's profit (if share is 100%)
      const stakeholderProfits = stakeholders.map((stakeholder) => ({
        name: stakeholder.name,
        share: stakeholder.share,
        profit:
          totalShare === 100
            ? ((stakeholder.share / 100) * profit).toFixed(2)
            : "0.00",
      }));

      // 9. Push project report to result
      result.push({
        project: {
          id: project._id,
          name: project.name,
          value: project.value,
          totalExpenditure,
          profit: totalShare === 100 ? profit.toFixed(2) : "0.00",
        },
        expenditures: expenseTransactions.map((exp) => ({
          id: exp._id,
          description: exp.description || "",
          amount: exp.amount,
          date: exp.createdAt,
        })),
        stakeholderProfits,
        totalShare,
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching project profit distribution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Search projects by exact word match only (case-insensitive)
export const searchProjects = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query is required" });
    }

    // Exact match using word boundaries and case-insensitive flag
    const exactWordRegex = new RegExp(`\\b${query}\\b`, "i");

    const results = await Project.find({
      name: { $regex: exactWordRegex },
    }).populate("stakeholders");

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};

// GET /api/projects/:id/available-share
export const getAvailableShare = async (req, res) => {
  try {
    // Find all stakeholders for the project
    const stakeholders = await Stakeholder.find({ project: req.params.id });

    if (!stakeholders || stakeholders.length === 0) {
      // No stakeholders yet, so 100% share is available
      return res.json({ availableShare: 100 });
    }

    // Sum up all stakeholder shares
    const totalShare = stakeholders.reduce((sum, s) => sum + (s.share || 0), 0);
    const availableShare = Math.max(100 - totalShare, 0);

    res.json({ availableShare });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
