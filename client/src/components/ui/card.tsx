import React from 'react';

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="card">
      {children}
    </div>
  );
};

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={`card-content ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardContent };
