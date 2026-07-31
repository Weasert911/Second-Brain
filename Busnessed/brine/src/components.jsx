import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, Menu, MessageCircle, X } from 'lucide-react'
import { DISCORD } from './data'

export function Logo() {
  return <Link to="/" className="logo" aria-label="Brine Network home"><span className="logo-mark"><i /><i /><i /></span><span>Brine <b>Network</b></span></Link>
}

const links = [['Home','/'],['How It Works','/how-it-works'],['Membership','/membership'],['About','/about'],['FAQ','/faq'],['Contact','/contact'],['Apply','/apply']]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  return <header className="nav-wrap"><nav className="nav container">
    <Logo />
    <div className={`nav-links ${open ? 'open' : ''}`}>{links.map(([label,to]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}<a className="button small mobile-cta" href={DISCORD} target="_blank" rel="noreferrer"><MessageCircle size={16}/>Join Discord</a></div>
    <a className="button small desktop-cta" href={DISCORD} target="_blank" rel="noreferrer"><MessageCircle size={16}/>Join Discord</a>
    <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
  </nav></header>
}

export function Footer() {
  return <footer><div className="container footer-grid"><div className="footer-brand"><Logo/><p>Connecting creative professionals with real client opportunities.</p><a className="discord-line" href={DISCORD} target="_blank" rel="noreferrer"><span className="status-dot"/>Community is growing</a></div><div><h4>Explore</h4><Link to="/">Home</Link><Link to="/about">About</Link><Link to="/membership">Membership</Link><Link to="/faq">FAQ</Link><Link to="/apply">Apply</Link></div><div><h4>Legal</h4><Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link><Link to="/refund-policy">Refund Policy</Link><Link to="/membership-policy">Membership Policy</Link></div><div><h4>Connect</h4><a href={DISCORD} target="_blank" rel="noreferrer">Discord</a><Link to="/contact">Contact</Link><span className="muted-link">Instagram soon</span><span className="muted-link">LinkedIn soon</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Brine Network</span><span>Built for better creative careers.</span></div></footer>
}

export function Layout({ children }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 25 })
  const location = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])
  return <><motion.div className="scroll-progress" style={{ scaleX }}/><div className="ambient"><span/><span/><span/></div><MouseGlow/><Navbar/><AnimatePresence mode="wait"><motion.main key={location.pathname} initial={{opacity:0, y:10, filter:'blur(8px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} exit={{opacity:0,y:-8,filter:'blur(5px)'}} transition={{duration:.35}}>{children}</motion.main></AnimatePresence><Footer/></>
}

function MouseGlow() {
  const ref = useRef(null)
  useEffect(() => { const move = e => { if (ref.current) ref.current.style.transform = `translate(${e.clientX - 240}px,${e.clientY - 240}px)` }; window.addEventListener('pointermove', move); return () => window.removeEventListener('pointermove', move) }, [])
  return <div ref={ref} className="mouse-glow"/>
}

export function Reveal({ children, className='', delay=0 }) { return <motion.div className={className} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-70px'}} transition={{duration:.65,delay,ease:[.2,.8,.2,1]}}>{children}</motion.div> }

export function Eyebrow({ children }) { return <div className="eyebrow"><span/> {children}</div> }

export function PageHero({ eyebrow, title, children, compact=false }) { return <section className={`page-hero ${compact ? 'compact' : ''}`}><div className="container"><Reveal><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{children && <p>{children}</p>}</Reveal></div></section> }

export function SectionHeading({ eyebrow, title, text, align='left' }) { return <Reveal className={`section-heading ${align}`}><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{text && <p>{text}</p>}</Reveal> }

export function CTA() { return <section className="section"><div className="container"><Reveal className="cta-panel"><div><Eyebrow>Your next chapter</Eyebrow><h2>Great work deserves<br/>better opportunities.</h2><p>Join the community, share your portfolio, and take the first step toward a stronger creative career.</p></div><div className="button-row"><a href={DISCORD} target="_blank" rel="noreferrer" className="button light"><MessageCircle size={18}/>Join Discord</a><Link to="/apply" className="button secondary">Apply now <ArrowRight size={18}/></Link></div></Reveal></div></section> }

export function ButtonLink({ to, children, secondary=false }) { return <Link to={to} className={`button ${secondary ? 'secondary':''}`}>{children}<ArrowRight size={18}/></Link> }

export function Accordion({ question, children }) { const [open,setOpen]=useState(false); return <div className={`accordion ${open?'active':''}`}><button onClick={()=>setOpen(!open)} aria-expanded={open}><span>{question}</span><ChevronDown/></button><AnimatePresence initial={false}>{open && <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}><div className="answer">{children}</div></motion.div>}</AnimatePresence></div> }

export function PlanCard({ plan }) { return <Reveal className={`plan ${plan.popular?'featured':''}`}>{plan.popular&&<span className="popular">Most popular</span>}<div className="plan-top"><span>{plan.name}</span><p>{plan.description}</p></div><div className="price"><sup>$</sup>{plan.price}<small>/ month</small></div><Link to={`/apply?plan=${plan.name.toLowerCase()}`} className={`button wide ${plan.popular?'':'secondary'}`}>{plan.cta}<ArrowRight size={18}/></Link><div className="plan-list">{plan.features.map(x=><div key={x}><span><Check size={13}/></span>{x}</div>)}</div></Reveal> }

export function Counter({ value, suffix='+' }) { const ref=useRef(null); const [n,setN]=useState(0); useEffect(()=>{const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting){let s=0;const t=setInterval(()=>{s+=1;setN(Math.round(value*(1-Math.pow(1-s/30,3))));if(s===30)clearInterval(t)},35);ob.disconnect()}},{threshold:.5});if(ref.current)ob.observe(ref.current);return()=>ob.disconnect()},[value]);return <span ref={ref}>{n}{suffix}</span> }
