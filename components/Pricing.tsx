"use client";

import { useState } from "react";
import Link from "next/link";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PricingFeature[];
  highlighted: boolean;
  buttonText: string;
  badge?: string;
}

const plans: PricingPlan[] = [
  {
    name: "Starter",
    description: "Parfait pour les solopreneurs et les petits projets",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: "3 roadmaps", included: true },
      { text: "Vue timeline basique", included: true },
      { text: "Export PDF", included: true },
      { text: "1 utilisateur", included: true },
      { text: "Templates basiques", included: true },
      { text: "Collaboration temps réel", included: false },
      { text: "Intégrations", included: false },
      { text: "Support prioritaire", included: false },
    ],
    highlighted: false,
    buttonText: "Commencer gratuitement",
  },
  {
    name: "Pro",
    description: "Pour les équipes produit en croissance",
    monthlyPrice: 29,
    yearlyPrice: 24,
    features: [
      { text: "Roadmaps illimitées", included: true },
      { text: "Toutes les vues (Timeline, Gantt, Kanban)", included: true },
      { text: "Export PDF, PNG, SVG", included: true },
      { text: "Jusqu'à 10 utilisateurs", included: true },
      { text: "Tous les templates", included: true },
      { text: "Collaboration temps réel", included: true },
      { text: "Intégrations (Jira, Notion, Slack)", included: true },
      { text: "Support prioritaire", included: false },
    ],
    highlighted: true,
    buttonText: "Essayer 14 jours gratuit",
    badge: "Populaire",
  },
  {
    name: "Enterprise",
    description: "Pour les grandes organisations",
    monthlyPrice: 79,
    yearlyPrice: 66,
    features: [
      { text: "Tout du plan Pro", included: true },
      { text: "Utilisateurs illimités", included: true },
      { text: "SSO & SAML", included: true },
      { text: "API avancée", included: true },
      { text: "Audit logs", included: true },
      { text: "SLA garanti", included: true },
      { text: "Manager de compte dédié", included: true },
      { text: "Support prioritaire 24/7", included: true },
    ],
    highlighted: false,
    buttonText: "Contacter les ventes",
  },
];

export default function Pricing(): React.ReactElement {
  const [isYearly, setIsYearly] = useState<boolean>(true);

  return (
    <section id="pricing" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 border border-green-100 mb-6">
            <span className="text-sm font-medium text-green-700">
              💰 Tarifs transparents
            </span>
          </div>
          <h2 className="section-heading">
            Un plan pour chaque{" "}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ambition
            </span>
          </h2>
          <p className="section-subheading">
            Commencez gratuitement, évoluez selon vos besoins. Pas de surprise,
            pas de frais cachés.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span
              className={`text-sm font-medium ${
                !isYearly ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Mensuel
            </span>
            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? "bg-primary-600" : "bg-gray-300"
              }`}
              aria-label="Toggle billing period"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                isYearly ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Annuel
            </span>
            {isYearly && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                -17% économisé
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan: PricingPlan, index: number) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-primary-600 to-secondary-600 text-white shadow-2xl scale-105 z-10"
                  : "bg-white border border-gray-200 shadow-lg"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-yellow-400 text-yellow-900">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${
                    plan.highlighted ? "text-primary-100" : "text-gray-500"
                  }`}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-6">
                  <span
                    className={`text-5xl font-bold ${
                      plan.highlighted ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}€
                  </span>
                  <span
                    className={`text-sm ${
                      plan.highlighted ? "text-primary-100" : "text-gray-500"
                    }`}
                  >
                    /mois
                  </span>
                </div>
                {isYearly && plan.monthlyPrice > 0 && (
                  <p
                    className={`text-xs mt-1 ${
                      plan.highlighted ? "text-primary-200" : "text-gray-400"
                    }`}
                  >
                    Facturé annuellement
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map(
                  (feature: PricingFeature, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.included ? (
                        <svg
                          className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                            plan.highlighted ? "text-green-300" : "text-green-500"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                            plan.highlighted ? "text-primary-300" : "text-gray-300"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                      <span
                        className={`text-sm ${
                          plan.highlighted
                            ? feature.included
                              ? "text-white"
                              : "text-primary-200"
                            : feature.included
                            ? "text-gray-700"
                            : "text-gray-400"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  )
                )}
              </ul>

              {/* CTA Button */}
              <Link
                href="#signup"
                className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  plan.highlighted
                    ? "bg-white text-primary-600 hover:bg-gray-100"
                    : "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700"
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Rejoint par plus de 10,000+ entreprises
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {["TechCorp", "StartupXYZ", "InnovateCo", "FutureTech", "DigitalPro"].map(
              (company: string) => (
                <div
                  key={company}
                  className="text-xl font-bold text-gray-400 grayscale"
                >
                  {company}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
