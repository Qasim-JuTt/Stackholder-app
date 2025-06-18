import Project from '../models/Project.js';
import Finance from '../models/ProjectFinance.js';
import Stakeholder from '../models/Stakeholder.js';

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }); // Latest first
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};


export const createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

export const getProjectName = async (req, res) => {
  try {
    // Fetch only `_id` and `name`
    const projects = await Project.find({}, '_id name');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProjectsWithStakeholders = async (req, res) => {
  try {
    const projects = await Project.find().populate({
      path: 'stakeholders',
      select: 'name role share' // fetch only these fields
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/projectController.js

export const getProjectsWithTotalExpense = async (req, res) => {
  try {
    const projects = await Project.aggregate([
      {
        $lookup: {
          from: 'finances',
          localField: '_id',
          foreignField: 'project',
          as: 'finances'
        }
      },
      {
        $addFields: {
          totalExpense: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$finances',
                    as: 'f',
                    cond: { $eq: ['$$f.type', 'expense'] }
                  }
                },
                as: 'e',
                in: '$$e.amount'
              }
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          value: 1,
          completion: 1,
          totalExpense: 1,
          createdAt: 1
        }
      }
    ]);

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


export const getAllProjectsWithProfitDistribution = async (req, res) => {
  try {
    // 1. Get all projects that have at least one stakeholder
    const stakeholderProjects = await Stakeholder.distinct('project');
    const projects = await Project.find({ _id: { $in: stakeholderProjects } });

    const result = [];

    for (const project of projects) {
      // 2. Get total expenses for each project
      const expenses = await Finance.aggregate([
        { $match: { project: project._id, type: 'expense' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      const totalExpense = expenses[0]?.total || 0;

      // 3. Calculate profit
      const profit = project.value - totalExpense;

      // 4. Get stakeholders for this project
      const stakeholders = await Stakeholder.find({ project: project._id });

      // 5. Calculate individual profit share (only name, share, profit)
      const stakeholderProfits = stakeholders.map((stakeholder) => ({
        name: stakeholder.name,
        share: stakeholder.share,
        profit: ((stakeholder.share / 100) * profit).toFixed(2),
      }));

      // 6. Add project info and profit distribution to result array
      result.push({
        project: {
          id: project._id,
          name: project.name,
          value: project.value,
          totalExpense,
          profit: profit.toFixed(2)
        },
        stakeholderProfits
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

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Exact match using word boundaries and case-insensitive flag
    const exactWordRegex = new RegExp(`\\b${query}\\b`, 'i');

    const results = await Project.find({
      name: { $regex: exactWordRegex },
    }).populate('stakeholders');

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};


