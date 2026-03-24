# SkillBridge AI - Frontend

A clean, minimal React + TypeScript + TailwindCSS frontend for the ATS Resume Analyzer.

## Features

- ✨ **Modern, Clean UI** - Built with TailwindCSS for a polished SaaS look
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 📊 **Interactive Dashboard** - Real-time analysis results with visual breakdowns
- 🎯 **Smart Empty State** - Engaging preview before the first upload
- ⚡ **Fast & Lightweight** - Vite-powered for instant dev server and optimized builds
- 🦾 **Type-Safe** - Full TypeScript support with proper interfaces

## Tech Stack

- **React 18** - UI framework
- **Vite** - Next-generation build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first styling
- **Fetch API** - HTTP requests (no dependencies!)

## Prerequisites

- Node.js 16+ (npm or pnpm)
- Backend API running on `http://localhost:8000`

## Installation

1. **Install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Create `.env` file (optional):**
   ```bash
   cp .env.example .env
   ```
   Customize `VITE_API_URL` if your backend is on a different URL.

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` with hot module reloading.

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/           # Reusable React components
│   ├── UploadForm.tsx           # File upload & job description input
│   ├── ScoreOverview.tsx        # Current + Projected score cards
│   ├── ScoreBreakdown.tsx       # Progress bars for 5 categories
│   ├── StrengthList.tsx         # Resume strengths list
│   ├── ImprovementsList.tsx     # Improvement suggestions
│   ├── MissingKeywords.tsx      # Missing keywords tags
│   ├── AtsTips.tsx              # ATS formatting tips
│   ├── SummaryCard.tsx          # Overall summary
│   ├── EmptyState.tsx           # Welcome screen
│   └── index.ts                 # Component exports
├── services/
│   └── api.ts                  # API client (uploadAndAnalyzeResume)
├── types/
│   └── ats.ts                  # TypeScript interfaces
├── App.tsx                     # Main application component
├── main.tsx                    # React entry point
└── index.css                   # TailwindCSS imports
```

## Components Overview

### UploadForm

Handles resume file upload and job description input with validation.

**Props:**

- `onAnalysisComplete` - Callback when analysis succeeds
- `onLoading` - Callback for loading state
- `onError` - Callback for errors
- `loading` - Optional loading state

### ScoreOverview

Displays current ATS score and projected score with circular progress indicators.

### ScoreBreakdownComponent

Shows a breakdown of scores across 5 categories with progress bars.

### StrengthList

Lists resume strengths in a clean bullet-point style.

### ImprovementsList

Displays improvement suggestions with impact levels (high/medium/low).

### MissingKeywords

Shows missing keywords as interactive tags.

### AtsTips

Lists ATS-specific formatting recommendations.

### SummaryCard

Displays an overall summary of the analysis.

### EmptyState

Welcome screen with feature preview and mock results.

## API Integration

The frontend communicates with the backend's `/upload` endpoint:

```typescript
POST /upload
Content-Type: multipart/form-data

Body:
- file: File (PDF or DOCX)
- job_description: string
```

See [src/services/api.ts](src/services/api.ts) for implementation.

## Configuration

### Environment Variables

Create a `.env.local` file to override defaults:

```env
VITE_API_URL=http://your-backend-url:8000
```

### TailwindCSS

Customize colors and theme in [tailwind.config.js](tailwind.config.js).

Current primary color: Sky blue (`#0284c7`)

## Styling

All styles use TailwindCSS utility classes. No custom CSS files needed for component styling.

### Color Palette

- **Primary**: Sky blue (`primary-600: #0284c7`)
- **Success**: Green (`green-600: #16a34a`)
- **Warning**: Yellow (`yellow-600: #ca8a04`)
- **Error**: Red (`red-600: #dc2626`)
- **Info**: Light blue (`blue-600: #2563eb`)

## Performance

- **Code Splitting**: Automatic with Vite
- **Tree Shaking**: Unused code is removed in production
- **CSS Purging**: TailwindCSS only includes used styles
- **Image Optimization**: Consider using `vite-plugin-imagemin` for assets

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Troubleshooting

### "Cannot connect to backend"

Make sure the backend is running:

```bash
cd ../BE
poetry run uvicorn src.main:app --reload
```

The frontend expects it on `http://localhost:8000`.

### Port 5173 already in use

```bash
npm run dev -- --port 3000
```

### Styles not loading

Clear Vite cache:

```bash
rm -rf dist node_modules/.vite
```

## Development Tips

- **HMR**: Hot Module Replacement is enabled. Changes instantly reload
- **DevTools**: React DevTools extension is compatible
- **Type Checking**: `tsc --noEmit` to check types without building
- **Responsive Design**: Use DevTools device emulation to test mobile

## Future Enhancements

- [ ] Dark mode support
- [ ] Resume preview/download
- [ ] Analysis history
- [ ] PDF visualization
- [ ] Multiple language support
- [ ] PWA capabilities

## License

Proprietary - SkillBridge AI

---

**Made with** ❤️ **and** ☕ **by Vraj**

**Questions?** Check the main [README.md](../README.md) for project-wide information.
