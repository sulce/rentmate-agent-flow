
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-rentmate-primary font-semibold tracking-wide uppercase">
              About Us
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simplifying rental applications for everyone
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              RentMate was created to streamline the rental application process
              for real estate agents, landlords, and tenants.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-600 mb-4">
                  At RentMate, we believe that the rental application process
                  should be simple, secure, and efficient for everyone involved.
                </p>
                <p className="text-gray-600 mb-4">
                  Our mission is to create a platform that empowers real estate
                  professionals to collect complete, professional-looking rental
                  applications and share them securely with landlords or main
                  agents.
                </p>
                <p className="text-gray-600">
                  By streamlining this process, we help agents save time,
                  improve their professional image, and provide a better
                  experience for tenants.
                </p>
              </div>
              <div>
                <img
                  className="rounded-lg shadow-lg"
                  src="https://images.unsplash.com/photo-1553335602-0f25c9f4c058?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80"
                  alt="Team working together"
                />
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 lg:text-center">
                Why Choose RentMate?
              </h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="bg-rentmate-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-rentmate-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Efficiency
                  </h4>
                  <p className="text-gray-600">
                    Streamline your workflow with our structured application
                    process, saving you valuable time and reducing paperwork.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="bg-rentmate-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-rentmate-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Security
                  </h4>
                  <p className="text-gray-600">
                    Protect sensitive tenant information with our secure document
                    handling and unique viewing links for landlords.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="bg-rentmate-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-rentmate-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      ></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Customization
                  </h4>
                  <p className="text-gray-600">
                    Personalize your portal with your branding to maintain a
                    consistent professional image with clients.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Ready to get started?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of real estate professionals who are using
                RentMate to streamline their rental application process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg">Create Your Account</Button>
                </Link>
                <Link to="/apply">
                  <Button size="lg" variant="outline">
                    Try Demo Application
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
