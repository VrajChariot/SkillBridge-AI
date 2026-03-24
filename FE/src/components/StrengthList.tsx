import React from "react";

interface StrengthListProps {
  strengths: string[];
}

export const StrengthList: React.FC<StrengthListProps> = ({ strengths }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-green-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10.868 2.884l-.321-.48A1.745 1.745 0 008.12 1.071l-.288.046a1.745 1.745 0 00-.572 3.06l.520.853a6 6 0 00.422 8.827l-5.85-5.852a1.5 1.5 0 10-2.121 2.121L10 16.66l1.716-1.716a1.5 1.5 0 10-2.121-2.121l-.841.84a6 6 0 008.827.422l.853.52c1.962-1.962 1.961-5.193-.032-7.174l-.48-.321z"
            clipRule="evenodd"
          />
        </svg>
        Strengths
      </h2>
      <ul className="space-y-3">
        {strengths.map((strength, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="text-green-600 font-bold mt-0.5">✓</span>
            <span className="text-gray-700">{strength}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
