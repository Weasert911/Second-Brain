import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  Globe2,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  ButtonLink,
  Counter,
  CTA,
  Eyebrow,
  PageHero,
  PlanCard,
  Reveal,
  SectionHeading,
} from "./components";
import {
  DISCORD,
  disciplines,
  features,
  plans,
  timeline,
  values,
} from "./data";

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <Reveal className="hero-copy">
            <Eyebrow>Private creative network · Applications open</Eyebrow>
            <h1>
              Stop chasing clients.
              <br />
              <span>Build your creative career.</span>
            </h1>
            <p>
              Brine Network connects talented Video Editors and Graphic
              Designers with genuine businesses, creators, startups, and
              agencies looking for professionals.
            </p>
            <div className="button-row">
              <a
                className="button"
                href={DISCORD}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} />
                Join Discord
              </a>
              <ButtonLink to="/apply" secondary>
                Apply now
              </ButtonLink>
            </div>
            <div className="hero-note">
              <span className="avatar-stack">
                <i>V</i>
                <i>D</i>
                <i>M</i>
              </span>
              <span>
                <b>Built with creatives,</b>
                <br />
                not around them.
              </span>
            </div>
          </Reveal>
          <NetworkVisual />
        </div>
      </section>
      <section className="proof">
        <div className="container proof-grid">
          <div>
            <strong>
              <Counter value={49} />
            </strong>
            <span>Community members</span>
          </div>
          <div>
            <strong>Weekly</strong>
            <span>Network growth</span>
          </div>
          <div>
            <strong>Private</strong>
            <span>Discord community</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Your quoted rate</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="The network advantage"
            title={
              <>
                Everything between talent
                <br />
                and opportunity.
              </>
            }
            text="One focused network for the parts of creative work nobody teaches you."
          />
          <div className="feature-grid">
            {features.map((f, i) => (
              <Reveal className="feature-card" key={f.title} delay={i * 0.05}>
                <div className="icon-box">
                  <f.icon />
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <span className="card-index">0{i + 1}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section disciplines">
        <div className="container">
          <SectionHeading
            eyebrow="Made for makers"
            title="Find your people."
            text="Different disciplines. Shared ambition. A professional environment for serious creative growth."
            align="center"
          />
          <div className="discipline-grid">
            {disciplines.map((d, i) => (
              <Reveal className="discipline-card" key={d.type} delay={i * 0.12}>
                <div className="discipline-icon">
                  <d.icon />
                </div>
                <div>
                  <span className="mono">0{i + 1} / Discipline</span>
                  <h3>{d.type}</h3>
                  <p>{d.text}</p>
                  <div className="tags">
                    {d.tags.map((x) => (
                      <span key={x}>{x}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container process-preview">
          <SectionHeading
            eyebrow="A deliberate process"
            title="From portfolio to possibility."
            text="No bidding wars. No race to the bottom. Just a clear route into a curated professional network."
          />
          <div className="mini-steps">
            {[
              "Join the community",
              "Share your work",
              "Get reviewed",
              "Access opportunities",
            ].map((x, i) => (
              <Reveal key={x} className="mini-step" delay={i * 0.07}>
                <span>0{i + 1}</span>
                <h3>{x}</h3>
                {i < 3 && <ChevronRight />}
              </Reveal>
            ))}
          </div>
          <ButtonLink to="/how-it-works" secondary>
            See how it works
          </ButtonLink>
        </div>
      </section>
      <CTA />
    </>
  );
}

function NetworkVisual() {
  return (
    <Reveal className="network-visual" delay={0.15}>
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="core">
        <span className="logo-mark big">
          <i />
          <i />
          <i />
        </span>
        <b>BRINE</b>
        <small>CURATED NETWORK</small>
      </div>
      <motion.div
        className="float-card client"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <span className="tiny-icon">
          <CircleDollarSign />
        </span>
        <div>
          <small>NEW BRIEF</small>
          <b>Client opportunity</b>
        </div>
        <span className="live">LIVE</span>
      </motion.div>
      <motion.div
        className="float-card editor"
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 4.6, repeat: Infinity }}
      >
        <span className="tiny-icon violet">
          <Sparkles />
        </span>
        <div>
          <small>CREATIVE</small>
          <b>Video editor</b>
        </div>
        <BadgeCheck />
      </motion.div>
      <motion.div
        className="float-card designer"
        animate={{ x: [0, 7, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <span className="tiny-icon green">
          <Globe2 />
        </span>
        <div>
          <small>CREATIVE</small>
          <b>Graphic designer</b>
        </div>
        <BadgeCheck />
      </motion.div>
      <div className="visual-label top">
        REAL CLIENTS <ArrowDown />
      </div>
      <div className="visual-label bottom">VETTED CREATIVES</div>
    </Reveal>
  );
}

export function HowItWorks() {
  return (
    <>
      <PageHero
        eyebrow="The path to verified"
        title={
          <>
            A clear process.
            <br />
            <span className="gradient-text">No guesswork.</span>
          </>
        }
      >
        Eight thoughtful steps separate discovering Brine from accessing curated
        opportunities.
      </PageHero>
      <section className="section timeline-section">
        <div className="container timeline">
          <div className="timeline-line" />
          {timeline.map((step, i) => (
            <Reveal
              key={step.title}
              className={`timeline-row ${i % 2 ? "reverse" : ""}`}
            >
              <div className="step-card">
                <div className="step-meta">
                  <span>STEP {String(i + 1).padStart(2, "0")}</span>
                  <step.icon />
                </div>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
                {i === 3 && (
                  <div className="inline-tags">
                    <span>Skill</span>
                    <span>Communication</span>
                    <span>Professionalism</span>
                    <span>Portfolio quality</span>
                  </div>
                )}
                {i === 4 && (
                  <>
                    <div className="mini-prices">
                      <span>
                        <b>$10</b> Creator
                      </span>
                      <span>
                        <b>$25</b> Professional
                      </span>
                    </div>
                    <div className="approval-note">
                      <ShieldCheck />
                      Payment is requested only after portfolio approval.
                    </div>
                  </>
                )}
              </div>
              <div className="step-node">{i + 1}</div>
              <div className="timeline-space" />
            </Reveal>
          ))}
        </div>
      </section>
      <section className="disclaimer-band">
        <div className="container">
          <ShieldCheck />
          <div>
            <b>Opportunity, not empty promises.</b>
            <p>
              We never guarantee jobs, projects, employment, or income. Clients
              always choose who they hire.
            </p>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

export function Membership() {
  return (
    <>
      <PageHero
        eyebrow="Simple membership"
        title={
          <>
            Invest in access.
            <br />
            <span className="gradient-text">Keep what you earn.</span>
          </>
        }
      >
        Two plans designed for where you are now and where you want your
        creative career to go. Payment is requested only after your portfolio
        has been approved.
      </PageHero>
      <section className="section pricing-section">
        <div className="container">
          <div className="pricing-grid">
            {plans.map((p) => (
              <PlanCard key={p.name} plan={p} />
            ))}
          </div>
          <p className="pricing-note">
            <ShieldCheck /> Apply first. Payment instructions are shared
            privately after approval.
          </p>
        </div>
      </section>
      <section className="section compare-section">
        <div className="container">
          <SectionHeading
            eyebrow="Built differently"
            title="Your rate stays yours."
            text="Brine is designed to align with creatives, not extract from them."
          />
          <div className="comparison">
            <Reveal>
              <small>TYPICAL MARKETPLACE</small>
              <strong>10–20%</strong>
              <span>Commission on every project</span>
            </Reveal>
            <div className="versus">VS</div>
            <Reveal className="brine-compare">
              <small>BRINE NETWORK</small>
              <strong>0%</strong>
              <span>Member commission</span>
            </Reveal>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

export function About() {
  return (
    <>
      <PageHero
        eyebrow="Why Brine exists"
        title={
          <>
            Creative careers deserve
            <br />
            <span className="gradient-text">better infrastructure.</span>
          </>
        }
      >
        We are not a marketplace, agency, or course. We are a curated network
        built to make finding genuine opportunities less chaotic.
      </PageHero>
      <section className="section mission">
        <div className="container mission-grid">
          <Reveal>
            <span className="section-number">01 / MISSION</span>
            <h2>Remove the hardest part of freelancing.</h2>
          </Reveal>
          <Reveal>
            <p className="lead">
              Finding quality clients should not demand hours of scrolling
              through noisy job boards and social feeds.
            </p>
            <p>
              Brine brings curated opportunities into one professional
              community, alongside the feedback, relationships, and resources
              that help creatives act on them.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section values">
        <div className="container">
          <SectionHeading
            eyebrow="What guides us"
            title="Values with consequences."
            text="Principles only matter when they shape how a community is built."
          />
          <div className="value-grid">
            {values.map((v, i) => (
              <Reveal key={v.title} className="value-card" delay={i * 0.05}>
                <v.icon />
                <span>0{i + 1}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section statement">
        <div className="container">
          <Reveal>
            <p>
              “Not more noise.
              <br />A <span>clearer signal.</span>”
            </p>
          </Reveal>
        </div>
      </section>
      <CTA />
    </>
  );
}

const faqs = [
  [
    "What is Brine Network?",
    "Brine is a private, curated network for video editors and graphic designers. Members access client opportunities, portfolio feedback, resources, networking, and community support.",
  ],
  [
    "Are you an agency?",
    "No. Brine does not employ creatives or deliver client projects as an agency. We connect independent creatives with opportunities and let clients make the final hiring decision.",
  ],
  [
    "Do you guarantee jobs?",
    "No. We provide curated opportunities, not guaranteed projects, employment, or income. The quality of your work, communication, fit, and the client’s decision determine outcomes.",
  ],
  [
    "Can beginners join?",
    "Yes. Emerging creatives and students can apply if they have a portfolio that demonstrates commitment and potential. Every application is reviewed individually.",
  ],
  [
    "How do I become verified?",
    <ol key="steps">
      <li>Join Discord</li>
      <li>Submit your portfolio and application</li>
      <li>Wait for approval</li>
      <li>Choose and pay for membership</li>
      <li>Send verification details</li>
      <li>Receive your verified role</li>
    </ol>,
  ],
  [
    "Do you take commission?",
    "No. Members keep 100% of the rate they quote for their project work. Any client-side service fees, if applicable, are handled separately.",
  ],
  [
    "Can I cancel my membership?",
    "Yes. You can cancel renewal at any time. Access remains active until the end of the paid billing period. See the Refund Policy for full details.",
  ],
  [
    "What kinds of opportunities are shared?",
    "Opportunities may come from creators, startups, businesses, and agencies seeking video editing, motion design, branding, thumbnails, social content, UI, and related creative services.",
  ],
];

export function FAQ() {
  return (
    <>
      <PageHero
        eyebrow="Answers, without ambiguity"
        title={
          <>
            Frequently asked.
            <br />
            <span className="gradient-text">Clearly answered.</span>
          </>
        }
      >
        Everything you should know before applying to the network.
      </PageHero>
      <section className="section faq-section">
        <div className="container faq-layout">
          <div>
            <Eyebrow>FAQ DIRECTORY</Eyebrow>
            <h2>Still deciding?</h2>
            <p>
              Read through the essentials or speak with us directly in Discord.
            </p>
            <a
              href={DISCORD}
              target="_blank"
              rel="noreferrer"
              className="button secondary"
            >
              <MessageCircle />
              Ask on Discord
            </a>
          </div>
          <div>
            {faqs.map(([q, a]) => (
              <Accordion key={q} question={q}>
                {typeof a === "string" ? <p>{a}</p> : a}
              </Accordion>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

export function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Start a conversation"
        title={
          <>
            Good networks begin
            <br />
            <span className="gradient-text">with a hello.</span>
          </>
        }
      >
        Questions about membership, partnerships, or hiring through Brine? Reach
        out.
      </PageHero>
      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-options">
            <Reveal className="contact-card active">
              <MessageCircle />
              <div>
                <small>FASTEST RESPONSE</small>
                <h3>Talk to us on Discord</h3>
                <p>Join the server and open a support ticket.</p>
              </div>
              <a href={DISCORD} target="_blank" rel="noreferrer">
                <ExternalLink />
              </a>
            </Reveal>
            <Reveal className="contact-card">
              <Mail />
              <div>
                <small>EMAIL</small>
                <h3>Coming soon</h3>
                <p>A dedicated support inbox is on the way.</p>
              </div>
            </Reveal>
            <div className="social-row">
              <span>
                <Camera />
                Instagram · Soon
              </span>
              <span>
                <Briefcase />
                LinkedIn · Soon
              </span>
            </div>
          </div>
          <Reveal className="form-panel discord-panel">
            <div className="discord-panel-icon">
              <MessageCircle />
            </div>
            <Eyebrow>Direct support</Eyebrow>
            <h2>Continue on Discord.</h2>
            <p>
              Join the Brine Network server and open a support ticket for
              membership, hiring, or partnership questions.
            </p>
            <div className="discord-benefits">
              <span>
                <Check /> No form to complete
              </span>
              <span>
                <Check /> Speak directly with the team
              </span>
              <span>
                <Clock3 /> Typical response within 24 hours
              </span>
            </div>
            <a
              className="button wide"
              href={DISCORD}
              target="_blank"
              rel="noreferrer"
            >
              Open Brine Discord <ExternalLink />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export function Apply() {
  const [params] = useSearchParams();
  const initial =
    params.get("plan") === "professional" ? "Professional" : "Creator";
  return (
    <>
      <PageHero
        eyebrow="Applications are open"
        title={
          <>
            Your work got you here.
            <br />
            <span className="gradient-text">Let’s see where it can go.</span>
          </>
        }
      >
        Applications now happen directly inside Discord. No website form, no
        payment before approval, and no transaction details required.
      </PageHero>
      <section className="section apply-section">
        <div className="container discord-apply-layout">
          <Reveal className="discord-apply-card">
            <div className="selected-plan">
              <span>YOUR PREFERRED PLAN</span>
              <b>{initial}</b>
              <small>
                ${initial === "Professional" ? "25" : "10"} / month after
                approval
              </small>
            </div>
            <div className="discord-steps">
              {[
                [
                  "01",
                  "Join Discord",
                  "Enter the public Brine Network server.",
                ],
                [
                  "02",
                  "Open the portfolio channel",
                  "Introduce yourself and choose Video Editor, Graphic Designer, or Both.",
                ],
                [
                  "03",
                  "Share your portfolio",
                  "Include your portfolio link, experience, country, and specializations.",
                ],
                [
                  "04",
                  "Wait for review",
                  "The team reviews your work and replies inside Discord within 12–24 hours.",
                ],
              ].map(([number, title, text]) => (
                <div key={number}>
                  <span>{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="approval-form-note">
              <ShieldCheck />
              <div>
                <b>No payment before approval.</b>
                <span>
                  Approved applicants receive membership and payment
                  instructions privately inside Discord.
                </span>
              </div>
            </div>
            <a
              className="button wide discord-apply-button"
              href={DISCORD}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle /> Join Discord and apply <ArrowRight />
            </a>
          </Reveal>
          <Reveal className="discord-checklist">
            <Eyebrow>Prepare before joining</Eyebrow>
            <h2>Have these ready.</h2>
            {[
              "Discord username",
              "Portfolio link",
              "Profession and specializations",
              "Experience level and country",
            ].map((item) => (
              <div key={item}>
                <Check />
                {item}
              </div>
            ))}
            <p>
              <ShieldCheck /> Membership provides access to curated
              opportunities and resources. It does not guarantee projects,
              employment, or income.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
export function Success() {
  return (
    <section className="success-page">
      <div className="container">
        <Reveal className="success-card">
          <div className="success-visual">
            <span className="success-ring r1" />
            <span className="success-ring r2" />
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.25 }}
            >
              <CheckCircle2 />
            </motion.div>
          </div>
          <Eyebrow>Application received</Eyebrow>
          <h1>Submitted successfully.</h1>
          <p>Thank you for applying. Your next steps happen inside Discord.</p>
          <div className="next-steps">
            {[
              ["01", "Join Discord"],
              ["02", "Open a verification ticket"],
              ["03", "Mention your email"],
              ["04", "Wait for review"],
            ].map(([n, x]) => (
              <div key={n}>
                <span>{n}</span>
                <b>{x}</b>
              </div>
            ))}
          </div>
          <div className="average">
            <Clock3 />
            <span>
              Average review time <b>12–24 hours</b>
            </span>
          </div>
          <a className="button" href={DISCORD} target="_blank" rel="noreferrer">
            <MessageCircle />
            Join Discord now <ArrowRight />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

const legal = {
  privacy: {
    title: "Privacy Policy",
    updated: "July 31, 2026",
    sections: [
      [
        "Information we collect",
        "When you apply or contact us, we may collect your name, email, Discord username, country, profession, portfolio URL, experience, specializations, membership preference, and the content of your message.",
      ],
      [
        "How we use information",
        "We use your information to review applications, administer membership, communicate with you, maintain community safety, and improve Brine Network. We do not sell personal information.",
      ],
      [
        "Data sharing and retention",
        "Information is shared only with service providers needed to operate the network or when legally required. We retain it only for as long as reasonably necessary for the purposes described here.",
      ],
      [
        "Your choices",
        "You may request access, correction, or deletion of your personal information by contacting us through Discord. Some records may be retained where required for legal, fraud-prevention, or accounting purposes.",
      ],
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "July 31, 2026",
    sections: [
      [
        "The service",
        "Brine Network is a curated community providing professional resources, networking, portfolio feedback, and access to curated client opportunities. Brine is not an employer, staffing agency, project guarantor, or party to agreements between members and clients unless expressly stated.",
      ],
      [
        "No guarantees",
        "Membership does not guarantee projects, employment, clients, revenue, or income. Clients independently decide whom to contact and hire. Members are responsible for their proposals, rates, contracts, taxes, delivery, and client relationships.",
      ],
      [
        "Member conduct",
        "Members must communicate professionally, represent their skills accurately, respect confidentiality and intellectual property, and avoid spam, harassment, fraud, or harmful conduct. Access may be suspended or terminated for violations.",
      ],
      [
        "Payments and changes",
        "Membership fees grant access for the applicable billing period. Prices, features, and opportunity volumes may change with reasonable notice. Continued use after an update constitutes acceptance of the revised terms.",
      ],
    ],
  },
  refund: {
    title: "Refund Policy",
    updated: "July 31, 2026",
    sections: [
      [
        "Membership payments",
        "Membership fees pay for immediate access to private community areas, resources, support, and curated opportunity channels. They do not purchase a job or guarantee a financial result.",
      ],
      [
        "Refund eligibility",
        "Because digital access is provided immediately, membership payments are generally non-refundable once access has been granted. Duplicate or demonstrably erroneous charges will be reviewed individually.",
      ],
      [
        "Cancellation",
        "You may cancel future renewal at any time. Cancellation prevents the next charge and does not normally create a refund for the current billing period. Access continues until that period ends.",
      ],
      [
        "Requesting a review",
        "Open a support ticket in Discord with your username, plan, payment date, transaction ID, and reason for the request. Approved refunds are returned to the original payment method when possible.",
      ],
    ],
  },
  membership: {
    title: "Membership Policy",
    updated: "July 31, 2026",
    sections: [
      [
        "What membership includes",
        "Membership grants access to private community resources, portfolio feedback, networking, support, and curated client opportunities according to the selected plan. Features and opportunity volume are targets, not guaranteed minimum results.",
      ],
      [
        "Approval and verification",
        "Applicants are manually reviewed for portfolio quality, professionalism, communication, and fit. Approval remains at Brine Network’s discretion. Payment alone does not override eligibility or conduct requirements.",
      ],
      [
        "Opportunity access",
        "Opportunities are shared for members to evaluate and pursue independently. Clients make the final hiring decision. Brine does not guarantee that a member will be contacted, selected, hired, or paid.",
      ],
      [
        "Member earnings",
        "Members keep 100% of the project rate they quote. Any client-side service fee, if applicable, is separate. Members remain responsible for contracts, scope, invoices, taxes, and delivery.",
      ],
      [
        "Access and enforcement",
        "Membership access is personal and may not be shared. Fraud, misrepresentation, harassment, misuse of client information, or repeated unprofessional conduct may lead to suspension or removal without refund.",
      ],
    ],
  },
};
export function Legal({ type }) {
  const page = legal[type];
  useEffect(() => {
    document.title = `${page.title} | Brine Network`;
  }, [page.title]);
  return (
    <>
      <PageHero compact eyebrow="Brine Network legal" title={page.title}>
        Last updated {page.updated}
      </PageHero>
      <section className="legal-page">
        <div className="container legal-layout">
          <aside>
            <span>ON THIS PAGE</span>
            {page.sections.map(([h]) => (
              <a href={`#${h.toLowerCase().replaceAll(" ", "-")}`} key={h}>
                {h}
              </a>
            ))}
          </aside>
          <article>
            <div className="legal-callout">
              <ShieldCheck />
              <p>
                <b>The essential point:</b> Membership grants access to
                community resources and curated client opportunities. It does
                not guarantee projects, employment, or income. Clients make the
                final hiring decision.
              </p>
            </div>
            {page.sections.map(([h, p], i) => (
              <section key={h} id={h.toLowerCase().replaceAll(" ", "-")}>
                <span>0{i + 1}</span>
                <h2>{h}</h2>
                <p>{p}</p>
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
