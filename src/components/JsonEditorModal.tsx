import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FormElement } from '../types/form';

interface JsonEditorModalProps {
  element: FormElement;
  onClose: () => void;
  onSave: (updatedJson: FormElement) => void;
}

export const JsonEditorModal: React.FC<JsonEditorModalProps> = ({
  element,
  onClose,
  onSave,
}) => {
  const [jsonString, setJsonString] = useState(JSON.stringify(element, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const parsedJson = JSON.parse(jsonString);
      onSave(parsedJson);
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Component JSON</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-700 rounded border border-red-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <textarea
              value={jsonString}
              onChange={(e) => {
                setJsonString(e.target.value);
                setError(null);
              }}
              className="w-full h-96 font-mono text-sm p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};