import React, { useState } from 'react';
import { FormElement, RadioOption } from '../types/form';
import { useFormStore } from '../store/formStore';
import { Monitor, Shield, GitBranch, Layout, X, HelpCircle, Database, Trash2, Info, Clock, MapPin, DollarSign } from 'lucide-react';

interface ElementSettingsPanelProps {
  element: FormElement;
  onClose: () => void;
}

type Tab = 'display' | 'data' | 'validation' | 'conditional' | 'layout' | 'api' | 'logic' | 'date' | 'time' | 'provider';

export const ElementSettingsPanel: React.FC<ElementSettingsPanelProps> = ({ element, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('display');
  const { updateElement } = useFormStore();
  const [radioOptions, setRadioOptions] = useState<RadioOption[]>(
    element.options?.map(opt => typeof opt === 'string' ? { label: opt, value: opt } : opt) || 
    [{ label: 'Option 1', value: '1' }]
  );

  const handleChange = (field: string, value: any) => {
    updateElement(element.id, { ...element, [field]: value });
  };

  const handleDisplayChange = (field: string, value: any) => {
    updateElement(element.id, {
      ...element,
      display: { ...(element.display || {}), [field]: value }
    });
  };

  const handleLayoutChange = (field: string, value: any) => {
    updateElement(element.id, {
      ...element,
      layout: { ...(element.layout || {}), [field]: value }
    });
  };

  const handleDataChange = (field: string, value: any) => {
    updateElement(element.id, {
      ...element,
      data: { ...(element.data || {}), [field]: value }
    });
  };

  const handleValidationChange = (field: string, value: any) => {
    updateElement(element.id, {
      ...element,
      validation: { ...(element.validation || {}), [field]: value }
    });
  };

  const handleOptionChange = (index: number, field: keyof RadioOption, value: string) => {
    const newOptions = [...radioOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setRadioOptions(newOptions);
    updateElement(element.id, { ...element, options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...radioOptions, { 
      label: `Option ${radioOptions.length + 1}`, 
      value: `${radioOptions.length + 1}` 
    }];
    setRadioOptions(newOptions);
    updateElement(element.id, { ...element, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = radioOptions.filter((_, i) => i !== index);
    setRadioOptions(newOptions);
    updateElement(element.id, { ...element, options: newOptions });
  };

  const renderSelectSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={element.data?.multipleValues || false}
            onChange={(e) => handleDataChange('multipleValues', e.target.checked)}
            className="mr-2 rounded border-gray-300 text-green-600"
          />
          <span className="text-sm font-medium text-gray-700">Multiple Values</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Data Source Type
        </label>
        <select
          value={element.data?.sourceType || 'values'}
          onChange={(e) => handleDataChange('sourceType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="values">Values</option>
          <option value="url">URL</option>
          <option value="resource">Resource</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Default Value
        </label>
        <select
          value={element.defaultValue as string || ''}
          onChange={(e) => handleChange('defaultValue', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select a default value</option>
          {radioOptions.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data Source Values
        </label>
        <div className="space-y-3">
          {radioOptions.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="px-2 py-1 border border-gray-300 rounded cursor-move">≡</div>
              <input
                type="text"
                value={option.label}
                onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                placeholder="Label"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={option.value}
                onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => removeOption(index)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={addOption}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            + Add Another
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrencySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Currency
        </label>
        <select
          value={element.data?.currency || 'USD'}
          onChange={(e) => handleDataChange('currency', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="USD">US Dollar (USD)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="GBP">British Pound (GBP)</option>
          <option value="JPY">Japanese Yen (JPY)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Input Format
        </label>
        <select
          value={element.data?.inputFormat || 'plain'}
          onChange={(e) => handleDataChange('inputFormat', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="plain">Plain</option>
          <option value="formatted">Formatted</option>
        </select>
      </div>

      <div>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={element.data?.protected || false}
            onChange={(e) => handleDataChange('protected', e.target.checked)}
            className="mr-2 rounded border-gray-300 text-green-600"
          />
          <span className="text-sm font-medium text-gray-700">Protected</span>
        </label>
      </div>

      <div>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={element.data?.dbIndex || false}
            onChange={(e) => handleDataChange('dbIndex', e.target.checked)}
            className="mr-2 rounded border-gray-300 text-green-600"
          />
          <span className="text-sm font-medium text-gray-700">Database Index</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Case
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="textCase"
              value="mixed"
              checked={element.data?.textCase === 'mixed'}
              onChange={(e) => handleDataChange('textCase', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">Mixed (Allow upper and lower case)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="textCase"
              value="uppercase"
              checked={element.data?.textCase === 'uppercase'}
              onChange={(e) => handleDataChange('textCase', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">Uppercase</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="textCase"
              value="lowercase"
              checked={element.data?.textCase === 'lowercase'}
              onChange={(e) => handleDataChange('textCase', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">Lowercase</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderDateTimeSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display in Timezone
        </label>
        <select
          value={element.data?.timezone || 'viewer'}
          onChange={(e) => handleDataChange('timezone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="viewer">of Viewer</option>
          <option value="utc">UTC</option>
          <option value="submission">of Submission</option>
        </select>
      </div>

      <div>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={element.data?.useLocale || false}
            onChange={(e) => handleDataChange('useLocale', e.target.checked)}
            className="mr-2 rounded border-gray-300 text-green-600"
          />
          <span className="text-sm font-medium text-gray-700">Use Locale Settings</span>
        </label>
      </div>

      <div>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={element.data?.allowManualInput || false}
            onChange={(e) => handleDataChange('allowManualInput', e.target.checked)}
            className="mr-2 rounded border-gray-300 text-green-600"
          />
          <span className="text-sm font-medium text-gray-700">Allow Manual Input</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Format
        </label>
        <input
          type="text"
          value={element.data?.format || 'yyyy-MM-dd hh:mm a'}
          onChange={(e) => handleDataChange('format', e.target.value)}
          placeholder="yyyy-MM-dd hh:mm a"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <p className="mt-1 text-xs text-gray-500">Use formats provided by DateParser Codes</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Placeholder
        </label>
        <input
          type="text"
          value={element.placeholder || ''}
          onChange={(e) => handleChange('placeholder', e.target.value)}
          placeholder="Enter placeholder text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Date specific settings */}
      {activeTab === 'date' && (
        <>
          <div>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={element.data?.enableDateInput || false}
                onChange={(e) => handleDataChange('enableDateInput', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-green-600"
              />
              <span className="text-sm font-medium text-gray-700">Enable Date Input</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disable specific dates or dates by range
            </label>
            <input
              type="text"
              value={element.data?.disabledDates || ''}
              onChange={(e) => handleDataChange('disabledDates', e.target.value)}
              placeholder="(yyyy-MM-dd) or (yyyy-MM-dd - yyyy-MM-dd)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={element.data?.disableWeekends || false}
                onChange={(e) => handleDataChange('disableWeekends', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-green-600"
              />
              <span className="text-sm font-medium text-gray-700">Disable weekends</span>
            </label>
          </div>

          <div>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={element.data?.disableWeekdays || false}
                onChange={(e) => handleDataChange('disableWeekdays', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-green-600"
              />
              <span className="text-sm font-medium text-gray-700">Disable weekdays</span>
            </label>
          </div>
        </>
      )}

      {/* Time specific settings */}
      {activeTab === 'time' && (
        <>
          <div>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={element.data?.enableTimeInput || false}
                onChange={(e) => handleDataChange('enableTimeInput', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-green-600"
              />
              <span className="text-sm font-medium text-gray-700">Enable Time Input</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hour Step Size
            </label>
            <input
              type="number"
              value={element.data?.hourStep || 1}
              onChange={(e) => handleDataChange('hourStep', parseInt(e.target.value))}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minute Step Size
            </label>
            <input
              type="number"
              value={element.data?.minuteStep || 1}
              onChange={(e) => handleDataChange('minuteStep', parseInt(e.target.value))}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={element.data?.use12HourTime || false}
                onChange={(e) => handleDataChange('use12HourTime', e.target.checked)}
                className="mr-2 rounded border-gray-300 text-green-600"
              />
              <span className="text-sm font-medium text-gray-700">12 Hour Time (AM/PM)</span>
            </label>
          </div>
        </>
      )}
    </div>
  );

  const renderAddressSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Provider
        </label>
        <select
          value={element.data?.provider || 'google'}
          onChange={(e) => handleDataChange('provider', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="google">Google Maps</option>
          <option value="mapbox">Mapbox</option>
          <option value="here">HERE Maps</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          API Key
        </label>
        <input
          type="text"
          value={element.data?.apiKey || ''}
          onChange={(e) => handleDataChange('apiKey', e.target.value)}
          placeholder="Enter API key"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={element.data?.enableAutocomplete || false}
            onChange={(e) => handleDataChange('enableAutocomplete', e.target.checked)}
            className="mr-2 rounded border-gray-300 text-green-600"
          />
          <span className="text-sm font-medium text-gray-700">Enable Autocomplete</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country Restriction
        </label>
        <input
          type="text"
          value={element.data?.countryRestriction || ''}
          onChange={(e) => handleDataChange('countryRestriction', e.target.value)}
          placeholder="e.g., US,CA"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <p className="mt-1 text-xs text-gray-500">Comma-separated country codes</p>
      </div>
    </div>
  );

  const tabs = [
    { id: 'display', label: 'Display', icon: <Monitor size={16} /> },
    { id: 'data', label: 'Data', icon: <Database size={16} /> },
    { id: 'validation', label: 'Validation', icon: <Shield size={16} /> },
    { id: 'conditional', label: 'Conditional', icon: <GitBranch size={16} /> },
    { id: 'layout', label: 'Layout', icon: <Layout size={16} /> },
  ];

  // Add date/time tabs for datetime element
  if (element.type === 'date') {
    tabs.push(
      { id: 'date', label: 'Date', icon: <Clock size={16} /> },
      { id: 'time', label: 'Time', icon: <Clock size={16} /> }
    );
  }

  // Add provider tab for address element
  if (element.type === 'address') {
    tabs.push({ id: 'provider', label: 'Provider', icon: <MapPin size={16} /> });
  }

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
                  value={element.layout?.labelPosition || 'top'}
                  onChange={(e) => handleLayoutChange('labelPosition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="top">Top</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              {(element.type === 'checkbox' || element.type === 'radio') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Options Label Position
                  </label>
                  <select
                    value={element.layout?.optionsLabelPosition || 'right'}
                    onChange={(e) => handleLayoutChange('optionsLabelPosition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label Width
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={element.layout?.labelWidth || '30'}
                    onChange={(e) => handleLayoutChange('labelWidth', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <span className="text-gray-500">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label Margin
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={element.layout?.labelMargin || '3'}
                    onChange={(e) => handleLayoutChange('labelMargin', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <span className="text-gray-500">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={element.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Description for this field"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tooltip
                </label>
                <textarea
                  value={element.tooltip || ''}
                  onChange={(e) => handleChange('tooltip', e.target.value)}
                  placeholder="To add a tooltip to this field, enter text here"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom CSS Class
                </label>
                <input
                  type="text"
                  value={element.customClass || ''}
                  onChange={(e) => handleChange('customClass', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tab Index
                </label>
                <input
                  type="number"
                  value={element.tabIndex || 0}
                  onChange={(e) => handleChange('tabIndex', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'data' && element.type === 'select' && renderSelectSettings()}
          {activeTab === 'data' && element.type === 'currency' && renderCurrencySettings()}
          {(activeTab === 'date' || activeTab === 'time') && renderDateTimeSettings()}
          {activeTab === 'provider' && renderAddressSettings()}

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