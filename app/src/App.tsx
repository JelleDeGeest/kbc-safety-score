import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import sprite from './assets/sprite.svg?raw'
import { NavBar, StatusBar, TopBar } from './components/ui'
import Breach from './screens/Breach'
import Done from './screens/Done'
import Home from './screens/Home'
import Insurance from './screens/Insurance'
import Intro from './screens/Intro'
import Questions from './screens/Questions'
import Score from './screens/Score'
import { useProfile } from './state'

function CyberEntry() {
  const { hasScore } = useProfile()
  return <Navigate to={hasScore ? '/cyber/score' : '/cyber/intro'} replace />
}

function Placeholder({ title }: { title: string }) {
  return (
    <>
      <TopBar title={title} back={false} right="none" />
      <main className="screen placeholder">
        <p>Not part of this demo.</p>
        <Link className="btn sm" to="/cyber">Open Cyber Safety Score</Link>
      </main>
      <NavBar />
    </>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <div className="app">
      <div hidden dangerouslySetInnerHTML={{ __html: sprite }} />
      <StatusBar />
      <div className="route" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/cyber" element={<CyberEntry />} />
          <Route path="/cyber/intro" element={<Intro />} />
          <Route path="/cyber/questions" element={<Questions />} />
          <Route path="/cyber/score" element={<Score />} />
          <Route path="/cyber/breach" element={<Breach />} />
          <Route path="/cyber/insurance" element={<Insurance />} />
          <Route path="/cyber/insurance/done" element={<Done />} />
          <Route path="/investments" element={<Placeholder title="Investments" />} />
          <Route path="/offer" element={<Placeholder title="Offer" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}
