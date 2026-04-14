import { ArrowLeft, LogOut, Bell, X } from "lucide-react";
import { useState, useEffect } from "react";
import LogoIMIWhite from "figma:asset/b02ecf5b59920736d31a4e06c94d18183301034a.png";
import LogoIMI from "figma:asset/44f0e2d307488884b49994dd88d631520e042d83.png";

import indonesiaFlag from "figma:asset/5f97d8e12658fd08d9d04cd9b93f0f14adf6db00.png";
import ukFlag from "figma:asset/ab0728dc55fb6e8f8d5296ed6c76e8aee1c2df43.png";
import indonesiaFlagCircle from "figma:asset/04e2b2bfed2bda498d40e5ab6a28a718fbaa232c.png";
import ukFlagCircle from "figma:asset/fdecde467c69903ab34a8a4c3a156281b924587e.png";

export function NavigationIMI({
  isMainDashboard = false,
  onBack,
  onLogout,
  hidden = false,
  vendorType = "local",
  onVendorTypeChange,
  onNotificationClick,
  onSetActiveTab,
  onSelectNotificationPO,
  onRemoveNotification,
  onNavigateToDocumentIMI,
}: {
  isMainDashboard?: boolean;
  onBack?: () => void;
  onLogout?: () => void;
  hidden?: boolean;
  vendorType?: "local" | "overseas";
  onVendorTypeChange?: (type: "local" | "overseas") => void;
  onNotificationClick?: () => void;
  onSetActiveTab?: (
    tab: "submission" | "creditNote" | "soa",
  ) => void;
  onSelectNotificationPO?: (poNumber: string) => void;
  onRemoveNotification?: (
    fn: (poNumber: string) => void,
  ) => void;
  onNavigateToDocumentIMI?: (
    tab: "submission" | "creditNote" | "soa",
    poNumber?: string,
  ) => void;
}) {
  const [showNotifications, setShowNotifications] =
    useState(false);

  // Notifications state - can be updated to remove notifications after submission
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      message:
        vendorType === "local"
          ? "Buat credit note untuk PO/IMI.MDN/2509/0001"
          : "Create credit note for PO/IMI.MDN/2509/0001",
      poNumber: "PO/IMI.MDN/2509/0001",
      timestamp: "2 hours ago",
      type: "credit_note",
    },
    {
      id: 2,
      message:
        vendorType === "local"
          ? "Buat credit note untuk PO/IMI.MDN/2509/0042"
          : "Create credit note for PO/IMI.MDN/2509/0042",
      poNumber: "PO/IMI.MDN/2509/0042",
      timestamp: "1 day ago",
      type: "credit_note",
    },
    {
      id: 3,
      message:
        vendorType === "local"
          ? "Buat credit note untuk PO/IMI.MDN/2510/0015"
          : "Create credit note for PO/IMI.MDN/2510/0015",
      poNumber: "PO/IMI.MDN/2510/0015",
      timestamp: "3 days ago",
      type: "credit_note",
    },
    {
      id: 4,
      message:
        vendorType === "local"
          ? "Upload SOA (Statement of Account)"
          : "Upload SOA (Statement of Account)",
      poNumber: "SOA",
      timestamp: "5 days ago",
      type: "soa",
    },
  ]);

  // Function to remove notification by PO number
  const removeNotificationByPO = (poNumber: string) => {
    console.log(
      "removeNotificationByPO called with:",
      poNumber,
    );
    console.log("Current notifications:", notificationsList);
    setNotificationsList((prev) => {
      const filtered = prev.filter(
        (notif) => notif.poNumber !== poNumber,
      );
      console.log("After filtering:", filtered);
      return filtered;
    });
  };

  // Register the remove function with parent
  useEffect(() => {
    if (onRemoveNotification) {
      onRemoveNotification(removeNotificationByPO);
    }
  }, [onRemoveNotification]);

  // Sample notifications data
  const notifications = notificationsList;

  const renderBackButton = () => {
    if (isMainDashboard) return null;
    return (
      <button
        onClick={() =>
          onBack ? onBack() : window.history.back()
        }
        className="flex items-center gap-2 text-black hover:text-gray-700 transition"
      >
        <ArrowLeft className="w-10 h-10" />
      </button>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full h-[100px] z-50 transition-transform duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex items-center justify-between h-full px-7 relative z-10">
        {/* Left side: Back button + Logo */}
        <div className="flex items-center gap-6">
          {/* Wrapper back button dengan lebar tetap */}
          <div className="w-10 flex justify-center">
            {renderBackButton()}
          </div>

          {/* Logo selalu di posisi tetap */}
          <img
            src={isMainDashboard ? LogoIMIWhite : LogoIMI}
            alt="IMI Logo"
            className="h-12"
          />
        </div>

        {/* Right side: Account icon */}
        <div className="ml-auto flex items-center gap-4">
          {/* Vendor Type Selector */}

          {/* Notification Button */}
          <button
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
            className="flex items-center gap-3 group relative"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition shadow-lg flex-shrink-0 ${
                isMainDashboard
                  ? "bg-white/20 text-white group-hover:bg-blue-500/30"
                  : "bg-white/20 text-black group-hover:bg-gray-200/30"
              }`}
            >
              <Bell
                className="w-6 h-6 font-bold transition-all"
                strokeWidth={2}
              />
              {notifications.length > 0 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {notifications.length > 99
                    ? "99+"
                    : notifications.length}
                </div>
              )}
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (onLogout) onLogout();
            }}
            className="flex items-center gap-3 group"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition shadow-lg flex-shrink-0 ${
                isMainDashboard
                  ? "bg-white/20 text-white group-hover:bg-blue-500/30"
                  : "bg-white/20 text-black group-hover:bg-gray-200/30"
              }`}
            >
              <LogOut
                className="w-6 h-6 font-bold transition-all"
                strokeWidth={2}
              />
            </div>
            <span
              className={`text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 duration-300 transition-opacity ${
                isMainDashboard ? "text-white" : "text-black"
              }`}
            >
              Logout
            </span>
          </button>
        </div>

        {/* Notification Drawer */}
        {showNotifications && (
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setShowNotifications(false)}
          />
        )}
        <div
          className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transition-transform duration-300 ease-out transform z-50 ${
            showNotifications
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 px-[24px] py-[23px]">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {vendorType === "local"
                  ? "Notifikasi"
                  : "Notifications"}
              </h2>
              <p className="text-sm text-[rgb(0,0,0)] mt-1 text-[15px] font-bold">
                To Do List
              </p>
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto h-[calc(100vh-80px)] border-t border-gray-100">
            <div className="p-4 space-y-3 px-[16px] py-[11px] mt-[2px]">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      // Tentukan tab tujuan berdasarkan tipe notifikasi
                      let targetTab:
                        | "soa"
                        | "creditNote"
                        | undefined;
                      if (notification.type === "soa") {
                        targetTab = "soa";
                      } else if (
                        notification.type === "credit_note"
                      ) {
                        targetTab = "creditNote";
                      }

                      // Navigasi ke DocumentIMI dengan tab tujuan + nomor PO
                      if (targetTab) {
                        if (onNavigateToDocumentIMI) {
                          onNavigateToDocumentIMI(
                            targetTab,
                            notification.poNumber,
                          ); // 👈 kirim tab + PO
                        }
                      }

                      // Callback tambahan tetap dijalankan
                      if (onNotificationClick) {
                        onNotificationClick();
                      }

                      setShowNotifications(false);
                    }}
                    className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">
                    {vendorType === "local"
                      ? "Tidak ada notifikasi"
                      : "No notifications"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {vendorType === "local"
                      ? "Anda akan menerima notifikasi di sini"
                      : "You'll receive notifications here"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}