import React, { useEffect, useState } from 'react';
import { animateModal } from '../animations.js';

export default function AirdropForm({ initial, onSave, onCancel }) {
  const [f, setF] = useState({
    name: initial?.name || '',
    projectUrl: initial?.projectUrl || '',
    chain: initial?.chain || '',
    walletAddress: initial?.walletAddress || '',
    tasksText: initial?.tasks ? initial.tasks.map((t) => t.text).join(', ') : '',
    expectedReward: initial?.expectedReward || '',
    receivedReward: initial?.receivedReward || '',
    status: initial?.status || 'pending',
    notes: initial?.notes || '',
  });
  useEffect(() => {
    animateModal();
  }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const tasks = f.tasksText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text) => {
        const old = initial?.tasks?.find((t) => t.text === text);
        return { text, done: old ? old.done : false };
      });
    onSave({
      name: f.name,
      projectUrl: f.projectUrl,
      chain: f.chain,
      walletAddress: f.walletAddress,
      tasks,
      expectedReward: f.expectedReward,
      receivedReward: f.receivedReward,
      status: f.status,
      notes: f.notes,
    });
  };

  return (
    <div className="modal-back" onClick={onCancel}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{initial ? 'تعديل Airdrop' : 'Airdrop جديد'}</h2>
        <input required placeholder="اسم المشروع" value={f.name} onChange={set('name')} />
        <input placeholder="رابط المشروع" value={f.projectUrl} onChange={set('projectUrl')} />
        <input placeholder="الشبكة (chain) — Ethereum, Solana, Arbitrum..." value={f.chain} onChange={set('chain')} />
        <input placeholder="عنوان المحفظة المستخدمة" value={f.walletAddress} onChange={set('walletAddress')} />
        <input placeholder="المهام (افصل بفاصلة)" value={f.tasksText} onChange={set('tasksText')} />
        <div className="row">
          <input placeholder="المكافأة المتوقعة" value={f.expectedReward} onChange={set('expectedReward')} />
          <input placeholder="المكافأة المستلمة" value={f.receivedReward} onChange={set('receivedReward')} />
        </div>
        <select value={f.status} onChange={set('status')}>
          <option value="pending">قيد الانتظار</option>
          <option value="confirmed">مؤكد</option>
          <option value="claimed">مستلم</option>
          <option value="expired">منتهٍ</option>
        </select>
        <textarea placeholder="ملاحظات" value={f.notes} onChange={set('notes')} />
        <div className="row end">
          <button type="button" onClick={onCancel}>إلغاء</button>
          <button type="submit" className="primary">حفظ</button>
        </div>
      </form>
    </div>
  );
}
