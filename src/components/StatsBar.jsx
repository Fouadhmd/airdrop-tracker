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
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = (Math.round(obj.v * 100) / 100).toString();
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
  const sum = list.reduce((s, a) => s + (parseFloat(a.receivedReward) || 0), 0);
  return (
    <div className="stats">
      <div><Count value={total} /><span>الكل</span></div>
      <div><Count value={pending} /><span>قيد الانتظار</span></div>
      <div><Count value={done} /><span>مؤكد / مستلم</span></div>
      <div><Count value={sum} /><span>مجموع المستلم</span></div>
    </div>
  );
}
