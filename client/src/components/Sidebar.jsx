import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  Map as MapIcon,
  Ship,
  History,
  Compass,
  FileCheck2,
  ShieldAlert,
  Flame,
  ChevronDown
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

const Sidebar = () => {
  const { incidents, activeIncidentId, selectIncident, activeIncident } = useIncident();

  const navItems = [
    { to: '/', label: 'Operational Dashboard', icon: LayoutDashboard },
    { to: '/incident', label: 'SAR Detection & Spill', icon: Radio },
    { to: '/map', label: 'Tactical Map & Timeline', icon: MapIcon },
    { to: '/vessels', label: 'Vessel Correlation', icon: Ship },
    { to: '/history', label: 'Historical Intelligence', icon: History },
    { to: '/forecast', label: 'Spill Drift Forecast', icon: Compass },
    { to: '/report', label: 'Evidence & Report', icon: FileCheck2 },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Flame size={20} className="text-cyan" />
        </div>
        <div className="brand-text">
          <h1>AEGIS-SPILL</h1>
          <span className="subtitle">MARITIME SURVEILLANCE</span>
        </div>
      </div>

      {/* Demo Mode Badge */}
      <div style={{ padding: '0.75rem 1.25rem 0.5rem 1.25rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        <span className="badge badge-demo badge-pulse">Demo Mode</span>
        <span className="badge badge-simulated">Simulated Data</span>
      </div>

      {/* Incident Selector */}
      <div style={{ padding: '0.5rem 1rem' }}>
        <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
          Active Incident
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={activeIncidentId}
            onChange={(e) => selectIncident(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 28, 52, 0.9)',
              border: '1px solid var(--border-cyan)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 1.8rem 0.5rem 0.75rem',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none'
            }}
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} - {inc.locationName.split('(')[0].trim()}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--primary)' }}
          />
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Active Incident Summary in Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
          <span className="badge badge-danger">{activeIncident?.status || 'Active'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Confidence:</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>
            {activeIncident?.confidence || 94.2}%
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Candidates:</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#f59e0b', fontWeight: 700 }}>
            {activeIncident?.candidateCount || 4} Vessels
          </span>
        </div>
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', marginTop: '0.2rem', textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-dim)' }}>
          SIH Prototype • Smart India Hackathon
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
