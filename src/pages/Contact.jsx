import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiEdit2, FiPlus, FiInstagram } from 'react-icons/fi';
import { useStore } from '../services/store';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Contact = () => {
  const { contacts, updateContact, addContact } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', phone: '' });

  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setFormData(contact);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: '', role: 'Team Member', phone: '' });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      updateContact(editingId, formData);
    } else {
      addContact(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gradient tracking-tight pb-1">Contact Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Important team contacts and studio details.</p>
        </div>
        <Button onClick={handleAddNew} className="shadow-lg shadow-blue-500/30">
          <FiPlus /> Add Contact
        </Button>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
          Teams
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {contacts.map((contact) => (
             <div key={contact.id} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col gap-4 hover:shadow-md transition-all duration-300 group">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
                   {contact.name.charAt(0)}
                 </div>
                 <div className="min-w-0 flex-1">
                   <h3 className="font-semibold text-slate-900 dark:text-white text-lg truncate">{contact.name}</h3>
                   <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{contact.role}</p>
                 </div>
               </div>
               
               <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                   <FiPhone className="text-blue-500" size={16} />
                   <span className="text-sm font-semibold tracking-wide">{contact.phone}</span>
                 </div>
                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => handleEdit(contact)}
                     className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-xl transition-colors"
                     title="Edit"
                   >
                     <FiEdit2 size={16} />
                   </button>
                   <a 
                     href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                     className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"
                     title="Call"
                   >
                     <FiPhone size={14} />
                   </a>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>
      
      {/* Studio Info */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <h2 className="text-2xl font-bold mb-6">Mersal Media Studio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="flex items-start gap-3 col-span-full md:col-span-2">
            <FiMapPin className="text-indigo-300 mt-1 shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-indigo-100">Location</h4>
              <p className="text-indigo-200/70 text-sm mt-1 uppercase">NO-3, RAMARMADAM, SOUTH STREET, PRATHABARAMAPURAM, PIN-611111</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiPhone className="text-indigo-300 mt-1 shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-indigo-100">Phone</h4>
              <p className="text-indigo-200/70 text-sm mt-1">6382251524 <span className="mx-2 text-indigo-400">|</span> 9944549583</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiInstagram className="text-indigo-300 mt-1 shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-indigo-100">Instagram</h4>
              <p className="text-indigo-200/70 text-sm mt-1">@mersalmediapoovai</p>
            </div>
          </div>
          <div className="flex items-start gap-3 md:col-span-2">
            <FiMail className="text-indigo-300 mt-1 shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-indigo-100">Email Us</h4>
              <p className="text-indigo-200/70 text-sm mt-1">mersalmedia555@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Contact' : 'Add Contact'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <Input label="Role" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
          <Input label="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
