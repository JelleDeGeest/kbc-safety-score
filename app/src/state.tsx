import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ACTIONS, QUESTIONS, computeFactors, scoreOf, type Answers, type FactorId, type PlanId } from './data'

type Policy = { plan: PlanId; premium: number; since: string }
type Profile = { answers: Answers; skipped: boolean; doneActions: string[]; coins: number; policy: Policy | null }

const KEY = 'kbc-cyber-profile-v1'
const EMPTY: Profile = { answers: {}, skipped: false, doneActions: [], coins: 10, policy: null }
const COMPLETE_REWARD = 5
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
  answer: (qid: string, idx: number) => void
  skip: () => void
  completeAction: (id: string) => void
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
    const completed = QUESTIONS.every(q => p.answers[q.id] !== undefined)
    const factors = computeFactors(p.answers, p.doneActions)
    return {
      ...p,
      completed,
      hasScore: completed || p.skipped,
      factors,
      score: scoreOf(factors),
      answer: (qid, idx) => setP(prev => {
        const answers = { ...prev.answers, [qid]: idx }
        const nowDone = QUESTIONS.every(q => answers[q.id] !== undefined)
        const wasDone = QUESTIONS.every(q => prev.answers[q.id] !== undefined)
        return { ...prev, answers, coins: prev.coins + (nowDone && !wasDone ? COMPLETE_REWARD : 0) }
      }),
      skip: () => setP(prev => ({ ...prev, skipped: true })),
      completeAction: id => setP(prev => prev.doneActions.includes(id) ? prev : {
        ...prev,
        doneActions: [...prev.doneActions, id],
        coins: prev.coins + (ACTIONS.find(a => a.id === id)?.coins ?? 0),
      }),
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
