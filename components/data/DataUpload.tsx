"use client";
import React, { useState } from "react";
import { WebAttackData } from "../../lib/types";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "../../hook/UseAuth";

interface DataUploadProps {
  onDataUploaded: (data: WebAttackData[]) => void;
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setMessage({ text: "", type: "" });
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsLoading(true);
    setProgress(0);
    setMessage({
      text: "Initializing data encryption protocol...",
      type: "info",
    });

    try {
      // Simulate progress for encryption effect
      setProgress(10);
      setMessage({ text: "Decrypting file contents...", type: "info" });
      await new Promise((resolve) => setTimeout(resolve, 500));

      const text = await file.text();
      setProgress(30);
      setMessage({ text: "Analyzing attack patterns...", type: "info" });
      await new Promise((resolve) => setTimeout(resolve, 300));

      const lines = text.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      const parsedData: WebAttackData[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(",");
        const entry: any = {};
        headers.forEach((header, index) => {
          entry[header] = isNaN(Number(values[index]))
            ? values[index]
            : Number(values[index]);
        });
        parsedData.push(entry as WebAttackData);
      }

      setProgress(60);
      setMessage({
        text: "Establishing secure connection to database...",
        type: "info",
      });

      // Save to Firestore
      const batchSize = 500;
      for (let i = 0; i < parsedData.length; i += batchSize) {
        const batch = parsedData.slice(i, i + batchSize);
        await addDoc(collection(db, "users", user.uid, "webAttacks"), {
          data: batch,
          uploadedAt: new Date(),
        });
        setProgress(60 + Math.floor((i / parsedData.length) * 40));
      }

      onDataUploaded(parsedData);
      setMessage({
        text: `✓ Successfully processed ${parsedData.length} threat vectors`,
        type: "success",
      });
      setProgress(100);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({
        text: "✗ Security protocol violation: Invalid file format",
        type: "error",
      });
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-cyan-400/20 rounded-lg p-4 backdrop-blur-sm">
      <div className="space-y-4">
        <div>
          <label className="block font-mono text-sm text-gray-300 mb-2">
            ONLY_CSV_FILE
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="cyber-upload"
            />
            <label
              htmlFor="cyber-upload"
              className={`block w-full p-3 border rounded-md font-mono text-sm cursor-pointer transition-all ${
                file
                  ? "border-green-400 text-green-400 bg-green-400/10"
                  : "border-cyan-400/50 text-gray-300 hover:border-cyan-400 hover:bg-cyan-400/10"
              }`}
            >
              {file ? file.name : "CLICK_TO_SELECT_THREAT_DATA"}
            </label>
          </div>
          <p className="mt-2 font-mono text-xs text-gray-400">
            Expected format: CSV with attack vectors (IP, timestamp, payload,
            etc.)
          </p>
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                message.type === "error" ? "bg-red-500" : "bg-cyan-400"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Status message */}
        {message.text && (
          <div
            className={`p-3 rounded-md font-mono text-sm border ${
              message.type === "error"
                ? "bg-red-900/30 border-red-500/50 text-red-400"
                : message.type === "success"
                ? "bg-green-900/20 border-green-500/50 text-green-400"
                : "bg-cyan-900/20 border-cyan-500/50 text-cyan-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className={`w-full py-2.5 px-4 rounded-md font-mono text-sm border ${
            !file || isLoading
              ? "border-gray-600 text-gray-500 cursor-not-allowed"
              : "border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-300 hover:text-cyan-300"
          } transition-all flex items-center justify-center`}
        >
          {isLoading ? (
            <>
              <span className="animate-pulse mr-2">⚙</span>{" "}
              PROCESSING_THREATS...
            </>
          ) : (
            <>
              <span className="mr-2">⏫</span> UPLOAD_AND_ANALYZE
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DataUpload;
