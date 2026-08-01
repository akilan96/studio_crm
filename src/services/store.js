import { create } from 'zustand';
import { differenceInDays, parseISO } from 'date-fns';
import { supabase } from './supabase';
import adminData from '../json/adminData.json';

export const useStore = create((set, get) => ({
  // Auth
  user: null,
  login: (username, password) => {
    const { team } = get();
    const found = team.find(u => u.username === username && u.password === password);
    if (found) {
      set({ user: found });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null }),

  // Theme
  theme: localStorage.getItem('theme') || 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),

  // Data
  team: adminData,
  tasks: [],
  wishes: [],
  notifications: [],
  documents: [],
  contacts: [],
  // Team CRUD
  addAdmin: (admin) => set((state) => ({ team: [...state.team, { ...admin, id: Date.now() }] })),
  updateAdmin: (id, updatedAdmin) => set((state) => ({
    team: state.team.map(t => t.id === id ? { ...t, ...updatedAdmin } : t)
  })),
  deleteAdmin: (id) => set((state) => ({ team: state.team.filter(t => t.id !== id) })),

  // Initialize Data from Supabase
  initializeData: async () => {
    if (get().isInitialized) return;
    
    try {
      const [
        { data: tasksData },
        { data: wishesData },
        { data: documentsData },
        { data: contactsData },
        { data: notificationsData }
      ] = await Promise.all([
        supabase.from('tasks').select('*').order('id', { ascending: false }),
        supabase.from('wishes').select('*').order('id', { ascending: false }),
        supabase.from('documents').select('*').order('id', { ascending: false }),
        supabase.from('contacts').select('*'),
        supabase.from('notifications').select('*').order('id', { ascending: false })
      ]);

      set({
        tasks: tasksData || [],
        wishes: wishesData || [],
        documents: documentsData || [],
        contacts: contactsData || [],
        notifications: notificationsData || [],
        isInitialized: true
      });
    } catch (error) {
      console.error("Error loading data from Supabase:", error);
    }
  },

  // Task CRUD
  addTask: async (task) => {
    const newTask = { ...task, id: `TASK-${Date.now()}` };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
    await supabase.from('tasks').insert(newTask);
  },
  updateTask: async (id, updatedTask) => {
    set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t) }));
    await supabase.from('tasks').update(updatedTask).eq('id', id);
  },
  deleteTask: async (id) => {
    set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) }));
    await supabase.from('tasks').delete().eq('id', id);
  },

  // Wish CRUD
  addWish: async (wish) => {
    const newWish = { ...wish, id: `WISH-${Date.now()}` };
    set((state) => ({ wishes: [newWish, ...state.wishes] }));
    await supabase.from('wishes').insert(newWish);
  },
  updateWish: async (id, updatedWish) => {
    set((state) => ({ wishes: state.wishes.map(w => w.id === id ? { ...w, ...updatedWish } : w) }));
    await supabase.from('wishes').update(updatedWish).eq('id', id);
  },
  deleteWish: async (id) => {
    set((state) => ({ wishes: state.wishes.filter(w => w.id !== id) }));
    await supabase.from('wishes').delete().eq('id', id);
  },

  // Document CRUD
  addDocument: async (doc) => {
    const newDoc = { ...doc, id: `DOC-${Date.now()}` };
    set((state) => ({ documents: [newDoc, ...(state.documents || [])] }));
    await supabase.from('documents').insert(newDoc);
  },
  deleteDocument: async (id) => {
    set((state) => ({ documents: (state.documents || []).filter(d => d.id !== id) }));
    await supabase.from('documents').delete().eq('id', id);
  },

  // Contact CRUD
  addContact: async (contact) => {
    const newContact = { ...contact, id: `CONT-${Date.now()}` };
    set((state) => ({ contacts: [...state.contacts, newContact] }));
    await supabase.from('contacts').insert(newContact);
  },
  updateContact: async (id, updated) => {
    set((state) => ({ contacts: state.contacts.map(c => c.id === id ? { ...c, ...updated } : c) }));
    await supabase.from('contacts').update(updated).eq('id', id);
  },
  deleteContact: async (id) => {
    set((state) => ({ contacts: state.contacts.filter(c => c.id !== id) }));
    await supabase.from('contacts').delete().eq('id', id);
  },

  // Notifications
  deleteNotification: async (id) => {
    set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) }));
    await supabase.from('notifications').delete().eq('id', id);
  },
  markAsRead: async (id) => {
    set((state) => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  },

  // Generator
  generateNotifications: async () => {
    const state = get();
    const today = new Date();
    const newNotifications = [];

    // Check Tasks
    state.tasks.forEach(task => {
      const checkDate = (dateStr, typeName) => {
        if (!dateStr) return;
        const taskDate = parseISO(dateStr);
        const daysDiff = differenceInDays(taskDate, today);
        if (daysDiff === 2 || daysDiff === 1 || daysDiff === 0) {
          const notifId = `NOTIF-${task.id}-${typeName.replace(/\s+/g, '')}`;
          const existing = state.notifications.find(n => n.id === notifId);
          if (!existing) {
            newNotifications.push({
              id: notifId,
              type: 'task',
              refId: task.id,
              title: `${typeName} of ${task.clientName}`,
              message: `Coming in ${daysDiff === 0 ? 'today' : daysDiff + ' days'}.`,
              date: new Date().toISOString(),
              read: false
            });
          }
        }
      };

      checkDate(task.date, task.functionType || 'Event');
      checkDate(task.preweddingDate, 'Prewedding Shoot');
      checkDate(task.engagementDate, 'Engagement');
      checkDate(task.weddingDate, 'Wedding');
      checkDate(task.receptionDate, 'Reception');
    });

    // Check Wishes
    state.wishes.forEach(wish => {
      if (wish.date) {
        const wishDate = new Date(wish.date);
        wishDate.setFullYear(today.getFullYear());
        let daysDiff = differenceInDays(wishDate, today);
        if (daysDiff < 0) {
            wishDate.setFullYear(today.getFullYear() + 1);
            daysDiff = differenceInDays(wishDate, today);
        }
        if (daysDiff === 2 || daysDiff === 1 || daysDiff === 0) {
          const notifId = `NOTIF-${today.getFullYear()}-${wish.id}`;
          const existing = state.notifications.find(n => n.id === notifId);
          if (!existing) {
            newNotifications.push({
              id: notifId,
              type: 'wish',
              refId: wish.id,
              title: `${wish.function} of ${wish.personName}`,
              message: `Coming in ${daysDiff === 0 ? 'today' : daysDiff + ' days'}.`,
              date: new Date().toISOString(),
              read: false
            });
          }
        }
      }
    });

    if (newNotifications.length > 0) {
      set((state) => ({ notifications: [...newNotifications, ...state.notifications] }));
      await supabase.from('notifications').insert(newNotifications);
    }
  }
}));
