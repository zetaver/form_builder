export interface FormElement {
  id: string;
  type: 'text' | 'number' | 'email' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'password' | 'url' | 'phone' | 'date' | 'currency' | 'html' | 'columns' | 'fieldset' | 'panel' | 'table' | 'tabs' | 'datasource' | 'file' | 'signature';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
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
  defaultValue?: string | number | boolean | string[];
  description?: string;
}

export interface Form {
  id: string;
  projectId: string;
  title: string;
  name?: string;
  description?: string;
  elements: FormElement[];
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
}