import React from "react";

interface MissingKeywordsProps {
  keywords: string[];
}

export const MissingKeywords: React.FC<MissingKeywordsProps> = ({
  keywords,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-orange-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v4h8v-4zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        Missing Keywords
      </h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, idx) => (
          <span
            key={idx}
            className="bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold border border-orange-200 hover:shadow-md transition-shadow"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
};
