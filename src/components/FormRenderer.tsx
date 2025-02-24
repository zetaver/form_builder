import React, { useState } from 'react';
import { Form } from '../types/form';
import api from '../config/api';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface FormRendererProps {
  form: Form;
  onClose?: () => void;
  embedded?: boolean;
}

export const FormRenderer: React.FC<FormRendererProps> = ({ form, onClose, embedded = false }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (fieldId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await api.post(`/submit/${form.endpoint}`, formData);
      setSuccess(true);
      setFormData({});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (elementId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [elementId]: value,
    }));
  };

  const renderInput = (element: any) => {
    const commonProps = {
      id: element.id,
      required: element.required,
      placeholder: element.placeholder,
      value: formData[element.id] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        handleInputChange(element.id, e.target.value),
      className:
        'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm',
    };

    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'url':
      case 'phone':
        return <input type={element.type} {...commonProps} />;
      
      case 'password':
        return (
          <div className="relative">
            <input
              type={showPassword[element.id] ? 'text' : 'password'}
              {...commonProps}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              onClick={() => togglePasswordVisibility(element.id)}
            >
              {showPassword[element.id] ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        );

      case 'textarea':
        return <textarea {...commonProps} rows={4} />;

      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {element.options?.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {element.options?.map((option: any, index: number) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`${element.id}_${index}`}
                  name={element.id}
                  value={option.value}
                  checked={formData[element.id] === option.value}
                  onChange={(e) => handleInputChange(element.id, e.target.value)}
                  className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor={`${element.id}_${index}`} className="ml-2 block text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData[element.id] || false}
              onChange={(e) => handleInputChange(element.id, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label className="ml-2 block text-sm text-gray-700">{element.label}</label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={embedded ? '' : 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'}>
      <div className={`bg-white rounded-lg ${embedded ? 'w-full' : 'w-full max-w-2xl mx-4'}`}>
        {!embedded && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{form.title}</h2>
            {onClose && (
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                ×
              </button>
            )}
          </div>
        )}

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
              Form submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {form.elements.map((element) => (
              <div key={element.id}>
                <label className="block text-sm font-medium text-gray-700">
                  {element.label}
                  {element.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {element.description && <p className="mt-1 text-sm text-gray-500">{element.description}</p>}
                <div className="mt-1">{renderInput(element)}</div>
              </div>
            ))}

            <div className="flex justify-end">
              {!embedded && onClose && (
                <button type="button" onClick={onClose} className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Cancel
                </button>
              )}
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
