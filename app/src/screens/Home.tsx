import { Link } from 'react-router-dom'
import { Icon, NavBar } from '../components/ui'
import { eur, scoreLabel } from '../data'
import { useProfile } from '../state'

export default function Home() {
  const { hasScore, score, coins } = useProfile()
  return (
    <>
      <main className="screen">
        <div className="home-top">
          <div className="row">
            <div className="avatar" />
            <div className="search">How can I help you? <b><Icon name="kate" size={16} />Kate</b></div>
            <Icon name="bell" size={24} />
          </div>
          <div className="chips">
            <span className="chip dark"><Icon name="wallet" size={16} /></span>
            <span className="chip">MyMobility</span>
            <span className="chip">MyHome</span>
          </div>
        </div>

        <div className="accounts">
          <div className="acc coins"><span>{eur(coins)} KTC</span></div>
          <div className="acc"><div className="img p" /><div className="t">Personal account<b>789,43 EUR</b></div></div>
          <div className="acc"><div className="img"><Icon name="wallet" size={30} style={{ color: '#fff' }} /></div><div className="t">Simons - Peeters<b>962,12 EUR</b></div></div>
        </div>

        <div className="tx">
          <div><span><span className="d">10/10</span> Netflix</span><span>-13,49 EUR</span></div>
          <div><span><span className="d">01/10</span> TicketmasterBE</span><span>-240,00 EUR</span></div>
          <div><span><span className="d">11/09</span> Direct debit at your bank</span><span>73,95 EUR</span></div>
        </div>

        <div className="foryou">
          <h3 style={{ fontWeight: 600 }}>For you</h3>
          {hasScore ? (
            <Link to="/cyber/score" className="feature-tip">
              <span className="pill" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>Cyber Safety Score</span>
              <h4>{score}/100 · {scoreLabel(score)}</h4>
              <div className="mini-meter"><i style={{ width: `${score}%` }} /></div>
              <p>See how to raise your score and earn Kate Coins.</p>
              <span className="btn">View my score</span>
              <Icon name="shield" size={96} className="shield" />
            </Link>
          ) : (
            <Link to="/cyber" className="feature-tip ring-pulse">
              <span className="pill new">New</span>
              <h4>How cyber-safe are you?</h4>
              <p>Get your personal Cyber Safety Score in 2 minutes and earn 5 Kate Coins.</p>
              <span className="btn">Check my score</span>
              <Icon name="shield" size={96} className="shield" />
            </Link>
          )}
          <div className="tip">
            <Icon name="info" size={30} style={{ flex: 'none', color: 'var(--blue)' }} />
            <div><small><Icon name="kate" size={12} />Kate tip</small><p>See what's new in KBC Mobile now!</p></div>
            <span className="x">✕</span>
          </div>
        </div>
      </main>
      <div className="fab"><Icon name="arrows" size={24} /></div>
      <NavBar />
    </>
  )
}
