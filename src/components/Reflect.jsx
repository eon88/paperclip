import { useLocalStorage } from '../hooks/useLocalStorage'
import { getTodayKey, formatDate, getLifeStats } from '../utils/time'

const VIRTUES = ['WISDOM', 'COURAGE', 'TEMPERANCE', 'JUSTICE']

const MORNING_QUOTE =
  '"The soul becomes dyed with the color of its thoughts."'

function empty() {
  return {
    intention: '',
    obstacle: '',
    selectedVirtues: [],
    eveningReview: '',
    missedOpportunity: '',
    gratitude: '',
    sealed: false,
  }
}

export default function Reflect({ settings }) {
  const key = `mm_reflect_${getTodayKey()}`
  const [r, setR] = useLocalStorage(key, empty())
  const { existencePercent } = getLifeStats(settings.birthYear, settings.lifeExpectancy)

  const set = (field, val) => setR(prev => ({ ...prev, [field]: val }))

  const toggleVirtue = v =>
    setR(prev => ({
      ...prev,
      selectedVirtues: prev.selectedVirtues.includes(v)
        ? prev.selectedVirtues.filter(x => x !== v)
        : [...prev.selectedVirtues, v],
    }))

  return (
    <div className="tab-content">
      <p className="field-label" style={{ marginBottom: 10 }}>{formatDate()}</p>
      <h1 className="page-title">The Daily Audit</h1>
      <p className="page-quote">
        "Waste no more time arguing about what a good man should be. Be one." — Marcus Aurelius
      </p>

      {/* Morning */}
      <div className="section-header">
        <span className="section-header-icon">☀</span>
        <span className="section-header-label">Morning Check-in</span>
      </div>

      <div className="card">
        <span className="field-label">THE PRIME DIRECTIVE</span>
        <p className="field-question">What is my main intention for today?</p>
        <textarea
          className="field-textarea"
          placeholder="To act with justice in every small decision..."
          value={r.intention}
          onChange={e => set('intention', e.target.value)}
          rows={3}
        />

        <span className="field-label mt-lg">ANTICIPATED OBSTACLE</span>
        <textarea
          className="field-textarea"
          placeholder="What might challenge my tranquility..."
          value={r.obstacle}
          onChange={e => set('obstacle', e.target.value)}
          rows={2}
        />

        <div className="virtue-tags">
          {VIRTUES.map(v => (
            <button
              key={v}
              className={`virtue-tag${r.selectedVirtues.includes(v) ? ' active' : ''}`}
              onClick={() => toggleVirtue(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div className="quote-card">
        <p className="quote-card-text">{MORNING_QUOTE}</p>
      </div>

      {/* Evening */}
      <div className="section-header">
        <span className="section-header-icon">🌙</span>
        <span className="section-header-label">Evening Reflection</span>
      </div>

      <div className="card">
        <span className="field-label">THE REVIEW</span>
        <p className="field-question">What good did I do today?</p>
        <textarea
          className="field-textarea"
          placeholder="I practiced patience when interrupted..."
          value={r.eveningReview}
          onChange={e => set('eveningReview', e.target.value)}
          rows={3}
        />

        <span className="field-label mt-lg">MISSED OPPORTUNITY</span>
        <textarea
          className="field-textarea"
          placeholder="Where did I falter?"
          value={r.missedOpportunity}
          onChange={e => set('missedOpportunity', e.target.value)}
          rows={2}
        />

        <span className="field-label mt-md">GRATITUDE</span>
        <textarea
          className="field-textarea"
          placeholder="One thing I am thankful for..."
          value={r.gratitude}
          onChange={e => set('gratitude', e.target.value)}
          rows={2}
        />
      </div>

      <button
        className={`btn-seal${r.sealed ? ' sealed' : ''}`}
        onClick={() => set('sealed', !r.sealed)}
      >
        {r.sealed ? 'REFLECTION SEALED' : 'SEAL REFLECTION'}
      </button>

      <div className="progress-section">
        <div className="progress-label-row">
          <span className="field-label" style={{ margin: 0 }}>EXISTENCE PROGRESS</span>
          <span className="progress-pct">{existencePercent.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${existencePercent}%` }} />
        </div>
      </div>
    </div>
  )
}
