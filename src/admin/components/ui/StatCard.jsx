import React from 'react';
import './StatCard.css';

const StatCard = ({ title, count }) => {
  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <p className="stat-count">{count}</p>
    </div>
  );
};

export default StatCard;
