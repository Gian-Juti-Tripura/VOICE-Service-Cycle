import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  User, 
  Users,
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Droplet, 
  Heart, 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  Share2, 
  ShieldCheck, 
  X, 
  Building,
  UserCheck,
  Edit3,
  Trash2,
  Lock,
  Download,
  RotateCcw,
  Camera,
  Save,
  Check,
  Crown,
  BookOpen,
  Award,
  Quote,
  ArrowRight,
  Layers,
  FileText,
  Copy,
  Printer,
  ChevronDown
} from "lucide-react";
import { jsPDF } from "jspdf";
import { useLanguage } from "../../context/LanguageContext";
import { 
  INITIAL_DEVOTEES_DATA, 
  SPIRITUAL_LINEAGE_DATA,
  type DevoteeProfile, 
  type NectarDrop,
  type SpiritualLineageProfile 
} from "../../data/devoteeProfilesData";
import { triggerHaptic } from "../../utils/haptics";
import toast from "react-hot-toast";

const STORAGE_KEY = "advaita_voice_devotees_profiles_v1";
const ADMIN_MODE_KEY = "advaita_voice_profiles_admin_mode";

export default function DevoteeProfilesPage() {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const [searchParams, setSearchParams] = useSearchParams();

  // Primary Tab: Lineage vs Residents
  const paramTab = searchParams.get("tab");
  const [activeViewTab, setActiveViewTab] = useState<"LINEAGE" | "RESIDENTS">(
    paramTab === "residents" ? "RESIDENTS" : "LINEAGE"
  );

  // Lineage Modal State
  const [selectedLineage, setSelectedLineage] = useState<SpiritualLineageProfile | null>(null);
  const [lineageModalTab, setLineageModalTab] = useState<"BIO" | "ACHIEVEMENTS" | "BOOKS" | "QUOTES" | "VOICE">("BIO");
  const [lineageSearchQuery, setLineageSearchQuery] = useState("");

  // Admin Mode State (Persisted)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(ADMIN_MODE_KEY);
    return saved !== null ? saved === "true" : true;
  });

  const toggleAdminMode = () => {
    triggerHaptic("medium");
    setIsAdminMode(prev => {
      const next = !prev;
      localStorage.setItem(ADMIN_MODE_KEY, String(next));
      toast.success(next 
        ? (isBn ? "অ্যাডমিন মোড সক্রিয় 🛡️ (সম্পাদনা সুবিধা উন্মুক্ত)" : "Admin Mode Enabled 🛡️ (Editing Unlocked)") 
        : (isBn ? "দর্শক মোড সক্রিয় 👁️" : "Visitor Mode Enabled 👁️")
      );
      return next;
    });
  };

  // Load Devotees from LocalStorage or Initial Seed Data
  const [devotees, setDevotees] = useState<DevoteeProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error loading devotees data from storage:", e);
    }
    return INITIAL_DEVOTEES_DATA;
  });

  // Save changes to LocalStorage whenever devotees change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devotees));
    } catch (e) {
      console.error("Error saving devotees data:", e);
    }
  }, [devotees]);

  // Deep linking to specific Acharya from URL
  useEffect(() => {
    const personParam = searchParams.get("person");
    if (personParam) {
      const match = SPIRITUAL_LINEAGE_DATA.find(p => p.id === personParam);
      if (match) {
        setSelectedLineage(match);
        setActiveViewTab("LINEAGE");
      }
    }
  }, [searchParams]);

  // Resident Devotee Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedBlood, setSelectedBlood] = useState("ALL");

  // Modal State for Adding New Devotee
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDevotee, setNewDevotee] = useState<Partial<DevoteeProfile>>({
    name: "",
    spiritualName: "",
    phone: "",
    gmail: "",
    birthday: "",
    address: "",
    bloodGroup: "O+",
    department: "CSE",
    institute: "University of Chittagong",
    serviceType: "IYF",
    roleBadge: "IYF Seva Member"
  });

  // Modal State for Editing Existing Devotee
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDevotee, setEditingDevotee] = useState<DevoteeProfile | null>(null);

  // Open Nectar Drop Input Form State (keyed by devotee id)
  const [openNectarFormId, setOpenNectarFormId] = useState<string | null>(null);
  const [nectarText, setNectarText] = useState("");
  const [nectarAuthor, setNectarAuthor] = useState("");
  const [nectarTag, setNectarTag] = useState("সাধনা নিষ্ঠা");

  // Predefined quick nectar tags
  const QUICK_TAGS = isBn
    ? ["নম্র স্বভাব", "সময়নিষ্ঠ সেবা", "সাধনা নিষ্ঠা", "মধুর কীর্তনীয়া", "উৎসাহী প্রচারক", "প্রসাদ সেবা", "শাস্ত্রীয় প্রজ্ঞা", "শান্ত স্বভাব"]
    : ["Humble Nature", "Punctual Seva", "Sadhana Dedication", "Sweet Kirtan", "Enthusiastic Preacher", "Prasadam Seva", "Scriptural Wisdom", "Peaceful"];

  // Helper to compress image
  const compressImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 600;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.8);
          callback(compressed);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle Photo Upload
  const handlePhotoUpload = (devoteeId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(isBn ? "অনুগ্রহ করে একটি ছবি নির্বাচন করুন!" : "Please select an image file!");
      return;
    }

    triggerHaptic("light");
    compressImage(file, (compressedBase64) => {
      setDevotees(prev => prev.map(dev => {
        if (dev.id === devoteeId) {
          return { ...dev, photo: compressedBase64 };
        }
        return dev;
      }));
      toast.success(isBn ? "ছবি সফলভাবে আপলোড হয়েছে! 📸" : "Photo uploaded successfully! 📸");
    });
  };

  // Multi-Format Export Dropdown State
  const [showExportMenu, setShowExportMenu] = useState(false);

  // 1. Export Official Landscape PDF Directory
  const handleExportProfilesPDF = () => {
    triggerHaptic("success");
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4"
      });

      // Top Decorative Gold Header
      doc.setFillColor(245, 158, 11);
      doc.rect(0, 0, 842, 45, "F");

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("ADVAITA VOICE • ISKCON YOUTH FORUM (IYF) CHITTAGONG", 421, 23, { align: "center" });

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.text(`Official Devotee Directory & Seva Ledger • Devotees: ${devotees.length} • Generated: ${new Date().toLocaleDateString()}`, 421, 38, { align: "center" });

      let y = 68;

      const drawTableHeader = (currentY: number) => {
        doc.setFillColor(30, 41, 59);
        doc.rect(20, currentY - 13, 802, 18, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");

        doc.text("SL", 25, currentY);
        doc.text("Full Name", 50, currentY);
        doc.text("Spiritual Name", 160, currentY);
        doc.text("Dept", 270, currentY);
        doc.text("Blood", 340, currentY);
        doc.text("Phone", 380, currentY);
        doc.text("Email", 470, currentY);
        doc.text("Address", 600, currentY);
        doc.text("Service Role", 690, currentY);
      };

      drawTableHeader(y);
      y += 16;

      devotees.forEach((d, idx) => {
        if (y > 545) {
          doc.addPage();
          y = 35;
          drawTableHeader(y);
          y += 16;
        }

        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(20, y - 11, 802, 15, "F");
        }

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");

        doc.text(String(d.sl), 25, y);
        doc.text(doc.splitTextToSize(d.name || "", 105)[0] || "", 50, y);
        doc.text(doc.splitTextToSize(d.spiritualName || "-", 105)[0] || "", 160, y);
        doc.text(doc.splitTextToSize(d.department || "-", 65)[0] || "", 270, y);
        doc.text(d.bloodGroup || "-", 340, y);
        doc.text(d.phone || "-", 380, y);
        doc.text(doc.splitTextToSize(d.gmail || "-", 125)[0] || "", 470, y);
        doc.text(doc.splitTextToSize(d.address || "-", 85)[0] || "", 600, y);
        doc.text(doc.splitTextToSize(d.roleBadge || d.serviceType || "-", 130)[0] || "", 690, y);

        y += 15;
      });

      doc.save(`Advaita_VOICE_Devotees_Directory_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success(isBn ? "অফিসিয়াল PDF ডিরেক্টরি ডাউনলোড হয়েছে! 📄" : "Official PDF Directory downloaded! 📄");
      setShowExportMenu(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  // 2. Export Styled Excel Spreadsheet (.xls format)
  const handleExportProfilesExcel = () => {
    triggerHaptic("success");
    try {
      const tableHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8" /></head>
        <body>
          <table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif;">
            <thead>
              <tr style="background-color: #f59e0b; color: #000000; font-weight: bold; height: 36px;">
                <th colspan="11" style="font-size: 15px; text-align: center;">ADVAITA VOICE • ISKCON YOUTH FORUM (IYF) DEVOTEE DIRECTORY</th>
              </tr>
              <tr style="background-color: #1e293b; color: #ffffff; font-weight: bold; height: 28px;">
                <th>SL</th>
                <th>Full Name</th>
                <th>Spiritual Name</th>
                <th>Department</th>
                <th>Institute</th>
                <th>Blood Group</th>
                <th>Phone Number</th>
                <th>Email Address</th>
                <th>Home Address</th>
                <th>Birthday</th>
                <th>Service Role</th>
              </tr>
            </thead>
            <tbody>
              ${devotees.map((d, i) => `
                <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'}; height: 24px;">
                  <td style="text-align: center;">${d.sl}</td>
                  <td><b>${d.name}</b></td>
                  <td>${d.spiritualName || ''}</td>
                  <td>${d.department}</td>
                  <td>${d.institute}</td>
                  <td style="text-align: center;">${d.bloodGroup}</td>
                  <td style="mso-number-format:'\\@';">${d.phone}</td>
                  <td>${d.gmail}</td>
                  <td>${d.address}</td>
                  <td>${d.birthday}</td>
                  <td>${d.roleBadge || d.serviceType}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
      const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Advaita_VOICE_Devotees_${new Date().toISOString().split("T")[0]}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(isBn ? "এক্সেল স্প্রেডশীট (.xls) ডাউনলোড হয়েছে! 📊" : "Excel Spreadsheet (.xls) downloaded! 📊");
      setShowExportMenu(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate Excel file");
    }
  };

  // 3. Export UTF-8 BOM CSV File
  const handleExportProfilesCSV = () => {
    triggerHaptic("success");
    try {
      const headers = ["SL", "Name", "Spiritual Name", "Phone", "Email", "Department", "Institute", "Blood Group", "Address", "Birthday", "Service Role"];
      const rows = devotees.map(d => [
        d.sl,
        `"${(d.name || "").replace(/"/g, '""')}"`,
        `"${(d.spiritualName || "").replace(/"/g, '""')}"`,
        `"${d.phone || ""}"`,
        `"${d.gmail || ""}"`,
        `"${(d.department || "").replace(/"/g, '""')}"`,
        `"${(d.institute || "").replace(/"/g, '""')}"`,
        `"${d.bloodGroup || ""}"`,
        `"${(d.address || "").replace(/"/g, '""')}"`,
        `"${d.birthday || ""}"`,
        `"${(d.roleBadge || d.serviceType || "").replace(/"/g, '""')}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Advaita_VOICE_Devotees_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(isBn ? "CSV ডিরেক্টরি ডাউনলোড হয়েছে! 📁" : "Devotees Directory (CSV) downloaded! 📁");
      setShowExportMenu(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export CSV");
    }
  };

  // 4. Export JSON Full Backup
  const handleExportProfilesJSON = () => {
    triggerHaptic("success");
    try {
      const jsonContent = JSON.stringify(devotees, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Advaita_VOICE_Devotees_Backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(isBn ? "JSON ব্যাকআপ ফাইল ডাউনলোড হয়েছে! 💾" : "JSON Backup downloaded! 💾");
      setShowExportMenu(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export JSON");
    }
  };

  // 5. Direct Print
  const handlePrintDirectory = () => {
    triggerHaptic("selection");
    setShowExportMenu(false);
    window.print();
  };

  // 6. Copy All Contacts to Clipboard
  const handleCopyContacts = () => {
    triggerHaptic("success");
    try {
      const text = devotees.map(d => `${d.sl}. ${d.spiritualName || d.name} (${d.department}) - 📞 ${d.phone} [🩸 ${d.bloodGroup}]`).join("\n");
      navigator.clipboard.writeText(text);
      toast.success(isBn ? "সকল কন্টাক্ট ক্লিপবোর্ডে কপি হয়েছে! 📋" : "Contacts list copied to clipboard! 📋");
      setShowExportMenu(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy contacts");
    }
  };

  // Reset to initial seed data
  const handleResetToSeedData = () => {
    triggerHaptic("warning");
    if (!window.confirm(isBn ? "আপনি কি সমস্ত প্রোফাইল প্রাথমিক ডিফল্ট তথ্যে রিসেট করতে চান?" : "Reset all profiles to initial default data?")) return;
    setDevotees(INITIAL_DEVOTEES_DATA);
    localStorage.removeItem(STORAGE_KEY);
    toast.success(isBn ? "ডিফল্ট ভক্ত তালিকা সফলভাবে পুনঃস্থাপন হয়েছে!" : "Reset to default devotee profiles!");
  };

  // Handle Add Nectar Drop
  const handleAddNectarDrop = (devoteeId: string) => {
    if (!nectarText.trim()) {
      toast.error(isBn ? "অনুগ্রহ করে সদ্গুণাবলী লিখুন!" : "Please write the nectar drop description!");
      return;
    }
    const newDrop: NectarDrop = {
      id: "nd_" + Date.now(),
      text: nectarText.trim(),
      author: nectarAuthor.trim() || (isBn ? "বেনামী শুভাকাঙ্ক্ষী" : "Well Wisher"),
      date: new Date().toISOString().split("T")[0],
      tag: nectarTag
    };

    setDevotees(prev => prev.map(dev => {
      if (dev.id === devoteeId) {
        return {
          ...dev,
          nectarDrops: [...(dev.nectarDrops || []), newDrop]
        };
      }
      return dev;
    }));

    setNectarText("");
    setNectarAuthor("");
    setOpenNectarFormId(null);
    triggerHaptic("success");
    toast.success(isBn ? "ভক্তের সদ্গুণাবলী (অমৃতবিন্দু) যুক্ত হয়েছে! ✨" : "Nectar drop added successfully! ✨");
  };

  // Handle Delete Nectar Drop
  const handleDeleteNectarDrop = (devoteeId: string, dropId: string) => {
    triggerHaptic("light");
    setDevotees(prev => prev.map(dev => {
      if (dev.id === devoteeId) {
        return {
          ...dev,
          nectarDrops: dev.nectarDrops.filter(nd => nd.id !== dropId)
        };
      }
      return dev;
    }));
    toast.success(isBn ? "অমৃতবিন্দু অপসারিত হয়েছে।" : "Nectar drop removed.");
  };

  // Handle Create New Devotee Profile
  const handleCreateDevotee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevotee.name || !newDevotee.phone) {
      toast.error(isBn ? "নাম ও ফোন নম্বর বাধ্যতামূলক!" : "Name and Phone are mandatory!");
      return;
    }

    const created: DevoteeProfile = {
      id: "dev_" + Date.now(),
      sl: devotees.length + 1,
      name: newDevotee.name.trim(),
      spiritualName: newDevotee.spiritualName?.trim(),
      phone: newDevotee.phone.trim(),
      gmail: newDevotee.gmail?.trim() || `${newDevotee.name?.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      birthday: newDevotee.birthday || "2002-01-01",
      address: newDevotee.address?.trim() || "Chittagong",
      bloodGroup: newDevotee.bloodGroup || "O+",
      department: newDevotee.department?.trim() || "General",
      institute: newDevotee.institute?.trim() || "University of Chittagong",
      serviceType: newDevotee.serviceType || "IYF",
      roleBadge: newDevotee.roleBadge?.trim() || "IYF Seva Member",
      guardianNumber: newDevotee.guardianNumber?.trim(),
      nationalId: newDevotee.nationalId?.trim(),
      photo: newDevotee.photo,
      nectarDrops: []
    };

    setDevotees(prev => [...prev, created]);
    setIsAddModalOpen(false);
    setNewDevotee({
      name: "",
      spiritualName: "",
      phone: "",
      gmail: "",
      birthday: "",
      address: "",
      bloodGroup: "O+",
      department: "CSE",
      institute: "University of Chittagong",
      serviceType: "IYF",
      roleBadge: "IYF Seva Member"
    });
    triggerHaptic("success");
    toast.success(isBn ? "নতুন ভক্তের প্রোফাইল যুক্ত হয়েছে! 🎉" : "New devotee profile created! 🎉");
  };

  // Handle Edit Save Devotee Profile
  const handleSaveEditDevotee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDevotee) return;

    setDevotees(prev => prev.map(dev => {
      if (dev.id === editingDevotee.id) {
        return editingDevotee;
      }
      return dev;
    }));

    setIsEditModalOpen(false);
    setEditingDevotee(null);
    triggerHaptic("success");
    toast.success(isBn ? "প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে! ✅" : "Profile updated successfully! ✅");
  };

  // Handle Delete Devotee
  const handleDeleteDevotee = (id: string, name: string) => {
    triggerHaptic("warning");
    if (!window.confirm(isBn ? `আপনি কি নিশ্চিতভাবে "${name}"-এর প্রোফাইল মুছে ফেলতে চান?` : `Are you sure you want to delete "${name}"?`)) return;

    setDevotees(prev => prev.filter(dev => dev.id !== id));
    toast.success(isBn ? "প্রোফাইল মুছে ফেলা হয়েছে।" : "Devotee profile deleted.");
  };

  // Share Devotee Contact Info
  const handleShareDevotee = (devotee: DevoteeProfile) => {
    triggerHaptic("selection");
    const text = `🌸 Advaita VOICE Devotee Contact 🌸\nName: ${devotee.name} (${devotee.spiritualName || devotee.name})\nPhone: ${devotee.phone}\nEmail: ${devotee.gmail}\nDept: ${devotee.department} (${devotee.institute})\nBlood: ${devotee.bloodGroup}\nAddress: ${devotee.address}\nRole: ${devotee.serviceType}`;

    if (navigator.share) {
      navigator.share({
        title: `${devotee.name} - VOICE Profile`,
        text: text
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success(isBn ? "ভক্তের যোগাযোগের তথ্য ক্লিপবোর্ডে কপি হয়েছে!" : "Devotee info copied to clipboard!");
    }
  };

  // Filtered Lineage Masters
  const filteredLineage = SPIRITUAL_LINEAGE_DATA.filter(master => {
    const q = lineageSearchQuery.toLowerCase();
    return !q || 
      master.name.toLowerCase().includes(q) || 
      master.nameBn.toLowerCase().includes(q) || 
      master.titleEn.toLowerCase().includes(q) ||
      master.titleBn.toLowerCase().includes(q) ||
      master.appearancePlace.toLowerCase().includes(q);
  });

  // Extract unique departments for filtering
  const departments = ["ALL", ...Array.from(new Set(devotees.map(d => d.department))).filter(Boolean)];
  const bloodGroups = ["ALL", "O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];

  // Filter Devotees
  const filteredDevotees = devotees.filter(dev => {
    const matchesSearch = 
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dev.spiritualName && dev.spiritualName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      dev.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.phone.includes(searchQuery) ||
      dev.gmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === "ALL" || dev.department === selectedDept;
    const matchesBlood = selectedBlood === "ALL" || dev.bloodGroup === selectedBlood;

    return matchesSearch && matchesDept && matchesBlood;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-24 transition-colors">
      
      {/* ================= PAGE HEADER & OFFICIAL BANNER ================= */}
      <div className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white shadow-xl py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-amber-400 opacity-80 blur-md animate-pulse" />
                <div className="relative w-12 h-12 rounded-2xl bg-slate-950 p-0.5 shadow-[0_0_20px_rgba(251,191,36,0.7)] border-2 border-amber-400/80 flex items-center justify-center shrink-0">
                  <img src="/assets/iyf_logo.png" alt="IYF" className="w-full h-full object-cover rounded-xl" />
                </div>
              </div>
              <div>
                <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest text-amber-200">
                  Advaita VOICE • IYF Chittagong
                </span>
                <div className="text-sm sm:text-base font-black text-white">
                  {isBn ? "পরম্পরা গুরুবর্গ ও নিবাসী ভক্ত ডিরেক্টরি" : "Parampara Lineage & Resident Devotees"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={toggleAdminMode}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs ${
                  isAdminMode 
                    ? "bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300" 
                    : "bg-black/30 hover:bg-black/50 text-white"
                }`}
                title="Toggle Admin Edit Controls"
              >
                {isAdminMode ? <ShieldCheck size={14} className="text-slate-950" /> : <Lock size={14} />}
                <span>{isAdminMode ? (isBn ? "অ্যাডমিন মোড: চালু" : "Admin: ON") : (isBn ? "অ্যাডমিন মোড: বন্ধ" : "Admin: OFF")}</span>
              </button>

              {/* Multi-Format Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { triggerHaptic("selection"); setShowExportMenu(prev => !prev); }}
                  className="px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-amber-200 font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs border border-amber-400/25 shadow-xs"
                  title="Export Devotees Directory in multiple formats"
                >
                  <Download size={13} className="text-amber-400" />
                  <span>{isBn ? "এক্সপোর্ট" : "Export"}</span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${showExportMenu ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu Modal */}
                {showExportMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowExportMenu(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-slate-900/98 dark:bg-slate-900 text-slate-100 border border-amber-400/40 shadow-2xl backdrop-blur-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-0.5">
                      <div className="px-3 py-1.5 border-b border-white/10 text-[10px] font-bold text-amber-300 font-mono uppercase tracking-wider">
                        {isBn ? "ফরম্যাট বেছে নিন (Choose Format)" : "Choose Export Format"}
                      </div>
                      
                      {/* 1. PDF */}
                      <button
                        onClick={handleExportProfilesPDF}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold hover:bg-amber-500/20 hover:text-amber-200 flex items-center gap-2.5 transition-colors cursor-pointer group"
                      >
                        <FileText size={15} className="text-rose-400 group-hover:scale-110 transition-transform shrink-0" />
                        <div>
                          <div className="font-bold text-slate-100 group-hover:text-amber-200">{isBn ? "পিডিএফ ডকুমেন্ট (.pdf)" : "PDF Document (.pdf)"}</div>
                          <div className="text-[9.5px] text-slate-400 font-normal">{isBn ? "প্রিন্ট ও অফিশিয়াল লেজার" : "Official Printable Ledger"}</div>
                        </div>
                      </button>

                      {/* 2. Excel */}
                      <button
                        onClick={handleExportProfilesExcel}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold hover:bg-amber-500/20 hover:text-amber-200 flex items-center gap-2.5 transition-colors cursor-pointer group"
                      >
                        <Layers size={15} className="text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                        <div>
                          <div className="font-bold text-slate-100 group-hover:text-amber-200">{isBn ? "এক্সেল স্প্রেডশীট (.xls)" : "Excel Spreadsheet (.xls)"}</div>
                          <div className="text-[9.5px] text-slate-400 font-normal">{isBn ? "মাইক্রোসফট এক্সেল ও শিটস" : "Formatted Excel & Sheets"}</div>
                        </div>
                      </button>

                      {/* 3. CSV */}
                      <button
                        onClick={handleExportProfilesCSV}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold hover:bg-amber-500/20 hover:text-amber-200 flex items-center gap-2.5 transition-colors cursor-pointer group"
                      >
                        <Download size={15} className="text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                        <div>
                          <div className="font-bold text-slate-100 group-hover:text-amber-200">{isBn ? "সিএসভি ফাইল (.csv)" : "CSV File (.csv)"}</div>
                          <div className="text-[9.5px] text-slate-400 font-normal">{isBn ? "ইউটিএফ-৮ র ডেটা" : "Raw UTF-8 Table Data"}</div>
                        </div>
                      </button>

                      {/* 4. Direct Print */}
                      <button
                        onClick={handlePrintDirectory}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold hover:bg-amber-500/20 hover:text-amber-200 flex items-center gap-2.5 transition-colors cursor-pointer group"
                      >
                        <Printer size={15} className="text-sky-400 group-hover:scale-110 transition-transform shrink-0" />
                        <div>
                          <div className="font-bold text-slate-100 group-hover:text-amber-200">{isBn ? "ডিরেক্টরি প্রিন্ট করুন" : "Print Devotee Directory"}</div>
                          <div className="text-[9.5px] text-slate-400 font-normal">{isBn ? "সরাসরি প্রিন্টার বা পিডিএফ" : "Direct Browser Print"}</div>
                        </div>
                      </button>

                      {/* 5. Copy Contacts */}
                      <button
                        onClick={handleCopyContacts}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold hover:bg-amber-500/20 hover:text-amber-200 flex items-center gap-2.5 transition-colors cursor-pointer group"
                      >
                        <Copy size={15} className="text-purple-400 group-hover:scale-110 transition-transform shrink-0" />
                        <div>
                          <div className="font-bold text-slate-100 group-hover:text-amber-200">{isBn ? "কন্টাক্ট কপি করুন" : "Copy Contacts List"}</div>
                          <div className="text-[9.5px] text-slate-400 font-normal">{isBn ? "হোয়াটসঅ্যাপ বা মেসেজ" : "Text format for WhatsApp"}</div>
                        </div>
                      </button>

                      {/* 6. JSON Backup */}
                      <button
                        onClick={handleExportProfilesJSON}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold hover:bg-amber-500/20 hover:text-amber-200 flex items-center gap-2.5 transition-colors cursor-pointer group border-t border-white/10"
                      >
                        <Save size={15} className="text-orange-400 group-hover:scale-110 transition-transform shrink-0" />
                        <div>
                          <div className="font-bold text-slate-100 group-hover:text-amber-200">{isBn ? "জেসন ব্যাকআপ (.json)" : "JSON Full Backup (.json)"}</div>
                          <div className="text-[9.5px] text-slate-400 font-normal">{isBn ? "সম্পূর্ণ ডেটা ব্যাকআপ" : "Full Database Backup"}</div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {isAdminMode && (
                <button
                  onClick={handleResetToSeedData}
                  className="px-2.5 py-1.5 rounded-xl bg-black/30 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 font-bold flex items-center gap-1 transition-all cursor-pointer text-xs"
                  title="Reset to Initial Default Directory"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {isBn ? "ভয়েস প্রোফাইল ও পরম্পরা বিবরণী" : "VOICE Profiles & Spiritual Lineage"}
              </h1>
              <p className="text-xs sm:text-sm text-amber-100 font-medium mt-1">
                "Rekindling Wisdom, Reviving Love" • {isBn ? "আধ্যাত্মিক গুরুবর্গের পূর্ণাঙ্গ জীবনী ও নিবাসী ভক্তদের ডিরেক্টরি" : "Authentic Lineage Biographies & Devotee Directory"}
              </p>
            </div>

            {activeViewTab === "RESIDENTS" && isAdminMode && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer text-xs sm:text-sm"
              >
                <Plus size={16} />
                <span>{isBn ? "নতুন ভক্ত প্রোফাইল যোগ করুন" : "Add Devotee Profile"}</span>
              </button>
            )}
          </div>

          {/* Official Center & Leadership Reference Card */}
          <div className="p-4 rounded-2xl bg-black/25 border border-white/15 backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <Building size={16} className="text-amber-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] text-amber-200 uppercase font-mono">{isBn ? "আশ্রম ও কেন্দ্র" : "Ashram & Center"}</div>
                <div className="font-bold text-white leading-tight">Radhamadhav Temple & Gour Nitai Ashram</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-amber-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] text-amber-200 uppercase font-mono">{isBn ? "ভয়েস ক্যাম্পাস ঠিকানা" : "VOICE Campus Address"}</div>
                <div className="font-bold text-white leading-tight">Forestry Garage, South Campus, CU</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <ShieldCheck size={16} className="text-amber-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] text-amber-200 uppercase font-mono">{isBn ? "কেয়ারটেকার" : "VOICE Caretaker"}</div>
                <div className="font-bold text-white leading-tight">HG Rasvihari Krishna Chandra Das</div>
                <a href="tel:01875835986" className="text-[11px] text-amber-200 underline font-mono">01875835986</a>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <UserCheck size={16} className="text-amber-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] text-amber-200 uppercase font-mono">{isBn ? "কো-অর্ডিনেটর" : "VOICE Coordinator"}</div>
                <div className="font-bold text-white leading-tight">Utpol Das Khocon (ACCE)</div>
                <a href="tel:01790839891" className="text-[11px] text-amber-200 underline font-mono">01790839891</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= PRIMARY NAVIGATION TAB BAR (LINEAGE vs RESIDENTS) ================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => { triggerHaptic("selection"); setActiveViewTab("LINEAGE"); setSearchParams({ tab: "lineage" }); }}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeViewTab === "LINEAGE"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md scale-[1.01]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Crown size={17} className={activeViewTab === "LINEAGE" ? "text-slate-950" : "text-amber-500"} />
            <span>{isBn ? "🌸 পরম গুরুবর্গ ও আধ্যাত্মিক পরম্পরা (৪ জন)" : "🌸 Spiritual Masters & Lineage (4)"}</span>
          </button>

          <button
            onClick={() => { triggerHaptic("selection"); setActiveViewTab("RESIDENTS"); setSearchParams({ tab: "residents" }); }}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeViewTab === "RESIDENTS"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-[1.01]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users size={17} className={activeViewTab === "RESIDENTS" ? "text-white" : "text-indigo-500"} />
            <span>{isBn ? `👥 নিবাসী ভক্ত ডিরেক্টরি (${devotees.length})` : `Resident Devotees (${devotees.length})`}</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: SPIRITUAL LINEAGE (4 SUPREME MASTERS) ================= */}
      {activeViewTab === "LINEAGE" && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          
          {/* Lineage Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-indigo-500/10 border border-amber-500/25 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase font-mono tracking-wider border border-amber-500/20">
                <Sparkles size={13} className="text-amber-500" />
                <span>{isBn ? "গৌড়ীয় বৈষ্ণব পরম্পরা ও ভয়েস অভিভাবকত্ব" : "Gaudiya Vaishnava Parampara & Guardians"}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isBn ? "ভয়েস আন্দোলনের ৪ প্রধান আধ্যাত্মিক স্তম্ভ ও আচার্যবর্গ" : "The 4 Supreme Spiritual Guardians of VOICE"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {isBn 
                  ? "শ্রীল প্রভুপাদের দিব্য আদেশ, শ্রীশ্রীমৎ জয়পতাকা স্বামী গুরুমহারাজের পরম অভিভাবকত্ব, শ্রীশ্রীমৎ ভক্তিপুরুষোত্তম স্বামী মহারাজের স্নেহময় দিকনির্দেশনা এবং শ্রীমান রাধেশ্যাম দাস প্রভুর উদ্ভাবনী শিক্ষা পদ্ধতির মেলবন্ধনে অদ্বৈত ভয়েস পরিচালিত।"
                  : "Empowered by Srila Prabhupada's global mission, blessed by HH Jayapataka Swami Gurumaharaja, guided by HH Bhakti Purushottama Swami Maharaj, and engineered by HG Radheshyam Das Prabhu."
                }
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={isBn ? "গুরুবর্গের নাম বা পদবি দিয়ে খুঁজুন..." : "Search Acharyas by name, title..."}
                value={lineageSearchQuery}
                onChange={(e) => setLineageSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs font-medium"
              />
              {lineageSearchQuery && (
                <button onClick={() => setLineageSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* 4 Grand Acharya Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLineage.map((master) => (
              <div
                key={master.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/30 dark:border-amber-500/20 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden p-6 sm:p-7 space-y-5"
              >
                {/* Top Glowing Gold Bar */}
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

                <div className="space-y-4">
                  
                  {/* Header Row: Photo + Name + Role Badge */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    
                    {/* Portrait Photo Container */}
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-950 p-1 border-2 border-amber-400 shadow-xl ring-4 ring-amber-500/20 group-hover:scale-105 transition-transform">
                        <img 
                          src={master.photo} 
                          alt={master.name} 
                          className="w-full h-full object-cover object-top rounded-full"
                        />
                      </div>
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[9px] uppercase font-mono whitespace-nowrap shadow-md">
                        {isBn ? master.roleBadgeBn : master.roleBadge}
                      </span>
                    </div>

                    {/* Master Names & Hierarchy */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-serif leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {isBn ? master.nameBn : master.name}
                      </h3>
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                        {isBn ? master.titleBn : master.titleEn}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex-wrap font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-amber-500 shrink-0" />
                          <span>{isBn ? master.appearancePlaceBn : master.appearancePlace}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-amber-500 shrink-0" />
                          <span>{master.appearanceDate}</span>
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Spiritual Guru Lineage Tag */}
                  <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 text-xs flex items-center gap-2">
                    <Crown size={14} className="text-amber-500 shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{isBn ? "দীক্ষাগুরু:" : "Spiritual Master:"} </span>
                      <span className="font-semibold text-amber-700 dark:text-amber-300">{isBn ? master.spiritualMasterBn : master.spiritualMaster}</span>
                    </div>
                  </div>

                  {/* Bio Excerpt */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {isBn ? master.bioBn : master.bioEn}
                  </p>

                  {/* Key Portfolios Pills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                      {isBn ? "প্রধান দায়িত্ব ও সেবাপদ:" : "Key Portfolios & Roles:"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(isBn ? master.keyPortfoliosBn : master.keyPortfoliosEn).slice(0, 3).map((port, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700/80"
                        >
                          {port}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Divine Quote Box */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-transparent border-l-4 border-amber-500 text-xs space-y-1">
                    <p className="italic font-serif text-slate-700 dark:text-slate-300">
                      "{isBn ? master.quoteBn : master.quoteEn}"
                    </p>
                    <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold text-right">
                      — {master.quoteSource}
                    </div>
                  </div>

                </div>

                {/* Footer Action Button to Open Full Modal */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    {isBn ? "গ্রন্থাবলী, কীর্তি ও ভয়েস অবদান" : "Books, Achievements & VOICE Vision"}
                  </span>

                  <button
                    onClick={() => { triggerHaptic("selection"); setSelectedLineage(master); setLineageModalTab("BIO"); }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{isBn ? "পূর্ণাঙ্গ জীবনী ও বিবরণ" : "Full Biography"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ================= TAB 2: RESIDENT DEVOTEES DIRECTORY ================= */}
      {activeViewTab === "RESIDENTS" && (
        <div className="space-y-6">
          
          {/* SEARCH & FILTER CONTROL BAR */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              
              <div className="flex flex-col md:flex-row items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={isBn ? "নাম, বিভাগ, জেলা, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন..." : "Search by name, department, district, email or phone..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Department Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                  <Filter size={14} className="text-slate-400 shrink-0 ml-1" />
                  {departments.map(dept => (
                    <button
                      key={dept}
                      onClick={() => setSelectedDept(dept)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedDept === dept
                          ? "bg-amber-500 text-slate-950 shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>

                {/* Blood Group Filter */}
                <div className="flex items-center gap-1 shrink-0">
                  <Droplet size={14} className="text-rose-500" />
                  <select
                    value={selectedBlood}
                    onChange={(e) => setSelectedBlood(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>Blood: {bg}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* DEVOTEES PROFILES GRID (SEPARATE BOXES) */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
            
            {filteredDevotees.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <User size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-bold text-slate-500">
                  {isBn ? "কোনো ভক্তের প্রোফাইল পাওয়া যায়নি।" : "No devotee profiles found matching your search."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredDevotees.map((devotee) => (
                  <div
                    key={devotee.id}
                    className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 p-5 sm:p-6"
                  >
                    
                    {/* Top Accent Stripe */}
                    <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600" />

                    <div className="space-y-4">
                      
                      {/* Header Row: Photo + Names + Role Badge */}
                      <div className="flex items-start gap-4">
                        
                        {/* Photo Container with Live Upload Button */}
                        <div className="relative shrink-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-md">
                            {devotee.photo ? (
                              <img 
                                src={devotee.photo} 
                                alt={devotee.name} 
                                className="w-full h-full object-cover rounded-2xl bg-white dark:bg-slate-800"
                              />
                            ) : (
                              <div className="w-full h-full rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-xl sm:text-2xl">
                                {devotee.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          {/* Hidden File Input for Instant Photo Upload */}
                          {isAdminMode && (
                            <label 
                              title={isBn ? "ছবি পরিবর্তন / আপলোড করুন" : "Change / Upload Photo"}
                              className="absolute -bottom-1.5 -right-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-all border border-white dark:border-slate-800"
                            >
                              <Camera size={12} className="text-amber-300" />
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handlePhotoUpload(devotee.id, e)}
                              />
                            </label>
                          )}
                        </div>

                        {/* Name & Academic Meta */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono font-bold text-[10px]">
                                #{devotee.sl}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-[10px]">
                                {devotee.roleBadge || devotee.serviceType}
                              </span>
                            </div>

                            {/* Share & Admin Controls */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleShareDevotee(devotee)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                title="Share Contact Info"
                              >
                                <Share2 size={14} />
                              </button>

                              {isAdminMode && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingDevotee(devotee);
                                      setIsEditModalOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                    title="Edit Profile"
                                  >
                                    <Edit3 size={14} />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteDevotee(devotee.id, devotee.name)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                    title="Delete Profile"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate mt-1">
                            {devotee.name}
                          </h3>
                          {devotee.spiritualName && (
                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 truncate">
                              📿 {devotee.spiritualName}
                            </p>
                          )}

                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {devotee.department} • {devotee.institute}
                          </p>
                        </div>

                      </div>

                      {/* Contact & Personal Details Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <Phone size={13} className="text-emerald-500 shrink-0" />
                          <a href={`tel:${devotee.phone}`} className="font-mono text-slate-700 dark:text-slate-300 hover:text-emerald-500 hover:underline truncate">
                            {devotee.phone}
                          </a>
                        </div>

                        <div className="flex items-center gap-2 truncate">
                          <Mail size={13} className="text-indigo-500 shrink-0" />
                          <a href={`mailto:${devotee.gmail}`} className="font-mono text-slate-700 dark:text-slate-300 hover:text-indigo-500 hover:underline truncate">
                            {devotee.gmail}
                          </a>
                        </div>

                        <div className="flex items-center gap-2 truncate">
                          <MapPin size={13} className="text-amber-500 shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 truncate">
                            {devotee.address}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 truncate">
                          <Droplet size={13} className="text-rose-500 shrink-0" />
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            Blood: <span className="text-rose-600 dark:text-rose-400 font-mono">{devotee.bloodGroup}</span>
                          </span>
                        </div>
                      </div>

                      {/* NECTAR DROPS (AMRITA BINDU) SECTION */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Sparkles size={14} className="text-amber-500" />
                            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                              {isBn ? "সদ্গুণাবলী ও প্রশংসা (Nectar Drops)" : "Vaishnava Qualities & Nectar"}
                            </span>
                          </div>

                          <button
                            onClick={() => setOpenNectarFormId(openNectarFormId === devotee.id ? null : devotee.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                          >
                            <Plus size={12} />
                            <span>{isBn ? "গুণকীর্তন লিখুন" : "Add Nectar"}</span>
                          </button>
                        </div>

                        {/* Expandable Nectar Input Form */}
                        {openNectarFormId === devotee.id && (
                          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2.5 animate-in fade-in duration-200">
                            <textarea
                              rows={2}
                              value={nectarText}
                              onChange={(e) => setNectarText(e.target.value)}
                              placeholder={isBn ? "ভক্তের সেবা নিষ্ঠা, নম্রতা বা স্মরণীয় সদ্গুণাবলী লিখুন..." : "Write about this devotee's humble service, dedication or sweet mood..."}
                              className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />

                            <div className="flex items-center gap-2 flex-wrap">
                              <input
                                type="text"
                                value={nectarAuthor}
                                onChange={(e) => setNectarAuthor(e.target.value)}
                                placeholder={isBn ? "আপনার নাম (ঐচ্ছিক)" : "Your Name (Optional)"}
                                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-xs flex-1 min-w-[140px] focus:outline-none"
                              />

                              <select
                                value={nectarTag}
                                onChange={(e) => setNectarTag(e.target.value)}
                                className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
                              >
                                {QUICK_TAGS.map(t => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>

                              <button
                                onClick={() => handleAddNectarDrop(devotee.id)}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                <Heart size={12} />
                                <span>{isBn ? "যুক্ত করুন" : "Submit"}</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* List of Nectar Drops */}
                        {devotee.nectarDrops && devotee.nectarDrops.length > 0 ? (
                          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                            {devotee.nectarDrops.map((drop) => (
                              <div
                                key={drop.id}
                                className="group/drop relative p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs"
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono text-[9px] font-bold">
                                    🌸 {drop.tag || "সদ্গুণাবলী"}
                                  </span>

                                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                    <span>{drop.date}</span>
                                    {isAdminMode && (
                                      <button
                                        onClick={() => handleDeleteNectarDrop(devotee.id, drop.id)}
                                        className="opacity-0 group-hover/drop:opacity-100 text-rose-400 hover:text-rose-600 transition-opacity ml-1"
                                        title="Delete Nectar Drop"
                                      >
                                        <X size={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <p className="text-slate-700 dark:text-slate-200 italic font-serif leading-relaxed">
                                  "{drop.text}"
                                </p>
                                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-right mt-0.5">
                                  — {drop.author}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 text-center text-[11px] text-slate-400 italic">
                            {isBn ? "এখনো কোনো সদ্গুণাবলী যুক্ত হয়নি। প্রথম প্রশংসা লিখুন!" : "No nectar drops yet. Be the first to appreciate this devotee!"}
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ================= SPIRITUAL LINEAGE DETAILED BIOGRAPHY MODAL ================= */}
      {selectedLineage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-[32px] bg-white dark:bg-slate-900 border border-amber-500/40 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header Banner */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white border-b border-amber-500/30">
              <button
                onClick={() => setSelectedLineage(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-amber-400 shadow-2xl ring-4 ring-amber-500/30 shrink-0 bg-slate-950">
                  <img src={selectedLineage.photo} alt={selectedLineage.name} className="w-full h-full object-cover object-top" />
                </div>

                <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs font-mono uppercase tracking-wider shadow-md">
                    {isBn ? selectedLineage.roleBadgeBn : selectedLineage.roleBadge}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black font-serif text-amber-200 leading-tight">
                    {isBn ? selectedLineage.nameBn : selectedLineage.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-amber-300/90">
                    {isBn ? selectedLineage.titleBn : selectedLineage.titleEn}
                  </p>
                  <p className="text-[11px] text-slate-300 font-mono">
                    {isBn ? selectedLineage.appearancePlaceBn : selectedLineage.appearancePlace} • {selectedLineage.appearanceDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Interactive Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 overflow-x-auto text-xs font-bold">
              {[
                { id: "BIO", icon: BookOpen, labelEn: "Life & Bio", labelBn: "জীবনবৃত্তান্ত" },
                { id: "ACHIEVEMENTS", icon: Award, labelEn: "Key Achievements", labelBn: "প্রধান কীর্তি ও সেবা" },
                { id: "BOOKS", icon: Layers, labelEn: "Books & Courses", labelBn: "রচিত গ্রন্থাবলী" },
                { id: "QUOTES", icon: Quote, labelEn: "Divine Vani", labelBn: "অমৃতবাণী ও উপদেশ" },
                { id: "VOICE", icon: Building, labelEn: "VOICE Connection", labelBn: "ভয়েসে ভূমিকা" }
              ].map(t => {
                const IconComponent = t.icon;
                const isActive = lineageModalTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => { triggerHaptic("selection"); setLineageModalTab(t.id as any); }}
                    className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                      isActive 
                        ? "bg-amber-500 text-slate-950 shadow-xs font-black" 
                        : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                    }`}
                  >
                    <IconComponent size={14} />
                    <span>{isBn ? t.labelBn : t.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Tab Content Area */}
            <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6 text-sm">
              
              {/* TAB 1: BIO */}
              {lineageModalTab === "BIO" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="space-y-3">
                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <BookOpen size={18} className="text-amber-500" />
                      <span>{isBn ? "মহিমাময় জীবন ও আত্মনিবেদন" : "Transcendental Life Journey & Surrender"}</span>
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify sm:text-left text-sm sm:text-base font-serif">
                      {isBn ? selectedLineage.bioBn : selectedLineage.bioEn}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                      <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 font-mono">
                        {isBn ? "দীক্ষাগুরু / আধ্যাত্মিক ধারা:" : "Spiritual Master & Lineage:"}
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">
                        {isBn ? selectedLineage.spiritualMasterBn : selectedLineage.spiritualMaster}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                      <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 font-mono">
                        {isBn ? "আবির্ভাব ধাম ও কাল:" : "Appearance Place & Date:"}
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">
                        {isBn ? selectedLineage.appearancePlaceBn : selectedLineage.appearancePlace} ({selectedLineage.appearanceDate})
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACHIEVEMENTS */}
              {lineageModalTab === "ACHIEVEMENTS" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Award size={18} className="text-amber-500" />
                    <span>{isBn ? "প্রধান অবদান ও ঐতিহাসিক কীর্তি" : "Major Contributions & Global Milestones"}</span>
                  </h3>
                  <div className="space-y-2.5">
                    {(isBn ? selectedLineage.keyAchievementsBn : selectedLineage.keyAchievementsEn).map((ach, i) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed text-xs sm:text-sm">
                          {ach}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: BOOKS & COURSES */}
              {lineageModalTab === "BOOKS" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers size={18} className="text-amber-500" />
                    <span>{isBn ? "রচিত প্রামাণ্য শাস্ত্রগ্রন্থ ও পাঠ্যক্রম" : "Authored Classical Literatures & Modules"}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(isBn ? selectedLineage.notableBooksBn : selectedLineage.notableBooksEn).map((book, i) => (
                      <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
                        <BookOpen size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {book}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: QUOTES */}
              {lineageModalTab === "QUOTES" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Quote size={18} className="text-amber-500" />
                    <span>{isBn ? "দিব্য উপদেশ ও অমৃতবাণী" : "Transcendental Quotes & Vani"}</span>
                  </h3>
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-indigo-500/10 border-2 border-amber-400/40 space-y-3">
                    <p className="italic font-serif text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed">
                      "{isBn ? selectedLineage.quoteBn : selectedLineage.quoteEn}"
                    </p>
                    <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 text-right">
                      — {selectedLineage.quoteSource}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: VOICE CONNECTION */}
              {lineageModalTab === "VOICE" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Building size={18} className="text-amber-500" />
                    <span>{isBn ? "ভয়েস যুব আন্দোলনে দিব্য অবদান" : "Foundational Role in the VOICE Movement"}</span>
                  </h3>
                  <div className="p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
                    <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-serif">
                      {isBn ? selectedLineage.voiceContributionBn : selectedLineage.voiceContributionEn}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Advaita VOICE • Spiritual Heritage
              </span>
              <button
                onClick={() => setSelectedLineage(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                {isBn ? "বন্ধ করুন" : "Close"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= EDIT DEVOTEES MODAL ================= */}
      {isEditModalOpen && editingDevotee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl my-8 space-y-4 animate-in fade-in duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 size={18} className="text-amber-500" />
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  {isBn ? "ভক্ত প্রোফাইল সম্পাদনা" : "Edit Devotee Profile"}
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditDevotee} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? "নাম (অফিসিয়াল / ক্যাম্পাসের নাম)" : "Full Name"}
                </label>
                <input
                  type="text"
                  required
                  value={editingDevotee.name}
                  onChange={(e) => setEditingDevotee({...editingDevotee, name: e.target.value})}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? "দীক্ষা / আধ্যাত্মিক নাম (যদি থাকে)" : "Spiritual / Initiated Name (If any)"}
                </label>
                <input
                  type="text"
                  value={editingDevotee.spiritualName || ""}
                  onChange={(e) => setEditingDevotee({...editingDevotee, spiritualName: e.target.value})}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none text-amber-600 dark:text-amber-400 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "ফোন নম্বর" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={editingDevotee.phone}
                    onChange={(e) => setEditingDevotee({...editingDevotee, phone: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "ইমেইল এড্রেস" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    value={editingDevotee.gmail}
                    onChange={(e) => setEditingDevotee({...editingDevotee, gmail: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "জন্মদিন / আবির্ভাব তারিখ" : "Birthday Date"}
                  </label>
                  <input
                    type="date"
                    value={editingDevotee.birthday}
                    onChange={(e) => setEditingDevotee({...editingDevotee, birthday: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "রক্তের গ্রুপ" : "Blood Group"}
                  </label>
                  <select
                    value={editingDevotee.bloodGroup}
                    onChange={(e) => setEditingDevotee({...editingDevotee, bloodGroup: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "বিভাগ / বিষয়" : "Department"}
                  </label>
                  <input
                    type="text"
                    value={editingDevotee.department}
                    onChange={(e) => setEditingDevotee({...editingDevotee, department: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "নিজ জেলা / ঠিকানা" : "Home District / Address"}
                  </label>
                  <input
                    type="text"
                    value={editingDevotee.address}
                    onChange={(e) => setEditingDevotee({...editingDevotee, address: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "অভিভাবকের ফোন নম্বর" : "Guardian Number"}
                  </label>
                  <input
                    type="tel"
                    value={editingDevotee.guardianNumber || ""}
                    onChange={(e) => setEditingDevotee({...editingDevotee, guardianNumber: e.target.value})}
                    placeholder="e.g. 01712345678"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "সেবা পদবি / দায়িত্ব ব্যাজ" : "Service Role Badge"}
                  </label>
                  <input
                    type="text"
                    value={editingDevotee.roleBadge || ""}
                    onChange={(e) => setEditingDevotee({...editingDevotee, roleBadge: e.target.value})}
                    placeholder="e.g. IYF Seva Member"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>{isBn ? "সংরক্ষণ করুন" : "Save Changes"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= ADD NEW DEVOTEES MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl my-8 space-y-4 animate-in fade-in duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-amber-500" />
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  {isBn ? "নতুন ভক্ত প্রোফাইল নিবন্ধন" : "Register New Devotee Profile"}
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDevotee} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? "নাম (অফিসিয়াল নাম) *" : "Full Official Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={newDevotee.name}
                  onChange={(e) => setNewDevotee({...newDevotee, name: e.target.value})}
                  placeholder="e.g. Akash Paul"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? "দীক্ষা / আধ্যাত্মিক নাম (যদি থাকে)" : "Spiritual Name (If any)"}
                </label>
                <input
                  type="text"
                  value={newDevotee.spiritualName}
                  onChange={(e) => setNewDevotee({...newDevotee, spiritualName: e.target.value})}
                  placeholder="e.g. Ananta Nimai Das"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none text-amber-600 dark:text-amber-400 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "ফোন নম্বর *" : "Phone Number *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={newDevotee.phone}
                    onChange={(e) => setNewDevotee({...newDevotee, phone: e.target.value})}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "ইমেইল এড্রেস" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    value={newDevotee.gmail}
                    onChange={(e) => setNewDevotee({...newDevotee, gmail: e.target.value})}
                    placeholder="example@gmail.com"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "জন্মদিন / আবির্ভাব তারিখ" : "Birthday Date"}
                  </label>
                  <input
                    type="date"
                    value={newDevotee.birthday}
                    onChange={(e) => setNewDevotee({...newDevotee, birthday: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "রক্তের গ্রুপ" : "Blood Group"}
                  </label>
                  <select
                    value={newDevotee.bloodGroup}
                    onChange={(e) => setNewDevotee({...newDevotee, bloodGroup: e.target.value})}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-bold"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "বিভাগ / বিষয়" : "Department"}
                  </label>
                  <input
                    type="text"
                    value={newDevotee.department}
                    onChange={(e) => setNewDevotee({...newDevotee, department: e.target.value})}
                    placeholder="e.g. CSE / Sanskrit / Sociology"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? "নিজ জেলা / ঠিকানা" : "Home District / Address"}
                  </label>
                  <input
                    type="text"
                    value={newDevotee.address}
                    onChange={(e) => setNewDevotee({...newDevotee, address: e.target.value})}
                    placeholder="e.g. Feni / Chittagong"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>{isBn ? "প্রোফাইল সংরক্ষণ করুন" : "Save Profile"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
