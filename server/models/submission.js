import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  metadata: {
    ip: String,
    userAgent: String,
    origin: String,
    apiKey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApiKey'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
submissionSchema.index({ formId: 1, createdAt: -1 });
submissionSchema.index({ 'metadata.apiKey': 1 });

export const Submission = mongoose.model('Submission', submissionSchema);