import React, { useState, useMemo, useRef, useEffect } from 'react';
import { loadAirdrops, saveAirdrops } from './storage';
import AirdropCard from './components/AirdropCard';
import AirdropForm from './components/AirdropForm';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import { animateHero } from './animations';

const DEMO_DATA = [
  { id:'s1', name:'LayerZero', projectUrl:'https://layerzero.network', chain:'Ethereum', wallet:'0x8216...eacf', reward:'~500 ZRO', status:'pending', tasks:[{text:'جسور عبر Stargate', done:true}], dateAdded: new Date().toISOString() },
  { id:'s2', name:'Starknet', projectUrl:'https://starknet.io', chain:'Starknet', wallet:'0x8216...eacf', reward:'1250 STRK', status:'claimed', tasks:[{text:'مطالبة بالتوكنات', done:true}], dateAdded: new Date().toISOString() }
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
    // Select all stat-card elements inside the stats container
    const statCards = statsRef.current.querySelectorAll('.stat-card');
    animateHero(titleRef.current, subRef.current, actRef.current, statCards);
  }, []);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? airdrops : airdrops.filter(a => a.status === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.chain.toLowerCase().includes(q));
    }
    return list;
  }, [airdrops, filter, query]);

  return (
    <div className="app">
      <header>
        <div className="badge-tag">لوحة تحكم شخصية</div>
        <h1 ref={titleRef}>متتبع الإيردروبات</h1>
        <p ref={subRef} className="subtitle">نظّم فرصك، تابع مهامك، ولا تفوّت أي فرصة ربح.</p>
        <div ref={actRef} className="actions">
          <button className="primary" onClick={() => setShowModal(true)}>+ إضافة Airdrop</button>
          <button onClick={() => { setAirdrops(DEMO_DATA); saveAirdrops(DEMO_DATA); }}>✨ تحميل تجريبي</button>
        </div>
      </header>

      <div ref={statsRef}>
        <StatsBar list={airdrops} />
      </div>

      <FilterBar status={filter} setStatus={setFilter} query={query} setQuery={setQuery} />

      <section className="cards-grid">
        {filtered.map(a => <AirdropCard key={a.id} a={a} />)}
      </section>

      {showModal && <AirdropForm onClose={() => setShowModal(false)} onSave={(n) => {
        const next = [n, ...airdrops];
        setAirdrops(next); saveAirdrops(next); setShowModal(false);
      }} />}
    </div>
  );
}
