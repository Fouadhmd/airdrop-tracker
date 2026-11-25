import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { reduced } from '../animations.js';

function Count({ value }) {
  const ref = useRef(null);
  const cur = useRef(0);
  useEffect(() => {
    if (reduced()) {
      if (ref.current) ref.current.textContent = value;
      return;
    }
    const obj = { v: cur.current };
    const t = gsap.to(obj, {
      v: value,
      duration: 1.1,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.v).toLocaleString('en-US');
      },
    });
    cur.current = value;
    return () => t.kill();
  }, [value]);
  return <b ref={ref}>{value}</b>;
}

export default function StatsBar({ list }) {
  const total = list.length;
  const pending = list.filter((a) => a.status === 'pending').length;
  const done = list.filter((a) => a.status === 'confirmed' || a.status === 'claimed').length;
  const sum = list.reduce((s, a) => s + (parseFloat(String(a.receivedReward).replace(/[^0-9.]/g, '')) || 0), 0);

  const items = [
    { label: 'الكل', value: total, icon: '📦' },
    { label: 'قيد الانتظار', value: pending, icon: '⏳' },
    { label: 'مؤكد / مستلم', value: done, icon: '✅' },
    { label: 'مجموع المستلم', value: sum, icon: '💰' },
  ];

  return (
    <div className="stats-grid">
      {items.map((it) => (
        <div className="stat-card" key={it.label}>
          <div className="stat-icon">{it.icon}</div>
          <div className="stat-value"><Count value={it.value} /></div>
          <div className="stat-label">{it.label}</div>
        </div>
      ))}
    </div>
  );
}
