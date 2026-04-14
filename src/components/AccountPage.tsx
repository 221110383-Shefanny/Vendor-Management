import {
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  CheckCircle,
  Eye,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AccountEditPage } from "./AccountEditPage";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function AccountPage({
  onEdit,
  vendorType = "local",
  setActiveView,
  revisionSubmitted = false,
}: {
  onEdit?: () => void;
  vendorType?: "local" | "overseas";
  setActiveView?: (
    view:
      | "dashboard"
      | "invoice"
      | "payment"
      | "account"
      | "message"
      | "accountedit",
  ) => void;
  revisionSubmitted?: boolean;
}) {
  const [taxMode, setTaxMode] = useState<"tax" | "nonTax">(
    "tax",
  );
  const [showRevisionRequest, setShowRevisionRequest] =
    useState(revisionSubmitted);

  // Auto-scroll to top when revision notification appears
  useEffect(() => {
    if (revisionSubmitted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [revisionSubmitted]);

  const supplierData = {
    companyName: "PT. PRIMERINDO (TOKO)",
    businessRegistration: "0522235010000001",
    yearEstablished: "2015",
    website: "www.primerindo.co.id",
    businessType: "Perdagangan Besar Non-Spesialisasi Lainnya",
    productCategory: "BOTOL PLASTIK",
    supplierCode: "SUP-2024-001",
    registrationDate: "15 Januari 2024",
    status: "Active",
    addressStreet:
      "JL. AMAL NO.80K, SUNGGAL, KEC. MEDAN SUNGGAL",
    addressProvince: "SUMATERA UTARA",
    addressCity: "MEDAN",
    addressPostalCode: "20127",
    address:
      "JL. AMAL NO.80K, SUNGGAL, KEC. MEDAN SUNGGAL, KOTA MEDAN, SUMATERA UTARA, Kode Pos 20127",
    email: "NO_SEND@EMAIL.COM",
    phoneCode: "061",
    phone: "+62 811-6221-599",
    mobile: "+62 811-6221-599",
    fax: "-",
    contactPerson: "ELLIS KWARSA",
    contactPersonPosition: "PEMILIK",
    countryCode: "+62",
    whatsapp1: "6281-1622-1599",
    whatsapp2: "",
    whatsapp3: "",
    npwp: "01.234.567.8-901.111",
    npwpStatus:
      "Non PKP or (PKP, nanti dibuat dropdown di bagian edit)",

    taxInvoiceAddress:
      "JL. AMAL NO.80K, SUNGGAL, KEC. MEDAN SUNGGAL, KOTA MEDAN, SUMATERA UTARA, Kode Pos 20127",
    paymentMethod:
      "Kredit (or Cash, nanti dibuat dropdown di bagian edit)",
    paymentTerms: "100 %",
    bankName: "BCA",
    bankCode: "002",
    bankBranchName: "MEDAN SUNGGAL",
    accountNumber: "1951114000",
    accountHolder: "ELLIS KWARSA",
    bankCity: "MEDAN, MEDAN",
    country: "INDONESIA",
    currency: "IDR",
    bankName2: "",
    bankCode2: "",
    bankBranchName2: "",
    accountNumber2: "",
    accountHolder2: "",
    bankCity2: "",
    paymentContactMethod: "WHATSAPP",
    paymentContactWhatsapp: "+62 1231-4453-1622",
    industryType: "SUKU CADANG MESIN",
    businessSize: "USAHA MIKRO (< 10 KARYAWAN)",
    certifications: ["ISO 9001 (QUALITY MANAGEMENT)"],
  };

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] =
    useState(false);
  const [showPendingReview, setShowPendingReview] =
    useState(false);
  const [showNpwpDialog, setShowNpwpDialog] = useState(false);
  const [showDocumentsDialog, setShowDocumentsDialog] =
    useState(false);

  // Sample documents data with images
  const documents = [
    {
      id: 1,
      name: "Business License",
      image:
        "https://unsplash.com/photos/orange-tabby-cat-on-brown-parquet-floor-LEpfefQf4rU",
      type: "License",
    },
    {
      id: 2,
      name: "Tax Certificate",
      image:
        "https://images.unsplash.com/photo-1557821552-17105176677c?w=300&h=200&fit=crop",
      type: "Certificate",
    },
    {
      id: 3,
      name: "Company Registration",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f70504646?w=300&h=200&fit=crop",
      type: "Registration",
    },
    {
      id: 4,
      name: "Bank Statement",
      image:
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf35f?w=300&h=200&fit=crop",
      type: "Bank",
    },
    {
      id: 5,
      name: "ISO Certificate",
      image:
        "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=300&h=200&fit=crop",
      type: "Certificate",
    },
  ];
  const [formData, setFormData] = useState({
    companyName: supplierData.companyName,
    businessRegistration: supplierData.businessRegistration,
    yearEstablished: supplierData.yearEstablished,
    website: supplierData.website,
    businessType: supplierData.businessType,
    productCategory: supplierData.productCategory,
    supplierCode: supplierData.supplierCode,
    registrationDate: supplierData.registrationDate,
    status: supplierData.status,
    addressStreet: supplierData.addressStreet,
    addressProvince: supplierData.addressProvince,
    addressCity: supplierData.addressCity,
    addressPostalCode: supplierData.addressPostalCode,
    address: supplierData.address,
    email: supplierData.email,
    phoneCode: supplierData.phoneCode,
    phone: supplierData.phone,
    mobile: supplierData.mobile,
    fax: supplierData.fax,
    contactPerson: supplierData.contactPerson,
    contactPersonPosition: supplierData.contactPersonPosition,
    countryCode: supplierData.countryCode,
    whatsapp1: supplierData.whatsapp1,
    whatsapp2: supplierData.whatsapp2,
    whatsapp3: supplierData.whatsapp3,
    npwp: supplierData.npwp,
    npwpStatus: "Non PKP",
    taxInvoiceAddress: supplierData.taxInvoiceAddress,
    paymentMethod: "Kredit",
    paymentTerms: supplierData.paymentTerms,
    bankName: supplierData.bankName,
    bankCode: supplierData.bankCode,
    bankBranchName: supplierData.bankBranchName,
    accountNumber: supplierData.accountNumber,
    accountHolder: supplierData.accountHolder,
    bankCity: supplierData.bankCity,
    country: supplierData.country,
    currency: supplierData.currency,
    bankName2: supplierData.bankName2,
    bankCode2: supplierData.bankCode2,
    bankBranchName2: supplierData.bankBranchName2,
    accountNumber2: supplierData.accountNumber2,
    accountHolder2: supplierData.accountHolder2,
    bankCity2: supplierData.bankCity2,
    paymentContactMethod: supplierData.paymentContactMethod,
    paymentContactWhatsapp: supplierData.paymentContactWhatsapp,
    industryType: supplierData.industryType,
    businessSize: supplierData.businessSize,
    certifications: supplierData.certifications || [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Request Edit Account Information:", formData);
    setShowEditDialog(false);
    setShowSuccessDialog(true);
  };

  // Labels for different languages
  const labels = {
    local: {
      pageTitle: "Informasi Akun Supplier",
      supplierCode: "Kode Supplier",
      registrationDate: "Tanggal Pendaftaran",
      companyInfo: "Informasi Perusahaan",
      companyName: "Nama Perusahaan",
      businessRegistration: "Nomor Registrasi Bisnis",
      yearEstablished: "Tahun Didirikan",
      website: "Website",
      businessType: "Jenis Usaha",
      productCategory: "Kategori / Jenis Produk",
      email: "Alamat Email",
      phoneCode: "Kode Area",
      phone: "Nomor Telepon",
      mobile: "Nomor Handphone",
      address: "Alamat Perusahaan",
      addressStreet: "Alamat Jalan",
      addressProvince: "Provinsi",
      addressCity: "Kota / Wilayah",
      addressPostalCode: "Kode Pos",
      fullAddress: "Alamat Lengkap",
      contactPerson: "Informasi Kontak Utama",
      contactPersonName: "Nama Kontak Utama",
      position: "Posisi / Jabatan",
      countryCode: "Negara",
      whatsapp1: "Nomor WhatsApp 1",
      whatsapp2: "Nomor WhatsApp 2",
      whatsapp3: "Nomor WhatsApp 3",
      paymentInfo: "Informasi Pembayaran",
      paymentMethod: "Metode Pembayaran",
      paymentTerms: "Syarat Pembayaran (%)",
      bankInfo: "Rekening Bank (Utama)",
      bankName: "Nama Bank",
      bankCode: "Kode Bank",
      bankBranchName: "Nama Cabang",
      accountNumber: "Nomor Rekening",
      accountHolder: "Nama Pemilik Rekening",
      bankCity: "Kota Cabang",
      bankInfo2: "Rekening Bank (Opsional)",
      bankName2: "Nama Bank",
      bankCode2: "Kode Bank",
      bankBranchName2: "Nama Cabang",
      accountNumber2: "Nomor Rekening",
      accountHolder2: "Nama Pemilik Rekening",
      bankCity2: "Kota Cabang",
      paymentContactTitle: "Kontak Bukti Pembayaran",
      paymentContactMethod: "Metode Kontak",
      paymentContactWhatsapp: "Nomor WhatsApp",
      paymentContactEmail: "Email",
      paymentContactEmailField: "Alamat Email",
      paymentContactNotice:
        "PENTING: KONTAK INI AKAN MENERIMA OTP UNTUK VERIFIKASI BUKTI PEMBAYARAN",
      businessDetails: "Detail Bisnis",
      industryType: "Jenis Industri",
      businessSize: "Ukuran Perusahaan",
      certifications: "Sertifikasi",
      taxInfo: "Informasi Pajak",
      npwp: "NPWP (Nomor Pokok Wajib Pajak)",
      npwpStatus: "Status NPWP",
      taxInvoiceAddress: "Alamat PKP (Pengusaha Kena Pajak)",
      editSupplierInfo: "Ubah Informasi Supplier",
      viewDocuments: "Lihat Dokumen",
    },
    overseas: {
      pageTitle: "Supplier Account Information",
      supplierCode: "Supplier Code",
      registrationDate: "Registration Date",
      companyInfo: "Company Information",
      companyName: "Company Name",
      businessRegistration: "Business Registration Number",
      yearEstablished: "Year Established",
      website: "Website",
      businessType: "Business Type",
      productCategory: "Product Category / Type",
      email: "Email Address",
      phoneCode: "Area Code",
      phone: "Phone Number",
      mobile: "Mobile Number",
      address: "Company Address",
      addressStreet: "Street Address",
      addressProvince: "Province",
      addressCity: "City / Area",
      addressPostalCode: "Postal Code",
      fullAddress: "Full Address",
      contactPerson: "Contact Person Information",
      contactPersonName: "Contact Person Name",
      position: "Position / Title",
      countryCode: "Country",
      whatsapp1: "WhatsApp Number 1",
      whatsapp2: "WhatsApp Number 2",
      whatsapp3: "WhatsApp Number 3",
      paymentInfo: "Payment Information",
      paymentMethod: "Payment Method",
      paymentTerms: "Payment Terms (%)",
      bankInfo: "Bank Account (Main)",
      bankName: "Bank Name",
      bankCode: "Bank Code",
      bankBranchName: "Bank Branch Name",
      accountNumber: "Account Number",
      accountHolder: "Account Holder Name",
      bankCity: "City",
      bankInfo2: "Bank Account (Optional)",
      bankName2: "Bank Name",
      bankCode2: "Bank Code",
      bankBranchName2: "Bank Branch Name",
      accountNumber2: "Account Number",
      accountHolder2: "Account Holder Name",
      bankCity2: "City",
      paymentContactTitle: "Payment Contact Information",
      paymentContactMethod: "Contact Method",
      paymentContactWhatsapp: "WhatsApp Number",
      paymentContactEmail: "Email",
      paymentContactEmailField: "Email Address",
      paymentContactNotice:
        "IMPORTANT: THIS CONTACT WILL RECEIVE OTP FOR PAYMENT PROOF VERIFICATION",
      businessDetails: "Business Details",
      industryType: "Industry Type",
      businessSize: "Company Size",
      certifications: "Certifications",
      taxInfo: "Tax Information",
      npwp: "NPWP (Tax ID)",
      npwpStatus: "NPWP Status",
      taxInvoiceAddress: "Tax Invoice Address",
      editSupplierInfo: "Edit Supplier Information",
      viewDocuments: "View Documents",
    },
  };

  const currentLabels =
    vendorType === "local" ? labels.local : labels.overseas;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-100 mt-20">
        <h1 className="text-3xl mb-8 text-blue-600 text-center">
          {currentLabels.pageTitle}
        </h1>

        {showRevisionRequest && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">
                !
              </span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-yellow-800">
                {vendorType === "local"
                  ? "Permintaan Revisi Sedang Ditinjau"
                  : "Revision Request Under Review"}
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                {vendorType === "local"
                  ? "Permintaan revisi informasi akun Anda sedang ditinjau. Kami akan memperbarui data Anda setelah disetujui."
                  : "Your account information revision request is currently being reviewed. We will update your data once it has been approved."}
              </p>
            </div>
          </div>
        )}
        {showPendingReview && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">
                !
              </span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-yellow-800">
                Revision Request Under Review
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Your account information revision request is
                currently being reviewed. We will notify you
                once it has been approved.
              </p>
            </div>
          </div>
        )}

        <div>
          {/* Supplier Profile Card */}
          <div className="w-full">
            <Card className="border border-blue-100 bg-gradient-to-br from-blue-50/50 to-purple-50/50 shadow-md">
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[20px]">
                <div className="bg-white/70 p-4 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500">
                    {currentLabels.supplierCode}
                  </p>
                  <p className="text-blue-500">
                    {supplierData.supplierCode}
                  </p>
                </div>

                <div className="bg-white/70 p-4 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500">
                    {currentLabels.registrationDate}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {supplierData.registrationDate}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supplier Details */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border border-gray-100 shadow-md mt-[20px]">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-400" />
                  {currentLabels.companyInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* nama perusahaan company */}
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.companyName}
                  </Label>
                  <div className="bg-gradient-to-r from-blue-50/70 to-purple-50/70 p-4 rounded-xl border border-blue-100">
                    <p className="text-xl text-gray-700">
                      {supplierData.companyName}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.businessRegistration}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.businessRegistration}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.yearEstablished}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.yearEstablished}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.website}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-blue-500 hover:underline cursor-pointer">
                        {supplierData.website}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.businessType}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.businessType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* alamat address */}

                {/* kategori produk product category */}

                <Separator />
                {/* email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Mail className="w-4 h-4" />
                    {currentLabels.email}
                  </Label>
                  <Input
                    id="email"
                    value={supplierData.email}
                    readOnly
                    className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  {/* Satu label untuk keduanya */}
                  <Label
                    htmlFor="phone"
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Phone className="w-4 h-4" />
                    {currentLabels.phone}{" "}
                    {/* misalnya "Telepon" */}
                  </Label>

                  {/* Dua input dalam satu baris */}
                  <div className="flex gap-4">
                    <Input
                      id="phoneCode"
                      value={`(${supplierData.phoneCode}) - Sumatera Utara`}
                      readOnly
                      className="flex-1 h-12 border border-gray-200 bg-gray-50/70 rounded-xl text-left"
                    />
                    <Input
                      id="phone"
                      value={supplierData.phone
                        .replace(/[^\d]/g, "")
                        .slice(-8)}
                      readOnly
                      className="flex-1 h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                    />
                  </div>
                </div>

                <Separator />
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600 font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {currentLabels.address}
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600 text-sm">
                      {currentLabels.addressStreet}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.addressStreet}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-600 text-sm">
                        {currentLabels.addressProvince}
                      </Label>
                      <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-700">
                          {supplierData.addressProvince}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600 text-sm">
                        {currentLabels.addressCity}
                      </Label>
                      <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-700">
                          {supplierData.addressCity}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600 text-sm">
                        {currentLabels.addressPostalCode}
                      </Label>
                      <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-700">
                          {supplierData.addressPostalCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600 text-sm">
                      {currentLabels.fullAddress}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.address}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Details */}
            <Card className="border border-gray-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 flex items-center gap-2">
                  <Building className="w-5 h-5 text-cyan-400" />
                  {currentLabels.businessDetails}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.industryType}
                  </Label>
                  <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                    <p className="text-gray-700">
                      {supplierData.industryType}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.businessSize}
                  </Label>
                  <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                    <p className="text-gray-700">
                      {supplierData.businessSize}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.certifications}
                  </Label>
                  <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200 space-y-2">
                    {supplierData.certifications &&
                    supplierData.certifications.length > 0 ? (
                      supplierData.certifications.map(
                        (cert, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <p className="text-gray-700">
                              {cert}
                            </p>
                          </div>
                        ),
                      )
                    ) : (
                      <p className="text-gray-400">-</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Person Information */}
            <Card className="border border-gray-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-400" />
                  {currentLabels.contactPerson}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.contactPersonName}
                  </Label>
                  <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                    <p className="text-gray-700">
                      {supplierData.contactPerson}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Kolom kiri: Position */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.position}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.contactPersonPosition}
                      </p>
                    </div>
                  </div>

                  {/* Kolom kanan: Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="contactEmail"
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <Mail className="w-4 h-4" />
                      {currentLabels.email}
                    </Label>
                    <Input
                      id="contactEmail"
                      value={supplierData.email}
                      readOnly
                      className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.countryCode}
                  </Label>
                  <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                    <p className="text-gray-700">
                      {supplierData.countryCode} - INDONESIA
                    </p>
                  </div>
                </div>

                {/* WhatsApp 1–3 sejajar */}
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="space-y-2">
                      <Label className="text-gray-600">
                        {currentLabels[`whatsapp${num}`]}
                      </Label>
                      <div className="flex gap-2">
                        <div className="bg-gray-50/70 px-4 py-3 rounded-xl border border-gray-200 w-fit flex items-center">
                          <p className="text-gray-700">
                            {supplierData.countryCode}
                          </p>
                        </div>
                        <Input
                          id={`whatsapp${num}`}
                          value={supplierData[`whatsapp${num}`]}
                          readOnly
                          className="flex-1 h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="border border-gray-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  {currentLabels.paymentInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.paymentMethod}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.paymentTerms}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.paymentTerms}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600 font-semibold">
                    {currentLabels.bankInfo}
                  </Label>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankName}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.bankName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankCode}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.bankCode}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankBranchName}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.bankBranchName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankCity}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.bankCity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.accountNumber}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.accountNumber}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.accountHolder}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.accountHolder}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Label className="text-gray-600 font-semibold">
                    {currentLabels.bankInfo2}
                  </Label>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankName2}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.bankName2 || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankCode2}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.bankCode2 || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankBranchName2}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.bankBranchName2 || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankCity2}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.bankCity2 || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.accountNumber2}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.accountNumber2 || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.accountHolder2}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.accountHolder2 || "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 pt-4">
                  <Label className="text-gray-600 font-semibold">
                    {currentLabels.paymentContactTitle}
                  </Label>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Metode kontak */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.paymentContactMethod}
                    </Label>
                    <div className="h-12 flex items-center px-4 rounded-xl border border-gray-200 bg-gray-50/70">
                      <p className="text-gray-700">
                        {supplierData.paymentContactMethod}
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.paymentContactWhatsapp}
                    </Label>
                    <div className="flex gap-4">
                      <div className="h-12 flex items-center px-4 rounded-xl border border-gray-200 bg-gray-50/70">
                        <p className="text-gray-700">
                          {supplierData.countryCode}
                        </p>
                      </div>
                      <Input
                        value={
                          supplierData.paymentContactWhatsapp
                        }
                        readOnly
                        className="flex-1 h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Metode kontak Email */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.paymentContactMethod}
                    </Label>
                    <div className="h-12 flex items-center px-4 rounded-xl border border-gray-200 bg-gray-50/70">
                      <p className="text-gray-700">
                        {currentLabels.paymentContactEmail}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.paymentContactEmailField}
                    </Label>
                    <Input
                      value={supplierData.email}
                      readOnly
                      className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl text-gray-700 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    {currentLabels.taxInfo}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setTaxMode("tax")}
                      className={`px-4 h-9 rounded-lg font-medium text-sm transition-all ${
                        taxMode === "tax"
                          ? "bg-purple-400 text-white shadow-md"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Tax
                    </Button>
                    <Button
                      onClick={() => setTaxMode("nonTax")}
                      className={`px-4 h-9 rounded-lg font-medium text-sm transition-all ${
                        taxMode === "nonTax"
                          ? "bg-purple-400 text-white shadow-md"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Non Tax
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-semibold">
                    Temporary:
                  </span>{" "}
                  Toggle to show different data format
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {taxMode === "tax" ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-gray-600">
                        {currentLabels.npwp}
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex-1">
                          <p className="text-lg text-gray-700">
                            {supplierData.npwp}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setShowNpwpDialog(true)
                          }
                          className="p-2 hover:bg-purple-100 rounded-lg transition-colors flex-shrink-0"
                          title="View NPWP Card"
                        >
                          <Eye className="w-5 h-5 text-purple-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">
                        {currentLabels.taxInvoiceAddress}
                      </Label>
                      <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-700">
                          {supplierData.taxInvoiceAddress}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 font-semibold">
                      Non Tax Vendor
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                  setActiveView && setActiveView("accountedit");
                }}
                className="flex-1 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white h-12 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {currentLabels.editSupplierInfo}
              </Button>
              <Button
                onClick={() => setShowDocumentsDialog(true)}
                variant="outline"
                className="h-12 px-8 rounded-xl border border-gray-200 hover:bg-gray-50"
              >
                {currentLabels.viewDocuments}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      >
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Edit Supplier Account Information
            </DialogTitle>
            <DialogDescription>
              Update your supplier account information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Company Information */}
            <Card className="border border-gray-100 shadow-md mt-[20px]">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-400" />
                  {currentLabels.companyInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nama perusahaan */}
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.companyName}
                  </Label>
                  <Input
                    id="companyName"
                    value={supplierData.companyName}
                    onChange={(e) =>
                      setSupplierData({
                        ...supplierData,
                        companyName: e.target.value,
                      })
                    }
                    className="h-12 border border-blue-100 bg-gradient-to-r from-blue-50/70 to-purple-50/70 rounded-xl text-gray-700 text-xl"
                  />
                </div>

                {/* Registrasi & Tahun berdiri */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.businessRegistration}
                    </Label>
                    <Input
                      id="businessRegistration"
                      value={supplierData.businessRegistration}
                      onChange={(e) =>
                        setSupplierData({
                          ...supplierData,
                          businessRegistration: e.target.value,
                        })
                      }
                      className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl text-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.yearEstablished}
                    </Label>
                    <Input
                      id="yearEstablished"
                      value={supplierData.yearEstablished}
                      onChange={(e) =>
                        setSupplierData({
                          ...supplierData,
                          yearEstablished: e.target.value,
                        })
                      }
                      className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl text-gray-700"
                    />
                  </div>
                </div>

                {/* Website & Business Type */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.website}
                    </Label>
                    <Input
                      id="website"
                      value={supplierData.website}
                      onChange={(e) =>
                        setSupplierData({
                          ...supplierData,
                          website: e.target.value,
                        })
                      }
                      className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl text-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.businessType}
                    </Label>
                    <Input
                      id="businessType"
                      value={supplierData.businessType}
                      onChange={(e) =>
                        setSupplierData({
                          ...supplierData,
                          businessType: e.target.value,
                        })
                      }
                      className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl text-gray-700"
                    />
                  </div>
                </div>

                <Separator />

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Mail className="w-4 h-4" />
                    {currentLabels.email}
                  </Label>
                  <Input
                    id="email"
                    value={supplierData.email}
                    onChange={(e) =>
                      setSupplierData({
                        ...supplierData,
                        email: e.target.value,
                      })
                    }
                    className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Phone className="w-4 h-4" />
                    {currentLabels.phone}
                  </Label>
                  <div className="flex gap-4">
                    <Input
                      id="phoneCode"
                      value={supplierData.phoneCode}
                      onChange={(e) =>
                        setSupplierData({
                          ...supplierData,
                          phoneCode: e.target.value,
                        })
                      }
                      className="flex-1 h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                    />
                    <Input
                      id="phone"
                      value={supplierData.phone}
                      onChange={(e) =>
                        setSupplierData({
                          ...supplierData,
                          phone: e.target.value,
                        })
                      }
                      className="flex-1 h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                    />
                  </div>
                </div>

                <Separator />

                {/* Address */}
                <div className="space-y-4">
                  <Label className="text-gray-600 font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {currentLabels.address}
                  </Label>

                  <div className="space-y-2">
                    <Label className="text-gray-600 text-sm">
                      {currentLabels.addressStreet}
                    </Label>
                    <Input
                      id="addressStreet"
                      value={supplierData.addressStreet}
                      onChange={(e) =>
                        setSupplierData({
                          ...supplierData,
                          addressStreet: e.target.value,
                        })
                      }
                      className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-600 text-sm">
                        {currentLabels.addressProvince}
                      </Label>
                      <Input
                        id="addressProvince"
                        value={supplierData.addressProvince}
                        onChange={(e) =>
                          setSupplierData({
                            ...supplierData,
                            addressProvince: e.target.value,
                          })
                        }
                        className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600 text-sm">
                        {currentLabels.addressCity}
                      </Label>
                      <Input
                        id="addressCity"
                        value={supplierData.addressCity}
                        onChange={(e) =>
                          setSupplierData({
                            ...supplierData,
                            addressCity: e.target.value,
                          })
                        }
                        className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600 text-sm">
                        {currentLabels.addressPostalCode}
                      </Label>
                      <Input
                        id="addressPostalCode"
                        value={supplierData.addressPostalCode}
                        onChange={(e) =>
                          setSupplierData({
                            ...supplierData,
                            addressPostalCode: e.target.value,
                          })
                        }
                        className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600 text-sm">
                      {currentLabels.fullAddress}
                    </Label>
                    <Textarea
                      id="address"
                      value={supplierData.address}
                      onChange={(e) =>
                        setSupplierData({
                          ...supplierData,
                          address: e.target.value,
                        })
                      }
                      className="border border-gray-200 bg-gray-50/70 rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Building className="w-5 h-5 text-cyan-400" />
                {currentLabels.businessDetails}
              </h3>

              <div className="space-y-2">
                <Label className="text-gray-600">
                  {currentLabels.industryType}
                </Label>
                <Input
                  id="industryType"
                  value={formData.industryType}
                  onChange={handleInputChange}
                  className="h-10 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-600">
                  {currentLabels.businessSize}
                </Label>
                <Input
                  id="businessSize"
                  value={formData.businessSize}
                  onChange={handleInputChange}
                  className="h-10 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-600">
                  {currentLabels.certifications}
                </Label>
                <textarea
                  id="certifications"
                  value={
                    formData.certifications
                      ? formData.certifications.join("\n")
                      : ""
                  }
                  onChange={(e) => {
                    const certs = e.target.value
                      .split("\n")
                      .filter((c) => c.trim() !== "");
                    setFormData((prev) => ({
                      ...prev,
                      certifications: certs,
                    }));
                  }}
                  placeholder="One certification per line"
                  className="w-full p-2 border border-gray-200 rounded-lg min-h-20"
                />
              </div>
            </div>

            {/* Contact Person Information */}
            <Card className="border border-gray-100 shadow-md mt-[20px]">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-400" />
                  {currentLabels.companyInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* nama perusahaan company */}
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.companyName}
                  </Label>
                  <div className="bg-gradient-to-r from-blue-50/70 to-purple-50/70 p-4 rounded-xl border border-blue-100">
                    <p className="text-xl text-gray-700">
                      {supplierData.companyName}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.businessRegistration}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.businessRegistration}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.yearEstablished}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.yearEstablished}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.website}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-blue-500 hover:underline cursor-pointer">
                        {supplierData.website}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.businessType}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.businessType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* alamat address */}

                {/* kategori produk product category */}

                <Separator />
                {/* email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Mail className="w-4 h-4" />
                    {currentLabels.email}
                  </Label>
                  <Input
                    id="email"
                    value={supplierData.email}
                    readOnly
                    className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  {/* Satu label untuk keduanya */}
                  <Label
                    htmlFor="phone"
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Phone className="w-4 h-4" />
                    {currentLabels.phone}{" "}
                    {/* misalnya "Telepon" */}
                  </Label>

                  {/* Dua input dalam satu baris */}
                  <div className="flex gap-4">
                    <Input
                      id="phoneCode"
                      value={`(${supplierData.phoneCode}) - Sumatera Utara`}
                      readOnly
                      className="flex-1 h-12 border border-gray-200 bg-gray-50/70 rounded-xl text-left"
                    />
                    <Input
                      id="phone"
                      value={supplierData.phone
                        .replace(/[^\d]/g, "")
                        .slice(-8)}
                      readOnly
                      className="flex-1 h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                    />
                  </div>
                </div>

                <Separator />
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600 font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {currentLabels.address}
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600 text-sm">
                      {currentLabels.addressStreet}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.addressStreet}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-600 text-sm">
                        {currentLabels.addressProvince}
                      </Label>
                      <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-700">
                          {supplierData.addressProvince}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600 text-sm">
                        {currentLabels.addressCity}
                      </Label>
                      <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-700">
                          {supplierData.addressCity}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600 text-sm">
                        {currentLabels.addressPostalCode}
                      </Label>
                      <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-700">
                          {supplierData.addressPostalCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600 text-sm">
                      {currentLabels.fullAddress}
                    </Label>
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700">
                        {supplierData.address}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-400" />
                {currentLabels.paymentInfo}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.paymentMethod}
                  </Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value: string) =>
                      handleSelectChange("paymentMethod", value)
                    }
                  >
                    <SelectTrigger className="h-10 border border-gray-200 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kredit">
                        Kredit
                      </SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.paymentTerms}
                  </Label>
                  <Input
                    id="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="text-sm font-semibold text-gray-700 mt-4">
                {currentLabels.bankInfo}
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.bankName}
                  </Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.bankCode}
                  </Label>
                  <Input
                    id="bankCode"
                    value={formData.bankCode}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.bankBranchName}
                  </Label>
                  <Input
                    id="bankBranchName"
                    value={formData.bankBranchName}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.bankCity}
                  </Label>
                  <Input
                    id="bankCity"
                    value={formData.bankCity}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.accountNumber}
                  </Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.accountHolder}
                  </Label>
                  <Input
                    id="accountHolder"
                    value={formData.accountHolder}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="text-sm font-semibold text-gray-700 mt-4">
                {currentLabels.bankInfo2}
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.bankName2}
                  </Label>
                  <Input
                    id="bankName2"
                    value={formData.bankName2}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.bankCode2}
                  </Label>
                  <Input
                    id="bankCode2"
                    value={formData.bankCode2}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.bankBranchName2}
                  </Label>
                  <Input
                    id="bankBranchName2"
                    value={formData.bankBranchName2}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.bankCity2}
                  </Label>
                  <Input
                    id="bankCity2"
                    value={formData.bankCity2}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.accountNumber2}
                  </Label>
                  <Input
                    id="accountNumber2"
                    value={formData.accountNumber2}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.accountHolder2}
                  </Label>
                  <Input
                    id="accountHolder2"
                    value={formData.accountHolder2}
                    onChange={handleInputChange}
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Payment Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                {currentLabels.paymentContactTitle}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.paymentContactMethod}
                  </Label>
                  <Select
                    value={formData.paymentContactMethod}
                    onValueChange={(value: string) =>
                      handleSelectChange(
                        "paymentContactMethod",
                        value,
                      )
                    }
                  >
                    <SelectTrigger className="h-10 border border-gray-200 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WHATSAPP">
                        WhatsApp
                      </SelectItem>
                      <SelectItem value="TELEGRAM">
                        Telegram
                      </SelectItem>
                      <SelectItem value="PHONE">
                        Phone
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.paymentContactWhatsapp}
                  </Label>
                  <Input
                    id="paymentContactWhatsapp"
                    value={formData.paymentContactWhatsapp}
                    onChange={handleInputChange}
                    placeholder="+62 1231-4453-1622"
                    className="h-10 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                <p className="text-yellow-700 text-sm font-semibold">
                  ⚠️ {currentLabels.paymentContactNotice}
                </p>
              </div>
            </div>

            {/* Tax Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                {currentLabels.taxInfo}
              </h3>

              <div className="space-y-2">
                <Label className="text-gray-600">
                  {currentLabels.npwp}
                </Label>
                <Input
                  id="npwp"
                  value={formData.npwp}
                  onChange={handleInputChange}
                  className="h-10 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-600">
                  {currentLabels.npwpStatus}
                </Label>
                <Select
                  value={formData.npwpStatus}
                  onValueChange={(value: string) =>
                    handleSelectChange("npwpStatus", value)
                  }
                >
                  <SelectTrigger className="h-10 border border-gray-200 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Non PKP">
                      Non PKP
                    </SelectItem>
                    <SelectItem value="PKP">PKP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-600">
                  {currentLabels.taxInvoiceAddress}
                </Label>
                <textarea
                  id="taxInvoiceAddress"
                  value={formData.taxInvoiceAddress}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded-lg min-h-20"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white h-10 rounded-lg"
              >
                Request Edit Account Information
              </Button>
              <Button
                onClick={() => setShowEditDialog(false)}
                variant="outline"
                className="h-10 px-8 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* NPWP View Dialog */}
      <Dialog
        open={showNpwpDialog}
        onOpenChange={setShowNpwpDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              {currentLabels.npwp}
            </DialogTitle>
            <DialogDescription>
              {vendorType === "local"
                ? "Lihat detail nomor registrasi pajak Anda"
                : "View your tax registration number details"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    {currentLabels.npwp}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 font-mono">
                    {supplierData.npwp}
                  </p>
                </div>
                <Separator />
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">
                      {currentLabels.npwpStatus}:
                    </span>{" "}
                    {formData.npwpStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-green-600">
              Request Sent
            </DialogTitle>
            <DialogDescription className="text-center">
              Waruna Group will review and update your account
              data once it has been approved.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                setShowPendingReview(true);
              }}
              className="w-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white h-10 rounded-lg"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Documents Gallery Dialog */}
      <Dialog
        open={showDocumentsDialog}
        onOpenChange={setShowDocumentsDialog}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {currentLabels.viewDocuments}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  {/* Document Image */}
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                    <Eye className="w-8 h-8 text-white mb-2" />
                    <p className="text-white text-sm font-semibold text-center px-2">
                      View
                    </p>
                  </div>

                  {/* Document Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-sm font-semibold truncate">
                      {doc.name}
                    </p>
                    <p className="text-gray-200 text-xs">
                      {doc.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}