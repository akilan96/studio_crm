import React, { useState, useMemo } from 'react';
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiCopy, FiFilter } from 'react-icons/fi';
import { useStore } from '../services/store';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { formatDate, calculatePendingPayment, copyGalleryLink, currencyFormatter, sortTasks, searchClients, paginate } from '../utils/helpers';
import confetti from 'canvas-confetti';

export const Tasks = () => {
  const { tasks, addTask, updateTask, deleteTask } = useStore();
  const { addToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  const initialForm = {
    clientName: '', date: '', location: '', phoneNumber: '', functionType: '', 
    status: 'Booked', responsibility: '', bookingAdvance: 0, totalPayment: 0, 
    settledPayment: 0, galleryLink: '', notes: '', deliveryDate: '',
    cameraTeam: '', editingTeam: '',
    preweddingDate: '', engagementDate: '', weddingDate: '', receptionDate: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const filteredTasks = useMemo(() => {
    let result = searchClients(tasks, searchQuery);
    result = sortTasks(result, sortOrder);
    return result;
  }, [tasks, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const currentTasks = useMemo(() => paginate(filteredTasks, currentPage, itemsPerPage), [filteredTasks, currentPage]);

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingId(task.id);
      setFormData({
        ...task,
        cameraTeam: Array.isArray(task.cameraTeam) ? task.cameraTeam.join(', ') : task.cameraTeam || '',
        editingTeam: Array.isArray(task.editingTeam) ? task.editingTeam.join(', ') : task.editingTeam || ''
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    let formattedLink = formData.galleryLink || '';
    if (formattedLink.includes('drive.google.com/drive/folders/')) {
      const match = formattedLink.match(/folders\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        formattedLink = `https://mersal-media-photos.vercel.app/${match[1]}`;
      }
    }

    const payload = {
      ...formData,
      galleryLink: formattedLink,
      pendingPayment: calculatePendingPayment(formData.totalPayment, formData.settledPayment),
      cameraTeam: typeof formData.cameraTeam === 'string' ? formData.cameraTeam.split(',').map(s=>s.trim()).filter(Boolean) : formData.cameraTeam,
      editingTeam: typeof formData.editingTeam === 'string' ? formData.editingTeam.split(',').map(s=>s.trim()).filter(Boolean) : formData.editingTeam,
    };

    if (editingId) {
      updateTask(editingId, payload);
      addToast('Task updated successfully', 'success');
      if (payload.status === 'Completed') {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    } else {
      addTask(payload);
      addToast('Task created successfully', 'success');
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    deleteTask(deleteId);
    addToast('Task deleted successfully', 'success');
    setDeleteId(null);
  };

  const handleCopyLink = async (url) => {
    if (!url) return;
    const success = await copyGalleryLink(url);
    if (success) addToast('Gallery link copied to clipboard!', 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Booked': return 'blue';
      case 'Completed': return 'green';
      case 'Cancelled': return 'red';
      case 'Editing': return 'orange';
      default: return 'gray';
    }
  };

  const columns = ['S.No', 'Date', 'Client Name', 'Location', 'Status', 'Responsibility', 'Action'];

  const formatGalleryLink = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com/drive/folders/')) {
      const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://mersal-media-photos.vercel.app/${match[1]}`;
      }
    }
    return url;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gradient tracking-tight pb-1">Order Management</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Manage and track your studio orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={searchQuery} onChange={(v) => {setSearchQuery(v); setCurrentPage(1);}} placeholder="Search clients..." />
          <Button onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')} variant="secondary" className="px-3" title="Sort by Date">
            <FiFilter />
          </Button>
          <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-blue-500/30">
            <FiPlus /> New Order
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={currentTasks}
        keyExtractor={(item) => item.id}
        renderRow={(task, index) => (
          <>
            <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
            <td className="px-6 py-4 font-medium">{formatDate(task.date)}</td>
            <td className="px-6 py-4">
              <div className="font-semibold text-slate-800 dark:text-white">{task.clientName}</div>
              <div className="text-xs text-slate-500">{task.phoneNumber}</div>
            </td>
            <td className="px-6 py-4">{task.location}</td>
            <td className="px-6 py-4">
              <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
            </td>
            <td className="px-6 py-4">{task.responsibility}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setViewDetailsModal(task)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="View Details">
                  <FiEye size={18} />
                </button>
                <button onClick={() => handleOpenModal(task)} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors" title="Edit">
                  <FiEdit2 size={18} />
                </button>
                <button onClick={() => setDeleteId(task.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </td>
          </>
        )}
      />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Order' : 'Create Order'} className="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Client Name" required value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
            <Input label="Date" type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            <Input label="Phone Number" required value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
            <Input label="Location" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            <Input label="Function Type" required value={formData.functionType} onChange={e => setFormData({...formData, functionType: e.target.value})} />
            
            {/* Conditional Marriage fields */}
            {['marriage', 'wedding'].some(kw => formData.functionType.toLowerCase().includes(kw)) && (
              <>
                <Input label="Prewedding Shoot Date" type="date" value={formData.preweddingDate} onChange={e => setFormData({...formData, preweddingDate: e.target.value})} />
                <Input label="Engagement Date" type="date" value={formData.engagementDate} onChange={e => setFormData({...formData, engagementDate: e.target.value})} />
                <Input label="Wedding Date" type="date" value={formData.weddingDate} onChange={e => setFormData({...formData, weddingDate: e.target.value})} />
                <Input label="Reception Date" type="date" value={formData.receptionDate} onChange={e => setFormData({...formData, receptionDate: e.target.value})} />
              </>
            )}

            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
              <select className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Booked">Booked</option>
                <option value="Editing">Editing</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <Input label="Responsibility" required value={formData.responsibility} onChange={e => setFormData({...formData, responsibility: e.target.value})} />
            <Input label="Delivery Date" type="date" value={formData.deliveryDate} onChange={e => setFormData({...formData, deliveryDate: e.target.value})} />
            <Input label="Camera Team (comma separated)" value={formData.cameraTeam} onChange={e => setFormData({...formData, cameraTeam: e.target.value})} />
            <Input label="Editing Team (comma separated)" value={formData.editingTeam} onChange={e => setFormData({...formData, editingTeam: e.target.value})} />
            
            <Input label="Total Payment" type="number" required value={formData.totalPayment} onChange={e => setFormData({...formData, totalPayment: e.target.value})} />
            <Input label="Booking Advance" type="number" required value={formData.bookingAdvance} onChange={e => setFormData({...formData, bookingAdvance: e.target.value})} />
            <Input label="Settled Payment" type="number" required value={formData.settledPayment} onChange={e => setFormData({...formData, settledPayment: e.target.value})} />
            
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pending Payment</label>
              <input disabled value={calculatePendingPayment(formData.totalPayment, formData.settledPayment)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-500 font-semibold" />
            </div>
            
            <div className="md:col-span-2">
              <Input label="Gallery Link" type="url" value={formData.galleryLink} onChange={e => setFormData({...formData, galleryLink: e.target.value})} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1 w-full">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
              <textarea rows={3} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Order</Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={!!viewDetailsModal} onClose={() => setViewDetailsModal(null)} title="Order Details" className="max-w-2xl">
        {viewDetailsModal && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{viewDetailsModal.clientName}</h3>
              <Badge variant={getStatusColor(viewDetailsModal.status)} className="text-sm px-3 py-1.5">{viewDetailsModal.status}</Badge>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 mb-1">Date</p>
                <p className="font-semibold text-slate-800 dark:text-white">{formatDate(viewDetailsModal.date)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Function</p>
                <p className="font-semibold text-slate-800 dark:text-white">{viewDetailsModal.functionType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Location</p>
                <p className="font-semibold text-slate-800 dark:text-white">{viewDetailsModal.location}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Phone</p>
                <p className="font-semibold text-slate-800 dark:text-white">{viewDetailsModal.phoneNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Responsibility</p>
                <p className="font-semibold text-slate-800 dark:text-white">{viewDetailsModal.responsibility}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Delivery Date</p>
                <p className="font-semibold text-slate-800 dark:text-white">{formatDate(viewDetailsModal.deliveryDate) || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50">
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Payment</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{currencyFormatter(viewDetailsModal.totalPayment)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Settled Payment</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{currencyFormatter(viewDetailsModal.settledPayment)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Booking Advance</p>
                <p className="font-semibold text-slate-800 dark:text-white">{currencyFormatter(viewDetailsModal.bookingAdvance)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Pending Payment</p>
                <p className="text-lg font-bold text-red-500 dark:text-red-400">{currencyFormatter(viewDetailsModal.pendingPayment)}</p>
              </div>
            </div>

            {viewDetailsModal.galleryLink && (
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gallery Link</p>
                <div className="flex items-center gap-3">
                  <input readOnly value={formatGalleryLink(viewDetailsModal.galleryLink)} className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 outline-none" />
                  <Button onClick={() => handleCopyLink(formatGalleryLink(viewDetailsModal.galleryLink))}>
                    <FiCopy /> Copy
                  </Button>
                </div>
              </div>
            )}
            
            {viewDetailsModal.notes && (
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notes</p>
                <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">{viewDetailsModal.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
};
