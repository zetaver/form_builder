import { Form } from '../models/form.js';
import { Project } from '../models/project.js';
import { ApiKey } from '../models/apiKey.js';
import { Submission } from '../models/submission.js';

export const createForm = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.body.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure radio options are properly formatted
    const elements = req.body.elements.map(element => {
      if (element.type === 'radio' && Array.isArray(element.options)) {
        return {
          ...element,
          options: element.options.map(opt => {
            if (typeof opt === 'string') {
              return { label: opt, value: opt };
            }
            return opt;
          })
        };
      }
      return element;
    });

    const form = await Form.create({
      ...req.body,
      elements
    });

    res.status(201).json(form);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
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

export const submitForm = async (req, res) => {
  try {
    const { endpoint } = req.params;
    const apiKey = req.headers['x-api-key'];
    const origin = req.headers.origin;

    if (!apiKey) {
      return res.status(401).json({ message: 'API key is required' });
    }

    // Validate API key
    const apiKeyDoc = await ApiKey.findOne({ key: apiKey, isActive: true });
    if (!apiKeyDoc) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // Check allowed domains if specified
    if (apiKeyDoc.allowedDomains?.length > 0) {
      const domain = new URL(origin).hostname;
      if (!apiKeyDoc.allowedDomains.includes(domain)) {
        return res.status(403).json({ message: 'Domain not allowed' });
      }
    }

    // Find form
    const form = await Form.findOne({ endpoint });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Validate form belongs to the same project as API key
    if (form.projectId.toString() !== apiKeyDoc.projectId.toString()) {
      return res.status(403).json({ message: 'Invalid API key for this form' });
    }

    // Validate submission data
    const validationErrors = form.validateSubmission(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Create submission
    const submission = await Submission.create({
      formId: form._id,
      data: req.body,
      metadata: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        origin,
        apiKey: apiKeyDoc._id
      }
    });

    // Update API key last used timestamp
    await ApiKey.findByIdAndUpdate(apiKeyDoc._id, {
      lastUsed: new Date()
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};