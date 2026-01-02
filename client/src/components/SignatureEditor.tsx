import React, { useState } from 'react';
import { Bold, Italic, Underline, Link, Image, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface SignatureEditorProps {
  darkMode: boolean;
  onSave: (signature: string) => void;
  onCancel: () => void;
  initialSignature?: string;
}

export const SignatureEditor: React.FC<SignatureEditorProps> = ({ 
  darkMode, 
  onSave, 
  onCancel,
  initialSignature = '' 
}) => {
  const [signature, setSignature] = useState(initialSignature);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const handleFormat = (format: string) => {
    // Toggle format
    if (activeFormats.includes(format)) {
      setActiveFormats(activeFormats.filter(f => f !== format));
    } else {
      setActiveFormats([...activeFormats, format]);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
      darkMode ? 'bg-[#050505]/80' : 'bg-[#FAFAFA]/80'
    }`}>
      <div className={`w-full max-w-3xl mx-4 rounded-xl border shadow-2xl ${
        darkMode ? 'bg-[#111] border-white/10' : 'bg-white border-neutral-200'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-neutral-500/10">
          <h2 className="text-2xl font-light">Email Signature</h2>
          <p className="text-xs opacity-50 mt-1">Create a professional signature for your emails</p>
        </div>

        {/* Toolbar */}
        <div className={`p-3 border-b border-neutral-500/10 flex gap-2 flex-wrap ${
          darkMode ? 'bg-[#0A0A0A]' : 'bg-neutral-50'
        }`}>
          <button 
            onClick={() => handleFormat('bold')}
            className={`p-2 rounded-md transition-colors ${
              activeFormats.includes('bold')
                ? 'bg-red-600 text-white'
                : (darkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-200')
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => handleFormat('italic')}
            className={`p-2 rounded-md transition-colors ${
              activeFormats.includes('italic')
                ? 'bg-red-600 text-white'
                : (darkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-200')
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => handleFormat('underline')}
            className={`p-2 rounded-md transition-colors ${
              activeFormats.includes('underline')
                ? 'bg-red-600 text-white'
                : (darkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-200')
            }`}
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className={`w-px h-8 ${darkMode ? 'bg-white/10' : 'bg-neutral-300'}`}></div>

          <button className={`p-2 rounded-md ${darkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-200'}`}>
            <AlignLeft className="w-4 h-4" />
          </button>
          <button className={`p-2 rounded-md ${darkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-200'}`}>
            <AlignCenter className="w-4 h-4" />
          </button>
          <button className={`p-2 rounded-md ${darkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-200'}`}>
            <AlignRight className="w-4 h-4" />
          </button>

          <div className={`w-px h-8 ${darkMode ? 'bg-white/10' : 'bg-neutral-300'}`}></div>

          <button className={`p-2 rounded-md ${darkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-200'}`}>
            <Link className="w-4 h-4" />
          </button>
          <button className={`p-2 rounded-md ${darkMode ? 'hover:bg-white/5' : 'hover:bg-neutral-200'}`}>
            <Image className="w-4 h-4" />
          </button>
        </div>

        {/* Editor */}
        <div className="p-6">
          <textarea
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Your Name&#10;Position, Company&#10;Email | Phone&#10;Website"
            className={`w-full h-48 p-4 rounded-lg border outline-none resize-none text-sm font-mono ${
              darkMode 
                ? 'bg-[#0A0A0A] border-white/10 text-white placeholder:text-neutral-600' 
                : 'bg-neutral-50 border-neutral-200 text-black placeholder:text-neutral-400'
            }`}
            style={{
              fontWeight: activeFormats.includes('bold') ? 'bold' : 'normal',
              fontStyle: activeFormats.includes('italic') ? 'italic' : 'normal',
              textDecoration: activeFormats.includes('underline') ? 'underline' : 'none'
            }}
          />
          
          <div className="mt-4 grid grid-cols-3 gap-3">
            <button
              className={`p-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-colors ${
                darkMode 
                  ? 'border-white/10 hover:bg-white/5' 
                  : 'border-neutral-200 hover:bg-neutral-100'
              }`}
              onClick={() => setSignature('Best regards,\nYour Name\nPosition, Company\nemail@company.com | +971 XX XXX XXXX')}
            >
              Professional
            </button>
            <button
              className={`p-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-colors ${
                darkMode 
                  ? 'border-white/10 hover:bg-white/5' 
                  : 'border-neutral-200 hover:bg-neutral-100'
              }`}
              onClick={() => setSignature('Cheers,\nYour Name\nemail@company.com')}
            >
              Casual
            </button>
            <button
              className={`p-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-colors ${
                darkMode 
                  ? 'border-white/10 hover:bg-white/5' 
                  : 'border-neutral-200 hover:bg-neutral-100'
              }`}
              onClick={() => setSignature('Sincerely,\nYour Name\nTitle | Company\nOffice: +XXX | Mobile: +XXX\nwww.company.com')}
            >
              Executive
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className={`p-6 border-t border-neutral-500/10 ${
          darkMode ? 'bg-[#0A0A0A]' : 'bg-neutral-50'
        }`}>
          <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Preview</div>
          <div className={`p-4 rounded-lg border ${
            darkMode ? 'bg-[#111] border-white/10' : 'bg-white border-neutral-200'
          }`}>
            <div className="text-sm whitespace-pre-wrap" style={{
              fontWeight: activeFormats.includes('bold') ? 'bold' : 'normal',
              fontStyle: activeFormats.includes('italic') ? 'italic' : 'normal',
              textDecoration: activeFormats.includes('underline') ? 'underline' : 'none'
            }}>
              {signature || 'Your signature will appear here...'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-neutral-500/10 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className={`px-6 py-2 rounded-lg border text-sm font-bold uppercase tracking-wider transition-colors ${
              darkMode 
                ? 'border-white/10 hover:bg-white/5' 
                : 'border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(signature)}
            className="px-6 py-2 rounded-lg bg-red-600 text-white text-sm font-bold uppercase tracking-wider hover:shadow-lg transition-all"
          >
            Save Signature
          </button>
        </div>
      </div>
    </div>
  );
};