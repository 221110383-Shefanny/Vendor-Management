import logo from "figma:asset/e61e129cbfeff28995f6d22c9febf555660c6e8f.png";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Building2, ChevronRight } from "lucide-react";

interface CompanySelectionPageProps {
  onSelectCompany: (company: "waruna" | "indo") => void;
}

export function CompanySelectionPage({
  onSelectCompany,
}: CompanySelectionPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-gray-900 mb-2">
              Pilih Perusahaan
            </h1>
            <p className="text-gray-500">Select Your Company</p>
          </div>

          {/* Company Selection Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onSelectCompany("waruna")}
              className="w-full flex items-center justify-between p-5 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h2 className="text-gray-900 group-hover:text-blue-600 transition-colors">
                    Waruna Group
                  </h2>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>

            <button
              onClick={() => onSelectCompany("indo")}
              className="w-full flex items-center justify-between p-5 bg-white rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h2 className="text-gray-900 group-hover:text-green-600 transition-colors">
                    PT Indo Mulia Indah
                  </h2>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-400">
              Invoice Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}