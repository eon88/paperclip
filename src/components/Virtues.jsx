import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { virtuePractices } from '../data/quotes'
import { getLifeStats } from '../utils/time'

const VIRTUES = [
  { id: 'wisdom', label: 'WISDOM', symbol: '✦' },
  { id: 'justice', label: 'JUSTICE', symbol: '⚖' },
  { id: 'courage', label: 'COURAGE', symbol: '◆' },
  { id: 'temperance', label: 'TEMPERANCE', symbol: '◉' },
]

const DEFAULT_PROGRESS = { wisdom: 72, justice: 61, courage: 45, temperance: 89 }
const DEFAULT_DONE = { wisdom: [false, false, false], justice: [false, false, false], courage: [false, false, false], temperance: [false, false, false] }

function ProgressRing({ percent, symbol, label, active, onClick }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(percent, 100) / 100)

  return (
    <div className={`virtue-ring-card${active ? ' active' : ''}`} onClick={onClick}>
      <div className="ring-svg-wrap">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#1e1e1e" strokeWidth="4" />
          <circle
            cx="50" cy="50" r={r}
            fill="none" stroke="#c0b8ac" strokeWidth="4"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1.2s ease' }}
          />
        </svg>
        <div className="ring-icon">{symbol}</div>
      </div>
      <p className="ring-label">{label}</p>
      <p className="ring-pct">{percent}% Alignment</p>
    </div>
  )
}

export default function Virtues({ settings }) {
  const [progress] = useLocalStorage('mm_virtue_progress', DEFAULT_PROGRESS)
  const [done, setDone] = useLocalStorage('mm_practice_done', DEFAULT_DONE)
  const [focus, setFocus] = useState('temperance')

  const { age } = getLifeStats(settings.birthYear, settings.lifeExpectancy)
  const practice = virtuePractices[focus]

  const toggleDone = (idx) => {
    setDone(prev => ({
      ...prev,
      [focus]: prev[focus].map((v, i) => (i === idx ? !v : v)),
    }))
  }

  const focusVirtue = VIRTUES.find(v => v.id === focus)

  return (
    <div className="tab-content">
      <p className="page-eyebrow">DIGITAL MONASTERY</p>
      <h1 className="page-title">Virtue Progress</h1>
      <p className="page-quote">
        "Waste no more time arguing about what a good man should be. Be one."
      </p>

      <div className="virtue-rings-grid">
        {VIRTUES.map(v => (
          <ProgressRing
            key={v.id}
            percent={progress[v.id]}
            symbol={v.symbol}
            label={v.label}
            active={focus === v.id}
            onClick={() => setFocus(v.id)}
          />
        ))}
      </div>

      {/* Focus card */}
      <div className="focus-card">
        <div className="focus-card-header">
          <span className="focus-tag">FOCUS</span>
          <span className="focus-virtue-name">
            {focusVirtue.label.charAt(0) + focusVirtue.label.slice(1).toLowerCase()}
          </span>
        </div>
        <p className="focus-description">{practice.focus}</p>
        <div className="focus-tasks">
          {practice.tasks.map((task, i) => (
            <label key={i} className="focus-task-item">
              <input
                type="checkbox"
                checked={done[focus]?.[i] ?? false}
                onChange={() => toggleDone(i)}
              />
              <span className={done[focus]?.[i] ? 'focus-task-done' : ''}>{task}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Temporal footer */}
      <div className="temporal-footer">
        <div>
          <span className="field-label">TEMPORAL PASSAGE</span>
          <p className="temporal-value">{age} YEARS ELAPSED</p>
        </div>
        <p className="carpe-diem">Memento Mori. Carpe Diem.</p>
      </div>
    </div>
  )
}
