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
    walletAddress: '', tasks: [{ text: 'swap على syncswap', done: true }, { text: 'Hold ETH', done: true }],
    expectedReward: '~200 ZK', receivedReward: '', status: 'confirmed',
    notes: 'مؤكد — بانتظارAnnouncement الرسمي.',
  },
  {
    id: 'd4', dateAdded: new Date(Date.now() - 86400000 * 30).toISOString(),
    name: 'Berachain', projectUrl: '', chain: 'Berachain',
    walletAddress: '', tasks: [],
    expectedReward: '', receivedReward: '', status: 'expired',
    notes: 'فmissed the snapshot 😅',
  },
];

export default function App() {
  const [airdrops, setAirdrops] = useState(loadAirdrops);
  const [status, setStatus] = useState('all');
  const [chain, setChain] = useState('');
  const [editing, setEditing] = useState(null);
  const fileRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    enterPage();
  }, []);

  const persist = (list) => {
    setAirdrops(list);
    saveAirdrops(list);
  };

  const filtered = useMemo(
    () =>
      airdrops.filter(
        (a) =>
          (status === 'all' || a.status === status) &&
          (!chain || (a.chain || '').toLowerCase().includes(chain.toLowerCase()))
      ),
    [airdrops, status, chain]
  );

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    animateListIn();
  }, [filtered]);

  const save = (data) => {
    if (editing && editing.id) {
      persist(airdrops.map((a) => (a.id === editing.id ? { ...a, ...data } : a)));
    } else {
      persist([
        { id: nid(), dateAdded: new Date().toISOString(), status: 'pending', tasks: [], ...data },
        ...airdrops,
      ]);
    }
    setEditing(null);
  };

  const remove = (id) => persist(airdrops.filter((a) => a.id !== id));
  const toggleTask = (id, i) =>
    persist(
      airdrops.map((a) =>
        a.id === id
          ? { ...a, tasks: a.tasks.map((t, j) => (j === i ? { ...t, done: !t.done } : t)) }
          : a
      )
    );
  const setStatusOf = (id, s) =>
    persist(airdrops.map((a) => (a.id === id ? { ...a, status: s } : a)));

  return (
    <div className="app">
      <header>
        <h1 className="hero-title">
          <span className="emoji">🪂</span> متتبع الإيردروبات
        </h1>
        <div className="actions">
          <button className="primary" onClick={() => setEditing({})}>+ إضافة airdrop</button>
          <button onClick={() => exportJSON(airdrops)}>تصدير JSON</button>
          <button onClick={() => fileRef.current.click()}>استيراد JSON</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={async (e) => {
              if (e.target.files[0]) {
                try {
                  persist(await importJSON(e.target.files[0]));
                } catch {
                  alert('ملف JSON غير صالح');
                }
              }
              e.target.value = '';
            }}
          />
        </div>
      </header>

      <StatsBar list={airdrops} />
      <FilterBar status={status} setStatus={setStatus} chain={chain} setChain={setChain} />

      <main>
        {filtered.length === 0 && (
          <div className="empty">
            <div className="big">🪂</div>
            <h2>لا توجد airdrops بعد</h2>
            <p>ابدأ بمتابعة أول airdrop — أو</p>
            <button className="primary" onClick={() => persist(DEMO)}>
              ✨ تحميل بيانات تجريبية
            </button>
          </div>
        )}
        {filtered.map((a) => (
          <AirdropCard
            key={a.id}
            a={a}
            onEdit={() => setEditing(a)}
            onDelete={() => remove(a.id)}
            onToggleTask={toggleTask}
            onStatus={setStatusOf}
          />
        ))}
      </main>

      {editing !== null && (
        <AirdropForm initial={editing.id ? editing : null} onSave={save} onCancel={() => setEditing(null)} />
      )}
    </div>
  );
}
