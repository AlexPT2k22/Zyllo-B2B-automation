import { Check } from "lucide-react";
import WaitlistForm from "@/components/waitlist/WaitlistForm";
import { FaqList, Breadcrumbs, StickyCta, RelatedLinks } from "@/components/marketing";
import { landingPages } from "@/content/landingPages";
import "@/styles/marketing.css";

const platformIcon = {
  instagram: { src: "/icons8-instagram.svg", label: "Instagram DM" },
  tiktok: { src: "/icons8-tiktok.svg", label: "TikTok" },
  both: { src: "/icons8-instagram.svg", label: "Instagram DM" },
};

function ChatMock({ chat, platform }) {
  const icon = platformIcon[platform];
  return (
    <figure style={{ margin: 0 }}>
      <div className="mk-chat" role="img" aria-label={`Example ${icon.label} automation conversation`}>
        <div className="mk-chat-header">
          <img src={icon.src} alt="" width="22" height="22" />
          <span>{icon.label} · automated by Zyllo</span>
        </div>
        <ul className="mk-chat-list">
          {chat.messages.map((m, i) => (
            <li
              key={i}
              className={`mk-bubble mk-bubble--${m.from} ${m.muted ? "mk-bubble--muted" : ""}`}
            >
              {m.text}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mk-chat-caption">{chat.caption}</figcaption>
    </figure>
  );
}

const LandingPage = ({ slug }) => {
  const lp = landingPages[slug];
  const source = `lp-${slug}`;

  return (
    <div className="mk-page">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: lp.navLabel, path: lp.path },
        ]}
      />

      {/* Hero: H1 + form above the fold on mobile */}
      <section className="mk-hero" id="waitlist-form" aria-labelledby="lp-title">
        <div className="mk-hero-copy">
          <p className="mk-eyebrow">{lp.hero.eyebrow}</p>
          <h1 id="lp-title" className="mk-h1">{lp.hero.h1}</h1>
          <p className="mk-lead">{lp.hero.sub}</p>
          <WaitlistForm source={source} />
          <ul className="mk-highlights">
            {lp.hero.highlights.map((h) => (
              <li key={h}>
                <Check size={16} aria-hidden="true" /> {h}
              </li>
            ))}
          </ul>
        </div>
        <ChatMock chat={lp.chat} platform={lp.platform} />
      </section>

      {/* Pain points */}
      <section className="mk-section" aria-labelledby="pains-title">
        <div className="mk-section-head">
          <h2 id="pains-title" className="mk-h2">{lp.pains.h2}</h2>
          <p className="mk-muted">{lp.pains.intro}</p>
        </div>
        <div className="mk-grid mk-grid--3">
          {lp.pains.items.map((item) => (
            <div key={item.h3} className="mk-card">
              <h3 className="mk-h3">{item.h3}</h3>
              <p className="mk-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mk-section" aria-labelledby="steps-title">
        <div className="mk-section-head">
          <h2 id="steps-title" className="mk-h2">{lp.steps.h2}</h2>
        </div>
        <ol className="mk-grid mk-grid--3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {lp.steps.items.map((s, i) => (
            <li key={s.h3} className="mk-card">
              <span className="mk-num">{i + 1}</span>
              <h3 className="mk-h3">{s.h3}</h3>
              <p className="mk-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Benefits */}
      <section className="mk-section" aria-labelledby="benefits-title">
        <div className="mk-section-head">
          <h2 id="benefits-title" className="mk-h2">{lp.benefits.h2}</h2>
        </div>
        <div className="mk-grid mk-grid--3">
          {lp.benefits.items.map((b) => (
            <div key={b.h3} className="mk-card">
              <h3 className="mk-h3">{b.h3}</h3>
              <p className="mk-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="mk-section" aria-labelledby="compare-title">
        <div className="mk-section-head">
          <h2 id="compare-title" className="mk-h2">{lp.comparison.h2}</h2>
        </div>
        <div className="mk-table-wrap">
          <table className="mk-table">
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Feature</span></th>
                {lp.comparison.columns.map((c, i) => (
                  <th key={c} scope="col" className={i === 0 ? "is-zyllo" : ""}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lp.comparison.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((v, i) => (
                    <td key={i} className={i === 0 ? "is-zyllo" : ""}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {lp.comparison.note && <p className="mk-note">{lp.comparison.note}</p>}
      </section>

      {lp.whenOther && (
        <section className="mk-section" aria-labelledby="other-title">
          <div className="mk-card">
            <h2 id="other-title" className="mk-h2" style={{ fontSize: "1.5rem" }}>
              {lp.whenOther.h2}
            </h2>
            <p className="mk-muted">{lp.whenOther.body}</p>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mk-section" aria-labelledby="faq-title">
        <div className="mk-section-head">
          <h2 id="faq-title" className="mk-h2">Frequently asked questions</h2>
        </div>
        <FaqList faqs={lp.faqs} />
      </section>

      {/* Final CTA with embedded form */}
      <section className="mk-section">
        <div className="mk-cta-band">
          <h2 className="mk-h2">{lp.finalCta.h2}</h2>
          <p className="mk-lead">{lp.finalCta.body}</p>
          <WaitlistForm source={`${source}-bottom`} />
        </div>
      </section>

      <RelatedLinks pages={lp.related} postSlugs={lp.relatedPosts} />

      <StickyCta href="#waitlist-form" />
    </div>
  );
};

export default LandingPage;
