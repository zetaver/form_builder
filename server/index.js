import express from 'express';
import * as authController from './controllers/auth.js';
import * as projectController from './controllers/projects.js';
import * as formController from './controllers/forms.js';
import * as apiKeyController from './controllers/apiKeys.js';
import { protect } from './middleware/auth.js';
import userRoutes from './routes/users';

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

// API Key routes
router.use('/api-keys', protect);
router.post('/api-keys', apiKeyController.createApiKey);
router.get('/projects/:projectId/api-keys', apiKeyController.getProjectApiKeys);
router.route('/api-keys/:id')
  .put(apiKeyController.updateApiKey)
  .delete(apiKeyController.deleteApiKey);

// Public form submission endpoint
router.post('/submit/:endpoint', formController.submitForm);

router.use('/users', userRoutes);

export default router;