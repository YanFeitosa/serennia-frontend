// src/components/layout/TotemLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const TotemLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Outlet />
    </div>
  );
};

export default TotemLayout;
