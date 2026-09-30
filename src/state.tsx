import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { BREACH, QUESTIONS, accuracy, computeFactors, scoreOf, type Answers, type FactorId, type PlanId } from './data'

type Policy = { plan: PlanId; premium: number; since: string }
type Profile = { answers: Answers; skipped: boolean; doneActions: string[]; resolvedBreach: string[]; sources: string[]; coins: number; policy: Policy | null }

const KEY = 'kbc-cyber-profile-v2'
const EMPTY: Profile = { answers: {}, skipped: false, doneActions: [], resolvedBreach: [], sources: [], coins: 10, policy: null }
const POLICY_REWARD = 10

function load(): Profile {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

type Ctx = Profile & {
  completed: boolean
  hasScore: boolean
  factors: Record<FactorId, number>
  score: number
  breachOpen: boolean
  breachImpact: number
  accuracy: number
  toggleSource: (id: string) => void
  answer: (qid: string, idx: number) => void
  skip: () => void
  completeAction: (id: string) => void
  toggleBreachStep: (id: string) => void
  buyPolicy: (plan: PlanId, premium: number) => void
  reset: () => void
}

const ProfileCtx = createContext<Ctx | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Profile>(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* storage unavailable */ }
  }, [p])

  const value = useMemo<Ctx>(() => {
    const factors = computeFactors(p.answers, p.doneActions, p.resolvedBreach)
    const score = scoreOf(factors)
    const allResolved = BREACH.steps.map(s => s.id)
    return {
      ...p,
      completed: QUESTIONS.every(q => p.answers[q.id] !== undefined),
      hasScore: QUESTIONS.every(q => p.answers[q.id] !== undefined) || p.skipped,
      factors,
      score,
      breachOpen: BREACH.steps.some(s => !p.resolvedBreach.includes(s.id)),
      breachImpact: scoreOf(computeFactors(p.answers, p.doneActions, allResolved)) - score,
      accuracy: accuracy(QUESTIONS.filter(q => p.answers[q.id] !== undefined).length, p.sources.length),
      toggleSource: id => setP(prev => ({ ...prev, sources: prev.sources.includes(id) ? prev.sources.filter(x => x !== id) : [...prev.sources, id] })),
      answer: (qid, idx) => setP(prev => ({ ...prev, answers: { ...prev.answers, [qid]: idx } })),
      skip: () => setP(prev => ({ ...prev, skipped: true })),
      completeAction: id => setP(prev => prev.doneActions.includes(id) ? prev : { ...prev, doneActions: [...prev.doneActions, id] }),
      toggleBreachStep: id => setP(prev => ({
        ...prev,
        resolvedBreach: prev.resolvedBreach.includes(id) ? prev.resolvedBreach.filter(x => x !== id) : [...prev.resolvedBreach, id],
      })),
      buyPolicy: (plan, premium) => setP(prev => ({
        ...prev,
        policy: { plan, premium, since: new Date().toISOString() },
        coins: prev.coins + (prev.policy ? 0 : POLICY_REWARD),
      })),
      reset: () => setP(EMPTY),
    }
  }, [p])

  return <ProfileCtx.Provider value={value}>{children}</ProfileCtx.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileCtx)
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider')
  return ctx
}
