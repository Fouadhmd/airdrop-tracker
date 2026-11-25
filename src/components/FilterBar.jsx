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
    <div className="toolbar">
      <div className="filter-group">
        {statuses.map(([v, l]) => (
          <button key={v} className={status === v ? 'active' : ''} onClick={() => setStatus(v)}>
            {l}
          </button>
        ))}
      </div>
      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          placeholder="ابحث في الشبكة..."
          value={chain}
          onChange={(e) => setChain(e.target.value)}
        />
      </div>
    </div>
  );
}
