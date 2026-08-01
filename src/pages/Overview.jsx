import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { FiBriefcase, FiCheckCircle, FiClock, FiUsers, FiDollarSign } from 'react-icons/fi';
import { useStore } from '../services/store';
import { Card } from '../components/Card';
import { currencyFormatter } from '../utils/helpers';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f97316', '#64748b'];

export const Overview = () => {
  const { tasks, notifications } = useStore();

  const totalProjects = tasks.length;
  const completedProjects = tasks.filter(t => t.status === 'Completed').length;
  const pendingProjects = tasks.filter(t => t.status !== 'Completed').length;
  
  // Calculate total pending payment
  const totalPendingPayments = tasks.reduce((sum, t) => sum + (Number(t.pendingPayment) || 0), 0);
  const totalSales = tasks.reduce((sum, t) => sum + (Number(t.totalPayment) || 0), 0);

  // Mock data for charts
  const monthlySales = [
    { name: 'Jan', sales: 40000 }, { name: 'Feb', sales: 30000 },
    { name: 'Mar', sales: 50000 }, { name: 'Apr', sales: 27800 },
    { name: 'May', sales: 60000 }, { name: 'Jun', sales: 75000 },
  ];

  const yearComparison = [
    { name: 'Jan', curr: 4000, last: 2400 },
    { name: 'Feb', curr: 3000, last: 1398 },
    { name: 'Mar', curr: 2000, last: 9800 },
    { name: 'Apr', curr: 2780, last: 3908 },
    { name: 'May', curr: 1890, last: 4800 },
    { name: 'Jun', curr: 2390, last: 3800 },
  ];

  const statusDistribution = [
    { name: 'Booked', value: tasks.filter(t => t.status === 'Booked').length },
    { name: 'Completed', value: completedProjects },
    { name: 'Editing', value: tasks.filter(t => t.status === 'Editing').length },
    { name: 'Cancelled', value: tasks.filter(t => t.status === 'Cancelled').length },
  ].filter(i => i.value > 0);

  const stats = [
    { label: 'Total Projects', value: totalProjects, icon: FiBriefcase, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Completed Projects', value: completedProjects, icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Pending Projects', value: pendingProjects, icon: FiClock, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { label: 'Total Sales', value: currencyFormatter(totalSales), icon: FiDollarSign, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gradient tracking-tight pb-1">Dashboard Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Welcome to your studio metrics and analytics.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales - Bar Chart */}
        <Card className="flex flex-col h-[400px]">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Monthly Sales</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution - Pie Chart */}
        <Card className="flex flex-col h-[400px]">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Project Status</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 flex-wrap mt-2">
            {statusDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
