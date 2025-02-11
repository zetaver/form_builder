import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormElement } from '../types/form';
import { GripVertical, X, Settings } from 'lucide-react';
import { useFormStore } from '../store/formStore';
import { ElementSettingsPanel } from './ElementSettingsPanel';

interface Props {
  element: FormElement;
  onEdit: (element: FormElement) => void;
}

export const DraggableElement: React.FC<Props> = ({ element, onEdit }) => {
  const { removeElement } = useFormStore();
  const [showSettings, setShowSettings] = React.useState(false);
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
      case 'number':
        return (
          <input
            type={element.type}
            placeholder={element.placeholder}
            defaultValue={element.defaultValue as string}
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
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            required={element.required}
            defaultChecked={element.defaultValue as boolean}
          />
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  name={element.id}
                  value={option}
                  className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                  required={element.required}
                  defaultChecked={element.defaultValue === option}
                />
                <label className="ml-2 text-gray-700">{option}</label>
              </div>
            ))}
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
              onClick={() => setShowSettings(true)}
              className="text-gray-400 hover:text-green-500"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => removeElement(element.id)}
              className="text-gray-400 hover:text-red-500"
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
    </>
  );
};