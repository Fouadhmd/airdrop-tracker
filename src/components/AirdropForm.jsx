import React, { useEffect, useState, useRef } from 'react';
import { animateModal } from '../animations.js';

export default function AirdropForm({ initial, onSave, onCancel }) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const [f, setF] = useState({
    name: initial?.name || '',
    projectUrl: initial?.projectUrl || '',
    chain: initial?.chain || '',
    walletAddress: initial?.walletAddress || '',
    tasksText: initial?.tasks ? initial.tasks.map((t) => t.text).join('\n') : '',
    expectedReward: initial?.expectedReward || '',
    receivedReward: initial?.receivedReward || '',
    status: initial?.status || 'pending',
    notes: initial?.notes || '',
  });

  useEffect(() => { animateModal(modalRef, overlayRef); }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const tasks = f.tasksText
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text) => {
        const old = initial?.tasks?.find((t) => t.text === text);
        return { text, done: old ? old.done : false };
      });
    onSave({ ...f, tasks });
  };

  return (
    <div ref={overlayRef} className="modal-back" onClick={onCancel} role="dialog" aria-modal="true">
      <form ref={modalRef} className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-head">
          <div>
            <p className="modal-eyebrow">{initial ? 'تحديث' : 'إضافة جديدة'}</p>
            <h2>{initial ? 'تعديل Airdrop' : 'Airdrop جديد'}</h2>
          </div>
          <button type="button" className="modal-close" onClick={onCancel} aria-label="إغلاق">✕</button>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>اسم المشروع *</label>
            <input required placeholder="مثال: LayerZero" value={f.name} onChange={set('name')} />
          </div>
          <div className="field">
            <label>رابط المشروع</label>
            <input placeholder="https://..." value={f.projectUrl} onChange={set('projectUrl')} dir="ltr" />
          </div>
          <div className="row">
            <div className="field">
              <label>الشبكة (Chain)</label>
              <input placeholder="Ethereum, Solana..." value={f.chain} onChange={set('chain')} />
            </div>
            <div className="field">
              <label>الحالة</label>
              <select value={f.status} onChange={set('status')}>
                <option value="pending">قيد الانتظار</option>
                <option value="confirmed">مؤكد</option>
                <option value="claimed">مستلم</option>
                <option value="expired">منتهٍ</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>عنوان المحفظة</label>
            <input placeholder="0x..." value={f.walletAddress} onChange={set('walletAddress')} dir="ltr" className="mono-input" />
          </div>
          <div className="row">
            <div className="field">
              <label>المكافأة المتوقعة</label>
              <input placeholder="~500 TOKEN" value={f.expectedReward} onChange={set('expectedReward')} />
            </div>
            <div className="field">
              <label>المكافأة المستلمة</label>
              <input placeholder="1250 TOKEN" value={f.receivedReward} onChange={set('receivedReward')} />
            </div>
          </div>
          <div className="field">
            <label>المهام (كل مهمة في سطر)</label>
            <textarea placeholder={"متابعة المشروع على X\nجسر عبر Stargate"} value={f.tasksText} onChange={set('tasksText')} rows={3} />
          </div>
          <div className="field">
            <label>ملاحظات</label>
            <textarea placeholder="أي تفاصيل إضافية..." value={f.notes} onChange={set('notes')} rows={2} />
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="ghost" onClick={onCancel}>إلغاء</button>
          <button type="submit" className="primary">حفظ التغييرات</button>
        </div>
      </form>
    </div>
  );
}
