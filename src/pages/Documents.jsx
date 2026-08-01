import React, { useRef, useState } from 'react';
import { FiUpload, FiDownload, FiTrash2, FiFileText, FiImage, FiFile, FiEye } from 'react-icons/fi';
import { useStore } from '../services/store';
import { Button } from '../components/Button';
import { formatDate } from '../utils/helpers';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/Modal';

export const Documents = () => {
  const { documents, addDocument, deleteDocument } = useStore();
  const fileInputRef = useRef(null);
  const { addToast } = useToast();
  const [viewingDoc, setViewingDoc] = useState(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for local storage safety
        addToast('File is too large. Please upload files under 2MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        addDocument({
          name: file.name,
          type: file.type,
          url: reader.result,
          date: new Date().toISOString()
        });
        addToast('Document uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = (doc) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (type) => {
    if (type.includes('image')) return <FiImage size={24} className="text-blue-500" />;
    if (type.includes('pdf') || type.includes('text')) return <FiFileText size={24} className="text-rose-500" />;
    return <FiFile size={24} className="text-slate-500" />;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gradient tracking-tight pb-1">Documents</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and download company assets like Logos and Visiting Cards.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,.pdf,.doc,.docx"
          />
          <Button onClick={handleUploadClick} className="shadow-lg shadow-blue-500/30">
            <FiUpload /> Upload Document
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                {getFileIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 dark:text-white truncate" title={doc.name}>
                  {doc.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formatDate(doc.date)}</p>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              {doc.type.includes('image') && (
                <Button variant="secondary" className="flex-1 text-sm py-2" onClick={() => setViewingDoc(doc)}>
                  <FiEye /> View
                </Button>
              )}
              <Button variant="secondary" className="flex-1 text-sm py-2" onClick={() => handleDownload(doc)}>
                <FiDownload /> Download
              </Button>
              <button 
                onClick={() => deleteDocument(doc.id)}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
        
        {documents.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 mb-4">
              <FiFileText size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No Documents Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
              Upload your company logo, visiting cards, and other important assets here.
            </p>
            <Button onClick={handleUploadClick} variant="secondary">
              <FiUpload /> Upload First Document
            </Button>
          </div>
        )}
      </div>

      <Modal isOpen={!!viewingDoc} onClose={() => setViewingDoc(null)} title={viewingDoc?.name || 'Image Preview'} className="max-w-4xl">
        {viewingDoc && viewingDoc.type.includes('image') && (
          <div className="flex items-center justify-center bg-slate-50 dark:bg-black/40 rounded-xl p-4 min-h-[300px]">
            <img src={viewingDoc.url} alt={viewingDoc.name} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
          </div>
        )}
      </Modal>
    </div>
  );
};
