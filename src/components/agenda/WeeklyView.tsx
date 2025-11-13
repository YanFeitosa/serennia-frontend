// src/components/agenda/WeeklyView.tsx
import React from 'react';

const WeeklyView: React.FC = () => {
  return (
    <div className="bg-card rounded-xl shadow-md p-4 border border-border">
      <h2 className="text-xl font-bold mb-4 text-text">Visualização Semanal</h2>
      <p className="text-text">Conteúdo da visualização semanal aqui.</p>
      {/* A weekly calendar grid will be implemented here */}
    </div>
  );
};

export default WeeklyView;
