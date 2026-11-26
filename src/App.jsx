import React, { useState, useMemo } from 'react';
import { loadAirdrops, saveAirdrops } from './storage';
import AirdropCard from './components/AirdropCard';
import AirdropForm from './components/AirdropForm';

export default function App() {
  const [airdrops, setAirdrops] = useState(loadAirdrops());
  const [filter, setFilter] = useState('all');

  const stats = useMemo(() => {
    return {
      total: airdrops.length,
      pending: airdrops.filter(a => a.status === 'pending').length,
      confirmed: airdrops.filter(a => a.status === 'confirmed').length,
      reward: airdrops.reduce((acc, a) => acc + (parseFloat(a.reward) || 0), 0)
    };
  }, [airdrops]);

  return (
    <div className="app">
      <header>
        <h1>Airdrop Tracker</h1>
        <p className="subtitle">Personal portfolio for crypto opportunities.</p>
        <div className="actions">
          <button className="primary" onClick={() => {}}>+ New</button>
        </div>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span className="stat-label">Total</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Earned</span>
          <span className="stat-value">{stats.reward}</span>
        </div>
      </section>

      <section className="cards-grid">
        {airdrops.map(a => <AirdropCard key={a.id} a={a} />)}
      </section>
    </div>
  );
}
