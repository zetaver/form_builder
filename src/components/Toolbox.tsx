import React from 'react';
import { useFormStore } from '../store/formStore';
import { FormElement } from '../types/form';
import { Type, Hash, Mail, List, AlignLeft, CheckSquare, Radio, Calendar, Clock, DollarSign, FileText, Link2, Phone, Tag, MapPin, Layout, Columns, Table, Table as Tabs, PanelLeftClose, Database, Shield, File, FormInput as Form, Pen, Tags, Table2, FileCheck, PenTool, Code, ChevronDown, ChevronRight } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { Sidebar, SidebarBody } from './ui/sidebar';

interface ToolboxItemProps {
  element: FormElement;
  icon: React.ReactNode;
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ element, icon }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbox-${element.type}`,
    data: element
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 px-3 py-1.5 cursor-move hover:bg-green-50 border border-transparent hover:border-green-200 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className="text-gray-600">{icon}</span>
      <span className="text-sm text-gray-700">{element.label}</span>
    </div>
  );
};

const CategorySection: React.FC<{
  title: string;
  elements: FormElement[];
  getIcon: (type: string) => React.ReactNode;
}> = ({ title, elements, getIcon }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="py-1">
          {elements.map((element, idx) => (
            <ToolboxItem key={idx} element={element} icon={getIcon(element.type)} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Toolbox: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const basicElements: FormElement[] = [
    {
      id: '',
      type: 'text',
      label: 'Text Field',
      placeholder: 'Enter text...',
      required: false,
    },
    {
      id: '',
      type: 'textarea',
      label: 'Text Area',
      placeholder: 'Enter long text...',
      required: false,
    },
    {
      id: '',
      type: 'number',
      label: 'Number',
      placeholder: 'Enter number...',
      required: false,
    },
    {
      id: '',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter password...',
      required: false,
    },
    {
      id: '',
      type: 'checkbox',
      label: 'Checkbox',
      required: false,
    },
    {
      id: '',
      type: 'select',
      label: 'Select',
      options: ['Option 1', 'Option 2', 'Option 3'],
      required: false,
    },
    {
      id: '',
      type: 'radio',
      label: 'Radio',
      options: [{ label: 'Option 1', value: '1' }],
      required: false,
      data: {
        sourceType: 'values',
        clearWhenHidden: false,
        customDefaultValue: false
      }
    },
  ];

  const advancedElements: FormElement[] = [
    {
      id: '',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter email...',
      required: false,
    },
    {
      id: '',
      type: 'url',
      label: 'URL',
      placeholder: 'Enter URL...',
      required: false,
    },
    {
      id: '',
      type: 'phone',
      label: 'Phone Number',
      placeholder: 'Enter phone...',
      required: false,
    },
    {
      id: '',
      type: 'date',
      label: 'Date / Time',
      required: false,
    },
    {
      id: '',
      type: 'currency',
      label: 'Currency',
      placeholder: 'Enter amount...',
      required: false,
    },
  ];

  const layoutElements: FormElement[] = [
    {
      id: '',
      type: 'html',
      label: 'HTML Element',
      required: false,
    },
    {
      id: '',
      type: 'columns',
      label: 'Columns',
      required: false,
    },
    {
      id: '',
      type: 'fieldset',
      label: 'Field Set',
      required: false,
    },
    {
      id: '',
      type: 'panel',
      label: 'Panel',
      required: false,
    },
    {
      id: '',
      type: 'table',
      label: 'Table',
      required: false,
    },
    {
      id: '',
      type: 'tabs',
      label: 'Tabs',
      required: false,
    },
  ];

  const dataElements: FormElement[] = [
    {
      id: '',
      type: 'datasource',
      label: 'Data Source',
      required: false,
    },
    {
      id: '',
      type: 'file',
      label: 'File',
      required: false,
    },
    {
      id: '',
      type: 'signature',
      label: 'Signature',
      required: false,
    },
  ];

  const getIcon = (type: string) => {
    const iconProps = { size: 16 };
    switch (type) {
      case 'text': return <Type {...iconProps} />;
      case 'textarea': return <AlignLeft {...iconProps} />;
      case 'number': return <Hash {...iconProps} />;
      case 'password': return <Shield {...iconProps} />;
      case 'checkbox': return <CheckSquare {...iconProps} />;
      case 'select': return <List {...iconProps} />;
      case 'radio': return <Radio {...iconProps} />;
      case 'email': return <Mail {...iconProps} />;
      case 'url': return <Link2 {...iconProps} />;
      case 'phone': return <Phone {...iconProps} />;
      case 'date': return <Calendar {...iconProps} />;
      case 'currency': return <DollarSign {...iconProps} />;
      case 'html': return <Code {...iconProps} />;
      case 'columns': return <Columns {...iconProps} />;
      case 'fieldset': return <Layout {...iconProps} />;
      case 'panel': return <PanelLeftClose {...iconProps} />;
      case 'table': return <Table {...iconProps} />;
      case 'tabs': return <Tabs {...iconProps} />;
      case 'datasource': return <Database {...iconProps} />;
      case 'file': return <File {...iconProps} />;
      case 'signature': return <PenTool {...iconProps} />;
      default: return null;
    }
  };

  const filterElements = (elements: FormElement[]) => {
    return elements.filter(element =>
      element.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="flex flex-col h-full">
        <div className="flex flex-col h-full">
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search field(s)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="overflow-y-auto flex-1">
            <CategorySection
              title="Basic"
              elements={filterElements(basicElements)}
              getIcon={getIcon}
            />

            <CategorySection
              title="Advanced"
              elements={filterElements(advancedElements)}
              getIcon={getIcon}
            />

            <CategorySection
              title="Layout"
              elements={filterElements(layoutElements)}
              getIcon={getIcon}
            />

            <CategorySection
              title="Data"
              elements={filterElements(dataElements)}
              getIcon={getIcon}
            />
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
};