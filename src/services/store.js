import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { differenceInDays, parseISO } from 'date-fns';
import adminData from '../json/adminData.json';
import userData from '../json/userData.json';
import wishData from '../json/wishData.json';
import initialNotifications from '../json/NotificationData.json';

export const useStore = create(
  persist(
    (set, get) => ({
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
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // Data
      team: adminData, // Keep default admin so user can login
      tasks: [],
      wishes: [],
      notifications: [],
      documents: [],
      contacts: [
        { id: 'CONT-1', name: 'Nandha', role: 'Team Member', phone: '+91 98765 43210' },
        { id: 'CONT-2', name: 'Shiva', role: 'Team Member', phone: '+91 87654 32109' },
        { id: 'CONT-3', name: 'Mukesh', role: 'Team Member', phone: '+91 76543 21098' },
        { id: 'CONT-4', name: 'Kabilan', role: 'Team Member', phone: '+91 65432 10987' },
        { id: 'CONT-5', name: 'Akilan', role: 'Team Member', phone: '+91 54321 09876' },
      ],

      // Team CRUD
      addAdmin: (admin) => set((state) => ({ team: [...state.team, { ...admin, id: Date.now() }] })),
      updateAdmin: (id, updatedAdmin) => set((state) => ({
        team: state.team.map(t => t.id === id ? { ...t, ...updatedAdmin } : t)
      })),
      deleteAdmin: (id) => set((state) => ({ team: state.team.filter(t => t.id !== id) })),

      // Task CRUD
      addTask: (task) => set((state) => ({ tasks: [{ ...task, id: `TASK-${Date.now()}` }, ...state.tasks] })),
      updateTask: (id, updatedTask) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t)
      })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),

      // Wish CRUD
      addWish: (wish) => set((state) => ({ wishes: [{ ...wish, id: `WISH-${Date.now()}` }, ...state.wishes] })),
      updateWish: (id, updatedWish) => set((state) => ({
        wishes: state.wishes.map(w => w.id === id ? { ...w, ...updatedWish } : w)
      })),
      deleteWish: (id) => set((state) => ({ wishes: state.wishes.filter(w => w.id !== id) })),

      // Document CRUD
      addDocument: (doc) => set((state) => ({ documents: [{ ...doc, id: `DOC-${Date.now()}` }, ...(state.documents || [])] })),
      deleteDocument: (id) => set((state) => ({ documents: (state.documents || []).filter(d => d.id !== id) })),

      // Contact CRUD
      addContact: (contact) => set((state) => ({ contacts: [...state.contacts, { ...contact, id: `CONT-${Date.now()}` }] })),
      updateContact: (id, updated) => set((state) => ({
        contacts: state.contacts.map(c => c.id === id ? { ...c, ...updated } : c)
      })),
      deleteContact: (id) => set((state) => ({ contacts: state.contacts.filter(c => c.id !== id) })),

      // Notifications
      deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),

      // Generator
      generateNotifications: () => {
        const state = get();
        const today = new Date();
        const newNotifications = [];

        // Check Tasks
        state.tasks.forEach(task => {
          const checkDate = (dateStr, typeName) => {
            if (!dateStr) return;
            const taskDate = parseISO(dateStr);
            const daysDiff = differenceInDays(taskDate, today);
            if (daysDiff === 2 || daysDiff === 1 || daysDiff === 0) { // Coming in 2 days
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
            // Need to handle year agnostic dates for birthdays/anniversaries
            const wishDate = new Date(wish.date);
            wishDate.setFullYear(today.getFullYear());
            let daysDiff = differenceInDays(wishDate, today);
            if (daysDiff < 0) {
                wishDate.setFullYear(today.getFullYear() + 1);
                daysDiff = differenceInDays(wishDate, today);
            }
            if (daysDiff === 2 || daysDiff === 1 || daysDiff === 0) {
              const existing = state.notifications.find(n => n.type === 'wish' && n.refId === wish.id);
              if (!existing) {
                newNotifications.push({
                  id: `NOTIF-${Date.now()}-${wish.id}`,
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
        }
      }
    }),
    {
      name: 'photo-studio-crm-storage-v2', // Force clean start for real usage
    }
  )
);
