import { format, parseISO } from 'date-fns';

export const calculatePendingPayment = (totalPayment, settledPayment) => {
  return Number(totalPayment || 0) - Number(settledPayment || 0);
};

export const copyGalleryLink = async (url) => {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};

export const sortTasks = (tasks, order = 'newest') => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === 'newest' ? dateB - dateA : dateA - dateB;
  });
};

export const searchClients = (data, query) => {
  if (!query) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(item => 
    item.clientName?.toLowerCase().includes(lowerQuery) || 
    item.name?.toLowerCase().includes(lowerQuery)
  );
};

export const paginate = (data, page, limit = 10) => {
  const startIndex = (page - 1) * limit;
  return data.slice(startIndex, startIndex + limit);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

export const currencyFormatter = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const uniqueCustomerCount = (tasks) => {
  const customers = new Set(tasks.map(t => t.clientName?.toLowerCase().trim()));
  return customers.size;
};
