import React from 'react';
import { FormElement } from '../types/form';
import { useFormStore } from '../store/formStore';
import { Settings, Layers, Database, Shield } from 'lucide-react';

interface Props {
  element: FormElement;
}

export const PropertiesPanel: React.FC<Props> = ({ element }) => {
  const { updateElement } = useFormStore();

  const handleChange = (field: string, value: any) => {
    updateElement(element.id, { ...element, [field]: value });
  };

  const handleValidationChange = (field: string, value: any) => {
    updateElement(element.id, {
      ...element,
      validation: { ...element.validation, [field]: value }
    });
  };

  const handleLayoutChange = (field: string, value: any) => {
    updateElement(element.id, {
      ...element,
      layout: { ...element.layout, [field]: value }
    });
  };

  const handleApiChange = (field: string, value: any) => {
    updateElement(element.id, {
      ...element,
      api: { ...element.api, [field]: value }
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
          <Settings size={16} />
          Basic Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              value={element.label}
              onChange={(e) => handleChange('label', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          
          {(element.type === 'text' || element.type === 'textarea' || element.type === 'email' || element.type === 'number') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Placeholder</label>
              <input
                type="text"
                value={element.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={element.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Default Value</label>
            {element.type === 'select' || element.type === 'radio' ? (
              <select
                value={element.defaultValue as string || ''}
                onChange={(e) => handleChange('defaultValue', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select a default value</option>
                {element.options?.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : element.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={!!element.defaultValue}
                onChange={(e) => handleChange('defaultValue', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            ) : (
              <input
                type={element.type}
                value={element.defaultValue as string || ''}
                onChange={(e) => handleChange('defaultValue', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            )}
          </div>

          {(element.type === 'select' || element.type === 'radio') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Options</label>
              <textarea
                value={element.options?.join('\n') || ''}
                onChange={(e) => handleChange('options', e.target.value.split('\n').filter(Boolean))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter options (one per line)"
                rows={4}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
          <Shield size={16} />
          Validation
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={element.required || false}
              onChange={(e) => handleChange('required', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-700">Required</label>
          </div>

          {element.type === 'text' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pattern (Regex)</label>
                <input
                  type="text"
                  value={element.validation?.pattern || ''}
                  onChange={(e) => handleValidationChange('pattern', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Length</label>
                  <input
                    type="number"
                    value={element.validation?.minLength || ''}
                    onChange={(e) => handleValidationChange('minLength', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Length</label>
                  <input
                    type="number"
                    value={element.validation?.maxLength || ''}
                    onChange={(e) => handleValidationChange('maxLength', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {element.type === 'number' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Value</label>
                <input
                  type="number"
                  value={element.validation?.min || ''}
                  onChange={(e) => handleValidationChange('min', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Value</label>
                <input
                  type="number"
                  value={element.validation?.max || ''}
                  onChange={(e) => handleValidationChange('max', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Custom Error Message</label>
            <input
              type="text"
              value={element.validation?.customMessage || ''}
              onChange={(e) => handleValidationChange('customMessage', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
          <Layers size={16} />
          Layout
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Width</label>
            <select
              value={element.layout?.width || 'full'}
              onChange={(e) => handleLayoutChange('width', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="full">Full Width</option>
              <option value="1/2">Half Width</option>
              <option value="1/3">One Third</option>
              <option value="1/4">One Quarter</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={element.layout?.hidden || false}
              onChange={(e) => handleLayoutChange('hidden', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-700">Hidden</label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
          <Database size={16} />
          API Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">API Key</label>
            <input
              type="text"
              value={element.api?.key || ''}
              onChange={(e) => handleApiChange('key', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">API URL</label>
            <input
              type="text"
              value={element.api?.url || ''}
              onChange={(e) => handleApiChange('url', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Method</label>
            <select
              value={element.api?.method || 'GET'}
              onChange={(e) => handleApiChange('method', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Response Path</label>
            <input
              type="text"
              value={element.api?.path || ''}
              onChange={(e) => handleApiChange('path', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., data.items"
            />
          </div>
        </div>
      </div>
    </div>
  );
};