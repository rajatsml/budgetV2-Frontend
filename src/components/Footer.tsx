import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className=" bg-white/90 backdrop-blur-md">
      <div className="max-w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Capex Budget Portal
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Contact IT - rajat.kalotra@smlmahindra.com | +91 9056743658 -
              archna.kumari@smlmahindra.com | +91 9988987867
            </p>
          </div>
        </div>
        <div className="mt-6 border-t border-slate-700 pt-4 text-xs text-slate-500">
          © {new Date().getFullYear()} Capex Budget Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
