
import { Building, ClipboardCheck, Lock, UserCheck } from "lucide-react";

const features = [
  {
    name: "Customizable Agent Portal",
    description:
      "Personalize your portal with your logo, brand colors, and bio to maintain professional consistency.",
    icon: Building,
  },
  {
    name: "Structured Application Process",
    description:
      "Guide tenants through a clear three-step application process, ensuring all necessary information is collected.",
    icon: ClipboardCheck,
  },
  {
    name: "Secure Document Handling",
    description:
      "Securely collect and store tenant documents, ensuring privacy and compliance with data protection regulations.",
    icon: Lock,
  },
  {
    name: "Seamless Forwarding",
    description:
      "Easily forward completed applications to landlords or main agents with secure, unique viewing links.",
    icon: UserCheck,
  },
];

export default function Features() {
  return (
    <div className="py-12 bg-rentmate-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-rentmate-primary font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to manage rental applications
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            RentMate provides everything you need to streamline the rental
            application process for you and your prospective tenants.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-rentmate-primary text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
