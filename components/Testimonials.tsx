interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "RoadmapGenius a transformé notre façon de communiquer notre vision produit. Les stakeholders adorent les visualisations, et notre équipe est enfin alignée sur les priorités.",
    author: "Marie Dupont",
    role: "VP Produit",
    company: "TechStartup",
    avatar: "MD",
    rating: 5,
  },
  {
    quote:
      "Après avoir essayé des dizaines d'outils, RoadmapGenius est de loin le plus intuitif. J'ai créé ma première roadmap en 10 minutes, et elle était magnifique !",
    author: "Thomas Martin",
    role: "Product Manager",
    company: "InnovateCo",
    avatar: "TM",
    rating: 5,
  },
  {
    quote:
      "L'outil parfait pour les startups. Le plan gratuit est généreux, et quand on a eu besoin de plus, le Pro valait chaque euro. Support client exceptionnel !",
    author: "Sophie Bernard",
    role: "CEO & Founder",
    company: "LaunchPad",
    avatar: "SB",
    rating: 5,
  },
  {
    quote:
      "Les intégrations avec Jira et Slack nous font gagner des heures chaque semaine. Nos roadmaps sont toujours à jour automatiquement.",
    author: "Pierre Leroy",
    role: "Head of Engineering",
    company: "DevStudio",
    avatar: "PL",
    rating: 5,
  },
  {
    quote:
      "Enfin un outil de roadmap qui comprend que la beauté compte. Nos présentations au board sont passées de 'correct' à 'impressionnant'.",
    author: "Julie Moreau",
    role: "Chief Product Officer",
    company: "GrowthHub",
    avatar: "JM",
    rating: 5,
  },
  {
    quote:
      "La collaboration en temps réel est un game-changer. Mon équipe distribuée travaille ensemble comme si nous étions dans la même pièce.",
    author: "Antoine Dubois",
    role: "Remote Team Lead",
    company: "DistribTech",
    avatar: "AD",
    rating: 5,
  },
];

export default function Testimonials(): React.ReactElement {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-50 border border-yellow-100 mb-6">
            <span className="text-sm font-medium text-yellow-700">
              ⭐ Témoignages
            </span>
          </div>
          <h2 className="section-heading">
            Ils adorent{" "}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              RoadmapGenius
            </span>
          </h2>
          <p className="section-subheading">
            Découvrez pourquoi des milliers de professionnels du produit font
            confiance à RoadmapGenius pour créer leurs roadmaps.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial: Testimonial, index: number) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i: number) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role} @ {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10,000+", label: "Utilisateurs actifs" },
            { value: "50,000+", label: "Roadmaps créées" },
            { value: "99.9%", label: "Uptime garanti" },
            { value: "4.9/5", label: "Note moyenne" },
          ].map(
            (stat: { value: string; label: string }, index: number) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
