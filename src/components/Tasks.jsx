import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getTodayKey, getLifeStats } from '../utils/time'

const VIRTUE_OPTIONS = ['WISDOM', 'JUSTICE', 'COURAGE', 'TEMPERANCE']

const OUTSIDE_ITEMS = [
  { label: 'The opinions of others', icon: '☁' },
  { label: 'The weather and environment', icon: '☁' },
  { label: 'The outcome of the journey', icon: '→' },
]

const DEFAULT_TASKS = [
  { id: 1, text: 'Deep work on philosophical core', virtue: 'WISDOM', completed: false },
  { id: 2, text: 'Morning meditation on mortality', virtue: 'COURAGE', completed: true },
  { id: 3, text: "Review the day's moral failings", virtue: 'JUSTICE', completed: false },
]

export default function Tasks({ settings }) {
  const [tasks, setTasks] = useLocalStorage('mm_tasks', DEFAULT_TASKS)
  const [intention, setIntention] = useLocalStorage(`mm_intention_${getTodayKey()}`, '')
  const [newText, setNewText] = useState('')
  const [newVirtue, setNewVirtue] = useState('WISDOM')
  const [showAdd, setShowAdd] = useState(false)

  const { age, lifePercent, lifeExpectancy } = getLifeStats(settings.birthYear, settings.lifeExpectancy)

  const toggle = id => setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  const remove = id => setTasks(prev => prev.filter(t => t.id !== id))

  const addTask = () => {
    if (!newText.trim()) return
    setTasks(prev => [...prev, { id: Date.now(), text: newText.trim(), virtue: newVirtue, completed: false }])
    setNewText('')
    setShowAdd(false)
  }

  return (
    <div className="tab-content">
      <h1 className="page-title">
        Dichotomy of<br />Control
      </h1>
      <p className="page-quote">"Some things are up to us and others are not."</p>

      {/* Under My Control */}
      <div className="section-dot-header">
        <span className="dot" />
        <span className="section-dot-label">UNDER MY CONTROL</span>
      </div>

      <span className="field-label">INTENTION</span>
      <input
        type="text"
        className="intention-input"
        placeholder="What will you act upon today?"
        value={intention}
        onChange={e => setIntention(e.target.value)}
      />

      <div className="task-list">
        {tasks.map(t => (
          <div key={t.id} className={`task-item${t.completed ? ' completed' : ''}`}>
            <button className={`task-check${t.completed ? ' checked' : ''}`} onClick={() => toggle(t.id)}>
              {t.completed && '✓'}
            </button>
            <div className="task-body">
              <span className="task-text">{t.text}</span>
              <span className="task-virtue-badge">{t.virtue}</span>
            </div>
            <button className="task-remove" onClick={() => remove(t.id)}>×</button>
          </div>
        ))}
      </div>

      {showAdd ? (
        <div className="add-task-form">
          <input
            type="text"
            className="add-task-input"
            placeholder="New task..."
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            autoFocus
          />
          <div className="add-task-virtues">
            {VIRTUE_OPTIONS.map(v => (
              <button
                key={v}
                className={`virtue-tag${newVirtue === v ? ' active' : ''}`}
                onClick={() => setNewVirtue(v)}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="add-task-actions">
            <button className="btn-text" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn-text confirm" onClick={addTask}>Add Task</button>
          </div>
        </div>
      ) : (
        <button className="btn-add-task" onClick={() => setShowAdd(true)}>+ Add Task</button>
      )}

      {/* Outside My Control */}
      <div className="section-dot-header mt-xl">
        <span className="dot" />
        <span className="section-dot-label">OUTSIDE MY CONTROL</span>
      </div>

      <div className="amor-fati-card">
        <p className="amor-fati-text">
          "Amor Fati: Love your fate, which is in fact your life."
        </p>
      </div>

      <div className="outside-list">
        {OUTSIDE_ITEMS.map(item => (
          <div key={item.label} className="outside-item">
            <span>{item.label}</span>
            <span className="outside-icon">{item.icon}</span>
          </div>
        ))}
      </div>

      {/* Life Progress */}
      <div className="life-footer">
        <div className="life-footer-row">
          <div>
            <span className="field-label">LIFE PROGRESS</span>
            <p className="life-years">{age} / {lifeExpectancy} Years Observed</p>
          </div>
          <span className="memento-badge">MEMENTO MORI</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${lifePercent}%` }} />
        </div>
      </div>
    </div>
  )
}
