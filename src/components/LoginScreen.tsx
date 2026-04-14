import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";
import logo from "figma:asset/e61e129cbfeff28995f6d22c9febf555660c6e8f.png";
import { ForgotPasswordPage } from "./ForgotPasswordPage";
import { SignUpPage } from "./SignUpPage";
import { MessageNotificationPage } from "./MessageNotificationPage";
import indonesiaFlagCircle from "figma:asset/04e2b2bfed2bda498d40e5ab6a28a718fbaa232c.png";
import ukFlagCircle from "figma:asset/fdecde467c69903ab34a8a4c3a156281b924587e.png";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [language, setLanguage] = useState<
    "local" | "overseas"
  >("local");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] =
    useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showNeedHelp, setShowNeedHelp] = useState(false);

  const labels = {
    local: {
      chooseLanguage: "Pilih Bahasa",
      phoneOrEmail: "Nomor Telepon atau Email",
      phoneOrEmailPlaceholder:
        "Masukkan nomor telepon atau email Anda",
      password: "Kata Sandi",
      passwordPlaceholder: "Masukkan kata sandi Anda",
      login: "MASUK",
      dontHaveAccount: "Belum punya akun?",
      signUp: "Daftar",
      forgotPassword: "Lupa Kata Sandi?",
      needHelp: "Butuh Bantuan?",
      footer: "Sistem Manajemen Invoice Waruna Group",
      autoFill: "Isi Otomatis (Sementara)",
      warning:
        "⚠️ Tombol ini bersifat sementara dan akan dihapus di masa depan.",
    },
    overseas: {
      chooseLanguage: "Choose Language",
      phoneOrEmail: "Phone Number or Email",
      phoneOrEmailPlaceholder:
        "Enter your phone number or email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      login: "LOGIN",
      dontHaveAccount: "Don't have an account?",
      signUp: "Sign Up",
      forgotPassword: "Forgot Password?",
      needHelp: "Need Help?",
      footer: "Waruna Group Invoice Management System",
      autoFill: "Auto Fill (Temporary)",
      warning:
        "⚠️ This button is temporary and will be removed in the future.",
    },
  };

  const currentLabels =
    language === "local" ? labels.local : labels.overseas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const handleAutoFill = () => {
    setPhoneOrEmail("user@example.com");
    setPassword("password123");
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordPage
        onBackToLogin={() => setShowForgotPassword(false)}
        language={language}
      />
    );
  }

  if (showSignUp) {
    return (
      <SignUpPage
        onBackToLogin={() => setShowSignUp(false)}
        onGoToLogin={() => setShowSignUp(false)}
        language={language}
      />
    );
  }

  if (showNeedHelp) {
    return (
      <MessageNotificationPage
        vendorType={language}
        onBack={() => setShowNeedHelp(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <img
                src={logo}
                alt="Waruna Group Logo"
                className="h-40 w-auto"
              />
            </div>
            <h1 className="text-xl text-gray-700 mt-1 italic">
              Invoice Management System
            </h1>

            {/* Language Selector */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">
                {currentLabels.chooseLanguage}
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setLanguage("local")}
                  className={`w-10 h-10 rounded-full transition-all flex justify-center items-center ${
                    language === "local"
                      ? "bg-blue-600 shadow-lg"
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
                  type="button"
                  onClick={() => setLanguage("overseas")}
                  className={`w-10 h-10 rounded-full transition-all flex justify-center items-center ${
                    language === "overseas"
                      ? "bg-blue-600 shadow-lg"
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
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="phoneOrEmail"
                className="text-gray-700"
              >
                {currentLabels.phoneOrEmail}
              </Label>
              <Input
                id="phoneOrEmail"
                type="text"
                placeholder={
                  currentLabels.phoneOrEmailPlaceholder
                }
                value={phoneOrEmail}
                onChange={(e) =>
                  setPhoneOrEmail(e.target.value)
                }
                className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-lg transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-gray-700"
              >
                {currentLabels.password}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    currentLabels.passwordPlaceholder
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full border-2 border-gray-200 focus:border-purple-500 rounded-lg transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              {currentLabels.login}
            </Button>
          </form>

          {/* Sign Up and Forgot Password Links */}
          <div className="text-center space-y-3">
            <p className="text-gray-600 text-sm">
              {currentLabels.dontHaveAccount}{" "}
              <a
                href="#"
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setShowSignUp(true);
                }}
              >
                {currentLabels.signUp}
              </a>
            </p>
            <p className="text-gray-600 text-sm">
              <a
                href="#"
                className="text-purple-600 hover:text-purple-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPassword(true);
                }}
              >
                {currentLabels.forgotPassword}
              </a>
            </p>
            <p className="text-gray-600 text-sm">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setShowNeedHelp(true);
                }}
              >
                {currentLabels.needHelp}
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
            <p>{currentLabels.footer}</p>
          </div>
        </div>
        {/* Auto Fill Button - Temporary */}
        <div className="space-y-2 mt-6">
          <Button
            type="button"
            onClick={handleAutoFill}
            variant="outline"
            className="w-full h-10 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          >
            {currentLabels.autoFill}
          </Button>
          <p className="text-xs text-orange-600 text-center">
            {currentLabels.warning}
          </p>
        </div>
      </div>
    </div>
  );
}