import { Form } from '../models/form.js';
import { Project } from '../models/project.js';

export const createForm = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.body.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getForms = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const forms = await Form.find({ projectId: req.params.projectId });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const project = await Project.findOne({
      _id: form.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const project = await Project.findOne({
      _id: form.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    Object.assign(form, req.body);
    await form.save();

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const project = await Project.findOne({
      _id: form.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await form.deleteOne();
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle form submissions
export const submitForm = async (req, res) => {
  try {
    const form = await Form.findOne({ endpoint: req.params.endpoint });
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Here you would typically:
    // 1. Validate the submitted data against form elements
    // 2. Store the submission in a separate collection
    // 3. Handle any form-specific logic (email notifications, etc.)

    // For now, we'll just return success
    res.json({ message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};