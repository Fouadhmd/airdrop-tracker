import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { reduced } from '../animations.js';

function Count({ value }) {
  const ref = useRef(null);
  const cur = useRef(0);
  useEffect(() => {
    if (reduced()) { if (ref.current) ref.current.textContent = Math.round(value).toLocaleString('en-US'); return; }
    const obj = { v: cur.current };
    const t = gsap.to(obj, {
      v: value, duration: 1.1, ease: 'power2.out',
      onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(obj.v).toLocaleString('en-US'); },
    });
    cur.current = value;
    return () => t.kill();
  }, [value]);
  return <b ref={ref}>{Math.round(value).toLocaleString('en-US')}</b>;
}

export default function StatsBar({ list }) {
  const total = list.length;
  const pending = list.filter((a) => a.status === 'pending').length;
  const confirmed = list.filter((a) => a.status === 'confirmed').length;
  const claimed = list.filter((a) => a.status === 'claimed').length;
  const done = confirmed + claimed;
  const sum = list.reduce((s, a) => s + (parseFloat(String(a.receivedReward || '').replace(/[^0-9.]/g, '')) || 0), 0);

  const items = [
    { label: 'إجمالي الإيردروبات', value: total, icon: '📦', bar: 100 },
    { label: 'قيد الانتظار', value: pending, icon: '⏳', bar: total ? (pending / total) * 100 : 0 },
    { label: 'مؤكد / مستلم', value: done, icon: '✅', bar: total ? (done / total) * 100 : 0 },
    { label: 'مجموع المستلم', value: sum, icon: '💰', bar: sum > 0 ? 100 : 0 },
  ];

  return (
    <section className="stats-grid" aria-label="إحصائيات">
      {items.map((it) => (
        <div className="stat-card" key={it.label}>
          <div className="stat-head">
            <span className="stat-label">{it.label}</span>
            <span className="stat-icon-wrap">{it.icon}</span>
          </div>
          <div className="stat-value"><Count value={it.value} /></div>
          <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${it.bar}%` }} /></div>
        </div>
      ))}
    </section>
  );
}
