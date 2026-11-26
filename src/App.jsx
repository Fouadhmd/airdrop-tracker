import React, { useState, useMemo, useEffect } from 'react';
import { loadAirdrops, saveAirdrops } from './storage';
import AirdropCard from './components/AirdropCard';
import AirdropForm from './components/AirdropForm';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';

const DEMO_DATA = [
  { id:'s1', name:'LayerZero', projectUrl:'https://layerzero.network', chain:'Ethereum', wallet:'0x8216...eacf', reward:'~500 ZRO', status:'pending', tasks:[{id:1, text:'جسور عبر Stargate', done:true}, {id:2, text:'الاحتفاظ حتى TGE', done:false}], dateAdded: new Date().toISOString() },
  { id:'s2', name:'Starknet', projectUrl:'https://starknet.io', chain:'Starknet', wallet:'0x8216...eacf', reward:'1250 STRK', status:'claimed', tasks:[{id:1, text:'مطالبة بالتوكنات', done:true}], dateAdded: new Date().toISOString() }
];

export default function App() {
  const [airdrops, setAirdrops] = useState(loadAirdrops());
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => airdrops.filter(a => filter === 'all' || a.status === filter), [airdrops, filter]);

  return (
    <div className="app">
      <header>
        <div className="badge-tag"><span className="badge-dot"></span> لوحة تحكم شخصية</div>
        <h1>متتبع الإيردروبات</h1>
        <p className="subtitle">نظّم فرصك، تابع مهامك، ولا تفوّت أي Airdrop — كل شيء في مكان واحد.</p>
        <div className="actions">
          <button className="primary" onClick={() => setShowModal(true)}>+ إضافة Airdrop</button>
          <button onClick={() => { setAirdrops(DEMO_DATA); saveAirdrops(DEMO_DATA); }}>✨ تحميل تجريبي</button>
        </div>
      </header>

      <StatsBar list={airdrops} />
      <FilterBar current={filter} onFilter={setFilter} count={filtered.length} />

      <section className="cards-grid">
        {filtered.length > 0 ? (
          filtered.map(a => <AirdropCard key={a.id} a={a} onStatus={(id, s) => {
            const next = airdrops.map(item => item.id === id ? {...item, status: s} : item);
            setAirdrops(next); saveAirdrops(next);
          }} />)
        ) : (
          <div className="empty-state">
            <p>لا توجد إيردروبات حالياً. ابدأ بإضافة واحدة أو حمل البيانات التجريبية.</p>
          </div>
        )}
      </section>

      {showModal && <AirdropForm onClose={() => setShowModal(false)} onSave={(item) => {
        const next = [item, ...airdrops];
        setAirdrops(next); saveAirdrops(next);
        setShowModal(false);
      }} />}
    </div>
  );
}
