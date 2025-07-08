"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/UseAuth";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WebAttackData } from "@/lib/types";
import DataUpload from "@/components/data/DataUpload";
import DataTable from "@/components/data/DataTable";
import ClusterModel from "@/components/clustering/ClusterModel";
import CyberNavbar from "@/components/layout/Navbar";

const ClusteringPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<WebAttackData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Fetch data from Firestore
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        addTerminalOutput("Initializing data fetch protocol...");
        addTerminalOutput(
          `Authenticating user: ${user.email?.split("@")[0]}@SECURE_DOMAIN`
        );

        const q = query(collection(db, "users", user.uid, "webAttacks"));
        const querySnapshot = await getDocs(q);

        const allData: WebAttackData[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data().data;
          if (Array.isArray(docData)) {
            allData.push(...docData);
          }
        });

        setData(allData);
        addTerminalOutput(
          `Successfully retrieved ${allData.length} attack vectors`
        );
        addTerminalOutput("Data decryption complete");
      } catch (error) {
        addTerminalOutput("ERROR: Data fetch failed", true);
        console.error("Error fetching data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const addTerminalOutput = (message: string, isError = false) => {
    setTerminalOutput((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${
        isError ? "✗ ERROR:" : "✓"
      } ${message}`,
    ]);
  };

  const handleDataUploaded = (newData: WebAttackData[]) => {
    setData(newData);
    addTerminalOutput(
      `New dataset uploaded: ${newData.length} records processed`
    );
  };

  // Loading state
  if (loading || (!user && typeof window !== "undefined")) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-pulse flex space-x-2 justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-cyan-400 rounded-full"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <p className="font-mono text-cyan-400 text-sm">
            Initializing secure connection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <CyberNavbar />

      {/* Glowing header effect */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-pulse" />

      <div className="container mx-auto px-4 py-6">
        {/* Main header */}
        <div className="flex items-center mb-6">
          <div className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse" />
          <h1 className="text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            WEB_ATTACK_CLUSTERING_MODULE
          </h1>
          <div className="ml-auto font-mono text-xs bg-gray-800 px-3 py-1 rounded-full border border-cyan-400/30">
            {user?.email?.replace(/@.*/, "@SECURE")}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Upload panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 border border-cyan-400/20 rounded-lg p-4 backdrop-blur-sm">
              <h2 className="font-mono text-lg text-cyan-400 mb-4 flex items-center">
                <span className="mr-2">$</span> DATA_UPLOAD
              </h2>
              <DataUpload onDataUploaded={handleDataUploaded} />
            </div>

            {/* Terminal output */}
            <div className="mt-6 bg-black/80 border border-cyan-400/20 rounded-lg p-4 font-mono text-xs h-64 overflow-y-auto">
              <div className="text-green-400 mb-2">// SYSTEM_LOG_OUTPUT</div>
              {terminalOutput.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.includes("ERROR") ? "text-red-400" : "text-cyan-400"
                  }
                >
                  {line}
                </div>
              ))}
              {terminalOutput.length === 0 && (
                <div className="text-gray-500">
                  Waiting for system events...
                </div>
              )}
            </div>
          </div>

          {/* Data preview */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-cyan-400/20 rounded-lg p-4 backdrop-blur-sm">
              <h2 className="font-mono text-lg text-cyan-400 mb-4 flex items-center">
                <span className="mr-2">$</span> DATA_PREVIEW
              </h2>
              {!dataLoading && data.length > 0 ? (
                <div className="border border-gray-700 rounded overflow-hidden">
                  <DataTable data={data} />
                </div>
              ) : dataLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400" />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 font-mono">
                  [NO_DATA_AVAILABLE] Upload dataset to begin analysis
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cluster model section */}
        {data.length > 0 && (
          <div className="bg-gray-800/50 border border-cyan-400/20 rounded-lg p-4 backdrop-blur-sm mb-6">
            <h2 className="font-mono text-lg text-cyan-400 mb-4 flex items-center">
              <span className="mr-2">$</span> CLUSTER_ANALYSIS
            </h2>
            <ClusterModel data={data} />
          </div>
        )}

        {/* Footer status */}
        <div className="font-mono text-xs text-gray-500 flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
          SYSTEM_STATUS: OPERATIONAL • {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ClusteringPage;
