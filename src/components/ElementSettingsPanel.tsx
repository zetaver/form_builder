import React, { useState } from 'react';
import { FormElement } from '../types/form';
import { useFormStore } from '../store/formStore';
import { Monitor, Shield, GitBranch, Layout, X, HelpCircle } from 'lucide-react';

interface ElementSettingsPanelProps {
  element: FormElement;
  onClose: () => void;
}

type Tab = 'display' | 'validation' | 'conditional' | 'layout';

export const ElementSettingsPanel: React.FC<ElementSettingsPanelProps> = ({ element, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('display');
  const { updateElement } = useFormStore();

  const handleChange = (field: string, value: any) => {
    updateElement(element.id, { ...element, [field]: value });
  };

  const handleDisplayChange = (field: string, value: any) => {
    updateElement(element.id, {
      ...element,
      display: { ...(element.display || {}), [field]: value }
    });
  };

  const handleValidationChange = (field: string, value: any) => {
    updateElement(element.id, {
      ...element,
      validation: { ...element.validation, [field]: value }
    });
  };

  const tabs = [
    { id: 'display', label: 'Display', icon: <Monitor size={16} /> },
    { id: 'validation', label: 'Validation', icon: <Shield size={16} /> },
    { id: 'conditional', label: 'Conditional', icon: <GitBranch size={16} /> },
    { id: 'layout', label: 'Layout', icon: <Layout size={16} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="w-[600px] bg-white h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {element.label} Settings
            <HelpCircle size={16} className="text-gray-400" />
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'display' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={element.label}
                  onChange={(e) => handleChange('label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label Position
                </label>
                <select
                  value={element.display?.labelPosition || 'top'}
                  onChange={(e) => handleDisplayChange('labelPosition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="top">Top</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label Width
                </label>
                <input
                  type="text"
                  value={element.display?.labelWidth || ''}
                  onChange={(e) => handleDisplayChange('labelWidth', e.target.value)}
                  placeholder="e.g., 200px or 30%"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label Alignment
                </label>
                <select
                  value={element.display?.labelAlignment || 'left'}
                  onChange={(e) => handleDisplayChange('labelAlignment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={element.placeholder || ''}
                  onChange={(e) => handleChange('placeholder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={element.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <select
                  value={element.display?.size || 'medium'}
                  onChange={(e) => handleDisplayChange('size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tooltip
                </label>
                <input
                  type="text"
                  value={element.display?.tooltip || ''}
                  onChange={(e) => handleDisplayChange('tooltip', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prefix
                  </label>
                  <input
                    type="text"
                    value={element.display?.prefix || ''}
                    onChange={(e) => handleDisplayChange('prefix', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suffix
                  </label>
                  <input
                    type="text"
                    value={element.display?.suffix || ''}
                    onChange={(e) => handleDisplayChange('suffix', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom CSS Class
                </label>
                <input
                  type="text"
                  value={element.display?.customClass || ''}
                  onChange={(e) => handleDisplayChange('customClass', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hidden"
                    checked={element.display?.hidden || false}
                    onChange={(e) => handleDisplayChange('hidden', e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hidden" className="ml-2 block text-sm text-gray-900">
                    Hidden
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="disabled"
                    checked={element.display?.disabled || false}
                    onChange={(e) => handleDisplayChange('disabled', e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="disabled" className="ml-2 block text-sm text-gray-900">
                    Disabled
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autofocus"
                    checked={element.display?.autofocus || false}
                    onChange={(e) => handleDisplayChange('autofocus', e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autofocus" className="ml-2 block text-sm text-gray-900">
                    Autofocus
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={element.required || false}
                  onChange={(e) => handleChange('required', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
                  Required
                </label>
              </div>

              {element.type === 'text' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pattern (Regex)
                    </label>
                    <input
                      type="text"
                      value={element.validation?.pattern || ''}
                      onChange={(e) => handleValidationChange('pattern', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Length
                      </label>
                      <input
                        type="number"
                        value={element.validation?.minLength || ''}
                        onChange={(e) => handleValidationChange('minLength', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Length
                      </label>
                      <input
                        type="number"
                        value={element.validation?.maxLength || ''}
                        onChange={(e) => handleValidationChange('maxLength', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Error Message
                </label>
                <input
                  type="text"
                  value={element.validation?.customMessage || ''}
                  onChange={(e) => handleValidationChange('customMessage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'conditional' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-700">
                  Add conditions to control when this component should be visible or enabled.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Show/Hide Logic
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500">
                  <option>Show</option>
                  <option>Hide</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  When
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500">
                  <option>All</option>
                  <option>Any</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Conditions
                  </label>
                  <button className="text-sm text-green-600 hover:text-green-700">
                    + Add Condition
                  </button>
                </div>
                <div className="border border-gray-200 rounded-md p-4">
                  <p className="text-sm text-gray-500 text-center">
                    No conditions added yet
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <select
                  value={element.layout?.width || 'full'}
                  onChange={(e) => handleChange('layout', { ...element.layout, width: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="full">Full Width</option>
                  <option value="1/2">Half Width</option>
                  <option value="1/3">One Third</option>
                  <option value="1/4">One Quarter</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};