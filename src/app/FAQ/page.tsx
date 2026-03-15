"use client"
import React, { useState } from 'react';
import ForAllHeroSections from '../../../components/ForAllHeroSections'

const faqData = [
  {
    question: "What types of cuisine do you offer?",
    answer: "We offer a diverse range of international cuisines, including Italian, Chinese, Japanese, Indian, Middle Eastern, and customized fusion dishes tailored to your taste."
  },
  {
    question: "How do you ensure food quality and freshness?",
    answer: "We source ingredients from trusted suppliers, ensure proper storage, and prepare meals with the highest hygiene standards. Our packaging is designed to maintain freshness during delivery."
  },
  {
    question: "How fast is your delivery service?",
    answer: "Our Q-Commerce model ensures ultra-fast delivery within 30 to 45 minutes, depending on your location and order size."
  },
  {
    question: "Do you offer meal customization?",
    answer: "Yes! You can customize your meals by selecting ingredients, portion sizes, and dietary preferences such as vegan, gluten-free, or keto options."
  },
  {
    question: "What are your delivery hours?",
    answer: "We operate 24/7, ensuring that you can order your favorite meals anytime, day or night."
  },
  {
    question: "Do you charge a delivery fee?",
    answer: "We offer free delivery on select orders above a minimum value. A nominal delivery charge applies for smaller orders based on your location."
  },
  {
    question: "How can I track my order?",
    answer: "Once you place your order, you will receive a real-time tracking link via SMS and email to monitor the status of your delivery."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards, digital wallets, UPI, and cash on delivery (COD) for your convenience."
  },
  {
    question: "Can I schedule an order in advance?",
    answer: "Yes, you can schedule orders in advance for special occasions, parties, or meal planning. Just select your preferred delivery time at checkout."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach our 24/7 customer support via chat, email, or our helpline for assistance with orders, refunds, or general inquiries."
  }
];

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="main-content">
      <div>
        <ForAllHeroSections />
      </div>

      <div className="min-h-screen bg-black">
        <main className="max-w-4xl mx-auto py-16 px-4">
          <h2 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <p className="text-center text-gray-100 mb-12">
            Find answers to common questions about our customized & international cuisine delivery service.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-grey-400 p-6 rounded-lg shadow-lg transition-transform duration-200"
              >
                <div
                  onClick={() => toggleFAQ(index)}
                  className="cursor-pointer flex justify-between items-center"
                >
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                  <span className="text-2xl">
                    {openIndex === index ? '-' : '+'}
                  </span>
                </div>
                {openIndex === index && (
                  <p className="text-sm text-gray-100 mt-4">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQPage;
