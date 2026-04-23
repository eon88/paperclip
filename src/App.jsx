import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Reflect from './components/Reflect'
import Tasks from './components/Tasks'
import Wisdom from './components/Wisdom'
import Virtues from './components/Virtues'
import './App.css'

const DEFAULT_SETTINGS = { birthYear: 1992, lifeExpectancy: 80 }

function IconReflect() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="3" y1="5" x2="17" y2="5" /><line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="15" x2="17" y2="15" />
      <circle cx="3" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="3" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="3" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconTasks() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="5" height="5" /><rect x="3" y="11" width="5" height="5" />
      <line x1="11" y1="6.5" x2="17" y2="6.5" /><line x1="11" y1="13.5" x2="17" y2="13.5" />
    </svg>
  )
}

function IconWisdom() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <text x="2" y="16" fontSize="16" fontFamily="Georgia, serif">"</text>
    </svg>
  )
}

function IconVirtues() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 2 L17 5 L17 10 Q17 15 10 18 Q3 15 3 10 L3 5 Z" />
    </svg>
  )
}

const TABS = [
  { id: 'reflect', label: 'REFLECT', Icon: IconReflect },
  { id: 'tasks', label: 'TASKS', Icon: IconTasks },
  { id: 'wisdom', label: 'WISDOM', Icon: IconWisdom },
  { id: 'virtues', label: 'VIRTUES', Icon: IconVirtues },
]

function HourglassIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M3 1h10M3 15h10M4 1 L12 7.5 L4 14M12 1 L4 7.5 L12 14" />
    </svg>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('reflect')
  const [settings, setSettings] = useLocalStorage('mm_settings', DEFAULT_SETTINGS)
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <span className="header-hourglass"><HourglassIcon /></span>
        <span className="header-title">MEMENTO MORI</span>
        <button className="header-btn" onClick={() => setShowSettings(s => !s)}>
          {showSettings ? '✕' : '⚙'}
        </button>
      </header>

      {showSettings && (
        <div className="settings-panel">
          <p className="settings-title">CONFIGURE YOUR EXISTENCE</p>
          <div className="settings-row">
            <div className="settings-field">
              <label>BIRTH YEAR</label>
              <input
                type="number"
                className="settings-input"
                value={settings.birthYear}
                onChange={e => setSettings(s => ({ ...s, birthYear: parseInt(e.target.value) || s.birthYear }))}
              />
            </div>
            <div className="settings-field">
              <label>LIFE EXPECTANCY</label>
              <input
                type="number"
                className="settings-input"
                value={settings.lifeExpectancy}
                onChange={e => setSettings(s => ({ ...s, lifeExpectancy: parseInt(e.target.value) || s.lifeExpectancy }))}
              />
            </div>
          </div>
          <button className="settings-done" onClick={() => setShowSettings(false)}>DONE</button>
        </div>
      )}

      <main className="app-content">
        {activeTab === 'reflect' && <Reflect settings={settings} />}
        {activeTab === 'tasks' && <Tasks settings={settings} />}
        {activeTab === 'wisdom' && <Wisdom settings={settings} />}
        {activeTab === 'virtues' && <Virtues settings={settings} />}
      </main>

      <nav className="tab-bar">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`tab-btn${activeTab === id ? ' active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
