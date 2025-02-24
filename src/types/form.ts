export interface RadioOption {
  label: string;
  value: string;
  shortcut?: string;
}

export interface FormElement {
  id: string;
  type: 'text' | 'number' | 'email' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'password' | 'url' | 'phone' | 'date' | 'currency' | 'html' | 'columns' | 'fieldset' | 'panel' | 'table' | 'tabs' | 'datasource' | 'file' | 'signature';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: RadioOption[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    customMessage?: string;
  };
  layout?: {
    width?: 'full' | '1/2' | '1/3' | '1/4';
    hidden?: boolean;
    labelWidth?: string;
    labelMargin?: string;
    labelPosition?: 'top' | 'left' | 'right';
    optionsLabelPosition?: 'right' | 'left';
  };
  display?: {
    labelPosition?: 'top' | 'left' | 'right';
    labelWidth?: string;
    labelAlignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large';
    tooltip?: string;
    prefix?: string;
    suffix?: string;
    customClass?: string;
    tabIndex?: number;
    hidden?: boolean;
    disabled?: boolean;
    autofocus?: boolean;
    autocomplete?: string;
  };
  data?: {
    sourceType: 'values' | 'url' | 'resource';
    defaultValue?: string;
    clearWhenHidden?: boolean;
    customDefaultValue?: boolean;
    url?: string;
    resource?: string;
    persistent?: 'none' | 'server' | 'client';
    protected?: boolean;
    dbIndex?: boolean;
    encrypted?: boolean;
    calculateServer?: boolean;
    allowManualOverride?: boolean;
    calculated?: string;
  };
  defaultValue?: string | number | boolean | string[];
  description?: string;
  tooltip?: string;
  shortcut?: string;
  customClass?: string;
  tabIndex?: number;
}

export interface Form {
  _id: string;
  projectId: string;
  title: string;
  name?: string;
  description?: string;
  elements: FormElement[];
  createdAt: string;
  endpoint: string;
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  userId: string;
}