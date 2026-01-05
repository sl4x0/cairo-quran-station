# Changelog

All notable changes to this project will be documented in this file.

## 2026-01-05 — Comprehensive UI/UX Improvements

### Added
- **Enhanced Error Toast** (`components/enhanced-toast.tsx`) - Bilingual error messages (Arabic/English) with retry functionality, auto-dismiss, and contextual suggestions
- **Success Toast** component for positive user feedback
- **Loading Skeletons** (`components/loading-skeletons.tsx`) - Beautiful animated skeleton loaders for prayer times, ayah, and general content
- **Buffering Indicator** for audio player with visual feedback
- **Keyboard Shortcuts Modal** (`components/keyboard-shortcuts-modal.tsx`) - Press '?' to view all available shortcuts
- **Floating Help Button** - Always-visible button to access keyboard shortcuts
- Keyboard shortcut for showing help modal ('?' key)

### Improved
- Error handling with user-friendly bilingual messages and retry buttons
- Loading states across all async components with professional skeleton loaders
- User feedback with contextual error messages and helpful suggestions
- Accessibility with keyboard navigation support and visual shortcuts guide
- Mobile experience with touch-optimized controls and responsive layouts
- **Responsive grid layout** - Changed from lg to xl breakpoints to prevent overlapping on tablets
- **Card spacing** - Improved gaps and padding across all device sizes (mobile: 1.5rem, tablet: 2rem, desktop: 2.5rem)
- **Touch targets** - Ensured minimum 44x44px for all interactive elements
- **Overflow prevention** - Added CSS rules to prevent horizontal scrolling on all devices

### Changed
- Replaced basic toast notifications with enhanced bilingual error toasts
- Updated Suspense fallbacks to use new skeleton components
- Added keyboard shortcut listener for '?' key to show help modal
- **Grid breakpoint** from `lg:grid-cols-12` to `xl:grid-cols-12` for better tablet experience
- **Spacing system** with responsive gaps: `gap-6 sm:gap-8` instead of fixed `gap-8`
- **Player minimum height** from 420px to responsive `min-h-[400px] sm:min-h-[450px]`

### Fixed
- **Layout centering** - Reduced max-width from 1600px to 1400px for better content centering
- **Grid proportions** - Changed to `lg:grid-cols-2 xl:grid-cols-5` (2:3 ratio) to reduce empty space
- **Color contrast** - Improved with brighter gold (#f4c430), darker background (#0f1419), pure white text
- **Glass panel visibility** - Increased opacity from 8% to 15% with stronger borders (25% → 35%)
- **Player card** - Made sticky on desktop, increased background opacity from 30% to 40%
- **Text readability** - Enhanced text-shadow and improved contrast ratios across all components

## 2026-01-05 — Documentation & Code Quality Improvements

### Added
- Comprehensive JSDoc documentation for utility functions (`lib/arabic-numerals.ts`)
- JSDoc documentation for custom hooks (`hooks/use-mounted.ts`)
- Component-level documentation for `PlayerCard` with feature descriptions
- `ARCHITECTURE.md` - Beginner-friendly guide explaining how the project works
- `CONTRIBUTING.md` - Comprehensive contribution guidelines with code style, testing requirements, and PR process
- `.env.example` - Environment variables documentation with setup instructions

### Improved
- Inline comments explaining complex logic throughout the codebase
- Code readability with explanatory comments for non-obvious implementations

## 2026-01-05 — Stability & UX fixes

- Updated core dependencies to latest stable releases and audited for compatibility.
- Removed unnecessary/no-op global event listeners to avoid performance overhead.
- Added centralized low-power detection hook (`hooks/use-low-power.ts`) with feature detection and safe cleanup.
- Fixed audio stream recovery logic to clear retry timers on unmount.
- Moved `AyahOfTheDay` into left column to balance layout and removed duplicate station badges.
- Improved slider visuals and play button sizing for better UX on mobile/desktop.
- Added `types/global.d.ts` to type experimental navigator APIs and eliminate unsafe casts.
- Added `Toast` message for prayer-time fallback when network fetch fails.
- Added an `optimize:images` script using `svgo` and optimized SVG assets.
- Accessibility fix: added `id="main-content"` to the main container for skip links.
