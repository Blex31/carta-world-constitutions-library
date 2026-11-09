# CARTA Web Application Development Guide

## Overview

The CARTA web application is built with **React 19 + Vite 8** and provides a document-first legal information platform for constitutional texts.

## Project Structure

```
src/
├── App.jsx              # Root component with state management
├── main.jsx             # Application entry point
├── auth.js              # Authentication and API client
├── assets/
│   └── images/          # Static images
├── components/
│   ├── AdSlot.jsx       # Advertisement component
│   ├── CompareCard.jsx  # Constitution comparison card
│   └── PageHeader.jsx   # Page header component
│   └── IntroLoadingScreen.jsx  # Introduction/loading screen
├── lib/
│   ├── daily.js         # Daily article selection logic
│   ├── format.js        # Text formatting utilities
│   ├── research-presets.js # Predefined research queries
│   └── use-store.js     # Persistent state hook
├── modals/
│   ├── AuthModal.jsx    # Authentication modal
│   ├── CompareModal.jsx # Document comparison modal
│   ├── NoteModal.jsx    # Note editing modal
│   ├── PaywallModal.jsx # Subscription paywall
│   └── WelcomeModal.jsx # Country selection modal
└── pages/
    ├── CataloguePage.jsx  # Jurisdiction catalogue
    ├── ChatPage.jsx        # Legal research chat
    ├── HomePage.jsx        # Landing page
    ├── LibraryPage.jsx     # User library
    ├── ReadPage.jsx        # Document reader
    ├── SearchPage.jsx      # Search results
    └── SourcesPage.jsx     # Legal sources directory
```

## Getting Started

### Prerequisites

- Node.js 22 or later (required by engines field in package.json)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Blex31/carta-world-constitutions-library.git
cd carta-world-constitutions-library

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### Environment Configuration

Edit `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://mvcirldxcuvcuqvlmqxv.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_CARTA_API_URL=https://mvcirldxcuvcuqvlmqxv.supabase.co/functions/v1/carta-api
```

### Development Server

```bash
npm run dev
```

This starts Vite on `http://localhost:3000` with hot module replacement.

### Production Build

```bash
npm run build
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run TypeScript type check |
| `npm run typecheck` | Type check without emitting |
| `npm run test` | Run tests |
| `npm run syntaxcheck` | Validate syntax of critical files |
| `npm run audit:global-queue` | Audit global constitution queue |
| `npm run audit:coverage` | Audit coverage statistics |
| `npm run import:constitutions` | Import constitution documents |

## Architecture

### State Management

The application uses a combination of:

1. **React useState** - Local component state
2. **useStore hook** - Persistent state in localStorage
3. **Context** - Shared state (passed via ctx prop)

### Data Flow

```
User Action
    ↓
Component Handler
    ↓
apiFetch() - calls CARTA API
    ↓
Supabase Edge Function (carta-api)
    ↓
Supabase Postgres Database
    ↓
Response
    ↓
State Update
    ↓
UI Re-render
```

### Authentication Flow

1. User signs in via `signInWithEmail()` in auth.js
2. Supabase Auth creates session
3. Session persisted in localStorage
4. Access token automatically refreshed
5. API calls include `apikey` header + `Authorization: Bearer <token>`

## Key Components

### App.jsx

The root component manages:
- Application state (countries, documents, articles, etc.)
- User authentication state
- Page routing (via page state)
- Data fetching from API
- Error handling and fallback to seed data

### Pages

#### HomePage.jsx
Displays:
- Daily constitutional article
- Quick actions
- Featured content

#### ReadPage.jsx
Provides:
- Full constitution reader
- Table of contents
- Article navigation
- Plain language summaries

#### SearchPage.jsx
Features:
- Full-text search
- Local search fallback
- Server-side search via API
- Filter by jurisdiction

#### ChatPage.jsx
Implements:
- Legal research chat assistant
- Streaming responses
- Source citations
- Conversation history

#### CataloguePage.jsx
Shows:
- All jurisdictions (195)
- Constitution status for each
- Coverage statistics

#### LibraryPage.jsx
Manages:
- User bookmarks
- Highlights
- Notes
- Downloads

#### SourcesPage.jsx
Displays:
- Legal source directory
- Source metadata
- Rights status

## Styling

The application uses plain CSS with a modular approach:
- Global styles in `index.html` and inline styles
- Component-specific styles in JSX
- CSS classes for common patterns
- Theme: Light mode (default) and dark mode (night)

### Color Palette

| Color | Usage | Hex |
|-------|-------|-----|
| Primary Green | Brand, accents | #1A7F37 |
| Background | Light mode | #FFFBF2 |
| Background | Dark mode | #1A1A1A |
| Text | Primary | #222222 |
| Text | Secondary | #6B6A61 |
| Text | Muted | #999999 |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | Merriweather | 48px-24px | 700 |
| Body | Inter | 19px | 400 |
| Small text | Inter | 11.5px-14px | 400 |

## API Integration

### API Client (auth.js)

The `apiFetch()` function is the primary way to call the CARTA API:

```javascript
import { apiFetch } from './auth';

// GET request
const response = await apiFetch('library');
const data = await response.json();

// POST request with body
const response = await apiFetch('legal-chat', {
  method: 'POST',
  body: JSON.stringify({ question: 'What is sovereignty?' })
});
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/library` | GET | Get jurisdictions, documents, articles |
| `/api/library/me` | GET | Get user's library data |
| `/api/library/:id` | GET | Get specific document |
| `/api/search` | GET | Search documents |
| `/api/legal-chat` | POST | Ask legal research question |
| `/api/billing/status` | GET | Get subscription status |
| `/api/billing/checkout` | POST | Create checkout session |
| `/api/billing/verify` | GET | Verify checkout completion |
| `/api/billing/portal` | POST | Open billing portal |
| `/api/admin/sources` | GET/POST | Manage legal sources |
| `/api/admin/ingest` | POST | Trigger feed ingestion |

## Data Model

### Jurisdiction

```javascript
{
  id: string,           // ISO code (e.g., 'KE')
  name: string,          // Country name
  flag: string,          // Emoji flag
  constitutionStatus: string,  // 'verified_current', 'text_loaded', 'metadata_only', etc.
  jurisdictionKind: string,
  isUnMember: boolean,
  continent: string,
  region: string
}
```

### Document

```javascript
{
  id: string,
  country: string,       // Jurisdiction ISO code
  title: string,
  type: string,          // 'constitution', 'amendment', etc.
  year: number,
  main: boolean,         // Is primary constitution
  short: string,         // Short description
  officialUrl: string,
  version: string,
  documentStatus: string,
  licenseStatus: string,
  commercialUseAllowed: boolean
}
```

### Article (Section)

```javascript
{
  id: string,
  doc: string,           // Document ID
  chapter: number,
  chapterTitle: string,
  num: string,           // Article/section number
  title: string,
  original: string,     // Original legal text
  plain: string,         // Plain language summary
  tags: string[],
  source: string,
  officialUrl: string
}
```

## User Library Features

### Bookmarks

Users can bookmark articles for quick access. Bookmarks are:
- Stored in localStorage (for unauthenticated users)
- Synced to server (for authenticated users)
- Persisted across devices (when signed in)

### Highlights

Users can highlight text within articles. Highlights include:
- Selected text
- Article reference
- Timestamp

### Notes

Users can add notes to articles. Notes include:
- Text content
- Article reference
- Timestamp

### Downloads

Users can download documents for offline reading. Downloads are:
- Tracked by document ID
- Available in user's library

## Authentication

### Sign In

```javascript
import { signInWithEmail } from './auth';

try {
  const user = await signInWithEmail(email, password);
  // User signed in successfully
} catch (error) {
  // Handle error
}
```

### Sign Up

```javascript
import { signUpWithEmail } from './auth';

try {
  const user = await signUpWithEmail(email, password, name);
  // User created (may need email confirmation)
} catch (error) {
  // Handle error
}
```

### Sign Out

```javascript
import { signOut } from './auth';

await signOut();
// User signed out
```

### Password Reset

```javascript
import { requestPasswordReset } from './auth';

await requestPasswordReset(email, redirectUrl);
// Password reset email sent
```

## Billing Integration

The application integrates with Stripe for subscription management:

### Checkout

```javascript
const response = await apiFetch('billing/checkout', {
  method: 'POST',
  body: JSON.stringify({ plan: 'monthly' })
});
const { url } = await response.json();
window.location.href = url;
```

### Verify Subscription

```javascript
const response = await apiFetch('billing/verify?checkoutSessionId=...');
const data = await response.json();
// data.isAdFree - true if subscription active
```

### Billing Portal

```javascript
const response = await apiFetch('billing/portal', { method: 'POST' });
const { url } = await response.json();
window.location.href = url;
```

## Daily Article Feature

Each day, users see a different article from their selected jurisdiction:

1. **Selection**: Based on hash of `countryId + date`
2. **Rotation**: Changes at 06:00 local time
3. **Fallback**: If no current constitution, shows placeholder
4. **Categories**: Rotates between:
   - Constitution article (fact)
   - Bill
   - Current affair

## Search Functionality

### Local Search

- Searches within loaded articles
- Case-insensitive
- Matches in title, number, text, tags

### Server Search

- Searches across all verified documents
- Uses PostgreSQL full-text search
- Returns chunks with context
- Limited to 80 results

## Legal Research Chat

The chat assistant provides:

1. **Verified Sources Only**: Only answers from verified, current, commercially-licensed documents
2. **Source Citations**: Always cites official URLs
3. **Rate Limiting**: 12 requests per 60 seconds per user
4. **Streaming**: Responses stream in real-time
5. **Conversations**: Persistent conversation history
6. **Fallback**: If no verified sources match, returns explicit message

### Usage

```javascript
const response = await apiFetch('legal-chat', {
  method: 'POST',
  body: JSON.stringify({
    question: 'What is the sovereignty clause?',
    jurisdictionIso: 'KE',
    conversationId: '...'  // Optional for continuing conversation
  })
});
```

## Administration

Admin users (with `admin` role in app_metadata) can:

1. **Manage Legal Sources**: Add, update, activate sources
2. **Trigger Ingestion**: Run feed ingestion manually
3. **View Source Registry**: See all registered sources

### Admin Functions

```javascript
// Get sources
const response = await apiFetch('admin/sources');

// Create source
const response = await apiFetch('admin/sources', {
  method: 'POST',
  body: JSON.stringify({ slug: 'new-source', name: '...', ... })
});

// Update source
const response = await apiFetch('admin/sources/123', {
  method: 'PATCH',
  body: JSON.stringify({ isActive: true, ... })
});

// Trigger ingestion
const response = await apiFetch('admin/ingest', { method: 'POST' });
```

## Performance Optimization

1. **Lazy Loading**: Data loaded on-demand
2. **Memoization**: useMemo for expensive computations
3. **Debouncing**: Search requests debounced (250ms)
4. **Pagination**: Feed items limited (80)
5. **Fallback**: Uses seed data when API unavailable

## Testing

### Run Tests

```bash
npm test
```

### Type Checking

```bash
npm run typecheck
```

### Syntax Checking

```bash
npm run syntaxcheck
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

### Deploy to GitHub Pages

The repository has a GitHub Actions workflow (`deploy-pages.yml`) that automatically deploys to GitHub Pages when changes are pushed to `main`.

### Deploy to Supabase

The repository has a workflow (`deploy-web.yml`) for deploying to Supabase Storage.

## Best Practices

1. **Component Structure**: Keep components focused and reusable
2. **State Management**: Use local state for UI, useStore for persistence
3. **Error Handling**: Always handle errors gracefully
4. **Loading States**: Show loading indicators for async operations
5. **Accessibility**: Use semantic HTML and ARIA attributes
6. **Security**: Never expose service role keys in client code
7. **Performance**: Minimize re-renders with useMemo and useCallback
8. **Documentation**: Add comments for complex logic

## Troubleshooting

### Common Issues

**Issue**: Blank page on load
**Solution**: Check if Supabase credentials are set in `.env.local`

**Issue**: API calls failing with 403
**Solution**: Verify SUPABASE_PUBLISHABLE_KEY is correct

**Issue**: Authentication not working
**Solution**: Check Supabase Auth configuration in Supabase dashboard

**Issue**: Daily article not changing
**Solution**: Ensure clockTick state is updating (check useEffect)

**Issue**: Search not returning results
**Solution**: Verify documents are imported and indexed

### Debugging

Add console.log statements or use browser dev tools:

```javascript
// Log API responses
const response = await apiFetch('library');
console.log('API Response:', await response.json());

// Log state
console.log('Current state:', { countries, docs, articles });
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Run typecheck: `npm run typecheck`
6. Run syntaxcheck: `npm run syntaxcheck`
7. Commit your changes
8. Push to your fork
9. Open a pull request

## License

This project is private and proprietary. Do not redistribute without permission.
