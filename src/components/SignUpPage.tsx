import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { UserPlus, Eye, EyeOff } from "lucide-react";

interface SignUpPageProps {
  onBackToLogin: () => void;
  onGoToLogin: () => void;
  language?: "local" | "overseas";
}

export function SignUpPage({
  onBackToLogin,
  onGoToLogin,
  language = "local",
}: SignUpPageProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const labels = {
    local: {
      title: "Buat Akun Baru",
      description:
        "Isi informasi di bawah untuk membuat akun Anda",
      fullName: "Nama Lengkap",
      fullNamePlaceholder: "Masukkan nama lengkap Anda",
      email: "Email",
      emailPlaceholder: "Masukkan email Anda",
      phone: "Nomor Telepon",
      phonePlaceholder: "Masukkan nomor telepon Anda",
      password: "Kata Sandi",
      passwordPlaceholder: "Buat kata sandi Anda",
      confirmPassword: "Konfirmasi Kata Sandi",
      confirmPasswordPlaceholder: "Konfirmasi kata sandi Anda",
      createAccount: "Buat Akun",
      or: "ATAU",
      haveAccount: "Sudah punya akun? Masuk",
      autoFill: "Isi Otomatis (Sementara)",
      warning:
        "⚠️ Tombol ini bersifat sementara dan akan dihapus di masa depan.",
      backToLogin: "Kembali ke Login",
    },
    overseas: {
      title: "Create New Account",
      description:
        "Fill in the information below to create your account",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      email: "Email",
      emailPlaceholder: "Enter your email",
      phone: "Phone Number",
      phonePlaceholder: "Enter your phone number",
      password: "Password",
      passwordPlaceholder: "Create a password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      createAccount: "Create Account",
      or: "OR",
      haveAccount: "Already have an account? Login",
      autoFill: "Auto Fill (Temporary)",
      warning:
        "⚠️ This button is temporary and will be removed in the future.",
      backToLogin: "Back to Login",
    },
  };

  const currentLabels =
    language === "local" ? labels.local : labels.overseas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log("Sign up:", {
      fullName,
      email,
      phone,
      password,
    });
  };

  const handleAutoFill = () => {
    setFullName("John Doe");
    setEmail("john@example.com");
    setPhone("+62 811-1234-5678");
    setPassword("password123");
    setConfirmPassword("password123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6 shadow-xl">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <UserPlus className="w-12 h-12 text-gray-800" />
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
              <Label
                htmlFor="fullName"
                className="text-gray-700"
              >
                {currentLabels.fullName}
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder={currentLabels.fullNamePlaceholder}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-600 rounded-md transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                {currentLabels.email}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={currentLabels.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-600 rounded-md transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                {currentLabels.phone}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={currentLabels.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-600 rounded-md transition-colors"
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
                  className="h-12 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-600 rounded-md transition-colors pr-12"
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

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700"
              >
                {currentLabels.confirmPassword}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  placeholder={
                    currentLabels.confirmPasswordPlaceholder
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="h-12 bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-blue-600 rounded-md transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
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
              {currentLabels.createAccount}
            </Button>
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

          {/* Already have account */}
          <div className="text-center">
            <a
              href="#"
              className="text-gray-800 font-semibold hover:text-gray-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                onGoToLogin();
              }}
            >
              {currentLabels.haveAccount}
            </a>
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