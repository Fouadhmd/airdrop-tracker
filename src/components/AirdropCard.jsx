import React from 'react';

const labels = { pending: 'قيد الانتظار', confirmed: 'مؤكد', claimed: 'مستلم', expired: 'منتهٍ' };

export default function AirdropCard({ a, onEdit, onDelete, onToggleTask, onStatus }) {
  return (
    <div className={'card ' + (a.status || 'pending')}>
      <div className="card-head">
        <h3>
          {a.projectUrl ? (
            <a href={a.projectUrl} target="_blank" rel="noreferrer">{a.name}</a>
          ) : (
            a.name
          )}
        </h3>
        <span className={'badge ' + (a.status || 'pending')}>{labels[a.status] || a.status}</span>
      </div>
      <div className="meta">
        {a.chain && <span>⛓ {a.chain}</span>}
        {a.walletAddress && (
          <span className="mono" title={a.walletAddress}>
            👛 {a.walletAddress.slice(0, 6)}...{a.walletAddress.slice(-4)}
          </span>
        )}
        {a.expectedReward && <span>🎯 متوقع: {a.expectedReward}</span>}
        {a.receivedReward && <span>✅ مستلم: {a.receivedReward}</span>}
        {a.dateAdded && <span>📅 {new Date(a.dateAdded).toLocaleDateString('ar')}</span>}
      </div>
      {a.tasks?.length > 0 && (
        <ul className="tasks">
          {a.tasks.map((t, i) => (
            <li key={i} className={t.done ? 'done' : ''}>
              <label>
                <input type="checkbox" checked={!!t.done} onChange={() => onToggleTask(a.id, i)} /> {t.text}
              </label>
            </li>
          ))}
        </ul>
      )}
      {a.notes && <p className="notes">{a.notes}</p>}
      <div className="card-actions">
        <select value={a.status || 'pending'} onChange={(e) => onStatus(a.id, e.target.value)}>
          <option value="pending">قيد الانتظار</option>
          <option value="confirmed">مؤكد</option>
          <option value="claimed">مستلم</option>
          <option value="expired">منتهٍ</option>
        </select>
        <button onClick={onEdit}>تعديل</button>
        <button className="danger" onClick={onDelete}>حذف</button>
      </div>
    </div>
  );
}
