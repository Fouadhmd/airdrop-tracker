import React from 'react';

const statuses = [
  ['all', 'الكل', '◈'],
  ['pending', 'قيد الانتظار', '◷'],
  ['confirmed', 'مؤكد', '◎'],
  ['claimed', 'مستلم', '✓'],
  ['expired', 'منتهٍ', '×'],
];

export default function FilterBar({ status, setStatus, query, setQuery }) {
  return (
    <div className="toolbar">
      <div className="filter-group" role="tablist" aria-label="تصفية حسب الحالة">
        {statuses.map(([v, l, icon]) => (
          <button key={v} role="tab" aria-selected={status === v} className={status === v ? 'active' : ''} onClick={() => setStatus(v)}>
            <span className="filter-icon">{icon}</span>{l}
          </button>
        ))}
      </div>
      <div className="search-wrap">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        <input
          placeholder="ابحث بالاسم، الشبكة، المحفظة..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="بحث"
        />
      </div>
    </div>
  );
}
