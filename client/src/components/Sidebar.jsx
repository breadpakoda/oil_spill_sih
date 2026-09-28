import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Globe,
  Radio,
  Map as MapIcon,
  Ship,
  History,
  Compass,
  FileCheck2,
  ChevronDown
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

const Sidebar = () => {
  const { incidents, activeIncidentId, selectIncident, activeIncident } = useIncident();

  const navItems = [
    { to: '/', label: 'Overview', icon: Globe },
    { to: '/incident', label: 'SAR Detection & Spill', icon: Radio },
    { to: '/map', label: 'Tactical Map & Timeline', icon: MapIcon },
    { to: '/vessels', label: 'Vessel Correlation', icon: Ship },
    { to: '/history', label: 'Historical Intelligence', icon: History },
    { to: '/forecast', label: 'Spill Drift Forecast', icon: Compass },
    { to: '/report', label: 'Evidence & Report', icon: FileCheck2 },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Identity Header */}
      <div className="sidebar-brand">
        <div className="brand-text">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
            <h1 className="brand-title-text">AEGIS-SPILL</h1>
            <span className="badge-demo-compact">DEMO</span>
          </div>
          <span className="subtitle">MARITIME SURVEILLANCE</span>
        </div>
      </div>

      {/* Compact Case Selector */}
      <div className="sidebar-case-selector">
        <label className="case-selector-label">
          Incident Case
        </label>
        <div className="case-select-box">
          <select
            value={activeIncidentId}
            onChange={(e) => selectIncident(e.target.value)}
            className="case-dropdown"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} • {inc.locationName.split('(')[0].trim()}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="case-select-chevron" />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={17} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Quiet Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-row">
          <span className="footer-label">Status</span>
          <span className="footer-status-pill">
            <span className="status-live-dot" />
            {activeIncident?.status?.split(' ')[0] || 'Active'}
          </span>
        </div>
        <div className="sidebar-footer-row">
          <span className="footer-label">Area Target</span>
          <span className="footer-mono-val">{activeIncident?.id || 'INC-2026-001'}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
