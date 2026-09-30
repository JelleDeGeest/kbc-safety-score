import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon, KateBadge, TopBar } from '../components/ui'
import { QUESTIONS } from '../data'
import { useProfile } from '../state'

const TYPING_MS = 700

export default function Questions() {
  const { answers, answer, skip } = useProfile()
  const nav = useNavigate()
  const [typing, setTyping] = useState(false)
  const scroller = useRef<HTMLElement>(null)

  const current = QUESTIONS.findIndex(q => answers[q.id] === undefined)
  const done = current === -1
  const answered = QUESTIONS.filter(q => answers[q.id] !== undefined).length
  const visible = done ? QUESTIONS : QUESTIONS.slice(0, typing ? current : current + 1)

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [answered, typing])

  function pick(qid: string, idx: number) {
    answer(qid, idx)
    setTyping(true)
    setTimeout(() => setTyping(false), TYPING_MS)
  }

  return (
    <>
      <TopBar title="Kate" right="close" onClose={() => nav('/')} />
      <div className="progress">
        <small>
          <span>{done ? 'All done!' : `Question ${current + 1} of ${QUESTIONS.length}`}</span>
          {!done && <button className="link-muted" onClick={() => { skip(); nav('/cyber/score', { replace: true }) }}>Skip</button>}
        </small>
        <div className="bar"><i style={{ width: `${(answered / QUESTIONS.length) * 100}%` }} /></div>
      </div>

      <main className="screen white" ref={scroller}>
        <div className="chat">
          <div className="day"><b>Today</b>Kate helps you with your Safety Score</div>
          <div className="msg"><span className="spacer" /><div className="bub">Hi 👋 A few quick questions and your score is ready.</div></div>
          <div className="msg"><KateBadge size={24} /><div className="bub">There are no wrong answers, so just be honest!</div></div>

          {visible.map((q, i) => {
            const a = answers[q.id]
            const isCurrent = !done && i === current
            return (
              <Fragment key={q.id}>
                <div className="msg in"><KateBadge size={24} /><div className="bub">{q.q}</div></div>
                {isCurrent && <div className="why"><Icon name="info" size={13} />Why do we ask? {q.why}</div>}
                {a !== undefined && <div className="msg me in"><div className="bub">{q.options[a].label}</div></div>}
              </Fragment>
            )
          })}

          {typing && <div className="msg"><KateBadge size={24} /><div className="bub typing"><i /><i /><i /></div></div>}
          {done && !typing && (
            <div className="msg in"><KateBadge size={24} /><div className="bub">That's it! 🎉 Your score is ready. Let's have a look.</div></div>
          )}
        </div>

        <div className="answers">
          {!done && !typing && QUESTIONS[current].options.map((o, idx) => (
            <button key={o.label} onClick={() => pick(QUESTIONS[current].id, idx)}>{o.label}</button>
          ))}
          {done && !typing && <Link className="btn" to="/cyber/score" replace>See my score</Link>}
        </div>
      </main>

      <div className="composer"><div>Write your message here <span className="mic"><Icon name="mic" size={18} /></span></div></div>
    </>
  )
}
