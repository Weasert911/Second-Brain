import {
  Aperture, BadgeCheck, BriefcaseBusiness, ChartNoAxesCombined, Clapperboard,
  Compass, FileSearch, Gem, GraduationCap, Handshake, Layers3, MessageCircle,
  Network, Palette, Radar, ShieldCheck, Sparkles, UsersRound, WalletCards,
} from 'lucide-react'

export const DISCORD = 'https://discord.gg/pYTabCJhB6'

export const features = [
  { icon: Radar, title: 'Curated client opportunities', text: 'Real briefs from businesses, creators, startups, and agencies, filtered for creative relevance.' },
  { icon: WalletCards, title: 'Keep your quoted rate', text: 'Quote confidently and keep 100% of your project fee. We do not take a member commission.' },
  { icon: UsersRound, title: 'Private community', text: 'A focused space to learn, share progress, and get unstuck with ambitious creative peers.' },
  { icon: FileSearch, title: 'Portfolio reviews', text: 'Practical feedback that helps your presentation match the quality of your creative work.' },
  { icon: GraduationCap, title: 'Professional resources', text: 'Useful systems, templates, and guidance for stronger client communication and delivery.' },
  { icon: Network, title: 'Real networking', text: 'Build long-term relationships with editors, designers, and potential collaborators.' },
]

export const timeline = [
  { title: 'Explore Brine Network', icon: Compass, text: 'Learn about the community and understand exactly what membership offers.' },
  { title: 'Join Discord', icon: MessageCircle, text: 'Enter the public server, meet the community, and find the portfolio channel.' },
  { title: 'Submit your portfolio', icon: Layers3, text: 'Post your work, share your specialties, and introduce yourself to the network.' },
  { title: 'Application review', icon: FileSearch, text: 'Every portfolio is reviewed manually for skill, communication, professionalism, and quality.' },
  { title: 'Approval and payment', icon: Gem, text: 'If approved, you will receive payment instructions by email or Discord. Choose Creator at $10/month or Professional at $25/month.' },
  { title: 'Complete verification', icon: ShieldCheck, text: 'After payment, DM the Founder with your payment screenshot, Discord username, portfolio, and selected plan.' },
  { title: 'Become verified', icon: BadgeCheck, text: 'Receive your role and unlock private client channels, resources, and networking.' },
  { title: 'Access opportunities', icon: BriefcaseBusiness, text: 'Receive curated briefs. Clients make the final hiring decision; you keep your quoted project fee.' },
]

export const plans = [
  { name: 'Creator', price: '10', description: 'A focused launchpad for emerging creatives.', features: ['Up to 20 curated opportunities monthly', 'Portfolio feedback', 'Private community', 'Networking and resources', 'Verified Discord access'], cta: 'Apply as Creator' },
  { name: 'Professional', price: '25', description: 'Greater visibility for career-focused professionals.', popular: true, features: ['Everything in Creator', 'Priority opportunities', 'Up to 50 opportunities monthly', 'Priority support', 'Featured portfolio', 'Early notifications'], cta: 'Become Professional' },
]

export const values = [
  { icon: Sparkles, title: 'Quality', text: 'Thoughtful curation over noisy volume.' },
  { icon: Aperture, title: 'Transparency', text: 'Clear expectations, process, and pricing.' },
  { icon: ShieldCheck, title: 'Professionalism', text: 'Respect for every client and creative.' },
  { icon: ChartNoAxesCombined, title: 'Growth', text: 'Progress through feedback and practice.' },
  { icon: Handshake, title: 'Community', text: 'Peers who share knowledge, not gatekeep it.' },
  { icon: BriefcaseBusiness, title: 'Opportunity', text: 'A better path to genuine client briefs.' },
]

export const disciplines = [
  { icon: Clapperboard, type: 'Video Editors', text: 'For storytellers who shape raw footage into work people remember.', tags: ['YouTube', 'Gaming', 'Commercial', 'Short Form', 'Long Form', 'Motion Graphics'] },
  { icon: Palette, type: 'Graphic Designers', text: 'For visual thinkers translating ideas into compelling brand moments.', tags: ['Brand Identity', 'Thumbnails', 'Social Media', 'UI', 'Posters', 'Logos'] },
]
