import { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  FileText,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Ban,
  ChevronDown,
  ChevronUp,
  Building2,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Payment } from "../App";

interface PaymentPageIMIProps {
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  vendorType?: "local" | "overseas";
  initialTab?: "submission" | "creditNote" | "soa";
}

interface PaymentScheduleItem {
  id: string;
  createInvoice: string;
  invoiceReceiptDate: string;
  invoiceReceiptNo: string;
  totalAmount: string;
  status: "Submitted" | "On Process" | "Paid" | "Canceled";
  poNumber: string;
  nominal: string;
  company: string;
  invoiceNo: string;
  invoiceDate: string;
  submitDate: string;
  receivedDate: string;
  paymentDate: string;
  attachments?: { name: string; date: string }[];
  cancellationReason?: string;
  items?: {
    itemCode: string;
    itemName: string;
    cbm: string;
    weight: string;
    box: string;
    charges: string;
  }[];
  poList?: {
    poNo: string;
    amount: string;
    status?: "Submitted" | "On Process" | "Paid" | "Canceled";
  }[];
}

type FilterStatus =
  | "All"
  | "Submitted"
  | "On Process"
  | "Paid"
  | "Canceled";
type FilterCompany = "All" | "IMI";
type SortableColumn =
  | "invoiceDate"
  | "amount"
  | "submitDate"
  | "receivedDate"
  | "paymentDate"
  | null;

export function PaymentPageIMI({
  payments,
  setPayments,
  vendorType = "overseas",
  initialTab = "submission",
}: PaymentPageIMIProps) {
  const labels = {
    local: {
      title: "Progress Pembayaran",
      company: "Perusahaan:",
      status: "Status:",
      clearFilters: "Hapus Filter",
      tableHeaders: {
        company: "PERUSAHAAN",
        purchaseOrder: "PURCHASE ORDER",
        invoiceNo: "NO INVOICE",
        invoiceDate: "TGL INVOICE",
        amount: "NOMINAL",
        submitDate: "TGL PENGUMPULAN",
        receivedDate: "TGL DITERIMA",
        paymentDate: "TGL PEMBAYARAN",
        status: "STATUS",
      },
      selectOptions: {
        allCompanies: "Semua Perusahaan",
        allStatus: "Semua Status",
        submitted: "Terkirim",
        onProcess: "Sedang Diproses",
        paid: "Dibayar",
        canceled: "Dibatalkan",
      },
      noPayment: "Tidak ada jadwal pembayaran yang ditemukan",
      tryAdjusting: "Coba sesuaikan filter Anda",
      detailsTitle: "Detail Progres Pembayaran",
      invoiceReceiptNo: "No. Penerimaan Invoice:",
      createDate: "Tanggal Dibuat",
      receiptDate: "Tanggal Penerimaan",
      amountLabel: "Jumlah",
      statusLabel: "Status",
      poDetails: "Detail Pesanan Pembelian",
      poNumber: "Nomor PO:",
      nominal: "Nominal:",
      poCompany: "Perusahaan:",
      close: "Tutup",
      currency: "Rp",
      dateSchedule: "Jadwal Tanggal",
      attachments: "Lampiran",
      cancellationReasonLabel: "Alasan Pembatalan:",
      download: "Download",
    },
    overseas: {
      title: "Payment Progress",
      company: "Company:",
      status: "Status:",
      clearFilters: "Clear Filters",
      tableHeaders: {
        company: "COMPANY",
        purchaseOrder: "PURCHASE ORDER",
        invoiceNo: "INVOICE NO",
        invoiceDate: "INVOICE DATE",
        amount: "AMOUNT",
        submitDate: "SUBMIT DATE",
        receivedDate: "RECEIVED DATE",
        paymentDate: "PAYMENT DATE",
        status: "STATUS",
      },
      selectOptions: {
        allCompanies: "All Companies",
        allStatus: "All Status",
        submitted: "Submitted",
        onProcess: "On Process",
        paid: "Paid",
        canceled: "Cancelled",
      },
      noPayment: "No payment schedule found",
      tryAdjusting: "Try adjusting your filter",
      detailsTitle: "Payment Progress Details",
      invoiceReceiptNo: "Invoice Receipt No:",
      createDate: "Create Date",
      receiptDate: "Receipt Date",
      amountLabel: "Amount",
      statusLabel: "Status",
      poDetails: "Purchase Order Details",
      poNumber: "PO Number:",
      nominal: "Nominal:",
      poCompany: "Company:",
      close: "Close",
      currency: "Rp",
      dateSchedule: "Date Schedule",
      attachments: "Attachments",
      cancellationReasonLabel: "Cancellation Reason:",
      download: "Download",
    },
  };

  const currentLabels =
    vendorType === "local" ? labels.local : labels.overseas;
  const [activeTab, setActiveTab] = useState(initialTab);

  // Reset tab to Payment Progress (submission) whenever initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [selectedSchedule, setSelectedSchedule] =
    useState<PaymentScheduleItem | null>(null);
  const [showScheduleDetail, setShowScheduleDetail] =
    useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(
    new Set(),
  );
  const [filterStatus, setFilterStatus] =
    useState<FilterStatus>("All");
  const [filterCompany, setFilterCompany] =
    useState<FilterCompany>("All");
  const [filterCreateDate, setFilterCreateDate] = useState("");
  const [filterReceiptDate, setFilterReceiptDate] =
    useState("");
  const [filterInvoiceNo, setFilterInvoiceNo] = useState("");
  const [filterInvoiceDate, setFilterInvoiceDate] =
    useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterAmount, setFilterAmount] = useState("");
  const [filterSubmitDate, setFilterSubmitDate] = useState("");
  const [filterReceivedDate, setFilterReceivedDate] =
    useState("");
  const [sortColumn, setSortColumn] =
    useState<SortableColumn>(null);
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc"
  >("asc");
  const [searchCreditNote, setSearchCreditNote] = useState("");
  const [sortColumnCN, setSortColumnCN] = useState<
    "amount" | "submitDate" | "receivedDate" | null
  >(null);
  const [sortDirectionCN, setSortDirectionCN] = useState<
    "asc" | "desc"
  >("asc");
  const [searchSOA, setSearchSOA] = useState("");
  const [sortColumnSOA, setSortColumnSOA] = useState<
    "submitDate" | null
  >(null);
  const [sortDirectionSOA, setSortDirectionSOA] = useState<
    "asc" | "desc"
  >("asc");

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  // Parse DD/MM/YY date format
  const parseDate = (dateStr: string): number => {
    if (dateStr === "-") return 0;
    const [day, month, year] = dateStr.split("/");
    const fullYear =
      parseInt(year) > 50
        ? 1900 + parseInt(year)
        : 2000 + parseInt(year);
    return new Date(
      fullYear,
      parseInt(month) - 1,
      parseInt(day),
    ).getTime();
  };

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(
        sortDirection === "asc" ? "desc" : "asc",
      );
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: SortableColumn) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="w-4 h-4 ml-1" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  const handleSortCN = (
    column: "amount" | "submitDate" | "receivedDate",
  ) => {
    if (sortColumnCN === column) {
      setSortDirectionCN(
        sortDirectionCN === "asc" ? "desc" : "asc",
      );
    } else {
      setSortColumnCN(column);
      setSortDirectionCN("asc");
    }
  };

  const getSortIconCN = (
    column: "amount" | "submitDate" | "receivedDate",
  ) => {
    if (sortColumnCN !== column) {
      return <ChevronsUpDown className="w-4 h-4 ml-1" />;
    }
    return sortDirectionCN === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  const handleSortSOA = (column: "submitDate") => {
    if (sortColumnSOA === column) {
      setSortDirectionSOA(
        sortDirectionSOA === "asc" ? "desc" : "asc",
      );
    } else {
      setSortColumnSOA(column);
      setSortDirectionSOA("asc");
    }
  };

  const getSortIconSOA = (column: "submitDate") => {
    if (sortColumnSOA !== column) {
      return <ChevronsUpDown className="w-4 h-4 ml-1" />;
    }
    return sortDirectionSOA === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  // Mock payment schedule data for IMI
  const paymentSchedule: PaymentScheduleItem[] = [
    {
      id: "PS-IMI-001",
      createInvoice: "08/10/25",
      invoiceReceiptDate: "15/10/25",
      invoiceReceiptNo: "INV-IMI-0097",
      invoiceNo: "INV-IMI-0097",
      invoiceDate: "08/10/25",
      poNumber: "PO-2025-001",
      totalAmount: "1200000",
      submitDate: "10/10/25",
      receivedDate: "15/10/25",
      paymentDate: "20/10/25",
      status: "Paid",
      nominal: "1200000",
      company: "IMI",
      attachments: [
        { name: "Invoice_IMI_0097.pdf", date: "08/10/25" },
        { name: "PO_Confirmation.pdf", date: "08/10/25" },
      ],
      poList: [
        {
          poNo: "PO/IMI/2509/0765",
          amount: "400000",
          status: "Paid",
        },
        {
          poNo: "PO/IMI/2509/0766",
          amount: "500000",
          status: "Paid",
        },
        {
          poNo: "PO/IMI/2509/0767",
          amount: "300000",
          status: "On Process",
        },
      ],
      items: [
        {
          itemCode: "ITM-001",
          itemName: "Electronic Components",
          cbm: "4.18 m³",
          weight: "57 kg",
          box: "54",
          charges: "Rp 3.241.700",
        },
        {
          itemCode: "ITM-002",
          itemName: "Electrical Parts",
          cbm: "2.50 m³",
          weight: "35 kg",
          box: "28",
          charges: "Rp 1.960.000",
        },
      ],
    },
    {
      id: "PS-IMI-002",
      createInvoice: "08/10/25",
      invoiceReceiptDate: "15/10/25",
      invoiceReceiptNo: "INV-IMI-0079",
      invoiceNo: "INV-IMI-0079",
      invoiceDate: "08/10/25",
      poNumber: "PO-2025-002",
      totalAmount: "600000",
      submitDate: "10/10/25",
      receivedDate: "15/10/25",
      paymentDate: "22/10/25",
      status: "Paid",
      nominal: "600000",
      company: "IMI",
      attachments: [
        { name: "Invoice_IMI_0079.pdf", date: "08/10/25" },
      ],
      poList: [
        {
          poNo: "PO/IMI/2509/0829",
          amount: "200000",
          status: "Paid",
        },
        {
          poNo: "PO/IMI/2509/0830",
          amount: "250000",
          status: "On Process",
        },
        {
          poNo: "PO/IMI/2509/0831",
          amount: "150000",
          status: "Paid",
        },
      ],
      items: [
        {
          itemCode: "ITM-003",
          itemName: "Hardware Supplies",
          cbm: "1.80 m³",
          weight: "42 kg",
          box: "15",
          charges: "Rp 600.000",
        },
      ],
    },
    {
      id: "PS-IMI-003",
      createInvoice: "08/10/25",
      invoiceReceiptDate: "15/10/25",
      invoiceReceiptNo: "INV-IMI-0165",
      invoiceNo: "INV-IMI-0165",
      invoiceDate: "08/10/25",
      poNumber: "PO-2025-003",
      totalAmount: "95000",
      submitDate: "09/10/25",
      receivedDate: "15/10/25",
      paymentDate: "-",
      status: "On Process",
      nominal: "95000",
      company: "IMI",
      poList: [
        {
          poNo: "PO/IMI/2510/0158",
          amount: "35000",
          status: "On Process",
        },
        {
          poNo: "PO/IMI/2510/0159",
          amount: "30000",
          status: "On Process",
        },
        {
          poNo: "PO/IMI/2510/0160",
          amount: "30000",
          status: "On Process",
        },
      ],
      items: [
        {
          itemCode: "ITM-004",
          itemName: "Support Materials",
          cbm: "0.50 m³",
          weight: "12 kg",
          box: "8",
          charges: "Rp 95.000",
        },
      ],
    },
    {
      id: "PS-IMI-004",
      createInvoice: "10/10/25",
      invoiceReceiptDate: "-",
      invoiceReceiptNo: "INV-IMI-0201",
      invoiceNo: "INV-IMI-0201",
      invoiceDate: "10/10/25",
      poNumber: "PO-2025-004",
      totalAmount: "750000",
      submitDate: "11/10/25",
      receivedDate: "-",
      paymentDate: "-",
      status: "Submitted",
      nominal: "750000",
      company: "IMI",
      poList: [
        {
          poNo: "PO/IMI/2510/0245",
          amount: "250000",
          status: "Submitted",
        },
        {
          poNo: "PO/IMI/2510/0246",
          amount: "300000",
          status: "Submitted",
        },
        {
          poNo: "PO/IMI/2510/0247",
          amount: "200000",
          status: "Submitted",
        },
      ],
      items: [
        {
          itemCode: "ITM-005",
          itemName: "Premium Components",
          cbm: "3.20 m³",
          weight: "65 kg",
          box: "32",
          charges: "Rp 750.000",
        },
      ],
    },
  ];

  // Filter payment schedule - show invoices that have POs matching the selected status
  const filteredSchedule = paymentSchedule.filter((item) => {
    // Check basic filters
    const matchCreateDate =
      !filterCreateDate ||
      item.createInvoice
        .toLowerCase()
        .includes(filterCreateDate.toLowerCase());
    const matchReceiptDate =
      !filterReceiptDate ||
      item.invoiceReceiptDate
        .toLowerCase()
        .includes(filterReceiptDate.toLowerCase());
    const matchInvoiceNo =
      !filterInvoiceNo ||
      item.invoiceNo
        .toLowerCase()
        .includes(filterInvoiceNo.toLowerCase());
    const matchInvoiceDate =
      !filterInvoiceDate ||
      item.invoiceDate
        .toLowerCase()
        .includes(filterInvoiceDate.toLowerCase());
    const matchSearch =
      !filterSearch ||
      item.poNumber
        .toLowerCase()
        .includes(filterSearch.toLowerCase()) ||
      item.invoiceNo
        .toLowerCase()
        .includes(filterSearch.toLowerCase());
    const matchAmount =
      !filterAmount || item.totalAmount.includes(filterAmount);
    const matchSubmitDate =
      !filterSubmitDate ||
      item.submitDate
        .toLowerCase()
        .includes(filterSubmitDate.toLowerCase());
    const matchReceivedDate =
      !filterReceivedDate ||
      item.receivedDate
        .toLowerCase()
        .includes(filterReceivedDate.toLowerCase());

    // Check status filter - if "All", show invoice; if specific status, check if any PO matches
    const matchStatus =
      filterStatus === "All" ||
      (item.poList &&
        item.poList.some(
          (po) => (po.status || item.status) === filterStatus,
        ));

    return (
      matchStatus &&
      matchCreateDate &&
      matchReceiptDate &&
      matchInvoiceNo &&
      matchInvoiceDate &&
      matchSearch &&
      matchAmount &&
      matchSubmitDate &&
      matchReceivedDate
    );
  });

  // Sort filtered schedule
  const sortedSchedule = [...filteredSchedule].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue: string | number;
    let bValue: string | number;

    switch (sortColumn) {
      case "invoiceDate":
        aValue = parseDate(a.invoiceDate);
        bValue = parseDate(b.invoiceDate);
        break;
      case "amount":
        aValue = parseFloat(a.totalAmount);
        bValue = parseFloat(b.totalAmount);
        break;
      case "submitDate":
        aValue = parseDate(a.submitDate);
        bValue = parseDate(b.submitDate);
        break;
      case "receivedDate":
        aValue = parseDate(a.receivedDate);
        bValue = parseDate(b.receivedDate);
        break;
      case "paymentDate":
        aValue = parseDate(a.paymentDate);
        bValue = parseDate(b.paymentDate);
        break;
      default:
        return 0;
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Calculate totals from payment schedule based on amount in Rupiah
  const totalAmount = paymentSchedule.reduce(
    (sum, item) => sum + parseFloat(item.totalAmount),
    0,
  );
  const totalPaid = paymentSchedule
    .filter((item) => item.status === "Paid")
    .reduce(
      (sum, item) => sum + parseFloat(item.totalAmount),
      0,
    );
  const totalPending = paymentSchedule
    .filter((item) => item.status === "Submitted")
    .reduce(
      (sum, item) => sum + parseFloat(item.totalAmount),
      0,
    );
  const totalOnProses = paymentSchedule
    .filter((item) => item.status === "On Process")
    .reduce(
      (sum, item) => sum + parseFloat(item.totalAmount),
      0,
    );

  const handleViewScheduleDetail = (
    schedule: PaymentScheduleItem,
  ) => {
    setSelectedSchedule(schedule);
    setShowScheduleDetail(true);
  };

  const handleCardClick = (status: FilterStatus) => {
    setFilterStatus(status);
  };

  const getInvoiceStatus = (schedule: PaymentScheduleItem) => {
    if (!schedule.poList || schedule.poList.length === 0) {
      return schedule.status;
    }

    // Get all unique statuses from poList
    const poStatuses = schedule.poList.map(
      (po) => po.status || schedule.status,
    );
    const uniqueStatuses = [...new Set(poStatuses)];

    // If all POs have the same status, return that status
    if (uniqueStatuses.length === 1) {
      return uniqueStatuses[0];
    }

    // If mix of "On Process" and "Paid", return "Partially Paid"
    if (
      uniqueStatuses.includes("On Process") &&
      uniqueStatuses.includes("Paid") &&
      uniqueStatuses.length === 2
    ) {
      return "Partially Paid" as const;
    }

    // If mix of "On Process" and "Canceled", return "On Process"
    if (
      uniqueStatuses.includes("On Process") &&
      uniqueStatuses.includes("Canceled")
    ) {
      return "On Process";
    }

    // Default to the most critical status
    if (uniqueStatuses.includes("Canceled")) return "Canceled";
    if (uniqueStatuses.includes("On Process"))
      return "On Process";
    if (uniqueStatuses.includes("Submitted"))
      return "Submitted";
    return "Paid";
  };

  const getStatusBadgeForInvoice = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md px-4 py-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            {currentLabels.selectOptions.paid}
          </Badge>
        );
      case "Partially Paid":
        return (
          <Badge className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md px-4 py-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Partially Paid
          </Badge>
        );
      case "Submitted":
        return (
          <Badge className="bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md px-4 py-1.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {currentLabels.selectOptions.submitted}
          </Badge>
        );
      case "On Process":
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md px-4 py-1.5 flex items-center gap-1.5">
            <Loader2 className="w-4 h-4" />
            {currentLabels.selectOptions.onProcess}
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-md px-4 py-1.5 flex items-center gap-1.5">
            <Ban className="w-4 h-4" />
            {currentLabels.selectOptions.canceled}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (
    status: PaymentScheduleItem["status"],
  ) => {
    switch (status) {
      case "Paid":
        return (
          <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md px-4 py-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            {currentLabels.selectOptions.paid}
          </Badge>
        );
      case "Submitted":
        return (
          <Badge className="bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md px-4 py-1.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {currentLabels.selectOptions.submitted}
          </Badge>
        );
      case "On Process":
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md px-4 py-1.5 flex items-center gap-1.5">
            <Loader2 className="w-4 h-4" />
            {currentLabels.selectOptions.onProcess}
          </Badge>
        );
      case "Canceled":
        return (
          <Badge className="bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-md px-4 py-1.5 flex items-center gap-1.5">
            <Ban className="w-4 h-4" />
            {currentLabels.selectOptions.canceled}
          </Badge>
        );
    }
  };

  return (
    <div className="bg-gray-50 pb-8">
      <div className="max-w-7xl mx-auto py-2 px-4">
        {/* Tab Menu */}
        <div className="flex gap-0 mb-0 mt-20 border-b border-gray-200 bg-gray-100 rounded-t-2xl overflow-hidden">
          <button
            onClick={() => setActiveTab("submission")}
            className={`px-6 py-3 font-medium whitespace-nowrap transition-all relative cursor-pointer ${
              activeTab === "submission"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Payment Progress
            {activeTab === "submission" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("creditNote")}
            className={`px-6 py-3 font-medium whitespace-nowrap transition-all relative cursor-pointer ${
              activeTab === "creditNote"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Credit Note
            {activeTab === "creditNote" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("soa")}
            className={`px-6 py-3 font-medium whitespace-nowrap transition-all relative cursor-pointer ${
              activeTab === "soa"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            SOA
            {activeTab === "soa" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
            )}
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-none shadow-lg border border-gray-100 border-t-0">
          <div className="p-8">
            {/* Payment Progress Tab */}
            {activeTab === "submission" && (
              <>
                <h1 className="text-3xl mb-8 text-blue-600 text-center gap-3">
                  {currentLabels.title}
                </h1>

                {/* Filter Section */}
                <div className="mb-6 flex items-center justify-between gap-4">
                  {/* Left Side: Company & Status Filters */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-20">
                      <CheckCircle2 className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">
                        {currentLabels.status}
                      </span>
                    </div>
                    <Select
                      value={filterStatus}
                      onValueChange={(value: string) =>
                        setFilterStatus(value as FilterStatus)
                      }
                    >
                      <SelectTrigger className="w-64 bg-white/80 border-gray-300 shadow-sm">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">
                          {
                            currentLabels.selectOptions
                              .allStatus
                          }
                        </SelectItem>
                        <SelectItem value="Submitted">
                          {
                            currentLabels.selectOptions
                              .submitted
                          }
                        </SelectItem>
                        <SelectItem value="On Process">
                          {
                            currentLabels.selectOptions
                              .onProcess
                          }
                        </SelectItem>
                        <SelectItem value="Paid">
                          {currentLabels.selectOptions.paid}
                        </SelectItem>
                        <SelectItem value="Canceled">
                          {currentLabels.selectOptions.canceled}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Right Side: Search & Buttons */}
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      placeholder={
                        vendorType === "local"
                          ? "Cari PO atau Invoice..."
                          : "Search PO or Invoice..."
                      }
                      value={filterSearch}
                      onChange={(e) =>
                        setFilterSearch(e.target.value)
                      }
                      className="flex-1 min-w-[250px] bg-white/80 border-gray-300 shadow-sm"
                    />
                    <Button
                      onClick={() => {
                        if (
                          expandedRows.size ===
                          filteredSchedule.length
                        ) {
                          // If all expanded, collapse all
                          setExpandedRows(new Set());
                        } else {
                          // If not all expanded, expand all
                          const allIds = new Set(
                            filteredSchedule.map(
                              (item) => item.id,
                            ),
                          );
                          setExpandedRows(allIds);
                        }
                      }}
                      variant="outline"
                      className="px-8 bg-white/80 whitespace-nowrap"
                    >
                      {expandedRows.size ===
                      filteredSchedule.length
                        ? vendorType === "local"
                          ? "Tutup Semua"
                          : "Collapse All"
                        : vendorType === "local"
                          ? "Buka Semua"
                          : "Expand All"}
                    </Button>
                    <Button
                      onClick={() => {
                        setFilterStatus("All");
                        setFilterCompany("All");
                        setFilterCreateDate("");
                        setFilterReceiptDate("");
                        setFilterInvoiceNo("");
                        setFilterInvoiceDate("");
                        setFilterSearch("");
                        setFilterAmount("");
                        setFilterSubmitDate("");
                        setFilterReceivedDate("");
                      }}
                      variant="outline"
                      className={`w-32 bg-white/80 whitespace-nowrap ${
                        filterStatus === "All" &&
                        filterCompany === "All" &&
                        filterSearch === ""
                          ? "invisible"
                          : ""
                      }`}
                    >
                      {currentLabels.clearFilters}
                    </Button>
                  </div>
                </div>

                {/* Payment Schedule Section */}

                <Card className="border border-teal-100 bg-white/90 shadow-lg">
                  <CardContent className="p-6">
                    {filteredSchedule.length > 0 ? (
                      <div className="overflow-x-auto rounded-xl">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600">
                              <TableHead className="text-white py-4 w-12"></TableHead>
                              <TableHead className="text-white py-4">
                                {
                                  currentLabels.tableHeaders
                                    .invoiceNo
                                }
                              </TableHead>
                              <TableHead
                                className="text-white cursor-pointer hover:bg-teal-600 transition-colors"
                                onClick={() =>
                                  handleSort("invoiceDate")
                                }
                              >
                                <div className="flex items-center gap-1">
                                  {
                                    currentLabels.tableHeaders
                                      .invoiceDate
                                  }
                                  {getSortIcon("invoiceDate")}
                                </div>
                              </TableHead>
                              <TableHead className="text-white py-4">
                                {
                                  currentLabels.tableHeaders
                                    .purchaseOrder
                                }
                              </TableHead>
                              <TableHead
                                className="text-white cursor-pointer hover:bg-teal-600 transition-colors"
                                onClick={() =>
                                  handleSort("amount")
                                }
                              >
                                <div className="flex items-center gap-1">
                                  {
                                    currentLabels.tableHeaders
                                      .amount
                                  }
                                  {getSortIcon("amount")}
                                </div>
                              </TableHead>
                              <TableHead
                                className="text-white cursor-pointer hover:bg-teal-600 transition-colors"
                                onClick={() =>
                                  handleSort("submitDate")
                                }
                              >
                                <div className="flex items-center gap-1">
                                  {
                                    currentLabels.tableHeaders
                                      .submitDate
                                  }
                                  {getSortIcon("submitDate")}
                                </div>
                              </TableHead>
                              <TableHead
                                className="text-white cursor-pointer hover:bg-teal-600 transition-colors"
                                onClick={() =>
                                  handleSort("receivedDate")
                                }
                              >
                                <div className="flex items-center gap-1">
                                  {
                                    currentLabels.tableHeaders
                                      .receivedDate
                                  }
                                  {getSortIcon("receivedDate")}
                                </div>
                              </TableHead>
                              <TableHead
                                className="text-white cursor-pointer hover:bg-teal-600 transition-colors"
                                onClick={() =>
                                  handleSort("paymentDate")
                                }
                              >
                                <div className="flex items-center gap-1">
                                  {
                                    currentLabels.tableHeaders
                                      .paymentDate
                                  }
                                  {getSortIcon("paymentDate")}
                                </div>
                              </TableHead>
                              <TableHead className="text-white">
                                {
                                  currentLabels.tableHeaders
                                    .status
                                }
                              </TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {sortedSchedule.map(
                              (schedule, index) => {
                                const isExpanded =
                                  expandedRows.has(schedule.id);
                                const toggleExpand = () => {
                                  const newExpanded = new Set(
                                    expandedRows,
                                  );
                                  if (isExpanded) {
                                    newExpanded.delete(
                                      schedule.id,
                                    );
                                  } else {
                                    newExpanded.add(
                                      schedule.id,
                                    );
                                  }
                                  setExpandedRows(newExpanded);
                                };

                                return (
                                  <>
                                    <TableRow
                                      key={schedule.id}
                                      onClick={toggleExpand}
                                      className={`${
                                        index % 2 === 0
                                          ? "bg-white"
                                          : "bg-teal-50/30"
                                      } hover:bg-teal-100/50 transition-all duration-200 cursor-pointer`}
                                    >
                                      {/* Expand Button */}
                                      <TableCell className="text-center">
                                        <div className="text-teal-600 hover:text-teal-800">
                                          {isExpanded ? (
                                            <ChevronUp className="w-5 h-5" />
                                          ) : (
                                            <ChevronDown className="w-5 h-5" />
                                          )}
                                        </div>
                                      </TableCell>

                                      {/* Invoice No */}
                                      <TableCell className="text-blue-600 font-medium">
                                        {schedule.invoiceNo}
                                      </TableCell>

                                      {/* Invoice Date */}
                                      <TableCell className="text-gray-600">
                                        {schedule.invoiceDate}
                                      </TableCell>

                                      {/* Purchase Order */}
                                      <TableCell className="text-gray-600">
                                        {schedule.poList &&
                                        schedule.poList.length >
                                          1
                                          ? "Multiple"
                                          : schedule.poList &&
                                              schedule.poList
                                                .length === 1
                                            ? schedule.poList[0]
                                                .poNo
                                            : schedule.poNumber}
                                      </TableCell>

                                      {/* Amount */}
                                      <TableCell className="text-emerald-600">
                                        {currentLabels.currency}{" "}
                                        {formatCurrency(
                                          schedule.totalAmount,
                                        )}
                                      </TableCell>

                                      {/* Submit Date */}
                                      <TableCell className="text-gray-600">
                                        {schedule.submitDate}
                                      </TableCell>

                                      {/* Received Date */}
                                      <TableCell className="text-gray-600">
                                        {schedule.receivedDate}
                                      </TableCell>

                                      {/* Payment Date */}
                                      <TableCell className="text-gray-600">
                                        {schedule.poList &&
                                        schedule.poList.length >
                                          1
                                          ? "Multiple"
                                          : schedule.paymentDate}
                                      </TableCell>

                                      {/* Status */}
                                      <TableCell>
                                        {getStatusBadgeForInvoice(
                                          getInvoiceStatus(
                                            schedule,
                                          ),
                                        )}
                                      </TableCell>
                                    </TableRow>

                                    {/* Expanded Rows - One row per PO (filtered by status) */}
                                    {isExpanded &&
                                      schedule.poList &&
                                      schedule.poList
                                        .filter((po) =>
                                          filterStatus === "All"
                                            ? true
                                            : (po.status ||
                                                schedule.status) ===
                                              filterStatus,
                                        )
                                        .map((po, poIndex) => (
                                          <TableRow
                                            key={`${schedule.id}-po-${poIndex}`}
                                            className={`${poIndex % 2 === 0 ? "bg-blue-50" : "bg-blue-100/30"} border-b-2 border-teal-200`}
                                          >
                                            {/* Empty expand cell */}
                                            <TableCell></TableCell>

                                            {/* Invoice No - empty */}
                                            <TableCell></TableCell>

                                            {/* Invoice Date - empty */}
                                            <TableCell></TableCell>

                                            {/* Purchase Order */}
                                            <TableCell className="text-gray-700 font-medium">
                                              <p className="text-sm font-medium">
                                                {po.poNo}
                                              </p>
                                            </TableCell>

                                            {/* PO Amount */}
                                            <TableCell className="text-emerald-600 font-medium">
                                              <p className="text-sm font-medium">
                                                {
                                                  currentLabels.currency
                                                }{" "}
                                                {formatCurrency(
                                                  po.amount,
                                                )}
                                              </p>
                                            </TableCell>

                                            {/* Submit Date - empty */}
                                            <TableCell></TableCell>

                                            {/* Received Date - empty */}
                                            <TableCell></TableCell>

                                            {/* Payment Date */}
                                            <TableCell>
                                              <p className="text-sm text-gray-700">
                                                {po.status ===
                                                "Paid"
                                                  ? schedule.paymentDate
                                                  : "-"}
                                              </p>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                              {getStatusBadge(
                                                (po.status ||
                                                  schedule.status) as PaymentScheduleItem["status"],
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                  </>
                                );
                              },
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-20">
                        <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <p className="text-gray-500 text-xl">
                          {currentLabels.noPayment}
                        </p>
                        <p className="text-gray-400">
                          {currentLabels.tryAdjusting}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Credit Note Tab */}
            {activeTab === "creditNote" && (
              <>
                <h1 className="text-3xl mb-8 text-blue-600 text-center">
                  Submitted Credit Note
                </h1>

                {/* Search Box */}
                <div className="mb-6 flex items-center gap-2">
                  <Input
                    placeholder="Search Purchase Order..."
                    value={searchCreditNote}
                    onChange={(e) =>
                      setSearchCreditNote(e.target.value)
                    }
                    className="flex-1 min-w-[250px] bg-white/80 border-gray-300 shadow-sm"
                  />
                </div>

                <Card className="border border-purple-100 bg-white/90 shadow-lg">
                  <CardContent className="p-6">
                    <div className="overflow-x-auto rounded-xl">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                            <TableHead className="text-white py-4">
                              Purchase Order
                            </TableHead>
                            <TableHead
                              className="text-white cursor-pointer hover:bg-blue-700 transition-colors"
                              onClick={() =>
                                handleSortCN("amount")
                              }
                            >
                              <div className="flex items-center gap-1">
                                CN Amount
                                {getSortIconCN("amount")}
                              </div>
                            </TableHead>
                            <TableHead
                              className="text-white cursor-pointer hover:bg-blue-700 transition-colors"
                              onClick={() =>
                                handleSortCN("submitDate")
                              }
                            >
                              <div className="flex items-center gap-1">
                                Submit Date
                                {getSortIconCN("submitDate")}
                              </div>
                            </TableHead>
                            <TableHead
                              className="text-white cursor-pointer hover:bg-blue-700 transition-colors"
                              onClick={() =>
                                handleSortCN("receivedDate")
                              }
                            >
                              <div className="flex items-center gap-1">
                                Received Date
                                {getSortIconCN("receivedDate")}
                              </div>
                            </TableHead>
                            <TableHead className="text-white">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            {
                              po: "PO/IMI.MDN/2509/0001",
                              amount: "500000",
                              submitDate: "12/10/25",
                              receivedDate: "15/10/25",
                            },
                            {
                              po: "PO/IMI.MDN/2509/0042",
                              amount: "350000",
                              submitDate: "13/10/25",
                              receivedDate: "16/10/25",
                            },
                          ]
                            .filter((cn) =>
                              cn.po
                                .toLowerCase()
                                .includes(
                                  searchCreditNote.toLowerCase(),
                                ),
                            )
                            .sort((a, b) => {
                              if (!sortColumnCN) return 0;

                              let aValue: string | number;
                              let bValue: string | number;

                              switch (sortColumnCN) {
                                case "amount":
                                  aValue = parseFloat(a.amount);
                                  bValue = parseFloat(b.amount);
                                  break;
                                case "submitDate":
                                  aValue = parseDate(
                                    a.submitDate,
                                  );
                                  bValue = parseDate(
                                    b.submitDate,
                                  );
                                  break;
                                case "receivedDate":
                                  aValue = parseDate(
                                    a.receivedDate,
                                  );
                                  bValue = parseDate(
                                    b.receivedDate,
                                  );
                                  break;
                                default:
                                  return 0;
                              }

                              if (sortDirectionCN === "asc") {
                                return aValue < bValue
                                  ? -1
                                  : aValue > bValue
                                    ? 1
                                    : 0;
                              } else {
                                return aValue > bValue
                                  ? -1
                                  : aValue < bValue
                                    ? 1
                                    : 0;
                              }
                            })
                            .map((cn, index) => (
                              <TableRow
                                key={index}
                                className={`${index % 2 === 0 ? "bg-white" : "bg-purple-50/30"} hover:bg-purple-100/50 transition-all duration-200`}
                              >
                                <TableCell className="text-gray-600">
                                  {cn.po}
                                </TableCell>
                                <TableCell className="text-emerald-600">
                                  {currentLabels.currency}{" "}
                                  {formatCurrency(cn.amount)}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {cn.submitDate}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {cn.receivedDate}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* SOA Tab */}
            {activeTab === "soa" && (
              <>
                <h1 className="text-3xl mb-8 text-blue-600 text-center">
                  Statement of Account
                </h1>

                {/* Search Box */}
                <div className="mb-6 flex items-center gap-2">
                  <Input
                    placeholder="Search Document Name..."
                    value={searchSOA}
                    onChange={(e) =>
                      setSearchSOA(e.target.value)
                    }
                    className="flex-1 min-w-[250px] bg-white/80 border-gray-300 shadow-sm"
                  />
                </div>

                <Card className="border border-green-100 bg-white/90 shadow-lg">
                  <CardContent className="p-6">
                    <div className="overflow-x-auto rounded-xl">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                            <TableHead className="text-white py-4">
                              Document Name
                            </TableHead>
                            <TableHead
                              className="text-white cursor-pointer hover:bg-blue-700 transition-colors"
                              onClick={() =>
                                handleSortSOA("submitDate")
                              }
                            >
                              <div className="flex items-center gap-1">
                                Date Submitted
                                {getSortIconSOA("submitDate")}
                              </div>
                            </TableHead>
                            <TableHead className="text-white">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[
                            {
                              name: "SOA_2025_Q4.pdf",
                              submitDate: "10/12/25",
                            },
                            {
                              name: "SOA_2025_Q3.csv",
                              submitDate: "09/10/25",
                            },
                            {
                              name: "SOA_2025_Q2.pdf",
                              submitDate: "08/07/25",
                            },
                            {
                              name: "SOA_2025_Q1.csv",
                              submitDate: "05/04/25",
                            },
                            {
                              name: "SOA_2024_Q4.pdf",
                              submitDate: "02/01/25",
                            },
                            {
                              name: "SOA_2024_Q3.csv",
                              submitDate: "18/10/24",
                            },
                            {
                              name: "SOA_2024_Q2.pdf",
                              submitDate: "25/07/24",
                            },
                            {
                              name: "SOA_2024_Q1.csv",
                              submitDate: "12/04/24",
                            },
                          ]
                            .filter((soa) =>
                              soa.name
                                .toLowerCase()
                                .includes(
                                  searchSOA.toLowerCase(),
                                ),
                            )
                            .sort((a, b) => {
                              if (!sortColumnSOA) return 0;

                              const aValue = parseDate(
                                a.submitDate,
                              );
                              const bValue = parseDate(
                                b.submitDate,
                              );

                              if (sortDirectionSOA === "asc") {
                                return aValue < bValue
                                  ? -1
                                  : aValue > bValue
                                    ? 1
                                    : 0;
                              } else {
                                return aValue > bValue
                                  ? -1
                                  : aValue < bValue
                                    ? 1
                                    : 0;
                              }
                            })
                            .map((soa, index) => (
                              <TableRow
                                key={index}
                                className={`${index % 2 === 0 ? "bg-white" : "bg-green-50/30"} hover:bg-green-100/50 transition-all duration-200`}
                              >
                                <TableCell className="text-gray-600 flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-green-600" />
                                  {soa.name}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {soa.submitDate}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Details Dialog */}
      <Dialog
        open={showScheduleDetail}
        onOpenChange={setShowScheduleDetail}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-blue-600">
              {currentLabels.detailsTitle}
            </DialogTitle>
            <DialogDescription>
              {selectedSchedule?.invoiceNo}
            </DialogDescription>
          </DialogHeader>

          {selectedSchedule && (
            <div className="space-y-6">
              {/* Attachments */}
              {selectedSchedule.attachments &&
                selectedSchedule.attachments.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-3">
                      {vendorType === "local"
                        ? "Lampiran"
                        : "Attachments"}
                    </p>
                    <div className="space-y-2">
                      {selectedSchedule.attachments.map(
                        (attachment, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  {attachment.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {attachment.date}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-200"
                            >
                              {vendorType === "local"
                                ? "Lihat"
                                : "View"}
                            </Button>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              onClick={() => setShowScheduleDetail(false)}
              variant="outline"
              className="px-6"
            >
              {currentLabels.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}