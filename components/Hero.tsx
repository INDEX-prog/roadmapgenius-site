import Link from "next/link";

export default function Hero(): React.ReactElement {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200 rounded-full filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-200 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-8">
            <span className="flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-sm font-medium text-primary-700">
              Nouveau : Templates de roadmap IA disponibles 🚀
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Créez des roadmaps produit{" "}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              époustouflantes
            </span>{" "}
            qui inspirent
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Le seul outil dont vous avez besoin pour créer des roadmaps produit
            magnifiques. Impressionnez vos stakeholders et alignez vos équipes
            avec des visualisations qui captivent.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="#signup" className="btn-primary w-full sm:w-auto">
              Commencer gratuitement
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link href="#how-it-works" className="btn-secondary w-full sm:w-auto">
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
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Voir la démo
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center">
            <div className="flex -space-x-3 mb-3">
              {[1, 2, 3, 4, 5].map((i: number) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-sm font-semibold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i: number) => (
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
              <span className="text-gray-600 text-sm">
                <strong className="text-gray-900">4.9/5</strong> basé sur{" "}
                <strong className="text-gray-900">2,000+</strong> avis
              </span>
            </div>
          </div>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Browser Chrome */}
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-md px-4 py-1.5 text-sm text-gray-500 max-w-md mx-auto">
                    app.roadmapgenius.io/dashboard
                  </div>
                </div>
              </div>
              {/* Dashboard Content */}
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-12 gap-4">
                  {/* Sidebar */}
                  <div className="col-span-3 bg-white rounded-lg p-4 shadow-sm">
                    <div className="space-y-3">
                      <div className="h-8 bg-primary-100 rounded-md" />
                      <div className="h-6 bg-gray-100 rounded w-3/4" />
                      <div className="h-6 bg-gray-100 rounded w-2/3" />
                      <div className="h-6 bg-gray-100 rounded w-4/5" />
                      <div className="h-6 bg-primary-50 rounded w-full" />
                    </div>
                  </div>
                  {/* Main Content */}
                  <div className="col-span-9 space-y-4">
                    {/* Timeline Header */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-6 bg-gray-200 rounded w-48" />
                        <div className="flex gap-2">
                          <div className="h-8 w-20 bg-primary-100 rounded" />
                          <div className="h-8 w-20 bg-gray-100 rounded" />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        {["Q1", "Q2", "Q3", "Q4"].map((q: string) => (
                          <div key={q} className="flex-1 text-center">
                            <div className="text-xs font-medium text-gray-500 mb-2">
                              {q} 2024
                            </div>
                            <div className="h-1 bg-gray-200 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Roadmap Items */}
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                          <div className="h-6 bg-green-100 rounded-full w-3/4" />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
                          <div className="h-6 bg-blue-100 rounded-full w-1/2" />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-purple-400" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-36 mb-2" />
                          <div className="h-6 bg-purple-100 rounded-full w-1/4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
