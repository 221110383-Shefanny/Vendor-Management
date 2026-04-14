import image_d05fbb624c197d8bc9d6b2071797cda6e0e2e7b5 from "figma:asset/d05fbb624c197d8bc9d6b2071797cda6e0e2e7b5.png";
import image_0ff3b9062a3eaa0f864846057f40408509a3b850 from "figma:asset/0ff3b9062a3eaa0f864846057f40408509a3b850.png";
import image_4a4eff644c520de5e1d8e7e3dae92b8335785810 from "figma:asset/4a4eff644c520de5e1d8e7e3dae92b8335785810.png";
import image_9ed2c3e317ac263ac109ce04ec9e74c46a2a9848 from "figma:asset/9ed2c3e317ac263ac109ce04ec9e74c46a2a9848.png";
import image_8bfd6bb6dab822f4a8d2cf3e2c092516d194ccf6 from "figma:asset/8bfd6bb6dab822f4a8d2cf3e2c092516d194ccf6.png";
import image_71509d755bbc0d484c3a9505ec89de41aed56bb1 from "figma:asset/71509d755bbc0d484c3a9505ec89de41aed56bb1.png";
import image_88be2c83f8d0b17f91914e27cf5689434e338614 from "figma:asset/88be2c83f8d0b17f91914e27cf5689434e338614.png";
import image_f3bf07e24479d1001d32d19d7d49fab60f586d44 from "figma:asset/f3bf07e24479d1001d32d19d7d49fab60f586d44.png";
import image_7c60fc5ac3ab92162c67853aef8bab999f3a3ee6 from "figma:asset/7c60fc5ac3ab92162c67853aef8bab999f3a3ee6.png";
import { useState } from "react";
import {
  MessageCircle,
  FileText,
  User,
  Bell,
  CreditCard,
} from "lucide-react";
import { InvoicePage } from "./InvoicePage";
import { DocumentIMI } from "./DocumentIMI";
import { PaymentPage } from "./PaymentPage";
import { AccountPage } from "./AccountPage";
import { MessageNotificationPage } from "./MessageNotificationPage";
import { Invoice, Payment } from "../App";
import kapalImage from "figma:asset/0b6ee484e3edd6804a9be03711a577ec55986d0d.png";

interface MainDashboardProps {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoiceStatus: (
    id: string,
    status: "waiting" | "approved" | "cancelled",
    additionalData?: Partial<Invoice>,
  ) => void;
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  activeView:
    | "dashboard"
    | "invoice"
    | "payment"
    | "account"
    | "message";
  setActiveView: (
    view:
      | "dashboard"
      | "invoice"
      | "payment"
      | "account"
      | "message",
  ) => void;
  vendorType: "local" | "overseas";
  setVendorType: (type: "local" | "overseas") => void;
}

export function MainDashboardIMI({
  invoices,
  addInvoice,
  updateInvoiceStatus,
  payments,
  setPayments,
  activeView,
  setActiveView,
  vendorType,
  setVendorType,
}: MainDashboardProps) {
  const waitingInvoices = invoices.filter(
    (inv) => inv.status === "waiting",
  );
  const [unreadNotifications] = useState(3);

  const labels = {
    local: {
      welcome: "Selamat Datang",
      submitDocument: "KIRIM DOKUMEN",
      paymentProgress: "PROGRES PEMBAYARAN",
      account: "AKUN",
      helpCenter: "PUSAT BANTUAN",
    },
    overseas: {
      welcome: "Welcome",
      submitDocument: "SUBMIT DOCUMENT",
      paymentProgress: "PAYMENT PROGRESS",
      account: "ACCOUNT",
      helpCenter: "HELP CENTER",
    },
  };

  const currentLabels =
    vendorType === "local" ? labels.local : labels.overseas;

  // If a view is selected, show that view
  if (activeView === "invoice") {
    return (
      <div>
        <DocumentIMI
          invoices={invoices}
          addInvoice={addInvoice}
          updateInvoiceStatus={updateInvoiceStatus}
          payments={payments}
          setPayments={setPayments}
          vendorType={vendorType}
        />
      </div>
    );
  }

  if (activeView === "payment") {
    return (
      <div>
        <PaymentPage
          payments={payments}
          vendorType={vendorType}
        />
      </div>
    );
  }

  if (activeView === "account") {
    return (
      <div>
        <AccountPage vendorType={vendorType} />
      </div>
    );
  }

  if (activeView === "message") {
    return (
      <div>
        <MessageNotificationPage vendorType={vendorType} />
      </div>
    );
  }

  // Dashboard view with 4 icons
  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0">
        <img
          src={image_d05fbb624c197d8bc9d6b2071797cda6e0e2e7b5}
          alt="Background"
          className="w-screen h-screen object-cover"
        />
      </div>

      {/* Headline */}
      <div
        className="flex-shrink-0 text-left pt-8 mt-[40] mb-[0px] relative z-10 w-fit"
        style={{ marginLeft: "200px" }}
      >
        {/* Headline */}
        <div className="text-left mb-12 md:mb-5 w-fit space-y-2">
          <h1 className="text-white text-xl tracking-wide leading-tight font-bold text-[50px]">
            PT INDO MULIA INDAH
          </h1>
          <h2 className="text-white text-xl tracking-wide leading-tight font-bold italic text-[20px] mb-[20px]">
            Invoice Management System
          </h2>
          <h2 className="text-white text-xl italic font-bold text-[30px]">
            {vendorType === "local"
              ? "Selamat Datang, PT Limpah Mas Indonesia"
              : "Welcome, PT Limpah Mas Indonesia"}
          </h2>
        </div>
      </div>

      {/* Cards */}
      <div
        className="flex-shrink-0 pb-8 w-full"
        style={{ marginLeft: "200px", marginTop: "0px" }}
      >
        <div className="flex flex-wrap justify-start">
          <div className="grid grid-cols-2 gap-6">
            {/* NEW INVOICE Card */}
            <button
              onClick={() => setActiveView("invoice")}
              className="backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-y-110 relative border-2 border-white w-55 h-55"
              style={{ borderColor: "#ffffff80" }}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <FileText
                  className="w-16 h-16 text-white flex-shrink-0"
                  strokeWidth={1.5}
                />
                <div className="text-center">
                  <h2 className="text-white text-xl mb-5 leading-tight">
                    {currentLabels.submitDocument}
                  </h2>
                </div>
              </div>
            </button>

            {/* PAYMENT PROGRESS Card */}
            <button
              onClick={() => setActiveView("payment")}
              className="backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-y-110 relative border-2 border-white w-55 h-55"
              style={{ borderColor: "#ffffff80" }}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <CreditCard
                  className="w-16 h-16 text-white flex-shrink-0"
                  strokeWidth={1.5}
                />
                <div className="text-center">
                  <h2 className="text-white text-xl mb-1 leading-tight">
                    {currentLabels.paymentProgress}
                  </h2>
                  <p className="text-white text-xs">
                    {vendorType === "local"
                      ? "Info & Status Pembayaran"
                      : "Payment Info & Status"}
                  </p>
                </div>
              </div>
            </button>

            {/* ACCOUNT Card */}
            <button
              onClick={() => setActiveView("account")}
              className="backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-y-110 origin-center overflow-visible relative border-2 border-white w-55 h-55"
              style={{ borderColor: "#ffffff80" }}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <User
                  className="w-16 h-16 text-white flex-shrink-0"
                  strokeWidth={1.5}
                />
                <div className="text-center">
                  <h2 className="text-white text-xl mb-1 leading-tight">
                    {currentLabels.account}
                  </h2>
                  <p className="text-white text-xs">
                    {vendorType === "local"
                      ? "Informasi Supplier"
                      : "Supplier Information"}
                  </p>
                </div>
              </div>
            </button>

            {/* MESSAGE & NOTIFICATION Card */}
            <button
              onClick={() => setActiveView("message")}
              className="backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-y-110 relative border-2 border-white w-55 h-55"
              style={{ borderColor: "#ffffff80" }}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="flex gap-2">
                  <MessageCircle
                    className="w-12 h-12 text-white flex-shrink-0"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-white text-xl mb-2 leading-tight">
                    {vendorType === "local"
                      ? "Pusat Bantuan"
                      : "Q & A"}
                  </h2>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}