import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { Tasks } from './pages/Tasks';
import { Team } from './pages/Team';
import { Notifications } from './pages/Notifications';
import { Wishes } from './pages/Wishes';
import { Documents } from './pages/Documents';
import { Contact } from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/team" element={<Team />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/wishes" element={<Wishes />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
