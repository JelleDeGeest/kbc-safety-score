import { Link, Navigate } from 'react-router-dom'
import { Icon, KateBadge } from '../components/ui'
import { PLANS, eur } from '../data'
import { useProfile } from '../state'

export default function Done() {
  const { policy } = useProfile()
  if (!policy) return <Navigate to="/cyber/insurance" replace />

  return (
    <main className="screen white done-screen">
      <div className="done-badge"><Icon name="shield" size={64} /></div>
      <h2>You're protected!</h2>
      <p>Your KBC Cyber Insurance is active from today. We've sent the policy documents to your KBC inbox.</p>

      <div className="card list summary">
        <div><span>Plan</span><b>{PLANS[policy.plan].name}</b></div>
        <div><span>Monthly premium</span><b>{eur(policy.premium)} EUR</b></div>
        <div><span>Start date</span><b>{new Date(policy.since).toLocaleDateString('nl-BE')}</b></div>
        <div><span>Reward</span><b className="coin-txt">+10 Kate Coins</b></div>
      </div>

      <div className="card kate-note">
        <KateBadge />
        <div>Victim of online fraud? Tell Kate <b>"I've detected online fraud"</b> and we'll block your cards and start your claim right away.</div>
      </div>

      <div className="spacer-grow" />
      <Link className="btn" to="/cyber/score" replace>Back to my score</Link>
      <Link className="btn ghost" to="/" replace style={{ marginTop: 10 }}>Go to Start</Link>
    </main>
  )
}
