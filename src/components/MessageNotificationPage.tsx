import { useState, useEffect } from "react";
import { ChevronDown, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "support";
  timestamp: string;
}

interface BilingualFAQ {
  id: number;
  local: {
    question: string;
    answer: string;
  };
  overseas: {
    question: string;
    answer: string;
  };
}

const faqDataBilingual: BilingualFAQ[] = [
  {
    id: 1,
    local: {
      question: "Kenapa data profile saya kosong?",
      answer:
        "Untuk supplier baru, data sedang dalam proses review. Setelah disetujui, data akan otomatis muncul di bagian akun. Proses ini dapat memakan waktu hingga 2 hari kerja.",
    },
    overseas: {
      question: "Why is my profile data empty?",
      answer:
        "For new suppliers, your data is currently being reviewed by our team. Once approved, your data will automatically appear in the account section. This process may take up to 2 business days.",
    },
  },
  {
    id: 2,
    local: {
      question:
        "Bagaimana cara mengubah informasi profil supplier saya?",
      answer:
        "Anda dapat mengubah informasi profil dengan masuk ke menu 'Akun' dan klik tombol 'Ubah Informasi Supplier'. Setelah dilakukan perubahan, mohon tunggu hingga proses review selesai. Data akan otomatis terupdate di bagian akun.",
    },
    overseas: {
      question:
        "How do I change / update my supplier profile information?",
      answer:
        "You can change your profile information by going to the 'Account' menu and clicking the 'Edit Supplier Information' button. After making changes, please wait for the review process to complete. Your data will automatically be updated in the account section.",
    },
  },
  {
    id: 3,
    local: {
      question:
        "Berapa lama waktu proses verifikasi perubahan data supplier?",
      answer:
        "Proses verifikasi perubahan data biasanya memakan waktu 3-5 hari kerja. Tim kami akan meninjau setiap perubahan yang Anda lakukan. Data pada akun akan diperbarui secara otomatis setelah perubahan disetujui.",
    },
    overseas: {
      question:
        "How long does the supplier data verification process take?",
      answer:
        "The data verification process usually takes approximately 3-5 business days. Our team will review any changes that you have made. Your data will automatically be updated after the changes have been approved.",
    },
  },
  {
    id: 4,
    local: {
      question: "Kapan invoice saya akan diproses?",
      answer:
        "Invoice akan diproses setelah diterima oleh tim Account Payable kami. Anda dapat melihat tanggal penerimaan invoice oleh tim kami dan melacak progres di bagian menu 'Progres Pembayaran'",
    },

    overseas: {
      question: "When will my invoice be processed?",
      answer:
        "We will start processing your invoice once it has been received by our Account Payable team. You can see when we have received your invoice and track the progress in the 'Payment Progress' menu.",
    },
  },
  {
    id: 5,
    local: {
      question: "Kapan pembayaran akan dilakukan?",
      answer:
        "Setelah semua dokumen yang diperlukan diterima oleh tim Account Payable kami, proses verifikasi akan dimulai dan pembayaran akan dilakukan sesuai dengan jangka waktu pembayaran yang disepakati.",
    },
    overseas: {
      question: "When will payment be made?",
      answer:
        "After all the necessary documents have been received by our Account Payables team, verification process will start and payment will be made according to the agreed payment terms.",
    },
  },
];

export function MessageNotificationPage({
  vendorType = "local",
  onBack,
}: {
  vendorType?: "local" | "overseas";
  onBack?: () => void;
}) {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const labels = {
    local: {
      helpCenter: "Pusat Bantuan",
      faq: "Pertanyaan yang Sering Diajukan",
      needHelp: "Masih membutuhkan bantuan?",
      needHelpDesc:
        "Jika Anda tidak menemukan jawaban yang Anda cari, silakan hubungi tim customer support kami atau gunakan fitur chat di bawah ini.",
      chat: "💬 Chat dengan Customer Service",
      chatPlaceholder: "Ketik pesan Anda...",
      chatSend: "Kirim",
      support24: "Kami siap membantu Anda 24/7",
      contactUs: "Hubungi Kami Langsung",
      emailSupport: "📧 Email Support",
      emailResponse: "Respons dalam 24 jam kerja",
      phoneSupport: "📞 Phone Support",
      workingHours: "Senin-Jumat: 08:00 - 17:00 WIB",
      initialGreeting: "Halo! Ada yang bisa kami bantu?",
      supportResponse:
        "Terima kasih atas pertanyaannya. Tim kami sedang memproses dan akan merespons segera.",
    },
    overseas: {
      helpCenter: "Help Center",
      faq: "Frequently Asked Questions",
      needHelp: "Still need help?",
      needHelpDesc:
        "If you cannot find the answer you are looking for, please contact our customer support team or use the chat feature below.",
      chat: "💬 Chat with Customer Service",
      chatPlaceholder: "Type your message...",
      chatSend: "Send",
      support24: "We are ready to help you 24/7",
      contactUs: "Contact Us Directly",
      emailSupport: "📧 Email Support",
      emailResponse: "Response within 24 business hours",
      phoneSupport: "📞 Phone Support",
      workingHours: "Mon-Fri: 08:00 - 17:00 WIB",
      initialGreeting: "Hello! How can we help you?",
      supportResponse:
        "Thank you for your question. Our team is processing and will respond shortly.",
    },
  };

  const currentLabels =
    vendorType === "local" ? labels.local : labels.overseas;

  // Select bilingual FAQ data based on vendor type
  const faqData = faqDataBilingual.map((faq) => ({
    id: faq.id,
    question:
      vendorType === "local"
        ? faq.local.question
        : faq.overseas.question,
    answer:
      vendorType === "local"
        ? faq.local.answer
        : faq.overseas.answer,
  }));

  const [chatMessages, setChatMessages] = useState<
    ChatMessage[]
  >([
    {
      id: 1,
      text:
        vendorType === "local"
          ? labels.local.initialGreeting
          : labels.overseas.initialGreeting,
      sender: "support",
      timestamp: "10:30",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Update initial greeting when vendorType changes
  useEffect(() => {
    setChatMessages([
      {
        id: 1,
        text:
          vendorType === "local"
            ? labels.local.initialGreeting
            : labels.overseas.initialGreeting,
        sender: "support",
        timestamp: "10:30",
      },
    ]);
  }, [vendorType]);

  const toggleExpand = (id: number) => {
    setExpandedIds(
      expandedIds.includes(id)
        ? expandedIds.filter((expandedId) => expandedId !== id)
        : [...expandedIds, id],
    );
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      text: chatInput,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");

    // Simulate support response
    setTimeout(() => {
      const supportResponse: ChatMessage = {
        id: chatMessages.length + 2,
        text:
          vendorType === "local"
            ? labels.local.supportResponse
            : labels.overseas.supportResponse,
        sender: "support",
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, supportResponse]);
    }, 1000);
  };

  return (
    <div className="w-[1200px] mx-auto p-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-100 mt-20">
        {onBack && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 font-semibold rounded-lg transition-all"
            >
              ←{" "}
              {vendorType === "local"
                ? "Kembali ke Login"
                : "Back to Login"}
            </button>
          </div>
        )}
        <h1 className="text-3xl mb-8 text-blue-600 text-center">
          {currentLabels.helpCenter}
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {currentLabels.faq}
        </h2>

        <div className="space-y-4">
          {faqData.map((faq) => (
            <Card
              key={faq.id}
              className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader
                className="cursor-pointer py-3 px-6"
                onClick={() => toggleExpand(faq.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-lg text-gray-700 flex-1">
                    {faq.question}
                  </CardTitle>
                  <ChevronDown
                    className={`w-6 h-6 text-blue-400 flex-shrink-0 transition-transform duration-300 ${
                      expandedIds.includes(faq.id)
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </div>
              </CardHeader>

              {expandedIds.includes(faq.id) && (
                <CardContent className="px-6 pb-6 pt-0">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            {currentLabels.needHelp}
          </h3>
          <p className="text-blue-600 text-sm mb-6">
            {currentLabels.needHelpDesc}
          </p>

          {/* Chat Section */}
          <Card className="border border-blue-200 bg-white shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="text-base">
                {currentLabels.chat}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {/* Chat Messages */}
              <div className="bg-gray-50 rounded-lg p-4 min-h-64 max-h-64 overflow-y-auto mb-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm break-words">
                        {msg.text}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-600"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  placeholder={currentLabels.chatPlaceholder}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 h-10 border border-gray-300 rounded-lg"
                />
                <Button
                  onClick={handleSendMessage}
                  className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {currentLabels.chatSend}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support Section */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
            <h3 className="text-lg font-semibold text-blue-700 mb-6">
              {currentLabels.contactUs}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Support */}
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">
                  {currentLabels.emailSupport}
                </p>
                <p className="text-lg font-semibold text-blue-600 mb-2">
                  support@warunagroup.com
                </p>
                <p className="text-xs text-gray-500">
                  {currentLabels.emailResponse}
                </p>
              </div>

              {/* Phone Support */}
              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">
                  {currentLabels.phoneSupport}
                </p>
                <p className="text-lg font-semibold text-blue-600 mb-2">
                  +62 21 1234 5678
                </p>
                <p className="text-xs text-gray-500">
                  {currentLabels.workingHours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}