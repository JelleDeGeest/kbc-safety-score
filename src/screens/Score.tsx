import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BreachAlert from '../components/BreachAlert'
import { Icon, NavBar, Sheet, TopBar } from '../components/ui'
import {
  ACTIONS, ARTICLES, FACTORS, PLANS, actionPoints, discountFor, eur, factorLevel, percentile, scoreLabel,
  type Action, type Article,
} from '../data'
import { useProfile } from '../state'

function useAnimatedNumber(target: number) {
  const [n, setN] = useState(0)
  const from = useRef(0)
  useEffect(() => {
    const start = performance.now(), a = from.current, dur = 900
    let raf = 0
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / dur)
      const v = a + (target - a) * (1 - Math.pow(1 - k, 3))
      from.current = v
      setN(v)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return n
}

type Tab = 'overview' | 'tips' | 'protection'

export default function Score() {
  const p = useProfile()
  const nav = useNavigate()
  const [tab, setTab] = useState<Tab>('overview')
  const [action, setAction] = useState<Action | null>(null)
  const [article, setArticle] = useState<Article | null>(null)
  const shown = useAnimatedNumber(p.score)

  const open = ACTIONS.filter(a => !p.doneActions.includes(a.id) && p.factors[a.factor] < 100)
    .sort((a, b) => p.factors[a.factor] - p.factors[b.factor])
  const done = ACTIONS.filter(a => p.doneActions.includes(a.id))
  const possible = Math.min(100 - p.score, p.breachImpact + open.reduce((s, a) => s + actionPoints(a, p.factors), 0))
  const audience = p.answers.household === 0 ? 'children' : p.answers.household === 1 ? 'elderly' : null
  const articles = ARTICLES.filter(a => !a.audience || a.audience === audience)
    .sort((a, b) => Number(!!b.audience) - Number(!!a.audience) || p.factors[a.factor] - p.factors[b.factor])
  const discount = discountFor(p.score)

  const show = (t: Tab) => tab === 'overview' || tab === t

  return (
    <>
      <TopBar title="KBC Safety Score" />
      <div className="tabs">
        {(['overview', 'tips', 'protection'] as Tab[]).map(t => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      <main className="screen" key={tab}>
        <div className="pad">
          {tab !== 'tips' && <BreachAlert />}
          {tab === 'overview' && (
            <>
              <div className="hero">
                <div className="lbl row between">
                  <span>Your Safety Score {!p.completed && <span className="pill est">Estimated</span>}</span>
                  <Link to="/cyber/intro" className="pill est">Accuracy {p.accuracy}%</Link>
                </div>
                <div className="gauge">
                  <svg width="220" height="124" viewBox="0 0 220 124" aria-hidden="true">
                    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#F26B5B" /><stop offset=".5" stopColor="#F5B840" /><stop offset="1" stopColor="#5FD08E" /></linearGradient></defs>
                    <path d="M20 112a90 90 0 0 1 180 0" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="14" strokeLinecap="round" />
                    <path d="M20 112a90 90 0 0 1 180 0" fill="none" stroke="url(#g)" strokeWidth="14" strokeLinecap="round" pathLength={100} strokeDasharray={`${shown} 100`} />
                  </svg>
                  <div className="val"><b>{Math.round(shown)}</b><span>/100</span><small>{scoreLabel(p.score)}</small></div>
                </div>
                <div className="cmp"><span>Safer than <b>{percentile(p.score)}%</b> of KBC customers</span><Icon name="forward" size={18} /></div>
              </div>

              {!p.completed && (
                <Link to="/cyber/intro" className="card nudge">
                  <Icon name="info" size={20} style={{ color: 'var(--orange)', flex: 'none' }} />
                  <span>Your score is an estimate. <b>Answer the remaining questions</b> for a precise result.</span>
                </Link>
              )}

              <div className="two">
                <button className="card" onClick={() => setTab('tips')}><Icon name="shield" size={20} style={{ color: 'var(--teal)' }} /><span><b>+{possible} points</b><br />still possible</span></button>
                <button className="card" onClick={() => setArticle(HOW_IT_WORKS)}><Icon name="info" size={20} style={{ color: 'var(--blue)' }} /><span>How is it<br />calculated?</span></button>
              </div>

              <div className="sec-h"><h3>What affects your score</h3></div>
              <div className="card list">
                {FACTORS.map(f => {
                  const v = p.factors[f.id], lvl = factorLevel(v)
                  return (
                    <div className="factor" key={f.id}>
                      <span className="fi"><Icon name={f.icon} /></span>
                      <div className="fb">
                        <div>{f.label} <em style={{ color: lvl.color }}>{lvl.text}</em></div>
                        <div className="meter"><i style={{ width: `${v}%`, background: lvl.color }} /></div>
                        <div className="src">{f.source(p.answers)}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {show('tips') && (
            <>
              <div className="sec-h"><h3>Improve your score</h3>{tab === 'overview' && open.length > 3 && <button className="link" onClick={() => setTab('tips')}>Show all</button>}</div>
              {open.length === 0 ? (
                <div className="card empty">🎉 You've completed every tip. Great job!</div>
              ) : (
                <div className="card list">
                  {(tab === 'overview' ? open.slice(0, 3) : open).map(a => (
                    <button className="action" key={a.id} onClick={() => setAction(a)}>
                      <span className="fi"><Icon name={a.icon} /></span>
                      <div className="fb">{a.title}<small>{a.sub}</small></div>
                      <div className="pts">+{actionPoints(a, p.factors)}</div>
                    </button>
                  ))}
                </div>
              )}
              {tab === 'tips' && done.length > 0 && (
                <>
                  <div className="sec-h"><h3 className="h-sm">Completed</h3></div>
                  <div className="card list">
                    {done.map(a => (
                      <div className="action done" key={a.id}>
                        <span className="check"><Icon name="ok" size={14} /></span>
                        <div className="fb">{a.title}</div>
                        
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="sec-h"><h3>Read & learn</h3></div>
              <div className="carousel">
                {articles.map(a => (
                  <button className="art" key={a.id} onClick={() => setArticle(a)}>
                    <div className="im" style={{ background: a.bg }}>
                      {a.tag && <span className="pill new" style={{ background: 'var(--red)' }}>{a.tag}</span>}
                      <Icon name={a.icon} size={44} />
                    </div>
                    <div className="tt">{a.title}<small>{a.meta}</small></div>
                  </button>
                ))}
              </div>
            </>
          )}

          {show('protection') && (
            <>
              <div className="sec-h"><h3>Stay protected</h3></div>
              {p.policy ? (
                <div className="ins">
                  <div className="top">
                    <Icon name="shield" size={44} style={{ color: 'var(--green-ok)', flex: 'none' }} />
                    <div><h4>You're protected</h4><p>KBC Cyber Insurance · {PLANS[p.policy.plan].name} plan</p></div>
                  </div>
                  <div className="price">
                    <div><small>Monthly premium</small><b>{eur(p.policy.premium)} <span>EUR/month</span></b></div>
                    <Link className="btn sm ghost" to="/cyber/insurance">Manage</Link>
                  </div>
                </div>
              ) : (
                <div className="ins">
                  <div className="top">
                    <Icon name="shield" size={44} style={{ color: 'var(--blue)', flex: 'none' }} />
                    <div><h4>KBC Cyber Insurance</h4><p>For when something goes wrong despite all precautions.</p></div>
                  </div>
                  <ul>
                    <li><Icon name="ok" size={16} />Online fraud & phishing losses</li>
                    <li><Icon name="ok" size={16} />Identity theft: legal & recovery help</li>
                    <li><Icon name="ok" size={16} />Undelivered webshop purchases</li>
                    <li><Icon name="ok" size={16} />Cyberbullying & reputation support</li>
                  </ul>
                  <div className="price">
                    <div><small>From</small><b>{eur(PLANS.solo.base * (1 - discount))} <span>EUR/month</span></b></div>
                    <Link className="btn sm" to="/cyber/insurance">Discover</Link>
                  </div>
                  <div className="disc">
                    <Icon name="ok" size={14} />
                    {discount ? `Your score unlocks ${discount * 100}% off your premium` : 'Reach a score of 70+ to get 15% off'}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="center" style={{ margin: '24px 0 8px' }}>
            <button className="link-muted" onClick={() => { p.reset(); nav('/', { replace: true }) }}>Reset demo</button>
          </div>
        </div>
      </main>
      <NavBar />

      <Sheet open={!!action} onClose={() => setAction(null)}>
        {action && (
          <>
            <span className="fi lg"><Icon name={action.icon} size={28} /></span>
            <h3>{action.title}</h3>
            <p className="sheet-p">{action.sub}. Complete this tip to raise your score by <b>+{actionPoints(action, p.factors)} points</b>.</p>
            <button className="btn" onClick={() => { p.completeAction(action.id); setAction(null) }}>I've done this</button>
            <button className="btn ghost" style={{ marginTop: 10 }} onClick={() => setAction(null)}>Later</button>
          </>
        )}
      </Sheet>

      <Sheet open={!!article} onClose={() => setArticle(null)}>
        {article && (
          <>
            <div className="sheet-hero" style={{ background: article.bg }}><Icon name={article.icon} size={52} /></div>
            <small className="muted">{article.meta}</small>
            <h3>{article.title}</h3>
            {article.body.map((t, i) => <p className="sheet-p" key={i}>{t}</p>)}
            <button className="btn" style={{ marginTop: 8 }} onClick={() => setArticle(null)}>Got it</button>
          </>
        )}
      </Sheet>
    </>
  )
}

const HOW_IT_WORKS: Article = {
  id: 'how', factor: 'login', title: 'How is your score calculated?', meta: 'Safety Score', icon: 'shield',
  bg: 'linear-gradient(135deg,#DDF0FB,#B9E1F7)',
  body: [
    'Your score combines five factors: log-in security, passwords, online shopping, online exposure and your devices & network.',
    'We use what we already know from your KBC products (like itsme and card usage) plus your answers. Each factor counts equally.',
    'Your data never leaves KBC and is not used for credit decisions.',
  ],
}
