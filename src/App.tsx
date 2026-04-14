import { useState, useEffect, useRef } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { LoginScreenIMI } from "./components/LoginScreenIMI";
import { CompanySelectionPage } from "./components/CompanySelectionPage";
import { Navigation } from "./components/Navigation";
import { NavigationIMI } from "./components/NavigationIMI";
import { MainDashboard } from "./components/MainDashboard";
import { MainDashboardIMI } from "./components/MainDashboardIMI";
import { InvoicePage } from "./components/InvoicePage";
import { InvoicePageIMI } from "./components/InvoicePageIMI";
import { DocumentIMI } from "./components/DocumentIMI";

import { PaymentPage } from "./components/PaymentPage";
import { PaymentPageIMI } from "./components/PaymentPageIMI";
import { AccountPage } from "./components/AccountPage";
import { AccountEditPage } from "./components/AccountEditPage";
import { AccountPageIMI } from "./components/AccountPageIMI";
import { AccountEditPageIMI } from "./components/AccountEditPageIMI";
import { MessageNotificationPage } from "./components/MessageNotificationPage";

import { Toaster } from "./components/ui/sonner";

export interface Invoice {
  id: string;
  billTo: string;
  createDate: string;
  invoiceDate: string;
  invoiceNo: string;
  taxInvoiceNo: string;
  purchaseOrder: string;
  nominal: string;
  status: "waiting" | "approved" | "cancelled";
  estimatedPaymentDate?: string;
  paidDate?: string;
  cancelReason?: string;
  pdfFile?: File | null;
  createdAt: Date;
}

export interface Payment {
  id: string;
  createDate: string;
  invoices: Invoice[];
  totalPO: number;
  totalNominal: string;
  paidDate: string;
}

export default function App() {
  const removeNotificationRef =
    useRef<(poNumber: string) => void | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<
    "waruna" | "indo" | null
  >(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Skip login on refresh
  const [vendorType, setVendorType] = useState<
    "local" | "overseas"
  >(selectedCompany === "indo" ? "overseas" : "local");
  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "invoicecardgrid"
    | "invoice"
    | "payment"
    | "account"
    | "message"
    | "accountedit"
  >("dashboard");
  const [activeInvoiceTab, setActiveInvoiceTab] = useState<
    "submission" | "creditNote" | "soa" | null
  >(null);
  const [activePaymentTab, setActivePaymentTab] = useState<
    "submission" | "creditNote" | "soa"
  >("submission");
  const [selectedPO, setSelectedPO] = useState<string>("");
  const [revisionSubmitted, setRevisionSubmitted] =
    useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [invoices, setInvoices] = useState<Invoice[]>([
    // Sample approved invoices
    {
      id: "INV-001",
      billTo: "PT. WARUNA SHIPYARD INDONESIA",
      createDate: "08/10/25",
      invoiceDate: "26/09/25",
      invoiceNo: "0097",
      taxInvoiceNo: "040025003183021231",
      purchaseOrder: "PO/WSI.MDN/2509/0765",
      nominal: "800000",
      status: "approved",
      estimatedPaymentDate: "03/11/25",
      paidDate: "03/11/25",
      createdAt: new Date(),
    },
    {
      id: "INV-002",
      billTo: "PT. WARUNA SHIPYARD INDONESIA",
      createDate: "08/10/25",
      invoiceDate: "24/09/25",
      invoiceNo: "0079",
      taxInvoiceNo: "040025003183021232",
      purchaseOrder: "PO/WSI.MDN/2509/0829",
      nominal: "400000",
      status: "approved",
      estimatedPaymentDate: "03/11/25",
      paidDate: "03/11/25",
      createdAt: new Date(),
    },
    {
      id: "INV-003",
      billTo: "PT. WARUNA SHIPYARD INDONESIA",
      createDate: "08/10/25",
      invoiceDate: "07/10/25",
      invoiceNo: "0165",
      taxInvoiceNo: "040025003183021233",
      purchaseOrder: "PO/WSI.MDN/2510/0158",
      nominal: "81000",
      status: "approved",
      estimatedPaymentDate: "03/11/25",
      paidDate: "03/11/25",
      createdAt: new Date(),
    },
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "PAY-001",
      createDate: "08/10/25",
      invoices: invoices.filter(
        (inv) => inv.status === "approved",
      ),
      totalPO: 3,
      totalNominal: "1281000",
      paidDate: "03/11/25",
    },
  ]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActiveView("dashboard"); // Reset to dashboard after login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedCompany(null); // Navigate to CompanySelectionPage
    setActiveView("dashboard"); // Reset view when logging out
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices([...invoices, invoice]);
  };

  const updateInvoiceStatus = (
    id: string,
    status: "waiting" | "approved" | "cancelled",
    additionalData?: Partial<Invoice>,
  ) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === id
          ? { ...inv, status, ...additionalData }
          : inv,
      ),
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setHidden(true); // scroll down → hide
      } else {
        setHidden(false); // scroll up → show
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 🔑 Sinkronisasi vendorType dengan selectedCompany
  useEffect(() => {
    if (selectedCompany === "indo") {
      setVendorType("overseas");
    } else if (selectedCompany === "waruna") {
      setVendorType("local");
    }
  }, [selectedCompany]);

  if (!selectedCompany) {
    return (
      <>
        <CompanySelectionPage
          onSelectCompany={setSelectedCompany}
        />
        <Toaster />
      </>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        {selectedCompany === "waruna" && (
          <LoginScreen
            onLogin={handleLogin}
            vendorType={vendorType}
          />
        )}
        {selectedCompany === "indo" && (
          <LoginScreenIMI
            onLogin={handleLogin}
            vendorType={vendorType}
          />
        )}
        <Toaster />
      </>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50/50 via-blue-50/30 to-purple-50/30">
      {selectedCompany === "waruna" ? (
        <Navigation
          isMainDashboard={activeView === "dashboard"}
          onLogout={handleLogout}
          onBack={() => setActiveView("dashboard")}
          hidden={hidden}
          vendorType={vendorType}
          onVendorTypeChange={setVendorType}
        />
      ) : selectedCompany === "indo" ? (
        <NavigationIMI
          isMainDashboard={activeView === "dashboard"}
          onLogout={handleLogout}
          onBack={() => {
            setActiveView("dashboard");
            setActiveInvoiceTab(null);
            setActivePaymentTab("submission");
          }}
          hidden={hidden}
          vendorType={vendorType}
          onVendorTypeChange={setVendorType}
          onSetActiveTab={setActiveInvoiceTab}
          onNotificationClick={() => setActiveView("invoice")}
          onSelectNotificationPO={setSelectedPO}
          onRemoveNotification={(fn) => {
            removeNotificationRef.current = fn;
          }}
          onNavigateToDocumentIMI={(tab, poNumber) => {
            setActiveInvoiceTab(tab);
            setActiveView("invoice");
            if (poNumber) {
              setSelectedPO(poNumber);
            }
          }}
        />
      ) : null}

      <div className="p-8">
        {selectedCompany === "waruna" ? (
          activeView === "dashboard" ? (
            <MainDashboard
              invoices={invoices}
              addInvoice={addInvoice}
              updateInvoiceStatus={updateInvoiceStatus}
              payments={payments}
              setPayments={setPayments}
              activeView={activeView}
              setActiveView={setActiveView}
              vendorType={vendorType}
              setVendorType={setVendorType}
            />
          ) : activeView === "invoice" ? (
            <InvoicePage
              invoices={invoices}
              addInvoice={addInvoice}
              updateInvoiceStatus={updateInvoiceStatus}
              payments={payments}
              setPayments={setPayments}
              setActiveView={setActiveView}
              vendorType={vendorType}
            />
          ) : activeView === "payment" ? (
            <PaymentPage
              payments={payments}
              setPayments={setPayments}
              vendorType={vendorType}
            />
          ) : activeView === "account" ? (
            <AccountPage
              vendorType={vendorType}
              setActiveView={setActiveView}
              revisionSubmitted={revisionSubmitted}
            />
          ) : activeView === "accountedit" ? (
            <AccountEditPage
              vendorType={vendorType}
              setActiveView={(view) => {
                if (view === "account") {
                  setRevisionSubmitted(true);
                  // Auto-reset notification after 5 seconds
                  setTimeout(() => {
                    setRevisionSubmitted(false);
                  }, 5000);
                }
                setActiveView(view);
              }}
            />
          ) : activeView === "message" ? (
            <MessageNotificationPage
              vendorType={vendorType}
              setActiveView={setActiveView}
            />
          ) : null
        ) : selectedCompany === "indo" ? (
          activeView === "invoicecardgrid" ? (
            <InvoicePageIMI
              invoices={invoices}
              addInvoice={addInvoice}
              setActiveView={setActiveView}
              vendorType={vendorType}
              activeInvoiceTab={
                activeInvoiceTab || "submission"
              }
              setActiveInvoiceTab={setActiveInvoiceTab}
              selectedPO={selectedPO} // 👈 kirim state dari parent
              setSelectedPO={setSelectedPO} // 👈 kirim setter dari parent
            />
          ) : activeView === "invoice" ? (
            <DocumentIMI
              invoices={invoices}
              addInvoice={addInvoice}
              updateInvoiceStatus={updateInvoiceStatus}
              payments={payments}
              setPayments={setPayments}
              vendorType={vendorType}
              setActiveView={setActiveView}
              setActivePaymentTab={setActivePaymentTab}
              initialTab={activeInvoiceTab || "menu"}
              selectedPO={selectedPO}
            />
          ) : activeView === "dashboard" ? (
            <MainDashboardIMI
              invoices={invoices}
              addInvoice={addInvoice}
              updateInvoiceStatus={updateInvoiceStatus}
              payments={payments}
              setPayments={setPayments}
              activeView={activeView}
              setActiveView={setActiveView}
              vendorType={vendorType}
              setVendorType={setVendorType}
            />
          ) : activeView === "payment" ? (
            <PaymentPageIMI
              payments={payments}
              setPayments={setPayments}
              vendorType={vendorType}
              initialTab={activePaymentTab}
            />
          ) : activeView === "account" ? (
            <AccountPageIMI
              vendorType={vendorType}
              setActiveView={setActiveView}
              revisionSubmitted={revisionSubmitted}
            />
          ) : activeView === "accountedit" ? (
            <AccountEditPageIMI
              vendorType={vendorType}
              setActiveView={setActiveView}
              onRevisionSubmitted={() => {
                setRevisionSubmitted(true);
                setActiveView("account");
              }}
            />
          ) : activeView === "message" ? (
            <MessageNotificationPage
              vendorType={vendorType}
              setActiveView={setActiveView}
            />
          ) : null
        ) : null}
      </div>

      <Toaster />
    </div>
  );
}