import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components'
import { Home, HowItWorks, Membership, About, FAQ, Contact, Apply, Success, Legal } from './pages'

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/how-it-works" element={<HowItWorks/>}/>
    <Route path="/membership" element={<Membership/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/faq" element={<FAQ/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/apply" element={<Apply/>}/>
    <Route path="/success" element={<Success/>}/>
    <Route path="/privacy" element={<Legal type="privacy"/>}/>
    <Route path="/terms" element={<Legal type="terms"/>}/>
    <Route path="/refund-policy" element={<Legal type="refund"/>}/>
    <Route path="/membership-policy" element={<Legal type="membership"/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></Layout>
}
