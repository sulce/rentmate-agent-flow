
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <div className="bg-rentmate-primary">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to streamline your</span>
          <span className="block">rental application process?</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-indigo-100">
          Join thousands of real estate professionals who are saving time and impressing clients with RentMate.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white text-rentmate-primary hover:bg-gray-100 hover:text-rentmate-primary"
              >
                Get started
              </Button>
            </Link>
          </div>
          <div className="ml-3 inline-flex">
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white/10"
              >
                Learn more
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
