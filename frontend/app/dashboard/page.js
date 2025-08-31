"use client";

import { useState } from "react";
import {
  ChartBarIcon,
  UserIcon,
  CogIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    const pdfs = acceptedFiles.filter((f) => f.type === "application/pdf");
    setFiles((prev) => [...prev, ...pdfs]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-2xl font-bold text-blue-600">My Dashboard</div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li
              onClick={() => setActiveTab("overview")}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                activeTab === "overview"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700"
              }`}>
              <HomeIcon className="w-5 h-5 mr-2" />
              Ana Sayfa
            </li>
            <li
              onClick={() => setActiveTab("stats")}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                activeTab === "stats"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700"
              }`}>
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Mevzuatlar
            </li>
            <li
              onClick={() => setActiveTab("profile")}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700"
              }`}>
              <UserIcon className="w-5 h-5 mr-2" />
              Profile
            </li>
            <li
              onClick={() => setActiveTab("settings")}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                activeTab === "settings"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700"
              }`}>
              <CogIcon className="w-5 h-5 mr-2" />
              Settings
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="p-6 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold">Total Mevzuat</h2>
                <p className="mt-2 text-3xl font-semibold">1,245</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold">Kelime Sayısı</h2>
                <p className="mt-2 text-3xl font-semibold">23,400</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold">Prompt Sayısı</h2>
                <p className="mt-2 text-3xl font-semibold">89</p>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold">Mevzuatlar</h2>
              <p className="mt-2 text-gray-600">
                Mevzuatlar ile ilgili detaylı bilgiler burada olacak.
              </p>

              {/* PDF Yükleme Alanı */}
              <div
                {...getRootProps()}
                className={`mt-4 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}>
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                {isDragActive ? (
                  <p className="text-blue-600 font-medium mt-2">
                    Bırak ve ekle
                  </p>
                ) : (
                  <p className="text-gray-600 mt-2">
                    PDF dosyalarını buraya sürükleyin veya tıklayın
                  </p>
                )}
              </div>

              {/* Eklenen PDF Listesi */}
              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((file, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold">Profile</h2>
              <p className="mt-2 text-gray-600">
                Profile bilgileri burada olacak.
              </p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold">Settings</h2>
              <p className="mt-2 text-gray-600">Ayarlar burada olacak.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
