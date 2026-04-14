import { ArrowLeft, LogOut } from "lucide-react";
import warunaLogoBlack from "figma:asset/8611b96b0d916e9ffd33add8860055122ad0e308.png";
import warunaLogoWhite from "figma:asset/6dc7081da725339d8d9ca591bf98c29c5292e2be.png";
import warunaColour from "figma:asset/ded35254a2092f27c00f83bf60f3227afc0ef082.png";
import LogoIMIWhite from "figma:asset/44f0e2d307488884b49994dd88d631520e042d83.png";
import LogoIMI from "figma:asset/44f0e2d307488884b49994dd88d631520e042d83.png";

import indonesiaFlag from "figma:asset/5f97d8e12658fd08d9d04cd9b93f0f14adf6db00.png";
import ukFlag from "figma:asset/ab0728dc55fb6e8f8d5296ed6c76e8aee1c2df43.png";
import indonesiaFlagCircle from "figma:asset/04e2b2bfed2bda498d40e5ab6a28a718fbaa232c.png";
import ukFlagCircle from "figma:asset/fdecde467c69903ab34a8a4c3a156281b924587e.png";

export function Navigation({
  isMainDashboard = false,
  onBack,
  onLogout,
  hidden = false,
  vendorType = "local",
  onVendorTypeChange,
}: {
  isMainDashboard?: boolean;
  onBack?: () => void;
  onLogout?: () => void;
  hidden?: boolean;
  vendorType?: "local" | "overseas";
  onVendorTypeChange?: (type: "local" | "overseas") => void;
}) {
  const renderBackButton = () => {
    if (isMainDashboard) return null;
    return (
      <button
        onClick={() =>
          onBack ? onBack() : window.history.back()
        }
        className="flex items-center gap-2 text-black hover:text-gray-700 transition"
      >
        <ArrowLeft className="w-10 h-10" />
      </button>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[100px] z-50 transition-transform duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex items-center justify-between h-full px-7 relative z-10">
        {/* Left side: Back button + Logo */}
        <div className="flex items-center gap-6">
          {/* Wrapper back button dengan lebar tetap */}
          <div className="w-10 flex justify-center">
            {renderBackButton()}
          </div>

          {/* Logo selalu di posisi tetap */}
          <img
            src={
              isMainDashboard ? warunaLogoWhite : warunaColour
            }
            alt="Waruna Logo"
            className="h-12"
          />
        </div>

        {/* Right side: Account icon */}
        <div className="ml-auto flex items-center gap-4">
          {/* Vendor Type Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => onVendorTypeChange?.("local")}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
                vendorType === "local"
                  ? "bg-blue-500"
                  : isMainDashboard
                    ? "bg-white/20 hover:bg-white/30"
                    : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <img
                src={indonesiaFlagCircle}
                alt="Indonesia Flag"
                className="w-6 h-6"
              />
            </button>
            <button
              onClick={() => onVendorTypeChange?.("overseas")}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
                vendorType === "overseas"
                  ? "bg-blue-500"
                  : isMainDashboard
                    ? "bg-white/20 hover:bg-white/30"
                    : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <img
                src={ukFlagCircle}
                alt="UK Flag"
                className="w-6 h-6"
              />
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (onLogout) onLogout();
            }}
            className="flex items-center gap-3 group"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition shadow-lg flex-shrink-0 ${
                isMainDashboard
                  ? "bg-white/20 text-white group-hover:bg-blue-500/30"
                  : "bg-white/20 text-black group-hover:bg-gray-200/30"
              }`}
            >
              <LogOut
                className="w-6 h-6 font-bold transition-all"
                strokeWidth={2}
              />
            </div>
            <span
              className={`text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 duration-300 transition-opacity ${
                isMainDashboard ? "text-white" : "text-black"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}