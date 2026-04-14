import { useState, useEffect } from "react";
import { FileText, CreditCard, BarChart3 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { InvoicePageIMI } from "./InvoicePageIMI";
import { Invoice, Payment } from "../App";

interface DocumentIMIProps {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoiceStatus: (
    id: string,
    status: "waiting" | "approved" | "cancelled",
    additionalData?: Partial<Invoice>,
  ) => void;
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  vendorType?: "local" | "overseas";
  setActiveView?: (
    view:
      | "dashboard"
      | "invoice"
      | "payment"
      | "account"
      | "message",
  ) => void;
  initialTab?: "menu" | "submission" | "creditNote" | "soa"; // 👈 tambahan
  selectedPO?: string; // 👈 tambahan untuk PO dari notifikasi
  setActivePaymentTab?: (
    tab: "submission" | "creditNote" | "soa",
  ) => void;
}

export function DocumentIMI({
  invoices,
  addInvoice,
  updateInvoiceStatus,
  payments,
  setPayments,
  vendorType = "overseas",
  setActiveView,
  setActivePaymentTab,
  initialTab = "menu", // default tetap menu
  selectedPO = "",
}: DocumentIMIProps) {
  const [activeTab, setActiveTab] = useState<
    "menu" | "submission" | "creditNote" | "soa" | undefined
  >(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const labels = {
    local: {
      title: "Kirim Dokumen",
      backToMenu: "Kembali ke Menu",
      invoice: "Invoice",
      invoiceDesc: "Pengajuan Invoice",
      creditNote: "Credit Note",
      creditNoteDesc: "Kredit Catatan",
      soa: "SOA",
      soaDesc: "Laporan Akun",
    },
    overseas: {
      title: "Submit Document",
      backToMenu: "Back to Menu",
      invoice: "Invoice",
      invoiceDesc: "Invoice Submission",
      creditNote: "Credit Note",
      creditNoteDesc: "Credit Notes",
      soa: "SOA",
      soaDesc: "Statement of Account",
    },
  };

  const currentLabels =
    vendorType === "local" ? labels.local : labels.overseas;

  // Jika tab selain menu dipilih, render InvoicePageIMI
  if (activeTab !== "menu") {
    return (
      <div>
        <InvoicePageIMI
          invoices={invoices}
          addInvoice={addInvoice}
          updateInvoiceStatus={updateInvoiceStatus}
          payments={payments}
          setPayments={setPayments}
          vendorType={vendorType}
          activeInvoiceTab={
            activeTab as
              | "submission"
              | "creditNote"
              | "soa"
              | undefined
          }
          setActiveInvoiceTab={(tab) => setActiveTab(tab)}
          setActiveView={setActiveView}
          setActivePaymentTab={setActivePaymentTab}
          selectedPO={selectedPO}
        />
      </div>
    );
  }

  // Tampilan menu dengan 3 kartu
  return (
    <div className="bg-gray-50 pb-8">
      <div className="w-full h-fit flex justify-center items-center px-0 py-[218px] mx-0 my-[-8px]">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-100 scale-100 origin-top">
          <h1 className="text-3xl mb-12 text-blue-600 text-center">
            {currentLabels.title}
          </h1>

          {/* Grid 3 kartu */}
          <div className="flex items-center justify-center mb-8">
            <div className="grid grid-cols-3 gap-8">
              {/* Invoice Card */}
              <button
                onClick={() => setActiveTab("submission")}
                className="transform transition-all hover:scale-105 focus:outline-none"
              >
                <Card className="border-2 border-blue-200 hover:border-blue-400 shadow-lg hover:shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-blue-500 rounded-full">
                        <FileText className="w-12 h-12 text-white" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-blue-600 mb-2">
                          {currentLabels.invoice}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {currentLabels.invoiceDesc}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>

              {/* Credit Note Card */}
              <button
                onClick={() => setActiveTab("creditNote")}
                className="transform transition-all hover:scale-105 focus:outline-none"
              >
                <Card className="border-2 border-purple-200 hover:border-purple-400 shadow-lg hover:shadow-xl bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-purple-500 rounded-full">
                        <CreditCard className="w-12 h-12 text-white" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-purple-600 mb-2">
                          {currentLabels.creditNote}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {currentLabels.creditNoteDesc}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>

              {/* SOA Card */}
              <button
                onClick={() => setActiveTab("soa")}
                className="transform transition-all hover:scale-105 focus:outline-none"
              >
                <Card className="border-2 border-green-200 hover:border-green-400 shadow-lg hover:shadow-xl bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-green-500 rounded-full">
                        <BarChart3 className="w-12 h-12 text-white" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-green-600 mb-2">
                          {currentLabels.soa}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {currentLabels.soaDesc}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}