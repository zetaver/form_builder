import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  allowedDomains: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate a unique API key before saving
apiKeySchema.pre('save', function(next) {
  if (this.isNew) {
    this.key = `zf_${crypto.randomBytes(32).toString('hex')}`;
  }
  next();
});

export const ApiKey = mongoose.model('ApiKey', apiKeySchema);