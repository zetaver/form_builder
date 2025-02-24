import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Form } from '../types/form';

interface EmbedCodeModalProps {
  form: Form;
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedCodeModal: React.FC<EmbedCodeModalProps> = ({ form, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const embedCode = `
<div id="form-${form._id}"></div>
<script src="https://lptwkkfkcfun.form.io/forms/embed.js"></script>
<script>
  FormRenderer.render({
    target: '#form-${form._id}',
    endpoint: '${form.endpoint}',
  });
</script>
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Embed Form</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Copy and paste this code into your website to embed the form:
          </p>

          <div className="relative">
            <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              {embedCode}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-md shadow-sm border border-gray-200"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Usage Instructions</h3>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>Add the code to your HTML where you want the form to appear</li>
              <li>The form will automatically load and handle submissions</li>
              <li>Form submissions will be sent to your form's endpoint</li>
              <li>Styling will be automatically applied to match your form's design</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};