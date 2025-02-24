import { ApiKey } from '../models/apiKey.js';
import crypto from 'crypto';

export const createApiKey = async (req, res) => {
  try {
    const { name, allowedDomains, projectId } = req.body;

    const apiKey = await ApiKey.create({
      name,
      allowedDomains,
      projectId,
      createdBy: req.user._id
    });

    res.status(201).json(apiKey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectApiKeys = async (req, res) => {
  try {
    const apiKeys = await ApiKey.find({
      projectId: req.params.projectId,
      createdBy: req.user._id
    });

    res.json(apiKeys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApiKey = async (req, res) => {
  try {
    const { name, allowedDomains, isActive } = req.body;

    const apiKey = await ApiKey.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { name, allowedDomains, isActive },
      { new: true }
    );

    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    res.json(apiKey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteApiKey = async (req, res) => {
  try {
    const apiKey = await ApiKey.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};