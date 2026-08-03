"use client";

import { useState } from "react";
import { AppViewState, ViewState } from "@/components/AppViewState";

const STATES: ViewState[] = [
  "404",
  "500",
  "empty-products",
  "empty-cart",
  "empty-orders",
  "loading",
  "network-error",
];

export default function TestStatesPage() {
  const [currentState, setCurrentState] = useState<ViewState>("404");

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-4">State View Tester</h1>
        <p className="text-xs text-gray-500 mb-4">Click any button below to instantly preview the corresponding UI state:</p>
        
        <div className="flex flex-wrap gap-2">
          {STATES.map((state) => (
            <button
              key={state}
              onClick={() => setCurrentState(state)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentState === state
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* Rendered View Component */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px] flex items-center justify-center">
        <AppViewState
          state={currentState}
          onAction={() => alert(`Action triggered for state: ${currentState}`)}
        />
      </div>
    </div>
  );
}