import React, { useEffect, useMemo, useRef, useState } from 'react';
import { loadAirdrops, saveAirdrops, exportJSON, importJSON } from './storage.js';
import { enterPage, animateListIn } from './animations.js';
import StatsBar from './components/StatsBar.jsx';
import FilterBar from './components/FilterBar.jsx';
import AirdropForm from './components/AirdropForm.jsx';
import AirdropCard from './components/AirdropCard.jsx';

let idc = 0;
const nid = () => 'a' + Date.now().toString(36) + (idc++);

const DEMO = [
  {
    id: 'd1', dateAdded: new Date(Date.now() - 86400000 * 2).toISOString(),
    name: 'LayerZero', projectUrl: 'https://layerzero.network', chain: 'Ethereum',
    walletAddress: '0x82162D6ca3cEEfA7C81bFb459E13C63baaC7eacf',
    tasks: [
      { text: 'متابعة المشروع على X', done: true },
      { text: 'جسر عبر Stargate', done: true },
      { text: 'الاحتفاظ حتى TGE', done: false },
    ],
    expectedReward: '~500 ZRO', receivedReward: '', status: 'pending',
    notes: 'Phase 2 متاحة للمطالبة الآن.',
  },
  {
    id: 'd2', dateAdded: new Date(Date.now() - 86400000 * 9).toISOString(),
    name: 'Starknet', projectUrl: 'https://www.starknet.io', chain: 'Starknet',
    walletAddress: '0x82162D6ca3cEEfA7C81bFb459E13C63baaC7eacf',
    tasks: [{ text: 'نشر عقد (deploy)', done: true }],
    expectedReward: '', receivedReward: '1250 STRK', status: 'claimed',
    notes: 'وصلت للمحفظة بنجاح ✅',
  },
  {
    id: 'd3', dateAdded: new Date(Date.now() - 86400000 * 15).toISOString(),
    name: 'zkSync', projectUrl: 'https://zksync.io', chain: 'zkSync Era',
    walletAddress: '', tasks: [{ text: 'Swap على SyncSwap', done: true }, { text: 'Hold ETH', done: true }],
    expectedReward: '~200 ZK', receivedReward: '', status: 'confirmed',
    notes: 'مؤكد — بانتظار الإعلان الرسمي.',
  },
  {
    id: 'd4', dateAdded: new Date(Date.now() - 86400000 * 30).toISOString(),
    name: 'Berachain', projectUrl: 'https://www.berachain.com', chain: 'Berachain',
    walletAddress: '', tasks: [{ text: 'اختبار الـ testnet', done: true }, { text: 'المطالبة بالـ airdrop', done: false }],
    expectedReward: '~100 BERA', receivedReward: '', status: 'expired',
    notes: 'فاتت نافذة المطالبة.',
  },
];

export default function App() {
  const [airdrops, setAirdrops] = useState(loadAirdrops);
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const fileRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => { enterPage(); }, []);

  const persist = (list) => { setAirdrops(list); saveAirdrops(list); };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return airdrops.filter((a) => {
      if (status !== 'all' && a.status !== status) return false;
      if (!q) return true;
      return [a.name, a.chain, a.notes, a.walletAddress, a.expectedReward, a.receivedReward]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
    });
  }, [airdrops, status, query]);

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    animateListIn();
  }, [status, query, airdrops.length]);

  const save = (data) => {
    if (editing && editing.id) {
      persist(airdrops.map((a) => (a.id === editing.id ? { ...a, ...data } : a)));
    } else {
      persist([{ id: nid(), dateAdded: new Date().toISOString(), status: 'pending', tasks: [], ...data }, ...airdrops]);
    }
    setEditing(null);
  };

  const remove = (id) => persist(airdrops.filter((a) => a.id !== id));
  const toggleTask = (id, i) =>
    persist(airdrops.map((a) => a.id === id ? { ...a, tasks: a.tasks.map((t, j) => j === i ? { ...t, done: !t.done } : t) } : a));
  const setStatusOf = (id, s) => persist(airdrops.map((a) => a.id === id ? { ...a, status: s } : a));

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-badge"><span className="dot-live" /> لوحة تحكم شخصية</div>
        <h1 className="hero-title">
          <span className="hero-icon">🪂</span>
          <span className="text-primary">متتبع</span>{' '}
          <span className="text-accent">الإيردروبات</span>
        </h1>
        <p className="hero-sub">نظّم فرصك، تابع مهامك، ولا تفوّت أي Airdrop — كل شيء في مكان واحد.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => setEditing({})}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            إضافة Airdrop
          </button>
          <button className="ghost" onClick={() => exportJSON(airdrops)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
            تصدير
          </button>
          <button className="ghost" onClick={() => fileRef.current.click()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>
            استيراد
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden
            onChange={async (e) => {
              if (e.target.files[0]) { try { persist(await importJSON(e.target.files[0])); } catch { alert('ملف JSON غير صالح'); } }
              e.target.value = '';
            }} />
        </div>
      </header>

      <StatsBar list={airdrops} />
      <FilterBar status={status} setStatus={setStatus} query={query} setQuery={setQuery} />

      <main className="cards-grid">
        {filtered.length === 0 && (
          <section className="empty-state">
            <div className="empty-glow" />
            <div className="big">🪂</div>
            <h2>{airdrops.length === 0 ? 'لا توجد airdrops بعد' : 'لا توجد نتائج'}</h2>
            <p>{airdrops.length === 0 ? 'ابدأ بإضافة أول Airdrop أو جرّب البيانات التجريبية.' : 'جرّب تغيير الفلتر أو كلمة البحث.'}</p>
            {airdrops.length === 0 && (
              <button className="primary" onClick={() => persist(DEMO)}>✨ تحميل بيانات تجريبية</button>
            )}
          </section>
        )}
        {filtered.map((a) => (
          <AirdropCard key={a.id} a={a} onEdit={() => setEditing(a)} onDelete={() => remove(a.id)} onToggleTask={toggleTask} onStatus={setStatusOf} />
        ))}
      </main>

      {editing !== null && (
        <AirdropForm initial={editing.id ? editing : null} onSave={save} onCancel={() => setEditing(null)} />
      )}
    </div>
  );
}
