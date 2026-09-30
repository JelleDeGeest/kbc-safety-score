import { Link } from 'react-router-dom'
import { BREACH } from '../data'
import { useProfile } from '../state'
import { Icon } from './ui'

export default function BreachAlert({ compact = false }: { compact?: boolean }) {
  const { breachOpen, breachImpact, resolvedBreach } = useProfile()
  if (!breachOpen) return null
  const left = BREACH.steps.length - resolvedBreach.length

  return (
    <Link to="/cyber/breach" className={`breach-alert ${compact ? 'compact' : ''}`}>
      <span className="breach-ic"><Icon name="alert" size={22} /></span>
      <div className="fb">
        <div className="breach-top">
          <b>Security alert</b>
          {!compact && breachImpact > 0 && <span className="pill danger">−{breachImpact} points</span>}
        </div>
        Your data was found in the <b>{BREACH.name}</b> data breach.
        <small>{left} action{left > 1 ? 's' : ''} needed · act as soon as possible</small>
      </div>
      <Icon name="forward" size={18} style={{ color: 'var(--red)', flex: 'none' }} />
    </Link>
  )
}
