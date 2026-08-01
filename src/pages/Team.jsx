import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useStore } from '../services/store';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { formatDate } from '../utils/helpers';

export const Team = () => {
  const { team, addAdmin, updateAdmin, deleteAdmin } = useStore();
  const { addToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', username: '', password: '', role: 'Admin', phone: '', email: ''
  });

  const handleOpenModal = (admin = null) => {
    if (admin) {
      setEditingId(admin.id);
      setFormData(admin);
    } else {
      setEditingId(null);
      setFormData({ name: '', username: '', password: '', role: 'Admin', phone: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      updateAdmin(editingId, formData);
      addToast('Admin updated successfully', 'success');
    } else {
      // check unique username
      if (team.find(t => t.username === formData.username)) {
        addToast('Username must be unique', 'error');
        return;
      }
      if (formData.password.length < 8) {
        addToast('Password minimum 8 characters', 'error');
        return;
      }
      addAdmin({ ...formData, createdAt: new Date().toISOString() });
      addToast('Admin created successfully', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteAdmin(deleteId);
    addToast('Admin deleted successfully', 'success');
    setDeleteId(null);
  };

  const columns = ['Name', 'Role', 'Contact', 'Created Date', 'Actions'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gradient tracking-tight pb-1">Team Management</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Manage your studio team members.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FiPlus /> Add Admin
        </Button>
      </div>

      <Table
        columns={columns}
        data={team}
        keyExtractor={(item) => item.id}
        renderRow={(admin) => (
          <>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {admin.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">{admin.name}</div>
                  <div className="text-xs text-slate-500">@{admin.username}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <Badge variant={admin.role === 'Super Admin' ? 'orange' : 'blue'}>{admin.role}</Badge>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">{admin.email}</div>
              <div className="text-xs text-slate-500">{admin.phone}</div>
            </td>
            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
              {formatDate(admin.createdAt)}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenModal(admin)} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors" title="Edit">
                  <FiEdit2 size={18} />
                </button>
                <button onClick={() => setDeleteId(admin.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </td>
          </>
        )}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Admin' : 'Add Admin'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <Input label="Username" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} disabled={!!editingId} />
            <Input label="Password" type="password" required={!editingId} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} minLength={8} />
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
              <select className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
            <Input label="Email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <Input label="Phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Admin"
        message="Are you sure you want to delete this admin? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};
