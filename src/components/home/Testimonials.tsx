
export default function Testimonials() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-rentmate-primary tracking-wide uppercase">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trusted by agents nationwide
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Hear what real estate professionals are saying about RentMate
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-rentmate-secondary text-white flex items-center justify-center font-bold text-xl">
                SH
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Sarah Henderson
                </h3>
                <p className="text-sm text-gray-500">
                  Independent Real Estate Agent
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              "RentMate has completely transformed my rental application process. It's saved me countless hours of paperwork and follow-ups. My clients love the professional experience too!"
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-rentmate-primary text-white flex items-center justify-center font-bold text-xl">
                JD
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  James Davis
                </h3>
                <p className="text-sm text-gray-500">
                  Property Manager, Urban Homes
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              "We manage over 200 rental properties, and RentMate has streamlined our entire application process. The secure document handling gives us and our landlords peace of mind."
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-rentmate-accent text-white flex items-center justify-center font-bold text-xl">
                ML
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Maria Lopez
                </h3>
                <p className="text-sm text-gray-500">
                  Broker, Coastal Properties
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              "As a broker overseeing multiple agents, RentMate has given us consistency in our rental applications. The customization options allow each agent to maintain their personal brand."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
