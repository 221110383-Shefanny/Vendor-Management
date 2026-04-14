import { useState } from "react";
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
  Building2,
  ChevronUp,
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

interface PaymentPageProps {
  payments: Payment[];
  vendorType?: "local" | "overseas";
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
}

type FilterStatus =
  | "All"
  | "Submitted"
  | "On Process"
  | "Paid"
  | "Canceled";
type FilterCompany =
  | "All"
  | "AMT"
  | "GMI"
  | "MJS"
  | "TTP"
  | "WNS"
  | "WSI";
type SortableColumn =
  | "invoiceDate"
  | "amount"
  | "submitDate"
  | "receivedDateSoftcopy"
  | "receivedDateHardcopy"
  | "estimatedPaymentDate"
  | "paymentDate"
  | null;

export function PaymentPage({
  payments,
  vendorType = "local",
}: PaymentPageProps) {
  const labels = {
    local: {
      title: "Progress Pembayaran",
      company: "PT:",
      status: "Status:",
      clearFilters: "Hapus Filter",
      tableHeaders: {
        company: "PT",
        purchaseOrder: "PURCHASE ORDER",
        invoiceNo: "NO INVOICE",
        invoiceDate: "TGL INVOICE",
        amount: "NOMINAL",
        submitDate: "TGL PENGUMPULAN",
        receivedDate: "TGL INVOICE DITERIMA",
        estimatedPaymentDate: "EST TGL PEMBAYARAN",
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
      cancellationReasons: {
        invoiceRevision: "Revisi Invoice",
        taxInvoiceRevision: "Revisi Faktur Pajak",
        incompleteDocuments:
          "Dokumen tidak lengkap / tidak jelas",
        retur: "Retur / Tidak Resupply",
      },
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
        estimatedPaymentDate: "EST PAYMENT DATE",
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
      cancellationReasons: {
        invoiceRevision: "Invoice Revision",
        taxInvoiceRevision: "Tax Invoice Revision",
        incompleteDocuments: "Incomplete / Unclear Documents",
        retur: "Return / No Resupply",
      },
      download: "Download",
    },
  };

  const currentLabels =
    vendorType === "local" ? labels.local : labels.overseas;
  const [selectedSchedule, setSelectedSchedule] =
    useState<PaymentScheduleItem | null>(null);
  const [showScheduleDetail, setShowScheduleDetail] =
    useState(false);
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

  // Mock payment schedule data with company
  const paymentSchedule: PaymentScheduleItem[] = [
    {
      id: "PS-001",
      createInvoice: "08/10/25",
      invoiceReceiptDate: "15/10/25",
      invoiceReceiptNo: "INV-0097",
      invoiceNo: "INV-0097",
      invoiceDate: "08/10/25",
      poNumber: "PO/WSI.MDN/2509/0765",
      totalAmount: "800000",
      submitDate: "10/10/25",
      receivedDate: "15/10/25",
      paymentDate: "20/10/25",
      status: "Paid",
      nominal: "800000",
      company: "WSI",
      attachments: [
        { name: "Invoice_0097.pdf", date: "08/10/25" },
        { name: "PO_Confirmation.pdf", date: "08/10/25" },
      ],
    },
    {
      id: "PS-002",
      createInvoice: "08/10/25",
      invoiceReceiptDate: "15/10/25",
      invoiceReceiptNo: "INV-0079",
      invoiceNo: "INV-0079",
      invoiceDate: "08/10/25",
      poNumber: "PO/AMT.MDN/2509/0829",
      totalAmount: "400000",
      submitDate: "10/10/25",
      receivedDate: "15/10/25",
      paymentDate: "22/10/25",
      status: "Paid",
      nominal: "400000",
      company: "AMT",
      attachments: [
        { name: "Invoice_0079.pdf", date: "08/10/25" },
      ],
    },
    {
      id: "PS-003",
      createInvoice: "08/10/25",
      invoiceReceiptDate: "15/10/25",
      invoiceReceiptNo: "INV-0165",
      invoiceNo: "INV-0165",
      invoiceDate: "08/10/25",
      poNumber: "PO/GMI.MDN/2510/0158",
      totalAmount: "81000",
      submitDate: "09/10/25",
      receivedDate: "15/10/25",
      paymentDate: "-",
      status: "On Process",
      nominal: "81000",
      company: "GMI",
      attachments: [
        { name: "Invoice_0165.pdf", date: "08/10/25" },
        { name: "PO_GMI_0158.pdf", date: "08/10/25" },
      ],
    },
    {
      id: "PS-004",
      createInvoice: "10/10/25",
      invoiceReceiptDate: "-",
      invoiceReceiptNo: "INV-0201",
      invoiceNo: "INV-0201",
      invoiceDate: "10/10/25",
      poNumber: "PO/WNS.MDN/2510/0245",
      totalAmount: "550000",
      submitDate: "11/10/25",
      receivedDate: "-",
      paymentDate: "-",
      status: "Submitted",
      nominal: "550000",
      company: "WNS",
      attachments: [
        { name: "Invoice_0201.pdf", date: "10/10/25" },
        { name: "Delivery_Note_0201.pdf", date: "10/10/25" },
      ],
    },
    {
      id: "PS-005",
      createInvoice: "12/10/25",
      invoiceReceiptDate: "18/10/25",
      invoiceReceiptNo: "INV-0210",
      invoiceNo: "INV-0210",
      invoiceDate: "12/10/25",
      poNumber: "PO/MJS.MDN/2510/0267",
      totalAmount: "300000",
      submitDate: "14/10/25",
      receivedDate: "18/10/25",
      paymentDate: "-",
      status: "On Process",
      nominal: "300000",
      company: "MJS",
      attachments: [
        { name: "Invoice_0210.pdf", date: "12/10/25" },
        { name: "Certificate_MJS.pdf", date: "12/10/25" },
      ],
    },
    {
      id: "PS-006",
      createInvoice: "14/10/25",
      invoiceReceiptDate: "20/10/25",
      invoiceReceiptNo: "INV-0225",
      invoiceNo: "INV-0225",
      invoiceDate: "14/10/25",
      poNumber: "PO/TTP.MDN/2510/0289",
      totalAmount: "150000",
      submitDate: "15/10/25",
      receivedDate: "20/10/25",
      paymentDate: "-",
      status: "Canceled",
      nominal: "150000",
      company: "TTP",
      attachments: [
        { name: "Invoice_0225.pdf", date: "14/10/25" },
      ],
      cancellationReason: "invoiceRevision",
    },
  ];

  // Filter payment schedule
  const filteredSchedule = paymentSchedule.filter((item) => {
    const matchStatus =
      filterStatus === "All" || item.status === filterStatus;
    const matchCompany =
      filterCompany === "All" || item.company === filterCompany;
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

    return (
      matchStatus &&
      matchCompany &&
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
      case "receivedDateSoftcopy":
        aValue = parseDate(a.receivedDate);
        bValue = parseDate(b.receivedDate);
        break;
      case "receivedDateHardcopy":
        aValue =
          a.status === "Paid" || a.status === "On Process"
            ? parseDate(a.receivedDate)
            : 0;
        bValue =
          b.status === "Paid" || b.status === "On Process"
            ? parseDate(b.receivedDate)
            : 0;
        break;
      case "estimatedPaymentDate":
        aValue = parseDate(a.paymentDate);
        bValue = parseDate(b.paymentDate);
        break;
      case "paymentDate":
        aValue =
          a.status === "Paid" ? parseDate(a.paymentDate) : 0;
        bValue =
          b.status === "Paid" ? parseDate(b.paymentDate) : 0;
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

  const getCancellationReasonLabel = (
    reasonKey: string,
  ): string => {
    const reasonMap =
      currentLabels.cancellationReasons as Record<
        string,
        string
      >;
    return reasonMap[reasonKey] || reasonKey;
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
      <div className="w-[1400px] mx-auto py-2 px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-100 mt-20 scale-100 origin-top">
          <h1 className="text-3xl mb-8 text-blue-600 text-center gap-3">
            {currentLabels.title}
          </h1>

          {/* Filter Section */}
          <div className="mb-6 flex items-center justify-between gap-4">
            {/* Left Side: Company & Status Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-5 text-gray-600" />
                <span className="text-gray-700">
                  {currentLabels.company}
                </span>
              </div>
              <Select
                value={filterCompany}
                onValueChange={(value: string) =>
                  setFilterCompany(value as FilterCompany)
                }
              >
                <SelectTrigger className="w-64 bg-white/80 border-gray-300 shadow-sm">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">
                    {currentLabels.selectOptions.allCompanies}
                  </SelectItem>
                  <SelectItem value="AMT">
                    PT. Asia Mulia Transpasifik (AMT)
                  </SelectItem>
                  <SelectItem value="GMI">
                    PT. Global Maritim Industri (GMI)
                  </SelectItem>
                  <SelectItem value="MJS">
                    PT. Multi Jaya Samudera (MJS)
                  </SelectItem>
                  <SelectItem value="TTP">
                    PT. Tanker Total Pasifik (TTP)
                  </SelectItem>
                  <SelectItem value="WNS">
                    PT. Waruna Nusa Sentana (WNS)
                  </SelectItem>
                  <SelectItem value="WSI">
                    PT. Waruna Shipyard Indonesia (WSI)
                  </SelectItem>
                </SelectContent>
              </Select>

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
                    {currentLabels.selectOptions.allStatus}
                  </SelectItem>
                  <SelectItem value="Submitted">
                    {currentLabels.selectOptions.submitted}
                  </SelectItem>
                  <SelectItem value="On Process">
                    {currentLabels.selectOptions.onProcess}
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

            {/* Right Side: Search & Clear Button */}
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
                  <Table className="table-fixed w-full text-center">
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-center align-middle">
                        <TableHead className="text-white py-3 px-2 rowspan-2 border-r border-teal-600 w-10 text-center align-middle text-xs truncate">
                          {currentLabels.tableHeaders.company}
                        </TableHead>
                        <TableHead className="text-white py-3 px-2 rowspan-2 border-r border-teal-600 w-16 text-center align-middle text-xs truncate">
                          {
                            currentLabels.tableHeaders
                              .purchaseOrder
                          }
                        </TableHead>

                        <TableHead className="text-white py-3 px-2 rowspan-2 border-r border-teal-600 w-11 text-center align-middle text-xs truncate">
                          {currentLabels.tableHeaders.invoiceNo}
                        </TableHead>

                        <TableHead
                          className="text-white py-3 px-2 rowspan-2 border-r border-teal-600 cursor-pointer hover:bg-teal-600 transition-colors w-12 text-center align-middle text-xs"
                          onClick={() => handleSort("amount")}
                        >
                          <div className="flex items-center justify-center gap-1 truncate">
                            <span className="truncate">
                              {
                                currentLabels.tableHeaders
                                  .amount
                              }
                            </span>
                            {getSortIcon("amount")}
                          </div>
                        </TableHead>
                        <TableHead
                          className="text-white py-3 px-2 rowspan-2 border-r border-teal-600 cursor-pointer hover:bg-teal-600 transition-colors w-20 text-center align-middle text-xs"
                          onClick={() =>
                            handleSort("submitDate")
                          }
                        >
                          <div className="flex items-center justify-center gap-1 truncate">
                            <span className="truncate">
                              {
                                currentLabels.tableHeaders
                                  .submitDate
                              }
                            </span>
                            {getSortIcon("submitDate")}
                          </div>
                        </TableHead>

                        <TableHead
                          className="text-white py-3 px-2 rowspan-2 border-r border-teal-600 cursor-pointer hover:bg-teal-600 transition-colors w-20 text-center align-middle text-xs"
                          onClick={() =>
                            handleSort("estimatedPaymentDate")
                          }
                        >
                          <div className="flex items-center justify-center gap-1 truncate">
                            <span className="truncate">
                              {
                                currentLabels.tableHeaders
                                  .estimatedPaymentDate
                              }
                            </span>
                            {getSortIcon(
                              "estimatedPaymentDate",
                            )}
                          </div>
                        </TableHead>

                        <TableHead
                          className="text-white py-3 px-2 rowspan-2 border-r border-teal-600 cursor-pointer hover:bg-teal-600 transition-colors w-20 text-center align-middle text-xs"
                          onClick={() =>
                            handleSort("paymentDate")
                          }
                        >
                          <div className="flex items-center justify-center gap-1 truncate">
                            <span className="truncate">
                              {
                                currentLabels.tableHeaders
                                  .paymentDate
                              }
                            </span>
                            {getSortIcon("paymentDate")}
                          </div>
                        </TableHead>
                        <TableHead className="text-white py-3 px-2 rowspan-2 w-20 text-center align-middle text-xs">
                          {currentLabels.tableHeaders.status}
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {sortedSchedule.map((schedule, index) => (
                        <TableRow
                          key={schedule.id}
                          className={`${
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-teal-50/30"
                          } hover:bg-teal-100/50 transition-all duration-200 cursor-pointer`}
                          onClick={() =>
                            handleViewScheduleDetail(schedule)
                          }
                        >
                          {/* Company */}
                          <TableCell className="text-gray-600 text-xs py-2 px-2 w-8 text-center truncate">
                            {schedule.company}
                          </TableCell>

                          {/* Purchase Order */}
                          <TableCell className="text-gray-600 text-xs py-2 px-2 w-16 text-center truncate">
                            {schedule.poNumber}
                          </TableCell>

                          {/* Invoice No */}
                          <TableCell className="text-blue-600 text-xs py-2 px-2 w-14 text-center font-medium truncate">
                            {schedule.invoiceNo}
                          </TableCell>

                          {/* Amount */}
                          <TableCell className="text-emerald-600 text-xs py-2 px-2 w-16 text-center font-medium truncate">
                            {currentLabels.currency}{" "}
                            {formatCurrency(
                              schedule.totalAmount,
                            )}
                          </TableCell>

                          {/* Submit Date */}
                          <TableCell className="text-gray-600 text-xs py-2 px-2 w-14 text-center truncate">
                            {schedule.submitDate}
                          </TableCell>

                          {/* Estimated Payment Date */}
                          <TableCell className="text-gray-600 text-xs py-2 px-2 w-14 text-center truncate">
                            {schedule.paymentDate || "-"}
                          </TableCell>

                          {/* Payment Date */}
                          <TableCell className="text-gray-600 text-xs py-2 px-2 w-14 text-center truncate">
                            {schedule.status === "Paid"
                              ? schedule.paymentDate
                              : "-"}
                          </TableCell>

                          {/* Status */}
                          <TableCell className="text-xs py-2 px-2 w-20 text-center">
                            {getStatusBadge(schedule.status)}
                          </TableCell>
                        </TableRow>
                      ))}
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
              {/* Tax Invoice Number */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-2">
                  {vendorType === "local"
                    ? "Nomor Faktur Pajak"
                    : "Tax Invoice Number"}
                </p>
                <p className="text-sm text-gray-700 font-medium">
                  {selectedSchedule.invoiceReceiptNo || "-"}
                </p>
              </div>

              {/* Invoice Date */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-2">
                  {vendorType === "local"
                    ? "Tanggal Invoice"
                    : "Invoice Date"}
                </p>
                <p className="text-sm text-gray-700 font-medium">
                  {selectedSchedule.invoiceDate || "-"}
                </p>
              </div>

              {/* Received Date - Softcopy & Hardcopy */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-2">
                    {vendorType === "local"
                      ? "Tgl Invoice Diterima - SCAN"
                      : "Invoice Receipt Date - SOFTCOPY"}
                  </p>
                  <p className="text-sm text-gray-700 font-medium">
                    {selectedSchedule.receivedDate || "-"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-2">
                    {vendorType === "local"
                      ? "Tgl Invoice Diterima - FISIK"
                      : "Invoice Receipt Date - HARDCOPY"}
                  </p>
                  <p className="text-sm text-gray-700 font-medium">
                    {selectedSchedule.status === "Paid" ||
                    selectedSchedule.status === "On Process"
                      ? selectedSchedule.receivedDate || "-"
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Cancellation Reason */}
              {selectedSchedule.status === "Canceled" &&
                selectedSchedule.cancellationReason && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-xs text-red-600 font-semibold uppercase mb-2">
                      {currentLabels.cancellationReasonLabel}
                    </p>
                    <p className="text-sm text-red-700 font-medium">
                      {getCancellationReasonLabel(
                        selectedSchedule.cancellationReason,
                      )}
                    </p>
                  </div>
                )}

              {/* Info Box - Available Cancellation Reasons (Always Show) */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 font-semibold uppercase mb-2">
                  {vendorType === "local"
                    ? "🚧 Alasan Pembatalan (Hanya internal remarks) | Alasan Pembatalan hanya muncul if status = Dibatalkan"
                    : "🚧 Available Cancellation Reasons (internal remarks only) | Show Reason only if status = Cancelled"}
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>
                    •{" "}
                    {
                      currentLabels.cancellationReasons
                        .invoiceRevision
                    }
                  </li>
                  <li>
                    •{" "}
                    {
                      currentLabels.cancellationReasons
                        .taxInvoiceRevision
                    }
                  </li>
                  <li>
                    •{" "}
                    {
                      currentLabels.cancellationReasons
                        .incompleteDocuments
                    }
                  </li>
                  <li>
                    • {currentLabels.cancellationReasons.retur}
                  </li>
                </ul>
              </div>

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