import React, { useState, useMemo, useRef, useEffect } from 'react';
import { loadAirdrops, saveAirdrops, exportJSON, importJSON } from './storage';
import AirdropCard from './components/AirdropCard';
import AirdropForm from './components/AirdropForm';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import { animateHero, animateCards, reduced } from './animations';

const DEMO_DATA = [
  { id: 's1', name: 'LayerZero', projectUrl: 'https://layerzero.network', chain: 'Ethereum', wallet: '0x8216...eacf', reward: '~500 ZRO', status: 'pending', tasks: [{ text: 'جسور عبر Stargate', done: true }], dateAdded: new Date().toISOString() },
  { id: 's2', name: 'Starknet', projectUrl: 'https://starknet.io', chain: 'Starknet', wallet: '0x8216...eacf', reward: '1250 STRK', status: 'claimed', tasks: [{ text: 'مطالبة بالتوكنات', done: true }], dateAdded: new Date().toISOString() }
];

export default function App() {
  const [airdrops, setAirdrops] = useState(loadAirdrops());
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const titleRef = useRef(null);
  const subRef = useRef(null);
  const actRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    if (reduced()) return;
    const statCards = statsRef.current?.querySelectorAll?.('.stat-card');
    if (statCards && statCards.length) {
      const cards = Array.from(statCards);
      gsap.fromTo(cards, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
    }
    animateHero(titleRef, subRef, actRef, statsRef);
  }, []);

  useEffect(() => {
    // Animate cards into view when they enter the viewport
    const grid = document.querySelector('.cards-grid');
    if (!grid) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const cardEls = grid.querySelectorAll('.card');
            gsap.fromTo(cardEls, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    const cards = grid.querySelectorAll('.card');
    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? airdrops : airdrops.filter(a => a.status === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.chain.toLowerCase().includes(q) ||
        a.wallet.toLowerCase().includes(q)
      );
    }
    return list;
  }, [airdrops, filter, query]);

  // Pass all required handlers to AirdropCard
  const cardHandlers = {
    onStatus: (id, s) => {
      const next = airdrops.map(item => item.id === id ? { ...item, status: s } : item);
      setAirdrops(next); saveAirdrops(next);
    },
    onToggleTask: (id, i) => {
      const next = airdrops.map(item => {
        if (item.id !== id) return item;
        const newTasks = item.tasks.map((t, idx) => idx === i ? { ...t, done: !t.done } : t);
        return { ...item, tasks: newTasks };
      });
      setAirdrops(next); saveAirdrops(next);
    },
    onEdit: (id) => { console.log('edit', id); }, // placeholder until we add edit form
    onDelete: (id) => {
      const next = airdrops.filter(a => a.id !== id);
      setAirdrops(next); saveAirdrops(next);
    }
  };

  return (
    <div className="app">
      <header>
        <div className="badge-tag"><span className="badge-dot"></span>لوحة تحكم شخصية</div>
        <h1 ref={titleRef}>متتبع الإيردروبات</h1>
        <p ref={subRef} className="subtitle">نظّم فرصك، تابع مهامك، ولا تفوّت أي فرصة ربح — كل شيء في مكان واحد.</p>
        <div ref={actRef} className="actions">
          <button className="primary" onClick={() => setShowModal(true)}>+ إضافة Airdrop</button>
          <button onClick={() => { setAirdrops(DEMO_DATA); saveAirdrops(DEMO_DATA); }}>✨ تحميل تجريبي</button>
        </div>
      </header>

      <div ref={statsRef}>
        <StatsBar list={airdrops} />
      </div>

      <FilterBar status={filter} setStatus={setFilter} query={query} setQuery={setQuery} count={filtered.length} />

      <section className="cards-grid">
        {filtered.length > 0 ? (
          filtered.map(a => <AirdropCard key={a.id} a={a} {...cardHandlers} />)
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p>لا توجد إيردروبات حالياً. ابدأ بإضافة واحدة أو حمل البيانات التجريبية.</p>
          </div>
        )}
      </section>

      {showModal && <AirdropForm onClose={() => setShowModal(false)} onSave={(item) => {
        const next = { id: Date.now().toString(), ...item };
        setAirdrops(prev => [next, ...prev]); saveAirdrops(prev => [next, ...prev]); setShowModal(false);
      }} />}
    </div>
  );
}