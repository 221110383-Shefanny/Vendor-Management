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
  vendorType?: "local" | "overseas";
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
  "PT. ASIA MULIA TRANSPASIFIK": "AMT",
  "PT. GLOBAL MARITIM INDUSTRI": "GMI",
  "PT. PELAYARAN MULTI JAYA SAMUDERA": "MJS",
  "PT. TANKER TOTAL PASIFIK": "TTP",
  "PT. WARUNA NUSA SENTANA": "WNS",
  "PT. WARUNA SHIPYARD INDONESIA": "WSI",
};

// Purchase Orders per company - 5 each
const posByCompany: { [key: string]: string[] } = {
  "PT. ASIA MULIA TRANSPASIFIK": [
    "PO/AMT.MDN/2509/0001",
    "PO/AMT.MDN/2509/0042",
    "PO/AMT.BLW/2510/0015",
    "PO/AMT.BLW/2510/0098",
    "PO/AMT.BLW/2511/0005",
  ],
  "PT. GLOBAL MARITIM INDUSTRI": [
    "PO/GMI.MDN/2509/0201",
    "PO/GMI.MDN/2509/0356",
    "PO/GMI.BLW/2510/0087",
    "PO/GMI.BLW/2510/0145",
    "PO/GMI.BLW/2511/0023",
  ],
  "PT. PELAYARAN MULTI JAYA SAMUDERA": [
    "PO/MJS.MDN/2509/0512",
    "PO/MJS.MDN/2509/0678",
    "PO/MJS.BLW/2510/0234",
    "PO/MJS.BLW/2510/0401",
    "PO/MJS.BLW/2511/0067",
  ],
  "PT. TANKER TOTAL PASIFIK": [
    "PO/TTP.MDN/2509/0789",
    "PO/TTP.MDN/2509/0923",
    "PO/TTP.BLW/2510/0456",
    "PO/TTP.BLW/2510/0678",
    "PO/TTP.BLW/2511/0112",
  ],
  "PT. WARUNA NUSA SENTANA": [
    "PO/WNS.MDN/2509/0345",
    "PO/WNS.MDN/2509/0567",
    "PO/WNS.BLW/2510/0123",
    "PO/WNS.BLW/2510/0789",
    "PO/WNS.BLW/2511/0034",
  ],
  "PT. WARUNA SHIPYARD INDONESIA": [
    "PO/WSI.MDN/2509/0765",
    "PO/WSI.MDN/2509/0829",
    "PO/WSI.MDN/2510/0158",
    "PO/WSI.BLW/2510/0412",
    "PO/WSI.BLW/2511/0056",
  ],
};

// Purchase Order nominal mapping (in IDR)
const poNominalMap: { [key: string]: string } = {
  "PO/AMT.MDN/2509/0001": "150.000.000",
  "PO/AMT.MDN/2509/0042": "275.500.000",
  "PO/AMT.BLW/2510/0015": "425.750.000",
  "PO/AMT.BLW/2510/0098": "189.250.000",
  "PO/AMT.BLW/2511/0005": "612.300.000",
  "PO/GMI.MDN/2509/0201": "320.000.000",
  "PO/GMI.MDN/2509/0356": "485.600.000",
  "PO/GMI.BLW/2510/0087": "215.800.000",
  "PO/GMI.BLW/2510/0145": "750.500.000",
  "PO/GMI.BLW/2511/0023": "380.900.000",
  "PO/MJS.MDN/2509/0512": "595.250.000",
  "PO/MJS.MDN/2509/0678": "242.300.000",
  "PO/MJS.BLW/2510/0234": "835.600.000",
  "PO/MJS.BLW/2510/0401": "412.700.000",
  "PO/MJS.BLW/2511/0067": "528.100.000",
  "PO/TTP.MDN/2509/0789": "368.500.000",
  "PO/TTP.MDN/2509/0923": "721.800.000",
  "PO/TTP.BLW/2510/0456": "295.400.000",
  "PO/TTP.BLW/2510/0678": "645.300.000",
  "PO/TTP.BLW/2511/0112": "456.200.000",
  "PO/WNS.MDN/2509/0345": "178.900.000",
  "PO/WNS.MDN/2509/0567": "512.600.000",
  "PO/WNS.BLW/2510/0123": "339.100.000",
  "PO/WNS.BLW/2510/0789": "748.500.000",
  "PO/WNS.BLW/2511/0034": "285.700.000",
  "PO/WSI.MDN/2509/0765": "625.300.000",
  "PO/WSI.MDN/2509/0829": "412.900.000",
  "PO/WSI.MDN/2510/0158": "789.200.000",
  "PO/WSI.BLW/2510/0412": "356.800.000",
  "PO/WSI.BLW/2511/0056": "524.600.000",
};

interface InvoiceFormData {
  id: string;
  billTo: string;
  invoiceDate: string;
  invoiceNo: string;
  taxInvoiceNo: string;
  purchaseOrder: string;
  poPrefix: string;
  poNumber: string;
  nominal: string;
  pdfFiles: File[];
  isExpanded: boolean;
}

export function InvoicePage({
  invoices,
  addInvoice,
  setActiveView,
  vendorType = "local",
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
      nominal: "Amount (IDR)",
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
      purchaseOrder: "",
      poPrefix: "MDN",
      poNumber: "",
      nominal: "",
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
  const [openCalendar, setOpenCalendar] = useState<
    string | null
  >(null);
  const [currentFormId, setCurrentFormId] = useState("");
  const calendarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        purchaseOrder: "",
        poPrefix: "MDN",
        poNumber: "",
        nominal: "",
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

  const handleSaveAllInvoices = () => {
    // Validate all forms and collect errors
    let hasErrors = false;
    const errorData: {
      formIndex: number;
      missingFields: string[];
    }[] = [];

    invoiceForms.forEach((form, index) => {
      const missingFields: string[] = [];

      if (!form.billTo) missingFields.push("billTo");
      if (!form.purchaseOrder)
        missingFields.push("purchaseOrder");
      if (!form.invoiceDate) missingFields.push("invoiceDate");
      if (!form.invoiceNo) missingFields.push("invoiceNo");
      if (!form.taxInvoiceNo)
        missingFields.push("taxInvoiceNo");
      if (!form.nominal) missingFields.push("nominal");
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

      const newInvoice: Invoice = {
        id: `INV-${Date.now()}-${form.id}`,
        billTo: form.billTo,
        createDate,
        invoiceDate: form.invoiceDate,
        invoiceNo: form.invoiceNo,
        taxInvoiceNo: form.taxInvoiceNo,
        purchaseOrder: form.purchaseOrder,
        nominal: form.nominal,
        status: "waiting",
        pdfFile: form.pdfFiles[0],
        createdAt: new Date(),
      };

      addInvoice(newInvoice);
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
        purchaseOrder: "",
        poPrefix: "MDN",
        poNumber: "",
        nominal: "",
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
        <button
          onClick={() =>
            updateForm(form.id, {
              isExpanded: !form.isExpanded,
            })
          }
          className="w-full text-left p-0"
        >
          <CardHeader className="pb-3 hover:bg-gray-50 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {form.isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
                <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-400" />
                  {currentLabels.invoiceDetails} #{index + 1}
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
        </button>

        {/* BODY - EXPANDABLE */}
        {form.isExpanded && (
          <>
            <CardContent className="space-y-4 pt-4">
              {/* Company & PO */}
              <div className="grid grid-cols-2 gap-6 items-start mb-[30px]">
                <div className="space-y-2 flex flex-col justify-between h-12">
                  <Label className="text-gray-600">
                    {currentLabels.company}
                  </Label>
                  <Select
                    value={form.billTo}
                    onValueChange={(value: string) =>
                      updateForm(form.id, { billTo: value })
                    }
                  >
                    <SelectTrigger className="w-full h-full border border-gray-200 rounded-xl bg-white/70">
                      <SelectValue
                        placeholder={
                          currentLabels.selectCompany
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem
                          key={company}
                          value={company}
                        >
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 flex flex-col justify-between h-12">
                  <Label className="text-gray-600">
                    {currentLabels.purchaseOrder}
                  </Label>
                  <div className="flex gap-2 items-center h-full w-full">
                    {/* Dropdown dengan data dummy PO per perusahaan */}
                    <Select
                      value={form.purchaseOrder}
                      onValueChange={(value: string) => {
                        updateForm(form.id, {
                          purchaseOrder: value,
                          poNumber: value
                            .split("/")
                            .slice(-2)
                            .join(""),
                          nominal: poNominalMap[value] || "",
                        });
                      }}
                    >
                      <SelectTrigger className="w-full h-full border border-gray-200 rounded-xl bg-white/70 text-center">
                        <SelectValue
                          placeholder={
                            currentLabels.purchaseOrder
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {form.billTo &&
                        posByCompany[form.billTo] ? (
                          posByCompany[form.billTo].map(
                            (po) => (
                              <SelectItem key={po} value={po}>
                                {po}
                              </SelectItem>
                            ),
                          )
                        ) : (
                          <SelectItem value="none" disabled>
                            {currentLabels.selectPO}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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

              {/* Tax & Nominal */}
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
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder={`${currentLabels.example}, 100.000,12`}
                    value={form.nominal}
                    onChange={(e) => {
                      let raw = e.target.value;
                      raw = raw.replace(/[^0-9.,]/g, "");

                      const [integerPart, decimalPart] =
                        raw.split(",");

                      const formattedInteger = integerPart
                        ? new Intl.NumberFormat("id-ID").format(
                            Number(
                              integerPart.replace(/\./g, ""),
                            ),
                          )
                        : "";

                      const formatted =
                        decimalPart !== undefined
                          ? `${formattedInteger},${decimalPart}`
                          : formattedInteger;

                      updateForm(form.id, {
                        nominal: formatted,
                      });
                    }}
                    className="h-12 border border-gray-200 rounded-xl w-full"
                  />
                  {form.nominal && (
                    <p className="text-xs text-red-500 mt-1">
                      {vendorType === "local"
                        ? "⚠️ Silahkan edit atau ubah nominal jika berbeda dengan invoice yang akan ditagihkan"
                        : "⚠️ Change the nominal amount if it differs from the billed invoice."}
                    </p>
                  )}
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
      billTo: currentLabels.company,
      purchaseOrder: currentLabels.purchaseOrder,
      invoiceDate: currentLabels.invoiceDate,
      invoiceNo: currentLabels.invoiceNumber,
      taxInvoiceNo: currentLabels.taxInvoiceNumber,
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
    <div className="bg-gray-50 pb-8">
      <div className="max-w-7xl mx-auto space-y-8 py-2 px-40">
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

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-100 mt-20 relative z-10">
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
                    purchaseOrder: "",
                    poPrefix: "MDN",
                    poNumber: "",
                    nominal: "",
                    pdfFiles: [],
                    isExpanded: true,
                  },
                ]);
                toast.info(currentLabels.formCleared);
              }}
            >
              {currentLabels.clearForm}
            </Button>
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

      {/* HIDDEN FILE INPUT FOR ALL FORMS */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        multiple
        onChange={(e) => {
          if (currentFormId) {
            handleFileUpload(e, currentFormId);
          }
        }}
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
          <div className="flex gap-3">
            <Button
              onClick={() => {
                fileInputRef.current?.click();
                setOpenUploadDialog(false);
              }}
              className="flex-1 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white h-10 rounded-xl"
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
          </div>
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