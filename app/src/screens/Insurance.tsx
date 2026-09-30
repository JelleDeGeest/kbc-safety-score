import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, KateBadge, TopBar } from '../components/ui'
import { COVERAGE, FACTORS, PLANS, discountFor, eur, type PlanId } from '../data'
import { useProfile } from '../state'

export default function Insurance() {
  const p = useProfile()
  const nav = useNavigate()
  const hasDependants = p.answers.household === 0 || p.answers.household === 1
  const [plan, setPlan] = useState<PlanId>(p.policy?.plan ?? (hasDependants ? 'family' : 'solo'))
  const discount = discountFor(p.score)
  const price = (id: PlanId) => PLANS[id].base * (1 - discount)

  const weakest = [...FACTORS].sort((a, b) => p.factors[a.id] - p.factors[b.id]).slice(0, 2).map(f => f.label.toLowerCase())

  return (
    <>
      <TopBar title="Cyber insurance" />
      <main className="screen">
        <div className="pad">
          <div className="hero">
            <div className="row" style={{ gap: 12 }}>
              <Icon name="shield" size={42} style={{ color: '#fff', flex: 'none' }} />
              <div>
                <div className="hero-t">Recommended for you</div>
                <div className="hero-s">Your weakest spots are {weakest.join(' and ')}, so fraud & identity cover matter most{hasDependants ? ', for your whole household' : ''}.</div>
              </div>
            </div>
          </div>

          <div className="sec-h"><h3>Choose your plan</h3></div>
          <div className="plans">
            {(Object.keys(PLANS) as PlanId[]).map(id => (
              <button key={id} className={`plan ${plan === id ? 'on' : ''}`} onClick={() => setPlan(id)}>
                <span className="rb" />
                {id === 'family' && hasDependants && <span className="pill new rec">Best fit</span>}
                <h5>{PLANS[id].name}</h5><p>{PLANS[id].sub}</p>
                <b>{eur(price(id))} <span>EUR/m</span></b>
                {discount > 0 && <s>{eur(PLANS[id].base)}</s>}
              </button>
            ))}
          </div>
          <div className="disc standalone">
            <Icon name="ok" size={14} />
            {discount ? `Your score of ${p.score} gives you ${discount * 100}% off` : `Reach a score of 70+ to unlock 15% off (you're at ${p.score})`}
          </div>

          <div className="sec-h"><h3>What's covered</h3></div>
          <div className="card list">
            {COVERAGE.map(c => (
              <div className={`cov ${c.family && plan !== 'family' ? 'off' : ''}`} key={c.title}>
                <Icon name={c.icon} size={22} style={{ flex: 'none' }} />
                <div className="fb">{c.title}<small>{c.sub}{c.family && plan !== 'family' ? ' · Family plan only' : ''}</small></div>
                <span className="lim">{c.limit}</span>
              </div>
            ))}
          </div>

          {p.score < 80 && (
            <div className="card kate-note">
              <KateBadge />
              <div>Raise your score to <b>{p.score < 70 ? 70 : 80}</b> and your premium drops to <b>{eur(PLANS[plan].base * (1 - (p.score < 70 ? 0.15 : 0.25)))} EUR</b>, automatically.</div>
            </div>
          )}
        </div>
      </main>
      <div className="sticky">
        <div className="row between">
          <div><small>Your monthly premium</small><br /><b>{eur(price(plan))} EUR</b></div>
          {!p.policy && <span className="pill coin">+10 Kate Coins</span>}
        </div>
        <button className="btn" onClick={() => { p.buyPolicy(plan, price(plan)); nav('/cyber/insurance/done', { replace: true }) }}>
          {p.policy ? (p.policy.plan === plan ? 'Keep my plan' : `Switch to ${PLANS[plan].name}`) : 'Take out insurance'}
        </button>
      </div>
    </>
  )
}
