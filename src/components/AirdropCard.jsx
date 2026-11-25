import React from 'react';

const labels = { pending: 'قيد الانتظار', confirmed: 'مؤكد', claimed: 'مستلم', expired: 'منتهٍ' };
const chainColors = {
  ethereum: '#627eea', eth: '#627eea', solana: '#14f195', arbitrum: '#28a0f0',
  base: '#0052ff', optimism: '#ff0420', polygon: '#8247e5', zksync: '#8c8dfc',
  'zksync era': '#8c8dfc', starknet: '#ec796b', bsc: '#f0b90b', blast: '#fcfc03',
  linea: '#61dfff', scroll: '#ffeeda', sui: '#4da2ff', aptos: '#2dd8a3',
  berachain: '#f47226', ton: '#0098ea',
};

function chainColor(chain) {
  if (!chain) return '#8b5cf6';
  const k = chain.toLowerCase().trim();
  return chainColors[k] || '#8b5cf6';
}

export default function AirdropCard({ a, onEdit, onDelete, onToggleTask, onStatus }) {
  const total = a.tasks?.length || 0;
  const done = a.tasks?.filter((t) => t.done).length || 0;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const dot = chainColor(a.chain);

  return (
    <article className={'card ' + (a.status || 'pending')}>
      <div className="card-head">
        <div className="card-title-row">
          <span className="chain-dot" style={{ background: dot, boxShadow: `0 0 12px ${dot}66` }} />
          <h3>
            {a.projectUrl ? (
              <a href={a.projectUrl} target="_blank" rel="noreferrer">{a.name} ↗</a>
            ) : (
              a.name
            )}
          </h3>
        </div>
        <span className={'badge ' + (a.status || 'pending')}>{labels[a.status] || a.status}</span>
      </div>

      <div className="meta-grid">
        {a.chain && <span className="meta-chip"><span className="k">⛓</span> {a.chain}</span>}
        {a.walletAddress && (
          <span className="meta-chip mono" title={a.walletAddress}>
            👛 {a.walletAddress.slice(0, 6)}…{a.walletAddress.slice(-4)}
          </span>
        )}
        {a.expectedReward && <span className="meta-chip reward">🎯 متوقع: {a.expectedReward}</span>}
        {a.receivedReward && <span className="meta-chip received">✅ مستلم: {a.receivedReward}</span>}
        {a.dateAdded && <span className="meta-chip">📅 {new Date(a.dateAdded).toLocaleDateString('ar-DZ')}</span>}
      </div>

      {total > 0 && (
        <div className="tasks-section">
          <div className="tasks-head">
            <span>المهام</span>
            <span>{done}/{total}</span>
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
        <select className="status-select" value={a.status || 'pending'} onChange={(e) => onStatus(a.id, e.target.value)}>
          <option value="pending">قيد الانتظار</option>
          <option value="confirmed">مؤكد</option>
          <option value="claimed">مستلم</option>
          <option value="expired">منتهٍ</option>
        </select>
        <button className="icon-btn" onClick={onEdit}>تعديل</button>
        <button className="icon-btn danger" onClick={onDelete}>حذف</button>
      </div>
    </article>
  );
}
