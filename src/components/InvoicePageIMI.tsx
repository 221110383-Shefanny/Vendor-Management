import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  FileText,
  Upload,
  Save,
  Building,
  CalendarIcon,
  CheckCircle,
  DollarSign,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Invoice, Payment } from "../App";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Calendar } from "./ui/calendar";

interface InvoicePageProps {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoiceStatus: (
    id: string,
    status: "waiting" | "approved" | "cancelled",
    additionalData?: Partial<Invoice>,
  ) => void;
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  setActiveView?: (
    view:
      | "dashboard"
      | "invoice"
      | "payment"
      | "account"
      | "accountEdit"
      | "message",
  ) => void;
  setActivePaymentTab?: (
    tab: "submission" | "creditNote" | "soa",
  ) => void;
  vendorType?: "local" | "overseas";
  activeInvoiceTab?: "submission" | "creditNote" | "soa";
  setActiveInvoiceTab?: (
    tab: "submission" | "creditNote" | "soa",
  ) => void;
  selectedPO?: string;
  setSelectedPO?: (po: string) => void;
  onRemoveNotification?: (poNumber: string) => void;
}

const companies = [
  "PT. ASIA MULIA TRANSPASIFIK",
  "PT. GLOBAL MARITIM INDUSTRI",
  "PT. PELAYARAN MULTI JAYA SAMUDERA",
  "PT. TANKER TOTAL PASIFIK",
  "PT. WARUNA NUSA SENTANA",
  "PT. WARUNA SHIPYARD INDONESIA",
];

// Mapping company ke code 3 huruf
const companyCodeMap: { [key: string]: string } = {
  "PT. ASIA MULIA TRANSPASIFIK": "IMI",
  "PT. GLOBAL MARITIM INDUSTRI": "IMI",
  "PT. PELAYARAN MULTI JAYA SAMUDERA": "IMI",
  "PT. TANKER TOTAL PASIFIK": "IMI",
  "PT. WARUNA NUSA SENTANA": "IMI",
  "PT. WARUNA SHIPYARD INDONESIA": "IMI",
};

// All Purchase Orders combined
const allPurchaseOrders: string[] = [
  // PT. ASIA MULIA TRANSPASIFIK
  "PO/IMI.MDN/2509/0001",
  "PO/IMI.MDN/2509/0042",
  "PO/IMI.MDN/2510/0015",
  "PO/IMI.MDN/2510/0098",
  "PO/IMI.MDN/2511/0005",
  // PT. GLOBAL MARITIM INDUSTRI
  "PO/IMI.MDN/2509/0201",
  "PO/IMI.MDN/2509/0356",
  "PO/IMI.MDN/2510/0087",
  "PO/IMI.MDN/2510/0145",
  "PO/IMI.MDN/2511/0023",
  // PT. PELAYARAN MULTI JAYA SAMUDERA
  "PO/IMI.MDN/2509/0512",
  "PO/IMI.MDN/2509/0678",
  "PO/IMI.MDN/2510/0234",
  "PO/IMI.MDN/2510/0401",
  "PO/IMI.MDN/2511/0067",
  // PT. TANKER TOTAL PASIFIK
  "PO/IMI.MDN/2509/0789",
  "PO/IMI.MDN/2509/0923",
  "PO/IMI.MDN/2510/0456",
  "PO/IMI.MDN/2510/0678",
  "PO/IMI.MDN/2511/0112",
  // PT. WARUNA NUSA SENTANA
  "PO/IMI.MDN/2509/0345",
  "PO/IMI.MDN/2509/0567",
  "PO/IMI.MDN/2510/0123",
  "PO/IMI.MDN/2510/0789",
  "PO/IMI.MDN/2511/0034",
  // PT. WARUNA SHIPYARD INDONESIA
  "PO/IMI.MDN/2509/0765",
  "PO/IMI.MDN/2509/0829",
  "PO/IMI.MDN/2510/0158",
  "PO/IMI.MDN/2510/0412",
  "PO/IMI.MDN/2511/0056",
];

// Helper function to generate random amount
const getRandomAmount = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Format nominal amount according to currency with proper separators
const formatNominalByCurrency = (
  amount: number,
  currency: string,
): string => {
  const fractionDigits = ["JPY", "IDR", "RMB"].includes(
    currency,
  )
    ? 0
    : 2;
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
};

// Purchase Order nominal mapping with currency (static values, realistic ranges)
const poNominalMap: {
  [key: string]: { currency: string; amount: number };
} = {
  "PO/IMI.MDN/2509/0001": { currency: "USD", amount: 250 },
  "PO/IMI.MDN/2509/0042": { currency: "SGD", amount: 320 },
  "PO/IMI.MDN/2510/0015": { currency: "EUR", amount: 410 },
  "PO/IMI.MDN/2510/0098": { currency: "JPY", amount: 320000 }, // ratusan ribu yen wajar
  "PO/IMI.MDN/2511/0005": {
    currency: "IDR",
    amount: 350000000,
  }, // rupiah tetap besar
  "PO/IMI.MDN/2509/0201": { currency: "RMB", amount: 280 },
  "PO/IMI.MDN/2509/0356": { currency: "USD", amount: 480 },
  "PO/IMI.MDN/2510/0087": { currency: "SGD", amount: 540 },
  "PO/IMI.MDN/2510/0145": { currency: "EUR", amount: 600 },
  "PO/IMI.MDN/2511/0023": { currency: "JPY", amount: 410000 },
  "PO/IMI.MDN/2509/0512": {
    currency: "IDR",
    amount: 480000000,
  },
  "PO/IMI.MDN/2509/0678": { currency: "RMB", amount: 350 },
  "PO/IMI.MDN/2510/0234": { currency: "USD", amount: 520 },
  "PO/IMI.MDN/2510/0401": { currency: "SGD", amount: 410 },
  "PO/IMI.MDN/2511/0067": { currency: "EUR", amount: 720 },
  "PO/IMI.MDN/2509/0789": { currency: "JPY", amount: 290000 },
  "PO/IMI.MDN/2509/0923": {
    currency: "IDR",
    amount: 520000000,
  },
  "PO/IMI.MDN/2510/0456": { currency: "RMB", amount: 460 },
  "PO/IMI.MDN/2510/0678": { currency: "USD", amount: 380 },
  "PO/IMI.MDN/2511/0112": { currency: "SGD", amount: 290 },
  "PO/IMI.MDN/2509/0345": { currency: "EUR", amount: 530 },
  "PO/IMI.MDN/2509/0567": { currency: "JPY", amount: 360000 },
  "PO/IMI.MDN/2510/0123": {
    currency: "IDR",
    amount: 300000000,
  },
  "PO/IMI.MDN/2510/0789": { currency: "RMB", amount: 410 },
  "PO/IMI.MDN/2511/0034": { currency: "USD", amount: 270 },
  "PO/IMI.MDN/2509/0765": { currency: "SGD", amount: 350 },
  "PO/IMI.MDN/2509/0829": { currency: "EUR", amount: 480 },
  "PO/IMI.MDN/2510/0158": { currency: "JPY", amount: 450000 },
  "PO/IMI.MDN/2510/0412": {
    currency: "IDR",
    amount: 600000000,
  },
  "PO/IMI.MDN/2511/0056": { currency: "RMB", amount: 390 },
};

interface InvoiceFormData {
  id: string;
  billTo: string;
  invoiceDate: string;
  invoiceNo: string;
  taxInvoiceNo: string;
  purchaseOrders: Array<{
    id: string;
    po: string;
    poPrefix: string;
    poNumber: string;
    nominal: string;
    currency: string;
  }>;
  otherCosts: Array<{
    id: string;
    type: string;
    customType?: string;
    nominal: string;
    currency: string;
  }>;
  pdfFiles: File[];
  isExpanded: boolean;
}

export function InvoicePageIMI({
  invoices,
  addInvoice,
  setActiveView,
  setActivePaymentTab,
  vendorType = "local",
  activeInvoiceTab = "submission",
  setActiveInvoiceTab,
  selectedPO = "",
  setSelectedPO,
  onRemoveNotification,
}: InvoicePageProps) {
  const labels = {
    local: {
      title: "Pengumpulan Invoice",
      invoiceDetails: "Detail Invoice",
      company: "Perusahaan",
      purchaseOrder: "Purchase Order",
      invoiceDate: "Tanggal Invoice",
      invoiceDateHint:
        "Isi tanggal dari lampiran invoice di kolom ini",
      invoiceNumber: "Nomor Invoice",
      taxInvoiceNumber: "Nomor Faktur Pajak",
      nominal: "Nominal (IDR)",
      uploadDocument: "Unggah Dokumen",
      invoicePdf: "Invoice PDF / Dokumen",
      clickToChoose: "Klik untuk memilih file",
      uploadedFiles: "File yang Diunggah",
      saveInvoice: "Kirim Invoice",
      clearForm: "Hapus Form",
      autoFill:
        "🚧 Isi Otomatis (sementara, akan dihapus nanti)",
      invoiceSubmitted: "Invoice Berhasil Dikirim",
      submittedAt: "Invoice dikirim pada",
      continueToPayment: "Lanjut ke Progress Pembayaran",
      close: "Tutup",
      addDocument: "Tambah Dokumen",
      chooseMethod: "Pilih cara Anda ingin menambah dokumen",
      uploadFile: "Unggah File",
      openCamera: "Buka Kamera",
      cameraFeature: "Fitur Kamera",
      cameraIntegration:
        "Integrasi kamera akan tersedia di BeeSuite",
      gotIt: "Tutup",
      invalidDate: "Format tanggal tidak valid",
      today: "Hari Ini",
      clear: "Hapus",
      successUpload: "file PDF berhasil diunggah",
      errorUpload: "Silakan upload file PDF",
      errorFill:
        "Mohon isi semua kolom dan upload minimal satu dokumen",
      successSave: "Invoice berhasil disimpan!",
      formCleared: "Form telah dihapus",
      fileRemoved: "File dihapus",
      selectCompany: "Pilih perusahaan...",
      selectPO: "Pilih perusahaan terlebih dahulu",
      ddmmyyyy: "DD/MM/YYYY",
      example: "Contoh",
      addNewInvoice: "Tambah Invoice Baru",
      removeInvoice: "Hapus Invoice",
      requiredField: "Wajib diisi",
      pdfRequired: "⚠️ Format Dokumen : .pdf",
      validationError:
        "Mohon periksa kembali data berikut sebelum submit:",
      missingFields: "Kolom yang belum diisi:",
    },
    overseas: {
      title: "Invoice Submission",
      invoiceDetails: "Invoice Details",
      company: "Company",
      purchaseOrder: "Purchase Order",
      invoiceDate: "Invoice Date",
      invoiceDateHint:
        "Enter the date from the invoice attachment in this field",
      invoiceNumber: "Invoice Number",
      taxInvoiceNumber: "Tax Invoice Number",
      nominal: "Amount",
      currency: "Currency",
      selectCurrency: "Select Currency",
      uploadDocument: "Upload Document",
      invoicePdf: "Invoice PDF / Documents",
      clickToChoose: "Click to choose file",
      uploadedFiles: "Uploaded Files",
      saveInvoice: "Submit Invoice",
      clearForm: "Clear Form",
      autoFill:
        "🚧 Auto Fill (temporary, will be deleted later)",
      invoiceSubmitted: "Invoice Submitted",
      submittedAt: "Invoice submitted at",
      continueToPayment: "Continue To Payment Progress",
      close: "Close",
      addDocument: "Add Document",
      chooseMethod: "Choose how you want to add your document",
      uploadFile: "Upload File",
      openCamera: "Open Camera",
      cameraFeature: "Camera Feature",
      cameraIntegration:
        "Camera integration will be available in BeeSuite",
      gotIt: "Close",
      invalidDate: "Invalid date format",
      today: "Today",
      clear: "Clear",
      successUpload: "PDF file(s) uploaded",
      errorUpload: "Please upload PDF file(s)",
      errorFill:
        "Please fill in all fields and upload at least one document",
      successSave: "Invoice saved successfully!",
      formCleared: "Form cleared",
      fileRemoved: "File removed",
      selectCompany: "Select company...",
      selectPO: "Please select company first",
      ddmmyyyy: "DD/MM/YYYY",
      example: "e.g.",
      addNewInvoice: "Add New Invoice",
      removeInvoice: "Remove Invoice",
      requiredField: "Required",
      pdfRequired: "⚠️Format File: .pdf",
      validationError:
        "Please check the following data before submit:",
      missingFields: "Fields not filled:",
    },
  };

  const currentLabels =
    vendorType === "local" ? labels.local : labels.overseas;

  const [invoiceForms, setInvoiceForms] = useState<
    InvoiceFormData[]
  >([
    {
      id: "1",
      billTo: "",
      invoiceDate: "",
      invoiceNo: "",
      taxInvoiceNo: "",
      purchaseOrders: [
        {
          id: "po-1",
          po: "",
          poPrefix: "MDN",
          poNumber: "",
          nominal: "",
          currency: "IDR",
        },
      ],
      otherCosts: [],
      pdfFiles: [],
      isExpanded: true,
    },
  ]);
  const [submittedAt, setSubmittedAt] = useState("");
  const [open, setOpen] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] =
    useState(false);
  const [openCameraDialog, setOpenCameraDialog] =
    useState(false);
  const [openInvoiceDateDialog, setOpenInvoiceDateDialog] =
    useState(false);
  const [validationErrors, setValidationErrors] = useState<
    { formIndex: number; missingFields: string[] }[]
  >([]);
  const [showValidationBanner, setShowValidationBanner] =
    useState(false);
  const [nominalWarning, setNominalWarning] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });
  const [openCalendar, setOpenCalendar] = useState<
    string | null
  >(null);
  const [currentFormId, setCurrentFormId] = useState("");
  const [activeTab, setActiveTab] = useState<
    "submission" | "creditNote" | "soa" | null
  >(null);

  // Sync activeTab with activeInvoiceTab prop
  useEffect(() => {
    setActiveTab(activeInvoiceTab);
  }, [activeInvoiceTab]);

  const [creditNotes, setCreditNotes] = useState<
    Array<{
      id: string;
      purchaseOrder: string;
      pdfFile: File | null;
      isExpanded: boolean;
    }>
  >([
    {
      id: "cn-1",
      purchaseOrder: "",
      pdfFile: null,
      isExpanded: true,
    },
  ]);

  // Auto-fill credit note PO when selectedPO changes
  useEffect(() => {
    if (selectedPO) {
      setCreditNotes((prevCreditNotes) =>
        prevCreditNotes.length > 0
          ? prevCreditNotes.map((note, idx) =>
              idx === 0
                ? { ...note, purchaseOrder: selectedPO }
                : note,
            )
          : prevCreditNotes,
      );
      // Clear the selectedPO after a brief delay to ensure state update completes
      const timer = setTimeout(() => {
        if (setSelectedPO) {
          setSelectedPO("");
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedPO, setSelectedPO]);
  const [
    creditNoteValidationError,
    setCreditNoteValidationError,
  ] = useState<string[]>([]);
  const [
    showCreditNoteValidationBanner,
    setShowCreditNoteValidationBanner,
  ] = useState(false);
  const [creditNoteSubmitted, setCreditNoteSubmitted] =
    useState(false);
  const [creditNoteSubmittedAt, setCreditNoteSubmittedAt] =
    useState("");
  const [soaData, setSOAData] = useState({
    pdfFile: null as File | null,
  });
  const [soaValidationError, setSOAValidationError] = useState<
    string[]
  >([]);
  const [showSOAValidationBanner, setShowSOAValidationBanner] =
    useState(false);
  const [soaSubmitted, setSOASubmitted] = useState(false);
  const [soaSubmittedAt, setSOASubmittedAt] = useState("");
  const calendarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const creditNoteFileInputRef = useRef<HTMLInputElement>(null);
  const soaFileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setOpenCalendar(null);
      }
    };

    if (openCalendar) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
      return () => {
        document.removeEventListener(
          "mousedown",
          handleClickOutside,
        );
      };
    }
  }, [openCalendar]);

  const updateForm = (
    id: string,
    updates: Partial<InvoiceFormData>,
  ) => {
    setInvoiceForms(
      invoiceForms.map((form) =>
        form.id === id ? { ...form, ...updates } : form,
      ),
    );
  };

  const addNewInvoice = () => {
    const newId = String(Date.now());
    setInvoiceForms([
      ...invoiceForms,
      {
        id: newId,
        billTo: "",
        invoiceDate: "",
        invoiceNo: "",
        taxInvoiceNo: "",
        purchaseOrders: [
          {
            id: "po-1",
            po: "",
            poPrefix: "MDN",
            poNumber: "",
            nominal: "",
            currency: "IDR",
          },
        ],
        otherCosts: [],
        pdfFiles: [],
        isExpanded: true,
      },
    ]);
  };

  const removeInvoice = (id: string) => {
    if (invoiceForms.length > 1) {
      setInvoiceForms(
        invoiceForms.filter((form) => form.id !== id),
      );
      toast.info(currentLabels.fileRemoved);
    } else {
      toast.error("Minimal harus ada 1 Invoice");
    }
  };

  const updateCreditNote = (
    id: string,
    updates: Partial<{
      purchaseOrder: string;
      pdfFile: File | null;
      isExpanded: boolean;
    }>,
  ) => {
    setCreditNotes(
      creditNotes.map((note) =>
        note.id === id ? { ...note, ...updates } : note,
      ),
    );
  };

  const addNewCreditNote = () => {
    const newId = `cn-${Date.now()}`;
    setCreditNotes([
      ...creditNotes,
      {
        id: newId,
        purchaseOrder: "",
        pdfFile: null,
        isExpanded: true,
      },
    ]);
  };

  const removeCreditNote = (id: string) => {
    if (creditNotes.length > 1) {
      setCreditNotes(
        creditNotes.filter((note) => note.id !== id),
      );
      toast.info(currentLabels.fileRemoved);
    } else {
      toast.error(
        vendorType === "local"
          ? "Minimal harus ada 1 Credit Note"
          : "Minimum 1 Credit Note required",
      );
    }
  };

  const deleteSelectedPO = () => {
    if (creditNotes.length > 1) {
      // Remove the last (newest) credit note
      const lastIndex = creditNotes.length - 1;
      const deletedNote = creditNotes[lastIndex];
      setCreditNotes(creditNotes.slice(0, -1));
      toast.info(
        vendorType === "local"
          ? `PO ${deletedNote.purchaseOrder} dihapus`
          : `PO ${deletedNote.purchaseOrder} deleted`,
      );
    } else {
      toast.error(
        vendorType === "local"
          ? "Minimal harus ada 1 Credit Note"
          : "Minimum 1 Credit Note required",
      );
    }
  };

  const handleSubmitCreditNote = (id: string) => {
    const creditNote = creditNotes.find(
      (note) => note.id === id,
    );
    if (!creditNote) return;

    const missingFields: string[] = [];

    if (!creditNote.purchaseOrder) {
      missingFields.push(
        vendorType === "local"
          ? "Purchase Order"
          : "Purchase Order",
      );
    }
    if (!creditNote.pdfFile) {
      missingFields.push(
        vendorType === "local"
          ? "Dokumen Credit Note PDF"
          : "Credit Note PDF Document",
      );
    }

    if (missingFields.length > 0) {
      setCreditNoteValidationError(missingFields);
      setShowCreditNoteValidationBanner(true);
      return;
    }

    // Record submission timestamp
    const submittedAtTime = new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setCreditNoteSubmittedAt(submittedAtTime);
    setCreditNoteSubmitted(true);

    // Remove notification for this PO - applies to both scenarios:
    // 1. PO selected from notification click
    // 2. PO manually entered in credit note form
    const poToRemove = creditNote.purchaseOrder;
    console.log("Removing notification for PO:", poToRemove);
    if (onRemoveNotification && poToRemove) {
      console.log("onRemoveNotification exists, calling it");
      onRemoveNotification(poToRemove);
    } else {
      console.log(
        "onRemoveNotification not available or poToRemove empty",
      );
    }

    // Reset form and banner
    updateCreditNote(id, {
      purchaseOrder: "",
      pdfFile: null,
    });
    setShowCreditNoteValidationBanner(false);

    // Clear selectedPO after submission
    if (setSelectedPO) {
      setSelectedPO("");
    }
  };

  const handleAutoFillCreditNote = (id: string) => {
    // Create a demo PDF file for testing
    const demoFile = new File(
      ["Sample Credit Note PDF"],
      `credit_note_${id}.pdf`,
      { type: "application/pdf" },
    );

    // Select a random PO for demo
    const defaultPO =
      vendorType === "local"
        ? "PO/IMI.MDN/2509/0001"
        : "PO/IMI.MDN/2509/0356";

    updateCreditNote(id, {
      purchaseOrder: defaultPO,
      pdfFile: demoFile,
    });

    toast.success(
      vendorType === "local"
        ? "Form Credit Note berhasil diisi secara otomatis"
        : "Credit Note form auto-filled successfully",
    );
  };

  const handleAutoFillSOA = () => {
    // Create a demo PDF file for testing
    const demoFile = new File(
      ["Sample SOA PDF"],
      "soa_sample.pdf",
      { type: "application/pdf" },
    );

    setSOAData({
      pdfFile: demoFile,
    });

    toast.success(
      vendorType === "local"
        ? "Form SOA berhasil diisi secara otomatis"
        : "SOA form auto-filled successfully",
    );
  };

  const handleSubmitSOA = () => {
    // Validate SOA data
    if (!soaData.pdfFile) {
      setSOAValidationError(
        vendorType === "local"
          ? ["Dokumen SOA PDF"]
          : ["SOA PDF Document"],
      );
      setShowSOAValidationBanner(true);
      return;
    }

    // Record submission timestamp
    const submittedAtTime = new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setSOASubmittedAt(submittedAtTime);
    setSOASubmitted(true);

    // Only remove SOA notification if user came from notification (selectedPO is set)
    // If selectedPO is NOT set, user navigated directly to Invoice page, so don't remove notification
    if (selectedPO && onRemoveNotification) {
      onRemoveNotification("SOA");
    }

    // Reset form and banner
    setSOAData({ pdfFile: null });
    setShowSOAValidationBanner(false);
  };

  // Helper functions untuk date format
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isValidDate = (dateStr: string): boolean => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateStr)) return false;

    const [, day, month, year] = dateStr.match(regex) || [];
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;

    const date = new Date(y, m - 1, d);
    return (
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
    );
  };

  const convertToISODate = (dateStr: string): string => {
    if (!isValidDate(dateStr)) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    formId: string,
  ) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf",
      );
      if (newFiles.length > 0) {
        const form = invoiceForms.find((f) => f.id === formId);
        if (form) {
          updateForm(formId, {
            pdfFiles: [...form.pdfFiles, ...newFiles],
          });
          toast.success(
            `${newFiles.length} ${currentLabels.successUpload}`,
          );
          if (fileInputRef.current)
            fileInputRef.current.value = "";
        }
      } else {
        toast.error(currentLabels.errorUpload);
      }
    }
  };

  const removeFile = (formId: string, index: number) => {
    const form = invoiceForms.find((f) => f.id === formId);
    if (form) {
      updateForm(formId, {
        pdfFiles: form.pdfFiles.filter((_, i) => i !== index),
      });
      toast.info(currentLabels.fileRemoved);
    }
  };

  const handleCreditNoteFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate PDF file
      if (file.type !== "application/pdf") {
        toast.error(
          vendorType === "local"
            ? "Hanya file PDF yang diperbolehkan"
            : "Only PDF files are allowed",
        );
        if (creditNoteFileInputRef.current)
          creditNoteFileInputRef.current.value = "";
        return;
      }

      // Store the file in the correct credit note
      const creditNoteId = currentFormId.replace(
        "credit-note-",
        "",
      );
      updateCreditNote(creditNoteId, {
        pdfFile: file,
      });

      toast.success(
        vendorType === "local"
          ? "File PDF berhasil diunggah"
          : "PDF file uploaded successfully",
      );

      setOpenUploadDialog(false);

      if (creditNoteFileInputRef.current)
        creditNoteFileInputRef.current.value = "";
    }
  };

  const handleSOAFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Validate PDF file
      if (file.type !== "application/pdf") {
        toast.error(
          vendorType === "local"
            ? "Hanya file PDF yang diperbolehkan"
            : "Only PDF files are allowed",
        );
        if (soaFileInputRef.current)
          soaFileInputRef.current.value = "";
        return;
      }

      // Store the file
      setSOAData((prev) => ({
        ...prev,
        pdfFile: file,
      }));

      toast.success(
        vendorType === "local"
          ? "File PDF berhasil diunggah"
          : "PDF file uploaded successfully",
      );

      setOpenUploadDialog(false);

      if (soaFileInputRef.current)
        soaFileInputRef.current.value = "";
    }
  };

  const handleAutoFill = () => {
    // Create a demo PDF file for testing
    const demoFile = new File(
      ["Sample Invoice PDF"],
      "invoice_sample.pdf",
      { type: "application/pdf" },
    );

    const filledForms = invoiceForms.map((form) => ({
      ...form,
      invoiceDate: getCurrentDate(),
      invoiceNo:
        vendorType === "local"
          ? "INV-2024-001"
          : "INV-2024-001",
      taxInvoiceNo:
        vendorType === "local" ? "040025003183021231" : "",
      purchaseOrders: form.purchaseOrders.map((po, idx) => {
        if (idx === 0) {
          const defaultPO =
            vendorType === "local"
              ? "PO/IMI.MDN/2509/0001"
              : "PO/IMI.MDN/2509/0356";
          const poData = poNominalMap[defaultPO];
          return {
            ...po,
            po: defaultPO,
            poNumber: defaultPO.split("/").slice(-2).join(""),
            nominal: poData
              ? formatNominalByCurrency(
                  poData.amount,
                  poData.currency,
                )
              : "",
            currency: poData?.currency || "IDR",
          };
        }
        return po;
      }),
      pdfFiles:
        form.pdfFiles.length === 0 ? [demoFile] : form.pdfFiles,
    }));

    setInvoiceForms(filledForms);
    toast.success(
      vendorType === "local"
        ? "Form berhasil diisi secara otomatis"
        : "Form auto-filled successfully",
    );
  };

  const handleSaveAllInvoices = () => {
    // Validate all forms and collect errors
    let hasErrors = false;
    const errorData: {
      formIndex: number;
      missingFields: string[];
    }[] = [];

    invoiceForms.forEach((form, index) => {
      const missingFields: string[] = [];

      if (
        form.purchaseOrders.length === 0 ||
        !form.purchaseOrders[0].po
      )
        missingFields.push("purchaseOrder");
      if (!form.invoiceDate) missingFields.push("invoiceDate");
      if (!form.invoiceNo) missingFields.push("invoiceNo");
      if (!form.purchaseOrders[0]?.nominal)
        missingFields.push("nominal");
      if (form.pdfFiles.length === 0)
        missingFields.push("pdfFiles");

      if (missingFields.length > 0) {
        hasErrors = true;
        errorData.push({ formIndex: index, missingFields });
      }
    });

    if (hasErrors) {
      // Store error data, not messages
      setValidationErrors(errorData);
      setShowValidationBanner(true);
      return;
    }

    // Save all invoices
    invoiceForms.forEach((form) => {
      const createDate = new Date().toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        },
      );

      // Save each PO as a separate invoice
      form.purchaseOrders.forEach((poItem) => {
        if (poItem.po) {
          const newInvoice: Invoice = {
            id: `INV-${Date.now()}-${poItem.id}`,
            billTo: form.billTo,
            createDate,
            invoiceDate: form.invoiceDate,
            invoiceNo: form.invoiceNo,
            taxInvoiceNo: form.taxInvoiceNo,
            purchaseOrder: poItem.po,
            nominal: poItem.nominal,
            status: "waiting",
            pdfFile: form.pdfFiles[0],
            createdAt: new Date(),
          };

          addInvoice(newInvoice);
        }
      });
    });

    toast.success(currentLabels.successSave);

    // Reset forms
    setInvoiceForms([
      {
        id: "1",
        billTo: "",
        invoiceDate: "",
        invoiceNo: "",
        taxInvoiceNo: "",
        purchaseOrders: [
          {
            id: "po-1",
            po: "",
            poPrefix: "MDN",
            poNumber: "",
            nominal: "",
            currency: "IDR",
          },
        ],
        otherCosts: [],
        pdfFiles: [],
        isExpanded: true,
      },
    ]);

    const submittedAtTime = new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setSubmittedAt(submittedAtTime);
    setOpen(true);
  };

  const renderInvoiceCard = (
    form: InvoiceFormData,
    index: number,
  ) => (
    <div key={form.id} className="relative">
      <Card className="w-full border border-gray-100 shadow-md">
        {/* HEADER - CLICKABLE */}
        <CardHeader
          className="pb-3 hover:bg-gray-50 transition-colors rounded-t-lg cursor-pointer"
          onClick={() =>
            updateForm(form.id, {
              isExpanded: !form.isExpanded,
            })
          }
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {form.isExpanded ? (
                <ChevronUp className="w-5 h-5 text-blue-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600" />
              )}
              <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-400" />
                {currentLabels.invoiceDetails}{" "}
                {invoiceForms.length > 1 ? `#${index + 1}` : ""}
              </CardTitle>
            </div>
            {invoiceForms.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeInvoice(form.id);
                }}
                className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                title={currentLabels.removeInvoice}
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            )}
          </div>
        </CardHeader>

        {/* BODY - EXPANDABLE */}
        {form.isExpanded && (
          <>
            <CardContent className="space-y-4 pt-4">
              {/* Purchase Orders Section */}
              <div className="space-y-4">
                <Label className="text-gray-600">
                  {currentLabels.purchaseOrder}
                </Label>

                {/* Existing Purchase Orders */}
                {form.purchaseOrders.map((poItem, poIndex) => (
                  <div key={poItem.id} className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <Select
                          value={poItem.po}
                          onValueChange={(value: string) => {
                            const poData = poNominalMap[value];
                            const updatedPOs =
                              form.purchaseOrders.map(
                                (po, idx) =>
                                  idx === poIndex
                                    ? {
                                        ...po,
                                        po: value,
                                        poNumber: value
                                          .split("/")
                                          .slice(-2)
                                          .join(""),
                                        nominal: poData
                                          ? formatNominalByCurrency(
                                              poData.amount,
                                              poData.currency,
                                            )
                                          : "",
                                        currency:
                                          poData?.currency ||
                                          "IDR",
                                      }
                                    : po,
                              );
                            updateForm(form.id, {
                              purchaseOrders: updatedPOs,
                            });
                          }}
                        >
                          <SelectTrigger className="h-12 border border-gray-200 rounded-xl bg-white/70">
                            <SelectValue
                              placeholder={
                                currentLabels.purchaseOrder
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              // Get first PO currency if exists
                              const firstPOCurrency = form
                                .purchaseOrders[0]?.po
                                ? poNominalMap[
                                    form.purchaseOrders[0].po
                                  ]?.currency
                                : null;

                              // Get all selected POs (excluding current one)
                              const selectedPOs =
                                form.purchaseOrders
                                  .filter(
                                    (_, idx) => idx !== poIndex,
                                  )
                                  .map((po) => po.po)
                                  .filter(Boolean);

                              // Filter POs: if first PO selected, show only same currency; otherwise show all
                              let filteredPOs = firstPOCurrency
                                ? allPurchaseOrders.filter(
                                    (po) =>
                                      poNominalMap[po]
                                        ?.currency ===
                                      firstPOCurrency,
                                  )
                                : allPurchaseOrders;

                              // Remove already selected POs
                              filteredPOs = filteredPOs.filter(
                                (po) =>
                                  !selectedPOs.includes(po),
                              );

                              return filteredPOs.map((po) => (
                                <SelectItem key={po} value={po}>
                                  {po}
                                </SelectItem>
                              ));
                            })()}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* PO Nominal Input */}
                      <div className="flex gap-2 items-center">
                        <div className="h-10 px-4 w-16 rounded-xl flex items-center justify-center font-semibold text-[14px] text-black">
                          {poItem.po ? poItem.currency : ""}
                        </div>
                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder="0"
                          value={poItem.nominal}
                          onChange={(e) => {
                            const value = e.target.value;

                            if (!poItem.po) return;

                            const originalPoData =
                              poNominalMap[poItem.po];
                            const originalAmount =
                              originalPoData?.amount || 0;
                            const currency =
                              poItem.currency || "IDR";

                            const digitsOnly = value.replace(
                              /\D/g,
                              "",
                            );

                            if (!digitsOnly) {
                              const updatedPOs =
                                form.purchaseOrders.map(
                                  (po, idx) =>
                                    idx === poIndex
                                      ? { ...po, nominal: "" }
                                      : po,
                                );
                              updateForm(form.id, {
                                purchaseOrders: updatedPOs,
                              });
                              return;
                            }

                            const numValue = parseInt(
                              digitsOnly,
                              10,
                            );

                            if (numValue > originalAmount) {
                              const warningMsg =
                                vendorType === "local"
                                  ? `⚠️ Nominal tidak boleh lebih dari ${formatNominalByCurrency(originalAmount, currency)}`
                                  : `⚠️ Amount cannot exceed ${formatNominalByCurrency(originalAmount, currency)}`;
                              setNominalWarning({
                                show: true,
                                message: warningMsg,
                              });
                              return;
                            }

                            let formatted = digitsOnly;
                            if (
                              ["EUR", "RMB"].includes(currency)
                            ) {
                              formatted = digitsOnly.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ".",
                              );
                            } else {
                              formatted = digitsOnly.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              );
                            }

                            const updatedPOs =
                              form.purchaseOrders.map(
                                (po, idx) =>
                                  idx === poIndex
                                    ? {
                                        ...po,
                                        nominal: formatted,
                                      }
                                    : po,
                              );
                            updateForm(form.id, {
                              purchaseOrders: updatedPOs,
                            });

                            setNominalWarning({
                              show: false,
                              message: "",
                            });
                          }}
                          className="h-10 border border-gray-200 rounded-xl px-4 w-32 font-semibold text-[14px] text-black"
                        />
                      </div>

                      {form.purchaseOrders.length > 1 ? (
                        <button
                          onClick={() => {
                            const updatedPOs =
                              form.purchaseOrders.filter(
                                (_, idx) => idx !== poIndex,
                              );
                            updateForm(form.id, {
                              purchaseOrders: updatedPOs,
                            });
                            toast.info(
                              currentLabels.fileRemoved,
                            );
                          }}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                          title={currentLabels.removeInvoice}
                        >
                          <X className="w-5 h-5 text-red-500" />
                        </button>
                      ) : (
                        <div className="w-9 h-9 flex-shrink-0" />
                      )}
                    </div>
                    {poIndex ===
                      form.purchaseOrders.length - 1 &&
                      poItem.po && (
                        <p className="text-xs text-right text-red-500 mt-[4px] mr-[45px] mb-[0px] ml-[0px]">
                          {vendorType === "local"
                            ? "⚠️ Silahkan edit atau ubah nominal jika berbeda dengan invoice yang akan ditagihkan"
                            : "⚠️ You can edit the amount if it differs from the invoice."}
                        </p>
                      )}
                  </div>
                ))}

                {/* Add New PO Button */}
                <Button
                  onClick={() => {
                    const newPOId = `po-${Date.now()}`;
                    const updatedPOs = [
                      ...form.purchaseOrders,
                      {
                        id: newPOId,
                        po: "",
                        poPrefix: "MDN",
                        poNumber: "",
                        nominal: "",
                        currency: "IDR",
                      },
                    ];
                    updateForm(form.id, {
                      purchaseOrders: updatedPOs,
                    });
                  }}
                  variant="outline"
                  className="w-full h-10 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {vendorType === "local"
                    ? "Tambah PO Baru"
                    : "Add New PO"}
                </Button>

                {/* Other Costs Section */}
                {form.otherCosts?.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-gray-600 text-sm font-medium">
                      {vendorType === "local"
                        ? "Biaya Tambahan"
                        : "Other Cost"}
                    </Label>
                    {form.otherCosts.map(
                      (otherCost, costIndex) => (
                        <div
                          key={otherCost.id}
                          className="space-y-2"
                        >
                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <Select
                                value={otherCost.type}
                                onValueChange={(
                                  value: string,
                                ) => {
                                  const updatedCosts =
                                    form.otherCosts.map(
                                      (cost, idx) =>
                                        idx === costIndex
                                          ? {
                                              ...cost,
                                              type: value,
                                            }
                                          : cost,
                                    );
                                  updateForm(form.id, {
                                    otherCosts: updatedCosts,
                                  });
                                }}
                              >
                                <SelectTrigger className="h-12 border border-gray-200 rounded-xl bg-white/70">
                                  <SelectValue
                                    placeholder={
                                      vendorType === "local"
                                        ? "Pilih Tipe Biaya"
                                        : "Select Type"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="freight-cost">
                                    {vendorType === "local"
                                      ? "Biaya Pengiriman"
                                      : "Freight Cost"}
                                  </SelectItem>
                                  <SelectItem value="packing-cost">
                                    {vendorType === "local"
                                      ? "Biaya Pengemasan"
                                      : "Packing Cost"}
                                  </SelectItem>
                                  <SelectItem value="certificate-cost">
                                    {vendorType === "local"
                                      ? "Biaya Sertifikat/Dokumen"
                                      : "Certificate Cost / Document Fee"}
                                  </SelectItem>
                                  <SelectItem value="other">
                                    {vendorType === "local"
                                      ? "Lainnya"
                                      : "Other"}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Custom Type Input - Show if "Other" is selected */}
                            {otherCost.type === "other" && (
                              <Input
                                type="text"
                                placeholder={
                                  vendorType === "local"
                                    ? "Ketik tipe biaya"
                                    : "Please specify"
                                }
                                value={
                                  otherCost.customType || ""
                                }
                                onChange={(e) => {
                                  const updatedCosts =
                                    form.otherCosts.map(
                                      (cost, idx) =>
                                        idx === costIndex
                                          ? {
                                              ...cost,
                                              customType:
                                                e.target.value,
                                            }
                                          : cost,
                                    );
                                  updateForm(form.id, {
                                    otherCosts: updatedCosts,
                                  });
                                }}
                                className="h-12 border border-gray-200 rounded-xl px-3 flex-1"
                              />
                            )}

                            {/* Other Cost Nominal Input */}
                            <div className="flex gap-2 items-center">
                              <div className="h-10 px-4 w-16 rounded-xl flex items-center justify-center font-semibold text-gray-700">
                                {form.purchaseOrders[0]?.po
                                  ? form.purchaseOrders[0]
                                      ?.currency
                                  : ""}
                              </div>
                              <Input
                                type="text"
                                inputMode="decimal"
                                placeholder="0"
                                value={otherCost.nominal}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const digitsOnly =
                                    value.replace(/\D/g, "");
                                  const currency =
                                    form.purchaseOrders[0]
                                      ?.currency || "IDR";

                                  if (!digitsOnly) {
                                    const updatedCosts =
                                      form.otherCosts.map(
                                        (cost, idx) =>
                                          idx === costIndex
                                            ? {
                                                ...cost,
                                                nominal: "",
                                              }
                                            : cost,
                                      );
                                    updateForm(form.id, {
                                      otherCosts: updatedCosts,
                                    });
                                    return;
                                  }

                                  let formatted = digitsOnly;
                                  if (
                                    ["EUR", "RMB"].includes(
                                      currency,
                                    )
                                  ) {
                                    formatted =
                                      digitsOnly.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ".",
                                      );
                                  } else {
                                    formatted =
                                      digitsOnly.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ",",
                                      );
                                  }

                                  const updatedCosts =
                                    form.otherCosts.map(
                                      (cost, idx) =>
                                        idx === costIndex
                                          ? {
                                              ...cost,
                                              nominal:
                                                formatted,
                                            }
                                          : cost,
                                    );
                                  updateForm(form.id, {
                                    otherCosts: updatedCosts,
                                  });
                                }}
                                className="h-10 border border-gray-200 rounded-xl px-3 w-32"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const updatedCosts =
                                  form.otherCosts.filter(
                                    (_, idx) =>
                                      idx !== costIndex,
                                  );
                                updateForm(form.id, {
                                  otherCosts: updatedCosts,
                                });
                                toast.info(
                                  currentLabels.fileRemoved,
                                );
                              }}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                              title={
                                vendorType === "local"
                                  ? "Hapus Biaya"
                                  : "Delete Cost"
                              }
                            >
                              <X className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

                {/* Add Other Cost Button */}
                <Button
                  onClick={() => {
                    const newCostId = `cost-${Date.now()}`;
                    const updatedCosts = [
                      ...form.otherCosts,
                      {
                        id: newCostId,
                        type: "",
                        nominal: "",
                        currency:
                          form.purchaseOrders[0]?.currency ||
                          "IDR",
                      },
                    ];
                    updateForm(form.id, {
                      otherCosts: updatedCosts,
                    });
                  }}
                  variant="outline"
                  className="w-full h-10 rounded-xl border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 transition-colors gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {vendorType === "local"
                    ? "Tambah Biaya Tambahan"
                    : "Add Other Cost"}
                </Button>
              </div>

              <Separator />

              {/* Invoice Date & No */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 flex flex-col">
                  <Label className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    {currentLabels.invoiceDate}
                    <button
                      type="button"
                      onClick={() =>
                        setOpenInvoiceDateDialog(true)
                      }
                      className="ml-auto hover:text-blue-600 transition-colors p-1"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </Label>
                  <div className="relative w-full flex-1 flex flex-col">
                    <div className="relative flex items-center">
                      <Input
                        type="text"
                        placeholder={currentLabels.ddmmyyyy}
                        value={form.invoiceDate}
                        onChange={(e) => {
                          let raw = e.target.value.replace(
                            /[^\d]/g,
                            "",
                          );
                          if (raw.length > 8)
                            raw = raw.slice(0, 8);

                          let formatted = "";
                          if (raw.length <= 2) {
                            formatted = raw;
                          } else if (raw.length <= 4) {
                            formatted =
                              raw.slice(0, 2) +
                              "/" +
                              raw.slice(2);
                          } else {
                            formatted =
                              raw.slice(0, 2) +
                              "/" +
                              raw.slice(2, 4) +
                              "/" +
                              raw.slice(4);
                          }

                          updateForm(form.id, {
                            invoiceDate: formatted,
                          });
                        }}
                        className={`h-12 border rounded-xl flex-1 cursor-text pr-10 ${
                          form.invoiceDate &&
                          !isValidDate(form.invoiceDate)
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setOpenCalendar(
                            openCalendar === form.id
                              ? null
                              : form.id,
                          )
                        }
                        className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <CalendarIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {openCalendar === form.id && (
                      <div
                        ref={calendarRef}
                        className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            form.invoiceDate &&
                            isValidDate(form.invoiceDate)
                              ? new Date(
                                  convertToISODate(
                                    form.invoiceDate,
                                  ),
                                )
                              : undefined
                          }
                          onSelect={(
                            date: Date | undefined,
                          ) => {
                            if (date) {
                              const day = String(
                                date.getDate(),
                              ).padStart(2, "0");
                              const month = String(
                                date.getMonth() + 1,
                              ).padStart(2, "0");
                              const year = date.getFullYear();
                              updateForm(form.id, {
                                invoiceDate: `${day}/${month}/${year}`,
                              });
                              setOpenCalendar(null);
                            }
                          }}
                          disabled={(date: Date) =>
                            date > new Date()
                          }
                          initialFocus
                        />
                        <div className="border-t border-gray-200 flex gap-2 mt-3 pt-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8"
                            onClick={() => {
                              updateForm(form.id, {
                                invoiceDate: getCurrentDate(),
                              });
                              setOpenCalendar(null);
                            }}
                          >
                            {currentLabels.today}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8"
                            onClick={() => {
                              updateForm(form.id, {
                                invoiceDate: "",
                              });
                              setOpenCalendar(null);
                            }}
                          >
                            {currentLabels.clear}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {form.invoiceDate &&
                    !isValidDate(form.invoiceDate) && (
                      <p className="text-xs text-red-500">
                        {currentLabels.invalidDate}
                      </p>
                    )}
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label className="flex items-center gap-2 text-gray-600 mt-[5px]">
                    <FileText className="w-4 h-4" />
                    {currentLabels.invoiceNumber}
                  </Label>
                  <div className="flex w-full mt-[4px]">
                    <Input
                      placeholder={`${currentLabels.example}, 0097`}
                      value={form.invoiceNo}
                      onChange={(e) =>
                        updateForm(form.id, {
                          invoiceNo: e.target.value,
                        })
                      }
                      className="h-12 border border-gray-200 rounded-xl w-full mb-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Tax & Nominal - Sum of all POs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-4 h-4" />
                    {currentLabels.taxInvoiceNumber}
                  </Label>
                  <Input
                    placeholder={`${currentLabels.example}, 040025003183021231`}
                    value={form.taxInvoiceNo}
                    onChange={(e) => {
                      let raw = e.target.value.replace(
                        /[^0-9]/g,
                        "",
                      );
                      if (raw.length > 17)
                        raw = raw.slice(0, 17);
                      updateForm(form.id, {
                        taxInvoiceNo: raw,
                      });
                    }}
                    className="h-12 border border-gray-200 rounded-xl w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-600">
                    {currentLabels.nominal}
                  </Label>
                  <div className="flex gap-2 items-center">
                    <div className="h-10 px-4 w-16 rounded-xl flex items-center justify-center font-semibold text-[14px] text-black">
                      {form.purchaseOrders[0]?.po
                        ? form.purchaseOrders[0]?.currency
                        : ""}
                    </div>

                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder={`${currentLabels.example}, 100.000,12`}
                      value={(() => {
                        const currency =
                          form.purchaseOrders[0]?.currency ||
                          "IDR";

                        const poTotal =
                          form.purchaseOrders.reduce(
                            (sum, po) => {
                              if (!po.nominal) return sum;
                              const cleanedValue =
                                po.nominal.replace(/[.,]/g, "");
                              const numValue =
                                parseInt(cleanedValue, 10) || 0;
                              return sum + numValue;
                            },
                            0,
                          );

                        const otherCostsTotal =
                          form.otherCosts?.reduce(
                            (sum, cost) => {
                              if (!cost.nominal) return sum;
                              const cleanedValue =
                                cost.nominal.replace(
                                  /[.,]/g,
                                  "",
                                );
                              const numValue =
                                parseInt(cleanedValue, 10) || 0;
                              return sum + numValue;
                            },
                            0,
                          ) || 0;

                        const totalAmount =
                          poTotal + otherCostsTotal;

                        if (totalAmount === 0) return "";

                        const totalStr = String(totalAmount);
                        if (["EUR", "RMB"].includes(currency)) {
                          return totalStr.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ".",
                          );
                        } else {
                          return totalStr.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ",",
                          );
                        }
                      })()}
                      readOnly
                      className="h-10 border border-gray-200 rounded-xl px-4 w-full font-semibold text-[14px] text-black cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            {/* UPLOAD SECTION */}
            <CardHeader>
              <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-400" />
                {currentLabels.uploadDocument}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-600">
                  {currentLabels.invoicePdf}
                </Label>
                <div
                  className="bg-purple-50/50 p-4 rounded-xl border-2 border-dashed border-purple-200 cursor-pointer hover:bg-purple-100/50 transition-colors"
                  onClick={() => {
                    setCurrentFormId(form.id);
                    setOpenUploadDialog(true);
                  }}
                >
                  <div className="text-center">
                    <svg
                      className="w-8 h-8 mx-auto mb-2 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      {currentLabels.clickToChoose}
                    </p>
                  </div>
                </div>
                {form.pdfFiles.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    {currentLabels.pdfRequired}
                  </p>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) => handleFileUpload(e, form.id)}
                className="hidden"
              />

              {form.pdfFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.uploadedFiles} (
                    {form.pdfFiles.length})
                  </Label>
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                    {form.pdfFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" />
                          </svg>
                          <span className="text-sm text-gray-700 truncate">
                            {file.name}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                          onClick={() =>
                            removeFile(form.id, idx)
                          }
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );

  // Map field keys to labels in current language
  const getFieldLabel = (fieldKey: string): string => {
    const fieldMap: { [key: string]: string } = {
      purchaseOrder: currentLabels.purchaseOrder,
      invoiceDate: currentLabels.invoiceDate,
      invoiceNo: currentLabels.invoiceNumber,
      nominal: currentLabels.nominal,
      pdfFiles: currentLabels.invoicePdf,
    };
    return fieldMap[fieldKey] || fieldKey;
  };

  // Generate error messages during render using current language
  const getGeneratedErrorMessages = (): string[] => {
    return validationErrors.map((errorItem) => {
      const translatedFields = errorItem.missingFields
        .map((fieldKey) => getFieldLabel(fieldKey))
        .join(", ");
      return `${currentLabels.invoiceDetails} #${errorItem.formIndex + 1}: ${translatedFields}`;
    });
  };

  return (
    <div className="bg-gray-50 pb-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8 py-2 px-40">
        {/* NOMINAL WARNING BANNER */}
        {nominalWarning.show && (
          <div className="sticky top-0 z-50 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-4 shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="h-5 w-5 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-800">
                  {vendorType === "local"
                    ? "Peringatan"
                    : "Warning"}
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {nominalWarning.message}
                </p>
              </div>
              <button
                onClick={() =>
                  setNominalWarning({
                    show: false,
                    message: "",
                  })
                }
                className="flex-shrink-0 inline-flex text-yellow-600 hover:text-yellow-800 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* CREDIT NOTE VALIDATION ERROR BANNER */}
        {showCreditNoteValidationBanner &&
          creditNoteValidationError.length > 0 && (
            <div className="sticky top-0 z-50 bg-red-50 border-l-4 border-red-600 rounded-lg p-4 mb-4 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="h-5 w-5 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800">
                    {vendorType === "local"
                      ? "Mohon isi semua kolom"
                      : "Please fill all fields"}
                  </h3>
                  <p className="text-xs text-red-700 mt-1 font-medium">
                    {vendorType === "local"
                      ? "Kolom yang belum diisi:"
                      : "Fields not filled:"}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {creditNoteValidationError.map(
                      (field, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-red-700 flex items-start gap-2"
                        >
                          <span className="text-red-600 font-bold mt-0.5">
                            •
                          </span>
                          <span
                            className={`break-words ${
                              vendorType === "local"
                                ? "text-left leading-relaxed"
                                : "text-left leading-snug"
                            }`}
                          >
                            {field}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
                <button
                  onClick={() =>
                    setShowCreditNoteValidationBanner(false)
                  }
                  className="flex-shrink-0 inline-flex text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

        {/* SOA VALIDATION ERROR BANNER */}
        {showSOAValidationBanner &&
          soaValidationError.length > 0 && (
            <div className="sticky top-0 z-50 bg-red-50 border-l-4 border-red-600 rounded-lg p-4 mb-4 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="h-5 w-5 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800">
                    {vendorType === "local"
                      ? "Mohon isi semua kolom"
                      : "Please fill all fields"}
                  </h3>
                  <p className="text-xs text-red-700 mt-1 font-medium">
                    {vendorType === "local"
                      ? "Kolom yang belum diisi:"
                      : "Fields not filled:"}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {soaValidationError.map((field, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-red-700 flex items-start gap-2"
                      >
                        <span className="text-red-600 font-bold mt-0.5">
                          •
                        </span>
                        <span
                          className={`break-words ${
                            vendorType === "local"
                              ? "text-left leading-relaxed"
                              : "text-left leading-snug"
                          }`}
                        >
                          {field}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() =>
                    setShowSOAValidationBanner(false)
                  }
                  className="flex-shrink-0 inline-flex text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

        {/* VALIDATION ERROR BANNER */}
        {showValidationBanner &&
          validationErrors.length > 0 && (
            <div className="sticky top-0 z-50 bg-red-50 border-l-4 border-red-600 rounded-lg p-4 mb-4 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="h-5 w-5 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800">
                    {currentLabels.validationError}
                  </h3>
                  <p className="text-xs text-red-700 mt-1 font-medium">
                    {currentLabels.missingFields}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {getGeneratedErrorMessages().map(
                      (error, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-red-700 flex items-start gap-2"
                        >
                          <span className="text-red-600 font-bold mt-0.5">
                            •
                          </span>
                          <span
                            className={`break-words ${
                              vendorType === "local"
                                ? "text-left leading-relaxed"
                                : "text-left leading-snug"
                            }`}
                          >
                            {error}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
                <button
                  onClick={() => setShowValidationBanner(false)}
                  className="flex-shrink-0 inline-flex text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

        {/* CONTENT AREA - SHOW WHEN A TAB IS SELECTED */}
        {activeTab !== null && (
          <>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-100 relative z-0">
              {/* SUBMISSION TAB CONTENT */}
              {activeTab === "submission" && (
                <>
                  <h1 className="text-3xl mb-8 text-blue-600 text-center">
                    {currentLabels.title}
                  </h1>

                  <div className="space-y-4">
                    {/* INVOICE CARDS */}
                    {invoiceForms.map((form, index) =>
                      renderInvoiceCard(form, index),
                    )}
                  </div>

                  {/* ADD NEW INVOICE BUTTON */}
                  <div className="mt-6">
                    <Button
                      onClick={addNewInvoice}
                      variant="outline"
                      className="w-full h-12 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      {currentLabels.addNewInvoice}
                    </Button>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={handleSaveAllInvoices}
                      className="flex-1 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white h-12 rounded-xl shadow-md hover:shadow-lg transition-all gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {currentLabels.saveInvoice}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 px-8 rounded-xl border border-gray-200 hover:bg-gray-50"
                      onClick={() => {
                        setInvoiceForms([
                          {
                            id: "1",
                            billTo: "",
                            invoiceDate: "",
                            invoiceNo: "",
                            taxInvoiceNo: "",
                            purchaseOrders: [
                              {
                                id: "po-1",
                                po: "",
                                poPrefix: "MDN",
                                poNumber: "",
                                nominal: "",
                                currency: "IDR",
                              },
                            ],
                            otherCosts: [],
                            pdfFiles: [],
                            isExpanded: true,
                          },
                        ]);
                        setValidationErrors([]);
                        setShowValidationBanner(false);
                        toast.info(currentLabels.formCleared);
                      }}
                    >
                      {currentLabels.clearForm}
                    </Button>
                  </div>

                  {/* AUTOFILL BUTTON */}
                  <div className="mt-4">
                    <Button
                      onClick={handleAutoFill}
                      variant="outline"
                      className="w-full h-10 rounded-xl border-2 border-dashed border-green-300 text-green-600 hover:bg-green-50 transition-colors gap-2"
                    >
                      {vendorType === "local"
                        ? "🚧 Isi Otomatis (untuk testing)"
                        : "🚧 Auto Fill (for testing, klik ini kalau malas isi satu satu)"}
                    </Button>
                  </div>
                </>
              )}

              {/* CREDIT NOTE TAB CONTENT */}
              {activeTab === "creditNote" && (
                <div className="space-y-6">
                  <h1 className="text-3xl mb-8 text-blue-600 text-center">
                    {vendorType === "local"
                      ? "Credit Note"
                      : "Credit Note"}
                  </h1>

                  {creditNotes.map((creditNote) => (
                    <Card
                      key={creditNote.id}
                      className="w-full border border-gray-100 shadow-md"
                    >
                      <CardHeader
                        className="pb-3 hover:bg-gray-50 transition-colors rounded-t-lg cursor-pointer"
                        onClick={() =>
                          updateCreditNote(creditNote.id, {
                            isExpanded: !creditNote.isExpanded,
                          })
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {creditNote.isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-blue-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-blue-600" />
                            )}
                            <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                              <FileText className="w-5 h-5 text-blue-400" />
                              {vendorType === "local"
                                ? "Credit Note"
                                : "Credit Note"}{" "}
                              {creditNotes.length > 1
                                ? `#${creditNotes.indexOf(creditNote) + 1}`
                                : ""}
                            </CardTitle>
                          </div>
                          {creditNotes.length > 1 && (
                            <button
                              onClick={(
                                e: React.MouseEvent,
                              ) => {
                                e.stopPropagation();
                                removeCreditNote(creditNote.id);
                              }}
                              className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                              title={
                                vendorType === "local"
                                  ? "Hapus Credit Note"
                                  : "Remove Credit Note"
                              }
                            >
                              <X className="w-5 h-5 text-red-500" />
                            </button>
                          )}
                        </div>
                      </CardHeader>

                      {creditNote.isExpanded && (
                        <CardContent className="space-y-6 pt-6">
                          {/* Purchase Order Section */}
                          <div className="space-y-4">
                            <Label className="text-gray-600 font-medium">
                              {currentLabels.purchaseOrder}
                            </Label>
                            <Select
                              value={creditNote.purchaseOrder}
                              onValueChange={(value: string) =>
                                updateCreditNote(
                                  creditNote.id,
                                  {
                                    purchaseOrder: value,
                                  },
                                )
                              }
                            >
                              <SelectTrigger className="h-12 border border-gray-200 rounded-xl bg-white/70">
                                <SelectValue
                                  placeholder={
                                    currentLabels.purchaseOrder
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {allPurchaseOrders
                                  .filter((po) => {
                                    // Include PO if it's currently selected in this credit note
                                    if (
                                      po ===
                                      creditNote.purchaseOrder
                                    ) {
                                      return true;
                                    }
                                    // Exclude PO if it's already selected in another credit note
                                    return !creditNotes.some(
                                      (note) =>
                                        note.id !==
                                          creditNote.id &&
                                        note.purchaseOrder ===
                                          po,
                                    );
                                  })
                                  .map((po) => (
                                    <SelectItem
                                      key={po}
                                      value={po}
                                    >
                                      {po}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <Separator />

                          {/* Upload Credit Note Section */}
                          <div className="space-y-4">
                            <Label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                              <Upload className="w-5 h-5 text-purple-400" />
                              {vendorType === "local"
                                ? "Unggah Credit Note"
                                : "Upload Credit Note"}
                            </Label>

                            <div className="space-y-2">
                              <Label className="text-gray-600">
                                {vendorType === "local"
                                  ? "Dokumen Credit Note PDF"
                                  : "Credit Note PDF Document"}
                              </Label>
                              <div
                                className="bg-purple-50/50 p-4 rounded-xl border-2 border-dashed border-purple-200 cursor-pointer hover:bg-purple-100/50 transition-colors"
                                onClick={() => {
                                  setCurrentFormId(
                                    `credit-note-${creditNote.id}`,
                                  );
                                  setOpenUploadDialog(true);
                                }}
                              >
                                <div className="text-center">
                                  <svg
                                    className="w-8 h-8 mx-auto mb-2 text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                  <p className="text-sm text-gray-600">
                                    {vendorType === "local"
                                      ? "Klik untuk memilih file"
                                      : "Click to choose file"}
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500">
                                {vendorType === "local"
                                  ? "Format: PDF"
                                  : "Format: PDF"}
                              </p>

                              {creditNote.pdfFile && (
                                <div className="bg-gray-50 rounded-xl p-3 mt-4 border border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <svg
                                        className="w-4 h-4 text-red-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" />
                                      </svg>
                                      <span className="text-sm text-gray-700 truncate">
                                        {
                                          creditNote.pdfFile
                                            .name
                                        }
                                      </span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                      onClick={() => {
                                        updateCreditNote(
                                          creditNote.id,
                                          {
                                            pdfFile: null,
                                          },
                                        );
                                        toast.info(
                                          currentLabels.fileRemoved,
                                        );
                                      }}
                                    >
                                      ✕
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}

                  {/* ADD NEW CREDIT NOTE BUTTON */}
                  <div>
                    <Button
                      onClick={addNewCreditNote}
                      variant="outline"
                      className="w-full h-10 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {vendorType === "local"
                        ? "Tambah Credit Note Baru"
                        : "Add New Credit Note"}
                    </Button>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => {
                        const lastNote =
                          creditNotes[creditNotes.length - 1];
                        handleSubmitCreditNote(lastNote.id);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white h-12 rounded-xl shadow-md hover:shadow-lg transition-all gap-2"
                    >
                      {vendorType === "local"
                        ? "Kirim Credit Note"
                        : "Submit Credit Note"}
                    </Button>
                  </div>

                  {/* AUTOFILL BUTTON */}
                  <div>
                    <Button
                      onClick={() => {
                        creditNotes.forEach((note) => {
                          handleAutoFillCreditNote(note.id);
                        });
                      }}
                      variant="outline"
                      className="w-full h-10 rounded-xl border-2 border-dashed border-green-300 text-green-600 hover:bg-green-50 transition-colors gap-2"
                    >
                      {vendorType === "local"
                        ? "🚧 Isi Otomatis (untuk testing)"
                        : "🚧 Auto Fill (for testing, klik ini kalau malas isi)"}
                    </Button>
                  </div>
                </div>
              )}

              {/* SOA TAB CONTENT */}
              {activeTab === "soa" && (
                <div className="space-y-6">
                  <h1 className="text-3xl mb-8 text-blue-600 text-center">
                    {vendorType === "local"
                      ? "SOA Submission"
                      : "Statement Of Account Submission"}
                  </h1>

                  <Card className="w-full border border-gray-100 shadow-md">
                    <CardContent className="space-y-6 pt-6">
                      {/* Upload SOA Document Section */}
                      <div className="space-y-4">
                        <Label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                          <Upload className="w-5 h-5 text-purple-400" />
                          {vendorType === "local"
                            ? "Unggah Dokumen SOA"
                            : "Upload SOA Document"}
                        </Label>

                        <div className="space-y-2">
                          <Label className="text-gray-600">
                            {" "}
                            {vendorType === "local"
                              ? "Dokumen SOA (PDF/CSV)"
                              : "SOA Document (PDF/CSV)"}{" "}
                          </Label>
                          <div
                            className="bg-purple-50/50 p-4 rounded-xl border-2 border-dashed border-purple-200 cursor-pointer hover:bg-purple-100/50 transition-colors"
                            onClick={() => {
                              setCurrentFormId("soa");
                              setOpenUploadDialog(true);
                            }}
                          >
                            <div className="text-center">
                              <svg
                                className="w-8 h-8 mx-auto mb-2 text-purple-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              <p className="text-sm text-gray-600">
                                {vendorType === "local"
                                  ? "Klik untuk memilih file"
                                  : "Click to choose file"}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            {vendorType === "local"
                              ? "Format: PDF atau CSV"
                              : "Format: PDF or CSV"}
                          </p>

                          {soaData.pdfFile && (
                            <div className="bg-gray-50 rounded-xl p-3 mt-4 border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4 text-red-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" />
                                  </svg>
                                  <span className="text-sm text-gray-700 truncate">
                                    {soaData.pdfFile.name}
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                  onClick={() => {
                                    setSOAData((prev) => ({
                                      ...prev,
                                      pdfFile: null,
                                    }));
                                    toast.info(
                                      vendorType === "local"
                                        ? "File dihapus"
                                        : "File removed",
                                    );
                                  }}
                                >
                                  ✕
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleSubmitSOA}
                      className="flex-1 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white h-12 rounded-xl shadow-md hover:shadow-lg transition-all gap-2"
                    >
                      {vendorType === "local"
                        ? "Kirim SOA"
                        : "Submit SOA"}
                    </Button>
                  </div>

                  {/* AUTOFILL BUTTON */}
                  <div className="mt-4">
                    <Button
                      onClick={handleAutoFillSOA}
                      variant="outline"
                      className="w-full h-10 rounded-xl border-2 border-dashed border-green-300 text-green-600 hover:bg-green-50 transition-colors gap-2"
                    >
                      {vendorType === "local"
                        ? "🚧 Isi Otomatis (untuk testing)"
                        : "🚧 Auto Fill (for testing, klik ini kalau malas isi)"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Notes Container - Positioned on the right */}
      <div className="fixed right-8 top-32 w-50 z-40">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-gray-100 sticky top-32">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            {vendorType === "local"
              ? "Catatan"
              : "Notes (temporary)"}
          </h2>
          <div className="w-full h-64 p-3 border border-gray-200 rounded-xl bg-white overflow-y-auto text-sm text-gray-700">
            <p>Aktual di BeesSuite</p>
            <p>1 Vendor hanya ada 1 Currency</p>
            <p>
              Nominal PO tidak dapat diubah / edit melebihi
              nominal awal
            </p>
            <p>
              1 Invoice (bisa lebih dari 1 PO) = 1 Other Cost
            </p>
          </div>
        </div>
      </div>

      {/* SUCCESS DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              {currentLabels.invoiceSubmitted}
            </DialogTitle>
            <DialogDescription>
              {currentLabels.submittedAt}{" "}
              <strong>{submittedAt}</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:flex-row">
            <Button
              onClick={() => {
                setOpen(false);
                setActiveView?.("payment");
              }}
              className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl h-10 px-6"
            >
              {currentLabels.continueToPayment}
            </Button>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="rounded-xl h-10 px-6"
            >
              {currentLabels.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CREDIT NOTE SUCCESS DIALOG */}
      <Dialog
        open={creditNoteSubmitted}
        onOpenChange={setCreditNoteSubmitted}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              {vendorType === "local"
                ? "Credit Note Berhasil Dikirim"
                : "Credit Note Submitted"}
            </DialogTitle>
            <DialogDescription>
              {vendorType === "local"
                ? "Credit Note dikirim pada"
                : "Credit Note submitted at"}{" "}
              <strong>{creditNoteSubmittedAt}</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:flex-row">
            <Button
              onClick={() => {
                setCreditNoteSubmitted(false);
                setActivePaymentTab?.("creditNote");
                setActiveView?.("payment");
              }}
              className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl h-10 px-6"
            >
              {vendorType === "local"
                ? "Lihat Credit Note yang Dikirim"
                : "View Submitted Credit Note"}
            </Button>
            <Button
              onClick={() => setCreditNoteSubmitted(false)}
              variant="outline"
              className="rounded-xl h-10 px-6"
            >
              {currentLabels.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SOA SUCCESS DIALOG */}
      <Dialog
        open={soaSubmitted}
        onOpenChange={setSOASubmitted}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              {vendorType === "local"
                ? "SOA Berhasil Dikirim"
                : "SOA Submitted"}
            </DialogTitle>
            <DialogDescription>
              {vendorType === "local"
                ? "SOA dikirim pada"
                : "SOA submitted at"}{" "}
              <strong>{soaSubmittedAt}</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:flex-row">
            <Button
              onClick={() => {
                setSOASubmitted(false);
                setActivePaymentTab?.("soa");
                setActiveView?.("payment");
              }}
              className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl h-10 px-6"
            >
              {vendorType === "local"
                ? "Lihat SOA yang Dikirim"
                : "View Submitted SOA"}
            </Button>
            <Button
              onClick={() => setSOASubmitted(false)}
              variant="outline"
              className="rounded-xl h-10 px-6"
            >
              {currentLabels.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CREDIT NOTE FILE INPUT */}
      <input
        ref={creditNoteFileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleCreditNoteFileUpload}
        className="hidden"
      />

      {/* SOA FILE INPUT */}
      <input
        ref={soaFileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleSOAFileUpload}
        className="hidden"
      />

      {/* UPLOAD DIALOG */}
      <Dialog
        open={openUploadDialog}
        onOpenChange={setOpenUploadDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentLabels.addDocument}
            </DialogTitle>
            <DialogDescription>
              {currentLabels.chooseMethod}
            </DialogDescription>
          </DialogHeader>

          <Button
            onClick={() => {
              // Check if this is for credit note, SOA, or invoice
              if (currentFormId.startsWith("credit-note-")) {
                creditNoteFileInputRef.current?.click();
              } else if (currentFormId === "soa") {
                soaFileInputRef.current?.click();
              } else {
                fileInputRef.current?.click();
              }
              setOpenUploadDialog(false);
            }}
            className="w-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white h-10 rounded-xl"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {currentLabels.uploadFile}
          </Button>
        </DialogContent>
      </Dialog>

      {/* INVOICE DATE HINT DIALOG */}
      <Dialog
        open={openInvoiceDateDialog}
        onOpenChange={setOpenInvoiceDateDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              {currentLabels.invoiceDate}
            </DialogTitle>
            <DialogDescription>
              {currentLabels.invoiceDateHint}
            </DialogDescription>
            <DialogDescription>
              {currentLabels.invoiceDateHint}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              {currentLabels.invoiceDateHint}
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setOpenInvoiceDateDialog(false)}
              className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl h-10 px-6"
            >
              {currentLabels.gotIt}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}