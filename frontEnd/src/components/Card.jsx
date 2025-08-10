// frontEnd/src/components/Card.jsx
import React from 'react';

const Card = ({ title, children }) => {
  return (
    <div className="card">
      {title && <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eee' }}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;