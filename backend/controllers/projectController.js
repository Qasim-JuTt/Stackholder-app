import Project from "../models/Project.js";
import Finance from "../models/ProjectFinance.js";
import Stakeholder from "../models/Stakeholder.js";
import { createNotification } from "../utils/notificationUtils.js";

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

export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
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
          from: "finances", // 👈 Ensure this matches your actual collection name
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

    console.log("Projects found:", projects.length);
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
  try {
    // 1. Get all projects that have at least one stakeholder
    const stakeholderProjects = await Stakeholder.distinct("project");
    const projects = await Project.find({ _id: { $in: stakeholderProjects } });

    const result = [];

    for (const project of projects) {
      // 2. Get all expense transactions related to this project
      const expenseTransactions = await Finance.find({
        project: project._id,
        type: "expense",
      });

      // 3. Calculate total expenditure
      const totalExpenditure = expenseTransactions.reduce(
        (sum, entry) => sum + entry.amount,
        0
      );

      // 4. Calculate profit = value - totalExpenditure
      const profit = project.value - totalExpenditure;

      // 5. Get stakeholders for this project
      const stakeholders = await Stakeholder.find({ project: project._id });

      // 6. Calculate total share
      const totalShare = stakeholders.reduce((sum, s) => sum + s.share, 0);

      let stakeholderProfits = [];

      // 7. If totalShare is 100%, calculate profit distribution
      if (totalShare === 100) {
        stakeholderProfits = stakeholders.map((stakeholder) => ({
          name: stakeholder.name,
          share: stakeholder.share,
          profit: ((stakeholder.share / 100) * profit).toFixed(2),
        }));
      } else {
        stakeholderProfits = stakeholders.map((stakeholder) => ({
          name: stakeholder.name,
          share: stakeholder.share,
          profit: "0.00",
        }));
      }

      // 8. Build final result object
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
