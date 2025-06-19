import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectName,
getProjectsWithStakeholders ,
getProjectsWithTotalExpense,
getAllProjectsWithProfitDistribution,
searchProjects,
getAvailableShare
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/getAll', getProjects);
router.get('/getName', getProjectName);
router.post('/create', createProject);
router.put('/update/:id', updateProject);
router.delete('/delete/:id', deleteProject);
router.get('/with-stakeholders', getProjectsWithStakeholders);
router.get('/expenses', getProjectsWithTotalExpense);
router.get('/profit-distribution', getAllProjectsWithProfitDistribution);
router.get('/search', searchProjects); // GET /api/projects/search?query=...
router.get('/share/:id', searchProjects); // GET /api/projects/search?query=...
router.get("/:id/available-share", getAvailableShare);






export default router;
