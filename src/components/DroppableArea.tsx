import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FormElement } from '../types/form';
import { DraggableElement } from './DraggableElement';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface DroppableAreaProps {
  elements: FormElement[];
  onEdit: (element: FormElement) => void;
}

export const DroppableArea: React.FC<DroppableAreaProps> = ({ elements, onEdit }) => {
  const { setNodeRef } = useDroppable({
    id: 'form-area',
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div 
        ref={setNodeRef}
        className="max-w-4xl mx-auto p-6"
      >
        {elements.length === 0 ? (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-center">
            Drag and Drop a form component
          </div>
        ) : (
          <SortableContext
            items={elements.map(el => el.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {elements.map((element) => (
                <DraggableElement
                  key={element.id}
                  element={element}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </SortableContext>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};