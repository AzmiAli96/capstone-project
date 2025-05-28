"use client";
import React from "react";
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface ToastProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
}

const iconMap = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  error: <XCircleIcon className="h-6 w-6 text-red-500" />,
  warning: <ExclamationCircleIcon className="h-6 w-6 text-orange-500" />,
};

const bgColorMap = {
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  warning: "bg-orange-100 text-orange-700",
};

export default function Toast({ type, message, onClose }: ToastProps) {
  return (
    <div className={`fixed top-5 right-5 z-50 w-full max-w-xs p-4 rounded-lg shadow-sm flex items-center gap-3 ${bgColorMap[type]}`}>
      <div className="shrink-0 w-8 h-8 flex items-center justify-center">
        {iconMap[type]}
      </div>
      <div className="text-sm font-medium flex-1">{message}</div>
      <button
        onClick={onClose}
        className="text-gray-600 hover:text-black p-1 rounded"
        aria-label="Close toast"
      >
        ✕
      </button>
    </div>
  );
}
