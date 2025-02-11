import express from 'express';
import * as authController from '../controllers/auth.js';
import * as projectController from '../controllers/projects.js';
import * as formController from '../controllers/forms.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Project routes
router.use('/projects', protect);
router.route('/projects')
  .get(projectController.getProjects)
  .post(projectController.createProject);

router.route('/projects/:id')
  .get(projectController.getProject)
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

// Form routes
router.use('/forms', protect);
router.post('/forms', formController.createForm);
router.get('/projects/:projectId/forms', formController.getForms);

router.route('/forms/:id')
  .get(formController.getForm)
  .put(formController.updateForm)
  .delete(formController.deleteForm);

// Public form submission endpoint
router.post('/submit/:endpoint', formController.submitForm);

export default router;