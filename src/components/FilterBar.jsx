import React from 'react';

const statuses = [
  ['all', 'الكل'],
  ['pending', 'قيد الانتظار'],
  ['confirmed', 'مؤكد'],
  ['claimed', 'مستلم'],
  ['expired', 'منتهٍ'],
];

export default function FilterBar({ status, setStatus, chain, setChain }) {
  return (
    <div className="filters">
      {statuses.map(([v, l]) => (
        <button key={v} className={status === v ? 'active' : ''} onClick={() => setStatus(v)}>
          {l}
        </button>
      ))}
      <input
        placeholder="ابحث في الشبكة (chain)..."
        value={chain}
        onChange={(e) => setChain(e.target.value)}
      />
    </div>
  );
}
