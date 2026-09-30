export type FactorId = 'login' | 'passwords' | 'shopping' | 'exposure' | 'devices'

export type Question = {
  id: string
  factor: FactorId
  topic: string
  q: string
  why: string
  options: { label: string; value: number }[]
}

export const QUESTIONS: Question[] = [
  {
    id: 'passwords', factor: 'passwords', topic: 'How you manage passwords',
    q: 'Do you use the same password for several accounts?',
    why: 'One leaked password can unlock all your other accounts.',
    options: [
      { label: 'Yes, for most of them', value: 20 },
      { label: 'For a few of them', value: 40 },
      { label: 'No, I use a password manager', value: 92 },
    ],
  },
  {
    id: 'updates', factor: 'devices', topic: 'Devices and updates',
    q: 'Do your phone and laptop install updates automatically?',
    why: 'Most attacks exploit holes that an update already fixed.',
    options: [
      { label: 'Yes', value: 90 },
      { label: 'I sometimes postpone them', value: 55 },
      { label: "I don't know", value: 40 },
    ],
  },
  {
    id: 'social', factor: 'exposure', topic: 'Social media visibility',
    q: 'How visible are your social media profiles?',
    why: 'Public profiles make targeted phishing easier.',
    options: [
      { label: 'Mostly public', value: 40 },
      { label: 'Friends only', value: 72 },
      { label: "I don't use social media", value: 95 },
    ],
  },
  {
    id: 'household', factor: 'exposure', topic: 'Children or elderly in your household',
    q: 'Does anyone in your household need extra protection online?',
    why: 'Children and elderly relatives are frequent scam targets.',
    options: [
      { label: 'Children', value: 55 },
      { label: 'An elderly parent', value: 50 },
      { label: 'No', value: 85 },
    ],
  },
  {
    id: 'marketplace', factor: 'shopping', topic: 'Second-hand marketplace use',
    q: 'Do you buy or sell on second-hand marketplaces?',
    why: 'Marketplace scams are the most reported fraud type in Belgium.',
    options: [
      { label: 'Often', value: 40 },
      { label: 'Sometimes', value: 58 },
      { label: 'Never', value: 80 },
    ],
  },
  {
    id: 'wifi', factor: 'devices', topic: 'Home Wi-Fi security',
    q: 'Is your home Wi-Fi protected with a password you changed yourself?',
    why: 'Default router passwords are easy to crack.',
    options: [
      { label: 'Yes', value: 90 },
      { label: 'Still the default', value: 35 },
      { label: 'Not sure', value: 50 },
    ],
  },
]

export const KNOWN_FACTS = [
  { title: 'You log in with itsme', sub: 'Strong 2-step authentication' },
  { title: 'You shop online ±14× per month', sub: 'Based on your card transactions' },
  { title: 'Card-not-present limit: 2 500 EUR', sub: 'Higher than average' },
  { title: 'No fraud reports in the last 2 years', sub: '' },
]

export const FACTORS: { id: FactorId; label: string; icon: string; source: (a: Answers) => string }[] = [
  { id: 'login', label: 'Log-in security', icon: 'id', source: () => 'itsme active · from KBC data' },
  { id: 'passwords', label: 'Passwords', icon: 'key', source: a => answerLabel(a, 'passwords') ?? 'Estimated' },
  { id: 'shopping', label: 'Online shopping', icon: 'cart', source: () => '14 purchases/month, 3 new webshops' },
  { id: 'exposure', label: 'Online exposure', icon: 'people', source: a => answerLabel(a, 'social') ?? 'Estimated' },
  { id: 'devices', label: 'Devices & network', icon: 'phone', source: a => answerLabel(a, 'updates') ? `Auto-updates: ${answerLabel(a, 'updates')!.toLowerCase()}` : 'Estimated' },
]

export type Action = { id: string; factor: FactorId; boost: number; coins: number; title: string; sub: string; icon: string }

// boost is added to the factor (0–100); score impact = boost / number of factors
export const ACTIONS: Action[] = [
  { id: 'pwmanager', factor: 'passwords', boost: 45, coins: 3, title: 'Start using a password manager', sub: '5 min · step-by-step guide', icon: 'key' },
  { id: 'cardlimit', factor: 'shopping', boost: 25, coins: 2, title: 'Lower your online card limit', sub: 'Adjust directly in KBC Mobile', icon: 'cart' },
  { id: 'quiz', factor: 'exposure', boost: 20, coins: 2, title: 'Take the 3-minute phishing quiz', sub: 'Can you spot the fake SMS?', icon: 'chat' },
  { id: 'privacy', factor: 'exposure', boost: 25, coins: 2, title: 'Make your social profiles private', sub: 'Guide for Instagram, Facebook & TikTok', icon: 'people' },
  { id: 'updates', factor: 'devices', boost: 25, coins: 2, title: 'Turn on automatic updates', sub: 'Phone and laptop · 2 min', icon: 'phone' },
  { id: 'wifi', factor: 'devices', boost: 25, coins: 2, title: "Change your router's default password", sub: 'Guide for Telenet, Proximus & Orange', icon: 'wifi' },
]

export type Article = { id: string; factor: FactorId; title: string; meta: string; icon: string; bg: string; tag?: string; body: string[] }

export const ARTICLES: Article[] = [
  {
    id: 'sms', factor: 'exposure', title: '"Your parcel is waiting": spotting fake SMS', meta: '3 min read', icon: 'chat',
    bg: 'linear-gradient(135deg,#FFE3D6,#FFC7B0)', tag: 'Trending',
    body: [
      'Fake delivery messages are the most common phishing trick right now. They ask you to pay a small fee or "confirm" your address via a link.',
      'KBC, bpost and couriers will never ask you to log in or pay via a link in an SMS. When in doubt, open the official app yourself instead of tapping the link.',
      'Received one? Forward it to suspicious@safeonweb.be and delete it.',
    ],
  },
  {
    id: 'spoof', factor: 'login', title: 'Is the bank really calling? Spoofing explained', meta: '4 min read', icon: 'phone',
    bg: 'linear-gradient(135deg,#DDF0FB,#B9E1F7)',
    body: [
      'Scammers can make any number appear on your screen, including the real KBC number.',
      'KBC will never ask you for codes, to confirm a payment with itsme or to move money to a "safe account". Hang up and call us back via the number in KBC Mobile.',
    ],
  },
  {
    id: 'market', factor: 'shopping', title: 'Safe selling on second-hand marketplaces', meta: 'Video · 2 min', icon: 'cart',
    bg: 'linear-gradient(135deg,#E3F4EC,#C4E8D5)',
    body: [
      'A buyer who wants to pay "via a secure link" is a red flag. You never need to log in to receive money.',
      'Use a KBC Payconiq request or hand over the item in person for cash.',
    ],
  },
  {
    id: 'wifi', factor: 'devices', title: 'Secure your home Wi-Fi in 5 steps', meta: '5 min read', icon: 'wifi',
    bg: 'linear-gradient(135deg,#EEE7FA,#D9CCF3)',
    body: [
      "1. Change the router's admin password. 2. Use WPA3 or WPA2. 3. Create a separate guest network. 4. Update the router firmware. 5. Turn off WPS.",
    ],
  },
  {
    id: 'pw', factor: 'passwords', title: 'Password managers: why and how', meta: '4 min read', icon: 'key',
    bg: 'linear-gradient(135deg,#FFF2D6,#FDE0A6)',
    body: [
      'A password manager creates and remembers a unique, strong password for every site. You only need to remember one.',
      'Built-in options like iCloud Keychain and Google Password Manager are a great, free start.',
    ],
  },
]

export const PLANS = {
  solo: { name: 'Solo', sub: 'Just you', base: 4.5 },
  family: { name: 'Family', sub: 'Whole household', base: 9 },
} as const
export type PlanId = keyof typeof PLANS

export const COVERAGE = [
  { icon: 'cart', title: 'Online purchase fraud', sub: 'Webshop never delivers or is fake', limit: '5 000 EUR', family: false },
  { icon: 'mail', title: 'Phishing & account takeover', sub: 'Money stolen via fake messages or calls', limit: '10 000 EUR', family: false },
  { icon: 'id', title: 'Identity theft', sub: 'Legal help and new documents', limit: 'Included', family: false },
  { icon: 'cloud', title: 'Data recovery', sub: 'Ransomware or a hacked device', limit: '1 500 EUR', family: false },
  { icon: 'people', title: 'Cyberbullying support', sub: 'Psychological help for your children', limit: 'Included', family: true },
]

export type Answers = Record<string, number>

function answerLabel(a: Answers, qid: string) {
  const q = QUESTIONS.find(q => q.id === qid)!
  return a[qid] === undefined ? undefined : q.options[a[qid]].label
}

const ESTIMATE = 55
const BASE: Partial<Record<FactorId, number>> = { login: 92, shopping: 60 }

export function computeFactors(answers: Answers, doneActions: string[]): Record<FactorId, number> {
  const out = {} as Record<FactorId, number>
  for (const f of FACTORS) {
    const vals = QUESTIONS.filter(q => q.factor === f.id).map(q => answers[q.id] === undefined ? ESTIMATE : q.options[answers[q.id]].value)
    if (BASE[f.id] !== undefined) vals.push(BASE[f.id]!)
    const boost = ACTIONS.filter(a => a.factor === f.id && doneActions.includes(a.id)).reduce((s, a) => s + a.boost, 0)
    out[f.id] = Math.min(100, Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) + boost)
  }
  return out
}

export const scoreOf = (factors: Record<FactorId, number>) =>
  Math.round(Object.values(factors).reduce((s, v) => s + v, 0) / FACTORS.length)

export const actionPoints = (a: Action, factors: Record<FactorId, number>) =>
  Math.max(1, Math.round(Math.min(a.boost, 100 - factors[a.factor]) / FACTORS.length))

export function scoreLabel(s: number) {
  if (s < 40) return 'At risk'
  if (s < 60) return 'Needs attention'
  if (s < 75) return 'Good, with room to improve'
  if (s < 90) return 'Well protected'
  return 'Excellent'
}

export function factorLevel(v: number) {
  if (v >= 75) return { text: 'Good', color: 'var(--green-ok)' }
  if (v >= 50) return { text: 'Medium', color: 'var(--orange)' }
  return { text: 'Weak', color: 'var(--red)' }
}

export const percentile = (s: number) => Math.max(3, Math.min(97, Math.round(s * 1.25 - 27)))

export function discountFor(score: number) {
  if (score >= 80) return 0.25
  if (score >= 70) return 0.15
  return 0
}

export const eur = (n: number) => n.toFixed(2).replace('.', ',')
