import mongoose from 'mongoose';

const formElementSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    enum: ['text', 'number', 'email', 'select', 'textarea', 'checkbox', 'radio', 'password', 'url', 'phone', 'date', 'currency', 'html', 'columns', 'fieldset', 'panel', 'table', 'tabs', 'datasource', 'file', 'signature'],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  placeholder: String,
  required: {
    type: Boolean,
    default: false
  },
  options: [String],
  validation: {
    pattern: String,
    min: Number,
    max: Number,
    minLength: Number,
    maxLength: Number,
    customMessage: String
  },
  layout: {
    width: {
      type: String,
      enum: ['full', '1/2', '1/3', '1/4']
    },
    hidden: Boolean
  },
  display: {
    labelPosition: {
      type: String,
      enum: ['top', 'left', 'right']
    },
    labelWidth: String,
    labelAlignment: {
      type: String,
      enum: ['left', 'center', 'right']
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large']
    },
    tooltip: String,
    prefix: String,
    suffix: String,
    customClass: String,
    tabIndex: Number,
    hidden: Boolean,
    disabled: Boolean,
    autofocus: Boolean,
    autocomplete: String
  },
  defaultValue: mongoose.Schema.Types.Mixed,
  description: String
});

const formSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  name: String,
  description: String,
  elements: [formElementSchema],
  endpoint: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate endpoint from title before saving
formSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.endpoint = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export const Form = mongoose.model('Form', formSchema);