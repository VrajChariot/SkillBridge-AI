/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",
      // Desk the documents sit on.
      paper: "#F7F8FA",
      // Document surfaces: the posting, the resume, the report.
      sheet: "#FFFFFF",
      // Ballpoint ink: text, primary actions.
      ink: { DEFAULT: "#17203A", soft: "#2A3557" },
      // Secondary text.
      graphite: "#5B6478",
      // Hairlines and borders.
      rule: { DEFAULT: "#D9DDE5", strong: "#B9C0CD" },
      // The one accent: only marks what the user should add.
      highlighter: { DEFAULT: "#F2DF4A", faint: "#FBF4C2" },
      // Problems and high-impact edits.
      correction: { DEFAULT: "#C8323C", faint: "#FBECEC" },
      // Things already in place, completed edits.
      matched: { DEFAULT: "#1F7A55", faint: "#E7F3ED" },
    },
    fontFamily: {
      sans: [
        '"Schibsted Grotesk Variable"',
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
      ],
    },
    // Classical typographic scale (Bringhurst): 12 14 16 18 21 24 36 48 60 72.
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1.4" }],
      sm: ["0.875rem", { lineHeight: "1.5" }],
      base: ["1rem", { lineHeight: "1.6" }],
      md: ["1.125rem", { lineHeight: "1.55" }],
      lg: ["1.3125rem", { lineHeight: "1.4" }],
      xl: ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
      "2xl": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      "3xl": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
      "4xl": ["3.75rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
      "5xl": ["4.5rem", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
    },
    borderRadius: {
      none: "0",
      // Chips and marks.
      sm: "3px",
      // Controls.
      DEFAULT: "6px",
      // Document sheets.
      lg: "10px",
      full: "9999px",
    },
    extend: {
      maxWidth: {
        prose: "68ch",
      },
      screens: {
        // Roomier spacing and the largest headline only when the window is tall enough to fit the form.
        tall: { raw: "(min-height: 820px)" },
      },
    },
  },
  plugins: [],
};
