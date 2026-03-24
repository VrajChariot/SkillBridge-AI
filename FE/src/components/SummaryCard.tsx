import React from "react";

interface SummaryCardProps {
  summary: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg shadow-md p-8 w-full border-l-4 border-primary-600">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-primary-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 11-2 0 1 1 0 012 0zm5 0a1 1 0 11-2 0 1 1 0 012 0z"
            clipRule="evenodd"
          />
        </svg>
        Summary
      </h2>
      <p className="text-gray-800 leading-relaxed text-base">{summary}</p>
    </div>
  );
};
