import React from "react";

interface AtsTipsProps {
  tips: string[];
}

export const AtsTips: React.FC<AtsTipsProps> = ({ tips }) => {
  return (
    <div className="bg-blue-50 rounded-lg shadow-md p-8 w-full border-l-4 border-blue-600">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z"
            clipRule="evenodd"
          />
        </svg>
        ATS Compatibility Tips
      </h2>
      <ul className="space-y-3">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="text-blue-600 font-bold mt-0.5">💡</span>
            <span className="text-gray-700">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
