import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Lock } from "lucide-react";
import { MessageNotificationPage } from "./MessageNotificationPage";
import { SignUpPage } from "./SignUpPage";

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
  language?: "local" | "overseas";
}

export function ForgotPasswordPage({
  onBackToLogin,
  language = "local",
}: ForgotPasswordPageProps) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const labels = {
    local: {
      title: "Kesulitan Masuk?",
      description:
        "Masukkan email, nomor telepon, atau nama pengguna Anda dan kami akan mengirimkan link untuk kembali ke akun Anda.",
      placeholder: "Email atau Nomor Telepon",
      sendLink: "Kirim Link Login",
      cantReset: "Tidak bisa reset kata sandi?",
      or: "ATAU",
      createNew: "Buat akun baru",
      backToLogin: "Kembali ke Login",
    },
    overseas: {
      title: "Trouble logging in?",
      description:
        "Enter your email, phone, or username and we'll send you a link to get back into your account.",
      placeholder: "Email or Phone",
      sendLink: "Send login link",
      cantReset: "Can't reset your password?",
      or: "OR",
      createNew: "Create new account",
      backToLogin: "Back to Login",
    },
  };

  const currentLabels =
    language === "local" ? labels.local : labels.overseas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log("Send login link to:", emailOrPhone);
  };

  const handleGoToLogin = () => {
    setShowSignUp(false);
    onBackToLogin();
  };

  if (showHelp) {
    return (
      <MessageNotificationPage
        vendorType={language}
        onBack={() => setShowHelp(false)}
      />
    );
  }

  if (showSignUp) {
    return (
      <SignUpPage
        onBackToLogin={() => setShowSignUp(false)}
        onGoToLogin={handleGoToLogin}
        language={language}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6 shadow-xl">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <Lock className="w-12 h-12 text-gray-800" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentLabels.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {currentLabels.description}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="emailOrPhone"
                type="text"
                placeholder={currentLabels.placeholder}
                value={emailOrPhone}
                onChange={(e) =>
                  setEmailOrPhone(e.target.value)
                }
                className="h-12 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-600 rounded-md transition-colors"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              {currentLabels.sendLink}
            </Button>

            <div className="text-center">
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setShowHelp(true);
                }}
              >
                {currentLabels.cantReset}
              </a>
            </div>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-600">
                {currentLabels.or}
              </span>
            </div>
          </div>

          {/* Create New Account */}
          <div className="text-center">
            <a
              href="#"
              className="text-gray-800 font-semibold hover:text-gray-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setShowSignUp(true);
              }}
            >
              {currentLabels.createNew}
            </a>
          </div>
        </div>

        {/* Back to Login */}
        <button
          onClick={onBackToLogin}
          className="w-full mt-4 bg-white hover:bg-gray-50 text-gray-800 py-3 rounded-lg font-semibold transition-colors border border-gray-300 shadow-md"
        >
          {currentLabels.backToLogin}
        </button>
      </div>
    </div>
  );
}