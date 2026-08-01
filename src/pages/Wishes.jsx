import React, { useState } from 'react';
import { useStore } from '../services/store';
import { useToast } from '../context/ToastContext';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { formatDate } from '../utils/helpers';
import { FiGift, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export const Wishes = () => {
  const { wishes, addWish, updateWish, deleteWish } = useStore();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const initialForm = { date: '', personName: '', function: '', type: 'Client' };
  const [formData, setFormData] = useState(initialForm);

  const handleOpenModal = (wish = null) => {
    if (wish) {
      setEditingId(wish.id);
      setFormData(wish);
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      updateWish(editingId, formData);
      addToast('Wish updated successfully', 'success');
    } else {
      addWish(formData);
      addToast('Wish added successfully', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteWish(deleteId);
    addToast('Wish deleted successfully', 'success');
    setDeleteId(null);
  };

  const columns = ['Date', 'Person Name', 'Event', 'Type', 'Actions'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gradient tracking-tight pb-1 flex items-center gap-3">
            <FiGift className="text-pink-500" />
            Wish Management
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Track birthdays, anniversaries, and send wishes.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-pink-500/30 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
          <FiPlus /> Add Wish
        </Button>
      </div>

      <Table
        columns={columns}
        data={wishes}
        keyExtractor={(item) => item.id}
        renderRow={(wish) => (
          <>
            <td className="px-6 py-4 font-medium">{formatDate(wish.date)}</td>
            <td className="px-6 py-4">
              <div className="font-semibold text-slate-800 dark:text-white">{wish.personName}</div>
            </td>
            <td className="px-6 py-4">{wish.function}</td>
            <td className="px-6 py-4">
              <Badge variant={wish.type === 'Client' ? 'blue' : 'green'}>{wish.type}</Badge>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenModal(wish)} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors" title="Edit">
                  <FiEdit2 size={18} />
                </button>
                <button onClick={() => setDeleteId(wish.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </td>
          </>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Wish' : 'Add Wish'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Person Name" required value={formData.personName} onChange={e => setFormData({...formData, personName: e.target.value})} />
          <Input label="Date (Birth/Anniversary)" type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          <Input label="Event Function (e.g. Birthday, 1st Anniversary)" required value={formData.function} onChange={e => setFormData({...formData, function: e.target.value})} />
          
          <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
            <select className="px-5 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="Client">Client</option>
              <option value="Team Member">Team Member</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-indigo-500/10 dark:border-indigo-500/20 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Wish</Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Wish"
        message="Are you sure you want to delete this event?"
        confirmText="Delete"
      />
    </div>
  );
};
