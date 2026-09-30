import { Link, useNavigate } from 'react-router-dom'
import { Icon, TopBar } from '../components/ui'
import { KNOWN_FACTS, QUESTIONS } from '../data'
import { useProfile } from '../state'

export default function Intro() {
  const { answers, skip } = useProfile()
  const nav = useNavigate()
  const left = QUESTIONS.filter(q => answers[q.id] === undefined).length
  const known = KNOWN_FACTS.length + QUESTIONS.length - left

  return (
    <>
      <TopBar title="Cyber Safety Score" />
      <main className="screen">
        <div className="illu">
          <svg width="150" height="104" viewBox="0 0 150 104" aria-hidden="true">
            <ellipse cx="78" cy="58" rx="62" ry="42" fill="#E8F4FB" />
            <rect x="46" y="14" width="46" height="80" rx="8" fill="#fff" stroke="#0B2A4F" strokeWidth="1.6" />
            <path d="M62 20h14" stroke="#0B2A4F" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M69 36 55 41v10c0 8 6 14 14 16 8-2 14-8 14-16V41Z" fill="#009FE3" />
            <path d="m63 52 4.5 4.5 8-8.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="112" cy="30" r="14" fill="#fff" stroke="#0B2A4F" strokeWidth="1.6" />
            <path d="M107 30h10M112 25v10" stroke="#009FE3" strokeWidth="2" strokeLinecap="round" />
            <rect x="18" y="62" width="26" height="18" rx="3" fill="#fff" stroke="#0B2A4F" strokeWidth="1.6" />
            <path d="m19 63 12 9 12-9" fill="none" stroke="#0B2A4F" strokeWidth="1.6" />
          </svg>
          <h3>Let's get to know you</h3>
          <p>Your banking behaviour already tells us a lot. Answer {QUESTIONS.length} quick questions so we can calculate your real risk.</p>
        </div>

        <div className="pad">
          <div className="sec-h tight">
            <h3 className="h-sm">What we already know</h3>
            <span className="pill ok">{known} of {KNOWN_FACTS.length + QUESTIONS.length}</span>
          </div>
          <div className="card"><ul className="checklist">
            {KNOWN_FACTS.map(f => (
              <li key={f.title}><span className="check"><Icon name="ok" size={14} /></span><div>{f.title}{f.sub && <small>{f.sub}</small>}</div></li>
            ))}
          </ul></div>

          <div className="sec-h">
            <h3 className="h-sm">What we're missing</h3>
            <span className="pill warn">{left ? `${left} question${left > 1 ? 's' : ''}` : 'Complete'}</span>
          </div>
          <div className="card"><ul className="checklist">
            {QUESTIONS.map(q => (
              <li key={q.id}>
                {answers[q.id] !== undefined
                  ? <span className="check"><Icon name="ok" size={14} /></span>
                  : <span className="q" />}
                <div>{q.topic}{answers[q.id] !== undefined && <small>{q.options[answers[q.id]].label}</small>}</div>
              </li>
            ))}
          </ul></div>

          <div className="privacy"><Icon name="lock" size={18} style={{ flex: 'none' }} />Your answers are only used to calculate your score and personalise tips. You can change or delete them anytime in your profile settings.</div>
          <Link className="btn" to="/cyber/questions">{left === QUESTIONS.length ? "Let's go · 2 min" : left ? `Continue · ${left} left` : 'Review my answers'}</Link>
          {left > 0 && (
            <div className="center" style={{ margin: '10px 0 8px' }}>
              <button className="link" onClick={() => { skip(); nav('/cyber/score', { replace: true }) }}>Skip and see an estimated score</button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
