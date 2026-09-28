import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Globe,
  Flame,
  AlertTriangle,
  Bell,
  Bot,
  ChevronRight,
  Clock,
  MapPin,
  X
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';

const TopNavbar = () => {
  const {
    incidents,
    activeIncidentId,
    selectIncident,
    activeIncident,
    setIsChatOpen
  } = useIncident();

  const [incidentsPanelOpen, setIncidentsPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIncidentsPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIncidentsPanelOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenIncident = (incId, tab = 'overview') => {
    selectIncident(incId);
    setIncidentsPanelOpen(false);
    navigate(`/incident?tab=${tab}`);
  };

  const totalIncidentsCount = incidents.length || 4;
  const activeCount = incidents.filter(i => i.status?.toLowerCase().includes('active') || i.severity === 'High').length || 1;

  return (
    <header className="top-navbar">
      {/* ── Left: Branding ── */}
      <div className="navbar-brand-section" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="brand-logo-badge">
          <Flame size={18} className="brand-logo-icon" />
        </div>
        <div className="brand-title-group">
          <div className="brand-name-row">
            <span className="brand-name">AEGIS-SPILL</span>
            <span className="badge-demo-pill">DEMO</span>
          </div>
          <span className="brand-subtitle">MARITIME SURVEILLANCE</span>
        </div>
      </div>

      <div className="navbar-divider" />

      {/* ── Center: Primary Navigation (Overview only) ── */}
      <nav className="navbar-nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `top-nav-link ${isActive && location.pathname === '/' ? 'active' : ''}`}
        >
          <Globe size={15} className="top-nav-icon" />
          <span className="top-nav-label">Overview</span>
        </NavLink>
      </nav>

      {/* ── Right: Incidents Panel Button, Notification & AI Copilot ── */}
      <div className="navbar-right-controls">
        {/* Incidents Dropdown Trigger Button */}
        <div className="nav-incidents-container" style={{ position: 'relative' }}>
          <button
            ref={buttonRef}
            onClick={() => setIncidentsPanelOpen(!incidentsPanelOpen)}
            className={`nav-incidents-btn ${incidentsPanelOpen ? 'active' : ''}`}
            title="Open Incidents & Surveillance History"
            aria-expanded={incidentsPanelOpen}
          >
            <AlertTriangle size={14} className="incidents-btn-icon" />
            <span className="incidents-btn-text">Incidents</span>
            <span className="incidents-badge-count">{totalIncidentsCount}</span>
          </button>

          {/* ── Incident History / Notification Dropdown Panel ── */}
          {incidentsPanelOpen && (
            <div
              ref={panelRef}
              className="incidents-overlay-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel Header */}
              <div className="dropdown-panel-header">
                <div className="dropdown-panel-title-group">
                  <span className="dropdown-panel-title">INCIDENTS</span>
                  <span className="dropdown-panel-count">
                    {activeCount} Active • {totalIncidentsCount} Total
                  </span>
                </div>
                <button
                  onClick={() => setIncidentsPanelOpen(false)}
                  className="dropdown-close-btn"
                  title="Close Panel"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Panel Body */}
              <div className="dropdown-panel-body">
                {/* 1. Active Incident Card */}
                {activeIncident && (
                  <div className="dropdown-section">
                    <div className="dropdown-section-title">ACTIVE</div>
                    <div
                      className="dropdown-active-incident-card"
                      onClick={() => handleOpenIncident(activeIncident.id, 'overview')}
                      role="button"
                      tabIndex={0}
                      title={`Open ${activeIncident.id} workspace`}
                    >
                      <div className="active-card-top">
                        <div className="active-pill-tag">
                          <AlertTriangle size={12} className="alert-pulse-icon" />
                          <span>NEW OIL SPILL DETECTED</span>
                        </div>
                        <span className="active-time-tag">
                          <Clock size={11} />
                          {activeIncident.displayDate?.split(',')[1]?.trim() || '14:32 UTC'}
                        </span>
                      </div>

                      <div className="active-card-title">{activeIncident.locationName?.split('(')[0]?.trim() || 'Arabian Sea'}</div>
                      <div className="active-card-subline">
                        <span className="mono font-bold active-id-text">{activeIncident.id}</span>
                        <span className="incident-bullet">•</span>
                        <span className="active-date-text">{activeIncident.displayDate || '27 Sep 2026, 14:32 UTC'}</span>
                      </div>

                      <div className="active-card-footer">
                        <span className="active-status-badge">● Investigation Active</span>
                        <span className="active-nav-hint">
                          <span>Workspace</span>
                          <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Recent Incidents List */}
                <div className="dropdown-section">
                  <div className="dropdown-section-title">RECENT INCIDENTS</div>
                  <div className="dropdown-incidents-list">
                    {incidents
                      .filter(inc => !activeIncident || inc.id !== activeIncident.id)
                      .map((inc) => {
                        return (
                          <div
                            key={inc.id}
                            onClick={() => handleOpenIncident(inc.id, 'overview')}
                            className="dropdown-incident-item"
                            role="button"
                            tabIndex={0}
                            title={`Open ${inc.id} workspace`}
                          >
                            <div className="item-left">
                              <div className="item-title-row">
                                <span className="item-title">{inc.title}</span>
                                <span className="item-id-badge mono">{inc.id}</span>
                              </div>
                              <div className="item-meta-row">
                                <span className="item-location">
                                  <MapPin size={11} />
                                  {inc.locationName?.split('(')[0]?.trim() || inc.region}
                                </span>
                                <span className="item-divider">•</span>
                                <span className="item-date">{inc.displayDate}</span>
                              </div>
                            </div>

                            <div className="item-right">
                              <span className={`item-status-pill ${inc.status?.toLowerCase().includes('active') ? 'active-status' : 'closed-status'}`}>
                                {inc.status?.toLowerCase().includes('active') ? '● Active' : '● Monitored'}
                              </span>
                              <ChevronRight size={14} className="item-chevron" />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setIncidentsPanelOpen(!incidentsPanelOpen)}
          className={`nav-icon-btn ${incidentsPanelOpen ? 'active' : ''}`}
          title="Surveillance Notifications"
        >
          <Bell size={16} />
          <span className="notification-indicator-dot" />
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="nav-ai-btn"
          title="Open AI Maritime Intelligence Assistant"
        >
          <Bot size={15} />
          <span className="ai-btn-text">AI Copilot</span>
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
