import React, { useState } from "react";
import { WebAttackData } from "../../lib/types";

interface DataTableProps {
  data: WebAttackData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (!data.length) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(data.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);

  // Threat detection logic
  const isPotentialThreat = (value: any) => {
    if (typeof value !== "string") return false;
    const threatIndicators = [
      "sql",
      "xss",
      "injection",
      "script",
      "<",
      ">",
      "alert",
      "union",
    ];
    return threatIndicators.some((indicator) =>
      value.toLowerCase().includes(indicator.toLowerCase())
    );
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="border border-cyan-400/20 rounded-lg overflow-hidden shadow-lg shadow-cyan-500/10">
      <div className="relative overflow-x-auto">
        <table className="w-full font-mono text-xs">
          <thead className="bg-gray-800/80 text-cyan-400">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th
                  key={key}
                  className="px-4 py-3 text-left uppercase tracking-wider border-b border-cyan-400/20"
                >
                  <span className="flex items-center">
                    <span className="mr-1">$</span> {key}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {currentRecords.map((row, i) => (
              <tr
                key={i}
                className={`hover:bg-gray-800/50 ${
                  i % 2 === 0 ? "bg-gray-900/30" : "bg-gray-900/10"
                }`}
              >
                {Object.values(row).map((value, j) => {
                  const displayValue =
                    typeof value === "string" ? value : JSON.stringify(value);
                  const isThreat = isPotentialThreat(value);

                  return (
                    <td
                      key={j}
                      className={`px-4 py-3 max-w-xs truncate border-r border-gray-700/30 last:border-r-0 ${
                        isThreat
                          ? "text-red-400 font-bold animate-pulse"
                          : "text-gray-300"
                      }`}
                      title={displayValue}
                    >
                      {isThreat ? (
                        <span className="flex items-center">
                          <span className="mr-1">⚠</span> {displayValue}
                        </span>
                      ) : (
                        displayValue
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compact Pagination */}
      <div className="bg-gray-900/50 px-4 py-3 flex items-center justify-between border-t border-cyan-400/20">
        <div className="font-mono text-xs text-cyan-400">
          PAGE {currentPage} OF {totalPages} | {data.length} RECORDS
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`p-1.5 px-3 rounded-md font-mono text-xs border ${
              currentPage === 1
                ? "border-gray-600 text-gray-500 cursor-not-allowed"
                : "border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_8px_rgba(34,211,238,0.2)]"
            }`}
          >
            ← PREV
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`p-1.5 px-3 rounded-md font-mono text-xs border ${
              currentPage === totalPages
                ? "border-gray-600 text-gray-500 cursor-not-allowed"
                : "border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_8px_rgba(34,211,238,0.2)]"
            }`}
          >
            NEXT →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
