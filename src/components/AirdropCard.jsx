import React from 'react';

const labels = { pending: 'قيد الانتظار', confirmed: 'مؤكد', claimed: 'مستلم', expired: 'منتهٍ' };
const chainColors = {
  ethereum: '#627eea', eth: '#627eea', solana: '#14f195', arbitrum: '#28a0f0',
  base: '#0052ff', optimism: '#ff0420', polygon: '#8247e5', zksync: '#8c8dfc',
  'zksync era': '#8c8dfc', starknet: '#ec796b', bsc: '#f0b90b', blast: '#fcfc03',
  linea: '#61dfff', scroll: '#ffeeda', sui: '#4da2ff', aptos: '#2dd8a3',
  berachain: '#f47226', ton: '#0098ea', bitcoin: '#f7931a',
};

function chainColor(chain) {
  if (!chain) return '#8b5cf6';
  return chainColors[chain.toLowerCase().trim()] || '#8b5cf6';
}

export default function AirdropCard({ a, onEdit, onDelete, onToggleTask, onStatus }) {
  const total = a.tasks?.length || 0;
  const done = a.tasks?.filter((t) => t.done).length || 0;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const dot = chainColor(a.chain);

  return (
    <article className={'card status-' + (a.status || 'pending')}>
      <div className="card-glow" style={{ background: `radial-gradient(600px circle at 0% 0%, ${dot}18, transparent 40%)` }} />
      <div className="card-head">
        <div className="card-title-row">
          <span className="chain-dot" style={{ background: dot, boxShadow: `0 0 0 3px ${dot}22, 0 0 14px ${dot}55` }} />
          <div className="card-title-block">
            <h3>
              {a.projectUrl ? (
                <a href={a.projectUrl} target="_blank" rel="noreferrer">
                  {a.name}
                  <svg className="ext-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>
                </a>
              ) : a.name}
            </h3>
            {a.chain && <span className="chain-label">{a.chain}</span>}
          </div>
        </div>
        <span className={'badge ' + (a.status || 'pending')}>{labels[a.status] || a.status}</span>
      </div>

      {(a.walletAddress || a.expectedReward || a.receivedReward || a.dateAdded) && (
        <div className="meta-grid">
          {a.walletAddress && (
            <span className="meta-chip mono" title={a.walletAddress}>
              <span className="meta-ic">👛</span>{a.walletAddress.slice(0, 6)}…{a.walletAddress.slice(-4)}
            </span>
          )}
          {a.expectedReward && <span className="meta-chip reward"><span className="meta-ic">🎯</span>{a.expectedReward}</span>}
          {a.receivedReward && <span className="meta-chip received"><span className="meta-ic">✓</span>{a.receivedReward}</span>}
          {a.dateAdded && <span className="meta-chip"><span className="meta-ic">📅</span>{new Date(a.dateAdded).toLocaleDateString('ar-DZ')}</span>}
        </div>
      )}

      {total > 0 && (
        <div className="tasks-section">
          <div className="tasks-head">
            <span>المهام</span>
            <span className="tasks-count">{done}<span className="tasks-total">/{total}</span></span>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
          <ul className="tasks">
            {a.tasks.map((t, i) => (
              <li key={i} className={t.done ? 'done' : ''}>
                <label>
                  <input type="checkbox" checked={!!t.done} onChange={() => onToggleTask(a.id, i)} />
                  <span>{t.text}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {a.notes && <p className="notes">{a.notes}</p>}

      <div className="card-footer">
        <select className="status-select" value={a.status || 'pending'} onChange={(e) => onStatus(a.id, e.target.value)} aria-label="تغيير الحالة">
          <option value="pending">قيد الانتظار</option>
          <option value="confirmed">مؤكد</option>
          <option value="claimed">مستلم</option>
          <option value="expired">منتهٍ</option>
        </select>
        <button className="icon-btn" onClick={onEdit} title="تعديل">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button className="icon-btn danger" onClick={onDelete} title="حذف">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </article>
  );
}
