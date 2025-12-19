import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, you can try Zyllo for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Of course. Our pricing scales with your company. Chat to our friendly team to find a solution that works for you.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'We understand that things change. You can cancel your plan at any time and we’ll refund you the difference already paid.',
  },
  {
    question: 'Can other info be added to an invoice?',
    answer: 'At the moment, the only way to add additional information to invoices is to add the information to the workspace\'s name.',
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq" id="faq">
      <div className="faq-container">
        <h2 className="faq-title">Frequently asked questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                {faq.question}
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-answer">
                <div className="faq-answer-inner">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
