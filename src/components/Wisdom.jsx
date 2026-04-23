import { useState, useEffect, useRef } from 'react'
import { quotes } from '../data/quotes'
import { getDayOfYear, getLifeStats } from '../utils/time'

const PHASES = ['idle', 'inhale', 'hold', 'exhale']
const PHASE_DURATION = { inhale: 4000, hold: 4000, exhale: 4000 }
const PHASE_LABELS = { idle: 'BREATHE', inhale: 'INHALE', hold: 'HOLD', exhale: 'EXHALE' }

const VIRTUE_FILTERS = [
  { id: 'wisdom', label: 'WISDOM' },
  { id: 'justice', label: 'JUSTICE' },
  { id: 'courage', label: 'COURAGE' },
  { id: 'temperance', label: 'TEMPERANCE' },
]

function getQuote(filter) {
  const pool = filter ? quotes.filter(q => q.virtue === filter) : quotes
  return pool[getDayOfYear() % pool.length]
}

export default function Wisdom({ settings }) {
  const [filter, setFilter] = useState(null)
  const [phase, setPhase] = useState('idle')
  const timersRef = useRef([])

  const { lifePercent } = getLifeStats(settings.birthYear, settings.lifeExpectancy)
  const quote = getQuote(filter)

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  const startBreathe = () => {
    if (phase !== 'idle') {
      clearTimers()
      setPhase('idle')
      return
    }
    setPhase('inhale')
    const t1 = setTimeout(() => setPhase('hold'), PHASE_DURATION.inhale)
    const t2 = setTimeout(() => setPhase('exhale'), PHASE_DURATION.inhale + PHASE_DURATION.hold)
    const t3 = setTimeout(() => setPhase('idle'), PHASE_DURATION.inhale + PHASE_DURATION.hold + PHASE_DURATION.exhale)
    timersRef.current = [t1, t2, t3]
  }

  useEffect(() => () => clearTimers(), [])

  const toggleFilter = id => setFilter(f => (f === id ? null : id))

  return (
    <div className="tab-content wisdom-content">
      <p className="page-eyebrow">TODAY'S WISDOM</p>

      <blockquote className="wisdom-quote">"{quote.text}"</blockquote>

      <p className="wisdom-author">
        — {quote.author.toUpperCase()}{quote.source ? `, ${quote.source.toUpperCase()}` : ''}
      </p>

      {/* Breathe */}
      <div className="breathe-wrap">
        <div className={`breathe-pulse ${phase}`} />
        <div className={`breathe-pulse ${phase}`} style={{ animationDelay: '0.6s' }} />
        <button className={`breathe-circle ${phase}`} onClick={startBreathe}>
          <span className="breathe-label">{PHASE_LABELS[phase]}</span>
        </button>
      </div>

      {/* Virtue filters */}
      <div className="virtue-tags centered">
        {VIRTUE_FILTERS.map(v => (
          <button
            key={v.id}
            className={`virtue-tag${filter === v.id ? ' active' : ''}`}
            onClick={() => toggleFilter(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Life Journey */}
      <div className="life-journey-bar">
        <div className="life-journey-row">
          <span className="field-label" style={{ margin: 0 }}>LIFE JOURNEY</span>
          <span className="life-journey-pct">{lifePercent.toFixed(0)}% ELAPSED</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${lifePercent}%` }} />
        </div>
      </div>
    </div>
  )
}
