import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormElement } from '../types/form';
import { GripVertical, X, Settings, Code } from 'lucide-react';
import { useFormStore } from '../store/formStore';
import { ElementSettingsPanel } from './ElementSettingsPanel';
import { JsonEditorModal } from './JsonEditorModal';

interface Props {
  element: FormElement;
  onEdit: (element: FormElement) => void;
}

export const DraggableElement: React.FC<Props> = ({ element, onEdit }) => {
  const { removeElement, updateElement } = useFormStore();
  const [showSettings, setShowSettings] = React.useState(false);
  const [showJsonEditor, setShowJsonEditor] = React.useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getWidthClass = () => {
    switch (element.layout?.width) {
      case '1/2': return 'w-1/2';
      case '1/3': return 'w-1/3';
      case '1/4': return 'w-1/4';
      default: return 'w-full';
    }
  };

  const renderInput = () => {
    if (element.layout?.hidden) return null;

    switch (element.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <input
            type={element.type}
            placeholder={element.placeholder}
            defaultValue={element.defaultValue as string}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required={element.required}
          />
        );
      case 'password':
        return (
          <input
            type="password"
            placeholder={element.placeholder || "Enter password"}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required={element.required}
          />
        );
      case 'phone':
        return (
          <input
            type="tel"
            placeholder={element.placeholder || "Enter phone number"}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required={element.required}
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            placeholder={element.placeholder}
            defaultValue={element.defaultValue as number}
            min={element.validation?.min}
            max={element.validation?.max}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required={element.required}
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder}
            defaultValue={element.defaultValue as string}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required={element.required}
            rows={4}
          />
        );
      case 'select':
        return (
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required={element.required}
            defaultValue={element.defaultValue as string}
          >
            <option value="">Select an option</option>
            {element.options?.map((option, index) => (
              <option key={index} value={typeof option === 'string' ? option : option.value}>
                {typeof option === 'string' ? option : option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="mt-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
                defaultChecked={element.defaultValue as boolean}
                required={element.required}
              />
              <span className="ml-2">{element.label}</span>
            </label>
          </div>
        );
      case 'radio':
        return (
          <div className="mt-1 space-y-2">
            {(element.options || []).map((option, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="radio"
                  name={element.id}
                  value={typeof option === 'string' ? option : option.value}
                  className="border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required={element.required}
                  defaultChecked={element.defaultValue === (typeof option === 'string' ? option : option.value)}
                />
                <span className="ml-2">{typeof option === 'string' ? option : option.label}</span>
              </label>
            ))}
          </div>
        );
      case 'currency':
        return (
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-green-500 focus:ring-green-500"
              required={element.required}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`${getWidthClass()} ${element.layout?.hidden ? 'hidden' : ''}`}
      >
        <div className="bg-white rounded-lg shadow p-4 relative group">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="text-gray-400" />
          </div>
          
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowJsonEditor(true)}
              className="text-gray-400 hover:text-blue-500"
              title="Edit JSON"
            >
              <Code size={20} />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="text-gray-400 hover:text-green-500"
              title="Edit Settings"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => removeElement(element.id)}
              className="text-gray-400 hover:text-red-500"
              title="Remove Element"
            >
              <X size={20} />
            </button>
          </div>

          <div className="pl-8">
            <label className="block text-sm font-medium text-gray-700">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {element.description && (
              <p className="mt-1 text-sm text-gray-500">{element.description}</p>
            )}
            {element.tooltip && (
              <p className="mt-1 text-xs text-gray-400">{element.tooltip}</p>
            )}
            {renderInput()}
          </div>
        </div>
      </div>

      {showSettings && (
        <ElementSettingsPanel
          element={element}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showJsonEditor && (
        <JsonEditorModal
          element={element}
          onClose={() => setShowJsonEditor(false)}
          onSave={(updatedJson) => {
            updateElement(element.id, updatedJson);
            setShowJsonEditor(false);
          }}
        />
      )}
    </>
  );
};