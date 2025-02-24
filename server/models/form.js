import mongoose from 'mongoose';

const radioOptionSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  shortcut: String
}, { _id: false });

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
  options: {
    type: [radioOptionSchema],
    validate: {
      validator: function(options) {
        if (this.type === 'radio' || this.type === 'select') {
          return options && options.length > 0;
        }
        return true;
      },
      message: 'Radio and Select elements must have at least one option'
    }
  },
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
  data: {
    sourceType: {
      type: String,
      enum: ['values', 'url', 'resource'],
      default: 'values'
    },
    defaultValue: String,
    clearWhenHidden: {
      type: Boolean,
      default: false
    },
    customDefaultValue: {
      type: Boolean,
      default: false
    },
    url: String,
    resource: String
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
    unique: true,
    sparse: true
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

// Add method to validate form data
formSchema.methods.validateSubmission = function(data) {
  const errors = [];
  
  this.elements.forEach(element => {
    const value = data[element.id];

    // Check required fields
    if (element.required && !value) {
      errors.push({
        field: element.id,
        message: element.validation?.customMessage || 'This field is required'
      });
      return;
    }

    // Skip validation if field is empty and not required
    if (!value && !element.required) return;

    // Type-specific validation
    switch (element.type) {
      case 'radio':
        if (value && !element.options.some(opt => opt.value === value)) {
          errors.push({
            field: element.id,
            message: 'Invalid option selected'
          });
        }
        break;
      
      // Add other validation cases as needed
    }
  });

  return errors;
};

// Add method to format submission data
formSchema.methods.formatSubmission = function(data) {
  const formatted = {};
  
  this.elements.forEach(element => {
    if (data[element.id] !== undefined) {
      formatted[element.id] = data[element.id];
    }
  });

  return formatted;
};

export const Form = mongoose.model('Form', formSchema);