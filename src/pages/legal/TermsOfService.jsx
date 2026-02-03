import React from "react";
import "./LegalPage.css";

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-updated">Last updated: January 27, 2026</p>
        </header>

        <div className="legal-content">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Zyllo ("Service"), you agree to be bound by
            these Terms of Service ("Terms"). If you do not agree to these
            Terms, please do not use our Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Zyllo is a software-as-a-service (SaaS) platform that enables
            businesses to automate their customer communications on social media
            platforms, including Instagram and TikTok. Our Service provides:
          </p>
          <ul>
            <li>Automated response systems for direct messages and comments</li>
            <li>Lead qualification and scoring</li>
            <li>Cart recovery automation</li>
            <li>Analytics and reporting</li>
          </ul>

          <h2>3. Account Registration</h2>
          <p>To use our Service, you must create an account. You agree to:</p>
          <ul>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>

          <h2>4. Acceptable Use</h2>
          <p>You agree NOT to use our Service to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>
              Send spam, unsolicited messages, or engage in abusive behavior
            </li>
            <li>
              Impersonate any person or entity or misrepresent your affiliation
            </li>
            <li>
              Interfere with or disrupt the Service or servers/networks
              connected to it
            </li>
            <li>
              Attempt to gain unauthorized access to any portion of the Service
            </li>
            <li>
              Use the Service in a manner that could damage, disable, or impair
              it
            </li>
            <li>
              Violate Instagram's or TikTok's terms of service or community
              guidelines
            </li>
          </ul>

          <h2>5. Third-Party Platforms</h2>
          <p>
            Our Service integrates with third-party platforms (Instagram,
            TikTok). Your use of these integrations is also subject to:
          </p>
          <ul>
            <li>Instagram/Meta Terms of Service and Platform Policies</li>
            <li>TikTok Terms of Service and Developer Guidelines</li>
          </ul>
          <p>
            We are not responsible for changes to these platforms' policies that
            may affect Service functionality.
          </p>

          <h2>6. Subscription and Payments</h2>

          <h3>6.1 Pricing</h3>
          <p>
            Our Service offers various subscription plans. All prices are listed
            in Euros (€) and may be subject to applicable taxes.
          </p>

          <h3>6.2 Billing</h3>
          <p>
            Subscriptions are billed in advance on a monthly or annual basis.
            You authorize us to charge your chosen payment method for all
            applicable fees.
          </p>

          <h3>6.3 Refunds</h3>
          <p>
            We offer a 14-day money-back guarantee for new subscriptions. After
            this period, fees are non-refundable except as required by law.
          </p>

          <h3>6.4 Cancellation</h3>
          <p>
            You may cancel your subscription at any time. Cancellation takes
            effect at the end of the current billing period.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            The Service, including all content, features, and functionality, is
            owned by Zyllo and is protected by international copyright,
            trademark, and other intellectual property laws. You may not copy,
            modify, or create derivative works of the Service.
          </p>

          <h2>8. User Content</h2>
          <p>
            You retain ownership of content you create within the Service
            (automation rules, templates, etc.). By using our Service, you grant
            us a limited license to use, store, and process this content solely
            to provide the Service.
          </p>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
            WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. We do not
            guarantee that the Service will be uninterrupted, secure, or
            error-free.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZYLLO SHALL NOT BE LIABLE
            FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED
            DIRECTLY OR INDIRECTLY.
          </p>
          <p>
            Our total liability shall not exceed the amount paid by you to Zyllo
            in the twelve (12) months preceding the claim.
          </p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Zyllo and its officers,
            directors, employees, and agents from any claims, damages, or
            expenses arising from your use of the Service or violation of these
            Terms.
          </p>

          <h2>12. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior
            notice, for conduct that we believe violates these Terms or is
            harmful to other users, us, or third parties.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the European Union and Portugal, without regard to
            conflict of law principles.
          </p>

          <h2>14. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will
            provide notice of significant changes via email or within the
            Service. Continued use after changes constitutes acceptance.
          </p>

          <h2>15. Contact</h2>
          <p>For questions about these Terms, please contact us:</p>
          <div className="highlight-box">
            <p>
              <strong>Zyllo</strong>
              <br />
              Email: <a href="mailto:contact@zyllo.tech">contact@zyllo.tech</a>
              <br />
              Website: <a href="https://zyllo.tech">zyllo.tech</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
