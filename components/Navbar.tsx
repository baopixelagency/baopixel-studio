'use client';

import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Navbar({ currentTab, onTabChange }: NavbarProps) {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'pipeline', label: '🚀 Pipeline', icon: '🚀' },
    { id: 'agenda', label: '📅 Agenda', icon: '📅' },
    { id: 'tresorerie', label: '💰 Trésorerie', icon: '💰' },
    { id: 'editorial', label: '📝 Éditorial', icon: '📝' },
    { id: 'veille', label: '👁️ Veille IA', icon: '👁️' },
    { id: 'reporting', label: '📈 Reporting', icon: '📈' },
    { id: 'equip', label: '⚙️ Équipements', icon: '⚙️' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🎬 BaoPixel Studio
      </div>

      <div className="navbar-menu">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              background: currentTab === tab.id ? 'var(--brand-primary)' : 'transparent',
              color: currentTab === tab.id ? '#000' : 'var(--text-secondary)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: currentTab === tab.id ? '700' : '600',
              fontSize: '14px',
              transition: 'all var(--trans-normal)',
            }}
          >
            {tab.icon} {tab.label.split(' ').pop()}
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        <ThemeToggle />
      </div>
    </nav>
  );
}
