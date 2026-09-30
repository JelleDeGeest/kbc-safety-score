import { Link } from 'react-router-dom'
import { Icon, KateBadge, TopBar } from '../components/ui'
import { BREACH, PLANS, discountFor, eur } from '../data'
import { useProfile } from '../state'

export default function Breach() {
  const p = useProfile()
  const done = BREACH.steps.filter(s => p.resolvedBreach.includes(s.id)).length
  const total = BREACH.steps.length

  return (
    <>
      <TopBar title="Security alert" />
      <main className="screen">
        <div className="pad">
          <div className={`breach-hero ${p.breachOpen ? '' : 'resolved'}`}>
            <span className="breach-ic lg"><Icon name={p.breachOpen ? 'alert' : 'shield'} size={30} /></span>
            <h3>{p.breachOpen ? `Your data was leaked in the ${BREACH.name} data breach` : 'Well done, the breach is handled'}</h3>
            <p>
              {p.breachOpen
                ? <>{BREACH.name} ({BREACH.kind.toLowerCase()}) was hacked on {BREACH.date}. The details of {BREACH.accounts} customers were published online, including yours.</>
                : <>You've taken every step to limit the damage from the {BREACH.name} breach. Stay alert for suspicious messages.</>}
            </p>
            {p.breachOpen && p.breachImpact > 0 && <span className="pill danger">Costs you {p.breachImpact} points on your score</span>}
          </div>

          <div className="sec-h"><h3>What was leaked</h3></div>
          <div className="leaked">
            {BREACH.leaked.map(l => (
              <div key={l.label}><Icon name={l.icon} size={18} />{l.label}</div>
            ))}
          </div>
          <p className="src" style={{ marginTop: 8 }}>Detected by KBC breach monitoring on {BREACH.foundOn}.</p>

          <div className="sec-h">
            <h3>What to do now</h3>
            <span className={`pill ${done === total ? 'ok' : 'warn'}`}>{done} of {total} done</span>
          </div>
          <div className="card list">
            {BREACH.steps.map((s, i) => {
              const ok = p.resolvedBreach.includes(s.id)
              return (
                <div className={`step ${ok ? 'done' : ''}`} key={s.id}>
                  {ok ? <span className="check"><Icon name="ok" size={14} /></span> : <span className="step-n">{i + 1}</span>}
                  <div className="fb">{s.title}<small>{s.sub}</small></div>
                  <button className={`btn sm ${ok ? 'ghost' : ''}`} onClick={() => p.toggleBreachStep(s.id)}>{ok ? 'Undo' : s.cta}</button>
                </div>
              )
            })}
          </div>

          <div className="card kate-note">
            <KateBadge />
            <div>Money already disappeared from your account? Call <b>Card Stop 078 170 170</b> or tell Kate <b>"I've detected online fraud"</b>.</div>
          </div>

          <div className="sec-h"><h3>Leaked data doesn't expire</h3></div>
          {p.policy ? (
            <div className="ins">
              <div className="top">
                <Icon name="shield" size={40} style={{ color: 'var(--green-ok)', flex: 'none' }} />
                <div><h4>You're covered</h4><p>Your {PLANS[p.policy.plan].name} plan covers identity theft and fraud that results from this breach.</p></div>
              </div>
            </div>
          ) : (
            <div className="ins">
              <div className="top">
                <Icon name="shield" size={40} style={{ color: 'var(--blue)', flex: 'none' }} />
                <div><h4>Be covered if it goes wrong</h4><p>Your details can be misused for months or even years after a breach.</p></div>
              </div>
              <ul>
                <li><Icon name="ok" size={16} />Identity theft: legal help & new documents</li>
                <li><Icon name="ok" size={16} />Money lost to phishing or account takeover</li>
                <li><Icon name="ok" size={16} />Fraudulent purchases in your name</li>
              </ul>
              <div className="price">
                <div><small>KBC Cyber Insurance from</small><b>{eur(PLANS.solo.base * (1 - discountFor(p.score)))} <span>EUR/month</span></b></div>
                <Link className="btn sm" to="/cyber/insurance">Get covered</Link>
              </div>
            </div>
          )}

          <div style={{ height: 16 }} />
          <Link className="btn ghost" to="/cyber/score">Back to my score</Link>
          <div style={{ height: 16 }} />
        </div>
      </main>
    </>
  )
}
