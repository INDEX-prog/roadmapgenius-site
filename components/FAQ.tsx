"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Qu'est-ce que RoadmapGenius exactement ?",
    answer:
      "RoadmapGenius est une plateforme SaaS qui vous permet de créer des roadmaps produit visuellement époustouflantes. Notre outil combine une interface intuitive avec des fonctionnalités puissantes pour vous aider à planifier, communiquer et exécuter votre vision produit.",
  },
  {
    question: "Y a-t-il une période d'essai gratuite ?",
    answer:
      "Oui ! Notre plan Starter est entièrement gratuit et vous permet de créer jusqu'à 3 roadmaps. Pour le plan Pro, nous offrons 14 jours d'essai gratuit sans engagement et sans carte de crédit requise.",
  },
  {
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer:
      "Absolument. Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. Vous continuerez à avoir accès aux fonctionnalités premium jusqu'à la fin de votre période de facturation.",
  },
  {
    question: "Quelles intégrations sont disponibles ?",
    answer:
      "Nous nous intégrons avec les outils les plus populaires : Jira, Notion, Trello, Asana, Slack, Microsoft Teams, et bien d'autres. Nous avons également une API robuste pour créer vos propres intégrations.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "La sécurité est notre priorité. Toutes les données sont chiffrées en transit et au repos. Nous sommes conformes RGPD et SOC 2. Vos roadmaps restent privées sauf si vous décidez de les partager.",
  },
  {
    question: "Proposez-vous des formations ou du support ?",
    answer:
      "Oui ! Nous offrons une documentation complète, des tutoriels vidéo, et des webinaires réguliers. Les utilisateurs Pro bénéficient d'un support prioritaire par email, et les clients Enterprise ont accès à un manager de compte dédié.",
  },
  {
    question: "Puis-je importer mes roadmaps existantes ?",
    answer:
      "Oui, vous pouvez importer vos données depuis Excel, CSV, ou directement depuis Jira et Trello. Notre assistant d'import vous guide à chaque étape pour une migration sans douleur.",
  },
  {
    question: "Combien de membres d'équipe peuvent collaborer ?",
    answer:
      "Le plan Starter permet 1 utilisateur, le plan Pro jusqu'à 10 utilisateurs, et le plan Enterprise offre un nombre illimité d'utilisateurs. Tous les plans incluent la collaboration en temps réel.",
  },
];

export default function FAQ(): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="text-sm font-medium text-blue-700">
              ❓ FAQ
            </span>
          </div>
          <h2 className="section-heading">
            Questions{" "}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              fréquentes
            </span>
          </h2>
          <p className="section-subheading">
            Vous avez des questions ? Nous avons les réponses. Si vous ne
            trouvez pas ce que vous cherchez, contactez notre équipe.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq: FAQItem, index: number) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                className="w-full px-6 py-5 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <span className="flex-shrink-0">
                  <svg
                    className={`w-5 h-5 text-primary-600 transform transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-br from-gray-50 to-primary-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Vous ne trouvez pas votre réponse ?
          </h3>
          <p className="text-gray-600 mb-6">
            Notre équipe est là pour vous aider. Contactez-nous et nous vous
            répondrons rapidement.
          </p>
          <a
            href="mailto:support@roadmapgenius.io"
            className="btn-secondary inline-flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contactez le support
          </a>
        </div>
      </div>
    </section>
  );
}
