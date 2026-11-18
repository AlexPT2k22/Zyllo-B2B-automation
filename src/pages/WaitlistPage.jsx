import { Link } from "react-router-dom";
import { Check, Zap, Lock, MessageCircle, Rocket } from "lucide-react";
import WaitlistForm from "@/components/waitlist/WaitlistForm";
import { FaqList, Breadcrumbs } from "@/components/marketing";
import { waitlistFaqs } from "@/content/faqs";
import { landingPageList } from "@/content/landingPages";
import "@/styles/marketing.css";

const perks = [
  {
    icon: Lock,
    title: "Launch pricing, locked in",
    body: "Early-access members keep launch pricing on their plan — a better deal than what we'll offer publicly.",
  },
  {
    icon: Rocket,
    title: "Priority onboarding",
    body: "We set up your first comment-to-DM and follow-up flows with you, so you're selling from day one.",
  },
  {
    icon: MessageCircle,
    title: "Shape the product",
    body: "A direct line to the team building Zyllo. Tell us what your shop needs and we'll build it.",
  },
  {
    icon: Zap,
    title: "First to new features",
    body: "Get new automations — like AI follow-ups and cart recovery — before anyone else.",
  },
];

const steps = [
  { title: "Join the list", body: "Enter your email. It takes 10 seconds and it's free." },
  { title: "Confirm your spot", body: "Click the link in the confirmation email to secure your place." },
  { title: "Get your invite", body: "We onboard brands in small batches. You'll get an email when your spot opens." },
];

const WaitlistPage = () => {
  return (
    <div className="mk-page">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Waitlist", path: "/waitlist" },
        ]}
      />

      {/* Above the fold on mobile: H1 + one-line value + form */}
      <section className="mk-hero" id="waitlist-form" aria-labelledby="waitlist-title">
        <div className="mk-hero-copy">
          <p className="mk-eyebrow">Early access · Limited spots per batch</p>
          <h1 id="waitlist-title" className="mk-h1">
            Get early access to <em>Zyllo</em>
          </h1>
          <p className="mk-lead">
            AI that answers every Instagram and TikTok comment and DM in
            seconds, sends product links and follows up with shoppers — so your
            shop never loses a sale in the inbox.
          </p>
          <WaitlistForm source="waitlist-page" buttonLabel="Reserve my spot" />
          <ul className="mk-highlights">
            <li><Check size={16} aria-hidden="true" /> Launch pricing</li>
            <li><Check size={16} aria-hidden="true" /> Priority onboarding</li>
            <li><Check size={16} aria-hidden="true" /> Cancel anytime</li>
          </ul>
        </div>

        <div className="mk-card">
          <span className="mk-kicker">What you're signing up for</span>
          <h2 className="mk-h3" style={{ fontSize: "1.25rem" }}>
            DM automation built for e-commerce
          </h2>
          <ul className="mk-checklist">
            {[
              "Instant replies to comments on posts, Reels and TikToks",
              "Comment-to-DM with the right product link",
              "Answers to price, stock, sizing and shipping questions",
              "AI follow-ups for shoppers who go quiet",
              "Lead tagging and handoff to your team",
              "Instagram + TikTok in one dashboard",
            ].map((item) => (
              <li key={item}>
                <Check size={18} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mk-section" aria-labelledby="perks-title">
        <div className="mk-section-head">
          <h2 id="perks-title" className="mk-h2">Why join early</h2>
          <p className="mk-muted">
            Early-access brands get more than a head start.
          </p>
        </div>
        <div className="mk-grid mk-grid--2">
          {perks.map(({ icon: Icon, title, body }) => (
            <div key={title} className="mk-card">
              <span className="mk-num"><Icon size={18} aria-hidden="true" /></span>
              <h3 className="mk-h3">{title}</h3>
              <p className="mk-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mk-section" aria-labelledby="steps-title">
        <div className="mk-section-head">
          <h2 id="steps-title" className="mk-h2">What happens next</h2>
        </div>
        <ol className="mk-grid mk-grid--3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {steps.map((s, i) => (
            <li key={s.title} className="mk-card">
              <span className="mk-num">{i + 1}</span>
              <h3 className="mk-h3">{s.title}</h3>
              <p className="mk-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mk-section" aria-labelledby="usecases-title">
        <div className="mk-section-head">
          <h2 id="usecases-title" className="mk-h2">See what Zyllo automates</h2>
        </div>
        <div className="mk-grid mk-grid--3">
          {landingPageList.map((lp) => (
            <Link key={lp.path} to={lp.path} className="mk-card mk-card--link">
              <span className="mk-kicker">Use case</span>
              <h3 className="mk-h3">{lp.navLabel}</h3>
              <p className="mk-muted">{lp.hero.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mk-section" aria-labelledby="faq-title">
        <div className="mk-section-head">
          <h2 id="faq-title" className="mk-h2">Waitlist FAQ</h2>
        </div>
        <FaqList faqs={waitlistFaqs} />
      </section>

      <section className="mk-section">
        <div className="mk-cta-band">
          <h2 className="mk-h2">Don't let another comment go unanswered</h2>
          <p className="mk-lead">
            Reserve your early-access spot — it's free and takes 10 seconds.
          </p>
          <WaitlistForm source="waitlist-page-bottom" buttonLabel="Reserve my spot" />
        </div>
      </section>
    </div>
  );
};

export default WaitlistPage;
