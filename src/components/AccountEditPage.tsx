import { useState } from "react";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { toast } from "sonner";

interface AccountEditPageProps {
  onCancel?: () => void;
  initialVendorType?: "local" | "overseas";
  initialTaxMode?: "tax" | "nonTax";
  onRevisionSubmitted?: () => void;
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
}

export function AccountEditPage({
  onCancel,
  initialVendorType = "local",
  initialTaxMode = "tax",
  onRevisionSubmitted,
  vendorType: propVendorType,
  setActiveView,
}: AccountEditPageProps) {
  const [displayVendorType, setDisplayVendorType] = useState<
    "local" | "overseas"
  >(propVendorType || initialVendorType);
  const [taxMode, setTaxMode] = useState<"tax" | "nonTax">(
    initialTaxMode,
  );
  const [showSuccessDialog, setShowSuccessDialog] =
    useState(false);
  const [isPending, setIsPending] = useState(false);

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
    phone: "16221599",
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
      paymentContactNotice:
        "PENTING: KONTAK INI AKAN MENERIMA OTP UNTUK VERIFIKASI BUKTI PEMBAYARAN",
      paymentInfoNote:
        "Mohon hubungi Tim Pembelian / Buyer kami jika ingin mengubah informasi pembayaran.",
      businessDetails: "Detail Bisnis",
      industryType: "Jenis Industri",
      businessSize: "Ukuran Perusahaan",
      certifications: "Sertifikasi",
      taxInfo: "Informasi Pajak",
      npwp: "NPWP (Nomor Pokok Wajib Pajak)",
      npwpStatus: "Status NPWP",
      taxInvoiceAddress: "Alamat PKP (Pengusaha Kena Pajak)",
      vendorNowNonTax: "Vendor saat ini Non Tax",
      revisionToTax: "Revisi menjadi Tax?",
      editTitle: "Ubah Informasi Akun Supplier",
      requestRevision: "Permintaan Revisi Informasi Akun",
      cancel: "Batal",
      close: "Tutup",
      requestSent: "Permintaan Terkirim",
      requestMessage:
        "Waruna Group akan meninjau dan memperbarui data akun Anda setelah disetujui.",
      country: "Negara",
      currency: "Kurs Pembayaran",
      fax: "Fax",
      status: "Status",
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
      bankCity: "Branch, City",
      bankInfo2: "Bank Account (Optional)",
      bankName2: "Bank Name",
      bankCode2: "Bank Code",
      bankBranchName2: "Bank Branch Name",
      accountNumber2: "Account Number",
      accountHolder2: "Account Holder Name",
      bankCity2: "Branch, City",
      paymentContactTitle: "Payment Contact Information",
      paymentContactMethod: "Contact Method",
      paymentContactWhatsapp: "WhatsApp Number",
      paymentContactEmail: "Email",
      paymentContactNotice:
        "IMPORTANT: THIS CONTACT WILL RECEIVE OTP FOR PAYMENT PROOF VERIFICATION",
      paymentInfoNote:
        "Please contact our Purchasing Team / Buyer if you want to make changes regarding payment information.",
      businessDetails: "Business Details",
      industryType: "Industry Type",
      businessSize: "Company Size",
      certifications: "Certifications",
      taxInfo: "Tax Information",
      npwp: "NPWP (Tax ID)",
      npwpStatus: "NPWP Status",
      taxInvoiceAddress: "Tax Invoice Address",
      vendorNowNonTax: "Vendor now Non Tax",
      revisionToTax: "Revision to Tax?",
      editTitle: "Edit Supplier Account Information",
      requestRevision: "Request Revision Account Information",
      cancel: "Cancel",
      close: "Close",
      requestSent: "Request Sent",
      requestMessage:
        "Waruna Group will review and update your account data once it has been approved.",
      country: "Country",
      currency: "Payment Currency",
      fax: "Fax",
      status: "Status",
    },
  };

  const currentLabels =
    labels[propVendorType || displayVendorType];

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

  const handleCertificationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const certs = e.target.value
      .split("\n")
      .filter((c) => c.trim() !== "");
    setFormData((prev) => ({
      ...prev,
      certifications: certs,
    }));
  };

  const handleSubmit = () => {
    setIsPending(true);
    console.log("Request Edit Account Information:", formData);

    // Simulate processing time
    setTimeout(() => {
      setIsPending(false);

      // Show pending notification
      const notificationMessage =
        propVendorType === "overseas" ||
        displayVendorType === "overseas"
          ? "Pending approval - Your changes will be automatically updated"
          : "Menunggu persetujuan - Perubahan Anda akan diperbarui secara otomatis";

      toast.loading(notificationMessage, {
        duration: 3000,
      });

      // Navigate back to account page
      if (setActiveView) {
        setActiveView("account");
      }
    }, 1500);
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    if (onRevisionSubmitted) {
      onRevisionSubmitted();
    }
  };

  return (
    <div className="bg-gray-50 pb-8">
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-gray-100 mt-20">
          <div className="mb-8 text-center">
            <h1 className="text-3xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {currentLabels.editTitle}
            </h1>
          </div>

          <div className="space-y-6">
            {/* Company Information */}
            <Card className="border border-gray-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-400" />
                  {currentLabels.companyInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.companyName}
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="h-12 border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.businessRegistration}
                    </Label>
                    <Input
                      id="businessRegistration"
                      value={formData.businessRegistration}
                      onChange={handleInputChange}
                      className="h-12 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.yearEstablished}
                    </Label>
                    <Input
                      id="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleInputChange}
                      className="h-12 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.website}
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="h-12 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.businessType}
                    </Label>
                    <Input
                      id="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="h-12 border border-gray-200 rounded-xl"
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
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-12 border border-gray-200 rounded-xl"
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

                  <div className="space-y-2">
                    <Label className="text-gray-600 text-sm">
                      {currentLabels.phone}
                    </Label>
                    <div className="flex gap-4">
                      {/* Kode area */}
                      <div className="flex-1 bg-gray-50/70 px-4 py-3 rounded-xl border border-gray-200 flex items-center">
                        <p className="text-gray-700">
                          ({formData.phoneCode}) -{" "}
                          {formData.phoneCode === "021"
                            ? "Jakarta"
                            : formData.phoneCode === "061"
                              ? "Sumatera Utara"
                              : formData.phoneCode === "031"
                                ? "Surabaya"
                                : formData.phoneCode === "022"
                                  ? "Bandung"
                                  : formData.phoneCode ===
                                      "0361"
                                    ? "Denpasar"
                                    : "Kode tidak dikenal"}
                        </p>
                      </div>

                      {/* Nomor telepon */}
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="flex-1 h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Address Section */}
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
                    <Input
                      id="addressStreet"
                      value={formData.addressStreet}
                      onChange={handleInputChange}
                      className="h-12 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-600 text-sm">
                        {currentLabels.addressProvince}
                      </Label>
                      <Input
                        id="addressProvince"
                        value={formData.addressProvince}
                        onChange={handleInputChange}
                        className="h-12 border border-gray-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600 text-sm">
                        {currentLabels.addressCity}
                      </Label>
                      <Input
                        id="addressCity"
                        value={formData.addressCity}
                        onChange={handleInputChange}
                        className="h-12 border border-gray-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600 text-sm">
                        {currentLabels.addressPostalCode}
                      </Label>
                      <Input
                        id="addressPostalCode"
                        value={formData.addressPostalCode}
                        onChange={handleInputChange}
                        className="h-12 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-600 text-sm">
                      {currentLabels.fullAddress}
                    </Label>
                    <textarea
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-gray-200 rounded-xl min-h-20"
                    />
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
                  <Input
                    id="industryType"
                    value={formData.industryType}
                    onChange={handleInputChange}
                    className="h-12 border border-gray-200 rounded-xl"
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
                    className="h-12 border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.certifications}
                  </Label>
                  <textarea
                    id="certifications"
                    value={formData.certifications.join("\n")}
                    onChange={handleCertificationChange}
                    placeholder="One certification per line"
                    className="w-full p-4 border border-gray-200 rounded-xl min-h-24 font-mono text-sm"
                  />
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
                {/* Nama Kontak */}
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.contactPersonName}
                  </Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="h-12 border border-gray-200 rounded-xl"
                  />
                </div>

                {/* Posisi & Email sejajar */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Posisi */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.position}
                    </Label>
                    <Input
                      id="contactPersonPosition"
                      value={formData.contactPersonPosition}
                      onChange={handleInputChange}
                      className="h-12 border border-gray-200 rounded-xl"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.email}
                    </Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                {/* Negara */}
                <div className="space-y-2">
                  <Label className="text-gray-600">
                    {currentLabels.countryCode}
                  </Label>
                  <select
                    id="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="w-full h-12 border border-gray-200 rounded-xl px-3 bg-white"
                  >
                    <option value="">Pilih kode negara</option>
                    <option value="+62">+62 - INDONESIA</option>
                    <option value="+60">+60 - MALAYSIA</option>
                    <option value="+65">+65 - SINGAPURA</option>
                    <option value="+63">+63 - FILIPINA</option>
                    <option value="+66">+66 - THAILAND</option>
                  </select>
                </div>

                {/* WhatsApp */}
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="space-y-2">
                      <Label className="text-gray-600">
                        {currentLabels[`whatsapp${num}`]}
                      </Label>
                      <div className="flex gap-2">
                        {/* Prefix kode negara mengikuti dropdown */}
                        <div className="bg-gray-50/70 px-4 py-3 rounded-xl border border-gray-200 w-fit flex items-center">
                          <p className="text-gray-700">
                            {formData.countryCode}
                          </p>
                        </div>
                        <Input
                          id={`whatsapp${num}`}
                          value={formData[`whatsapp${num}`]}
                          onChange={handleInputChange}
                          className="flex-1 h-12 border border-gray-200 bg-gray-50/70 rounded-xl"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="border border-gray-100 shadow-md opacity-75">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  {currentLabels.paymentInfo}
                </CardTitle>
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
                  📌 {currentLabels.paymentInfoNote}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.paymentMethod}
                    </Label>
                    <Select
                      value={formData.paymentMethod}
                      disabled
                    >
                      <SelectTrigger className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kredit">
                          Kredit
                        </SelectItem>
                        <SelectItem value="Cash">
                          Cash
                        </SelectItem>
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
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <Separator />

                <h3 className="text-sm font-semibold text-gray-700">
                  {currentLabels.bankInfo}
                </h3>

                <div className="grid md:grid-cols-4 gap-4">
                  {/* Nama Bank */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankName}
                    </Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Kode Bank */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankCode}
                    </Label>
                    <Input
                      id="bankCode"
                      value={formData.bankCode}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Nama Cabang */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankBranchName}
                    </Label>
                    <Input
                      id="bankBranchName"
                      value={formData.bankBranchName}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Kota Cabang */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankCity}
                    </Label>
                    <Input
                      id="bankCity"
                      value={formData.bankCity}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.accountNumber}
                    </Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.accountHolder}
                    </Label>
                    <Input
                      id="accountHolder"
                      value={formData.accountHolder}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <Separator />

                <h3 className="text-sm font-semibold text-gray-700">
                  {currentLabels.bankInfo2}
                </h3>

                <div className="grid md:grid-cols-4 gap-4">
                  {/* Nama Bank */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankName2}
                    </Label>
                    <Input
                      id="bankName2"
                      value={formData.bankName2}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Kode Bank */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankCode2}
                    </Label>
                    <Input
                      id="bankCode2"
                      value={formData.bankCode2}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Nama Cabang */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankBranchName2}
                    </Label>
                    <Input
                      id="bankBranchName2"
                      value={formData.bankBranchName2}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Kota Cabang */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.bankCity2}
                    </Label>
                    <Input
                      id="bankCity2"
                      value={formData.bankCity2}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Account Number */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.accountNumber2}
                    </Label>
                    <Input
                      id="accountNumber2"
                      value={formData.accountNumber2}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Account Holder */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.accountHolder2}
                    </Label>
                    <Input
                      id="accountHolder2"
                      value={formData.accountHolder2}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <Separator />

                <h3 className="text-sm font-semibold text-gray-700">
                  {currentLabels.paymentContactTitle}
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Metode kontak */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.paymentContactMethod}
                    </Label>
                    <Select
                      value={formData.paymentContactMethod}
                      disabled
                    >
                      <SelectTrigger className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed w-full">
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

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.paymentContactWhatsapp}
                    </Label>
                    <Input
                      id="paymentContactWhatsapp"
                      value={formData.paymentContactWhatsapp}
                      disabled
                      className="h-12 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed w-full"
                    />
                  </div>

                  {/* Metode kontak Email */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">
                      {currentLabels.paymentContactMethod}
                    </Label>
                    <div className="h-12 flex items-center px-4 rounded-xl border border-gray-200 bg-gray-50/70 w-full">
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
                      className="h-12 border border-gray-200 bg-gray-50/70 rounded-xl w-full mt-[22px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax Information */}
            <Card className="border border-gray-100 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-gray-700 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  {currentLabels.taxInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {initialTaxMode === "nonTax" ? (
                  <div className="text-center py-8">
                    <p className="text-gray-700 font-semibold mb-4">
                      {currentLabels.vendorNowNonTax}
                    </p>
                    <Button
                      onClick={() => setTaxMode("tax")}
                      variant="outline"
                      className="border-blue-400 text-blue-600 hover:bg-blue-50"
                    >
                      {currentLabels.revisionToTax}
                    </Button>
                  </div>
                ) : null}

                {taxMode === "tax" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-gray-600">
                        {currentLabels.npwp}
                      </Label>
                      <Input
                        id="npwp"
                        value={formData.npwp}
                        onChange={handleInputChange}
                        className="h-12 border border-gray-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">
                        {currentLabels.taxInvoiceAddress}
                      </Label>
                      <textarea
                        id="taxInvoiceAddress"
                        value={formData.taxInvoiceAddress}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-gray-200 rounded-xl min-h-24"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white h-12 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {currentLabels.requestRevision}...
                  </>
                ) : (
                  currentLabels.requestRevision
                )}
              </Button>
              <Button
                onClick={() => {
                  if (onCancel) onCancel();
                  if (setActiveView) setActiveView("account");
                }}
                variant="outline"
                className="h-12 px-8 rounded-xl border border-gray-200 hover:bg-gray-50"
              >
                {currentLabels.cancel}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-green-600">
              {currentLabels.requestSent}
            </DialogTitle>
            <DialogDescription className="text-center">
              {currentLabels.requestMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4">
            <Button
              onClick={handleSuccessDialogClose}
              className="w-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white h-10 rounded-lg"
            >
              {currentLabels.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}