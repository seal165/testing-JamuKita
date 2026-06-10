"use client";

import { useState, useRef } from "react";
import { Upload, X, Link2 } from "lucide-react";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageSelected: (base64OrUrl: string) => void;
  label?: string;
}

export default function ImageUpload({
  currentImageUrl,
  onImageSelected,
  label = "Upload Gambar",
}: ImageUploadProps) {
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [urlInput, setUrlInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format file tidak didukung. Gunakan JPEG, PNG, atau WebP");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setError(null);

    // Convert to base64 and show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewUrl(base64String);
      onImageSelected(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageSelected("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setError("URL tidak boleh kosong");
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
      setError(null);
      setPreviewUrl(urlInput);
      onImageSelected(urlInput);
    } catch {
      setError("URL tidak valid");
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => {
            setUploadMode("file");
            setError(null);
          }}
          className={`flex-1 py-2 px-4 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
            uploadMode === "file"
              ? "bg-[#8B4513] text-white border-[#8B4513]"
              : "bg-white text-gray-700 border-gray-300 hover:border-[#8B4513]"
          }`}
        >
          <Upload size={18} />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => {
            setUploadMode("url");
            setError(null);
          }}
          className={`flex-1 py-2 px-4 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
            uploadMode === "url"
              ? "bg-[#8B4513] text-white border-[#8B4513]"
              : "bg-white text-gray-700 border-gray-300 hover:border-[#8B4513]"
          }`}
        >
          <Link2 size={18} />
          Gunakan URL
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* URL Input Mode */}
      {uploadMode === "url" && !previewUrl && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-6 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6d3410] transition-colors"
            >
              Tampilkan
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Masukkan URL gambar dari internet
          </p>
        </div>
      )}

      {/* File Upload Mode */}
      {uploadMode === "file" && !previewUrl && (
        <>
          <div
            onClick={handleClickUpload}
            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#8B4513] hover:bg-gray-50 transition-colors"
          >
            <Upload size={48} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Klik untuk upload gambar
            </p>
            <p className="text-xs text-gray-500">
              JPEG, PNG, WebP (Max 5MB)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </>
      )}

      {/* Preview */}
      {previewUrl ? (
        <div className="relative group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X size={20} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
