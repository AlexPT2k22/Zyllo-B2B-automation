import React from "react";
import "./LegalPage.css";

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last updated: January 27, 2026</p>
        </header>

        <div className="legal-content">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Zyllo ("we," "our," or "us"). We are committed to
            protecting your personal information and your right to privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our service.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>2.1 Information You Provide</h3>
          <p>
            We collect information that you voluntarily provide to us,
            including:
          </p>
          <ul>
            <li>
              <strong>Account Information:</strong> Email address, name, company
              name when you register for an account or join our waitlist.
            </li>
            <li>
              <strong>Social Media Credentials:</strong> When you connect your
              Instagram or TikTok account, we receive access tokens to interact
              with those platforms on your behalf.
            </li>
            <li>
              <strong>Communication Data:</strong> Messages, automation rules,
              and response templates you create within our platform.
            </li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li>
              <strong>Usage Data:</strong> Information about how you interact
              with our service, including pages viewed, features used, and
              actions taken.
            </li>
            <li>
              <strong>Device Information:</strong> Browser type, operating
              system, device identifiers, and IP address.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies and similar tracking
              technologies to enhance your experience.
            </li>
          </ul>

          <h3>2.3 Information from Third Parties</h3>
          <p>
            When you connect your Instagram or TikTok account, we may receive:
          </p>
          <ul>
            <li>Your public profile information</li>
            <li>Direct messages sent to your business account</li>
            <li>Comments on your posts (when relevant to automation rules)</li>
            <li>Basic account analytics</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Process automated responses based on your configured rules</li>
            <li>Send you service-related communications</li>
            <li>Improve and personalize our platform</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Data Sharing and Disclosure</h2>
          <p>
            We do not sell your personal information. We may share your data
            with:
          </p>
          <ul>
            <li>
              <strong>Service Providers:</strong> Third-party companies that
              help us operate our service (e.g., hosting, analytics, email
              delivery).
            </li>
            <li>
              <strong>Platform APIs:</strong> Instagram and TikTok to process
              your automated responses.
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to
              protect our rights.
            </li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is
            active or as needed to provide you services. Message history is
            retained for up to 90 days after a conversation ends. You can
            request deletion of your data at any time.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information, including:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Secure token storage for social media credentials</li>
          </ul>

          <h2>7. Your Rights (GDPR)</h2>
          <p>
            If you are a resident of the European Economic Area (EEA), you have
            the following rights:
          </p>
          <ul>
            <li>
              <strong>Right to Access:</strong> Request copies of your personal
              data.
            </li>
            <li>
              <strong>Right to Rectification:</strong> Request correction of
              inaccurate data.
            </li>
            <li>
              <strong>Right to Erasure:</strong> Request deletion of your
              personal data.
            </li>
            <li>
              <strong>Right to Portability:</strong> Request transfer of your
              data.
            </li>
            <li>
              <strong>Right to Object:</strong> Object to certain processing of
              your data.
            </li>
          </ul>
          <p>
            To exercise these rights, please contact us at{" "}
            <a href="mailto:privacy@zyllo.tech">privacy@zyllo.tech</a>.
          </p>

          <h2>8. Third-Party Links</h2>
          <p>
            Our service may contain links to third-party websites. We are not
            responsible for the privacy practices of these external sites.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our service is not intended for individuals under the age of 18. We
            do not knowingly collect personal information from children.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new policy on this page and
            updating the "Last updated" date.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <div className="highlight-box">
            <p>
              <strong>Zyllo</strong>
              <br />
              Email: <a href="mailto:privacy@zyllo.tech">privacy@zyllo.tech</a>
              <br />
              Website: <a href="https://zyllo.tech">zyllo.tech</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
