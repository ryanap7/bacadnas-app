# 🚀 React Native Expo Starter Kit

### Expo SDK 54 · React Native 0.81 · React 19.1 · Expo Router v6

A **production-ready** boilerplate for building scalable, maintainable React Native apps with Expo's managed workflow.

---

## 📦 Tech Stack

| Layer              | Technology                       |
| ------------------ | -------------------------------- |
| **Runtime**        | React Native 0.81 + React 19.1   |
| **Framework**      | Expo SDK 54 (Managed Workflow)   |
| **Navigation**     | Expo Router v6 (file-based)      |
| **Styling**        | StyleSheet + shared theme tokens |
| **State (Local)**  | React `useState` / `useReducer`  |
| **State (Server)** | TanStack Query v5                |
| **HTTP**           | Axios with interceptors          |
| **Animation**      | React Native Reanimated v4       |
| **Icons**          | `@expo/vector-icons` (Lucide)    |
| **Linting**        | ESLint + Prettier                |
| **Type Safety**    | TypeScript (strict)              |

---

## ⚡ Quick Start

```bash
# 1. Create project from template
npx create-expo-app@latest MyApp --template blank

# 2. Install core dependencies
npx expo install expo-router react-native-safe-area-context react-native-screens \
  expo-linking expo-constants expo-status-bar

# 3. Install ecosystem packages
npm install @tanstack/react-query axios react-native-reanimated \
  @expo/vector-icons

# 4. Install dev tools
npm install --save-dev eslint prettier eslint-plugin-expo \
  eslint-plugin-react-native-community typescript @types/react

# 5. Copy the boilerplate files from this kit into your project
# 6. Start development
npx expo start
```

---

## 📁 Project Structure

```
├── app/                        # Expo Router — file = route
│   ├── _layout.tsx             # Root layout (QueryClient, SafeArea, Reanimated)
│   ├── index.tsx               # Home screen → route "/"
│   ├── (tabs)/                 # Tab navigator group
│   │   ├── _layout.tsx         # Tab bar config
│   │   ├── home.tsx
│   │   ├── explore.tsx
│   │   └── profile.tsx
│   └── (stack)/                # Stack navigator group
│       ├── _layout.tsx         # Stack header config
│       └── detail.tsx          # /detail — accessible from any tab
│
├── src/
│   ├── api/                    # Axios instance + endpoint functions
│   │   ├── client.ts           # Axios base config + interceptors
│   │   └── users.ts            # Example: user API functions
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── index.ts            # Barrel export
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useUsers.ts         # TanStack Query hook wrapping API
│   │   └── useHaptic.ts        # Example: haptic feedback hook
│   │
│   ├── context/                # React Context providers
│   │   └── ThemeContext.tsx    # Light/Dark theme
│   │
│   ├── constants/              # App-wide constants
│   │   ├── colors.ts           # Color palette tokens
│   │   ├── spacing.ts          # Spacing scale
│   │   └── typography.ts       # Font sizes & weights
│   │
│   ├── types/                  # Global TypeScript types
│   │   ├── api.ts              # API response types
│   │   └── navigation.ts       # Route param types
│   │
│   └── utils/                  # Pure utility functions
│       ├── formatDate.ts
│       └── logger.ts
│
├── assets/                     # Static assets
│   └── images/
│
├── app.json                    # Expo config
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
└── babel.config.js
```

---

## 🏗️ Architecture Conventions

### 1. File-Based Routing (Expo Router v6)

-   Setiap file di `app/` → otomatis jadi route.
-   Gunakan **route groups** `(name)/` untuk mengelompokkan layout tanpa menambah URL.
-   `_layout.tsx` mengontrol navigator (Stack, Tabs, Drawer).
-   Dynamic routes: `app/users/[id].tsx` → `/users/123`.

### 2. State Management Layers

```
┌─────────────────────────────────────┐
│  Server State   →  TanStack Query   │  API caching, refetch, mutations
│  Global State   →  React Context    │  Theme, Auth, App config
│  Local State    →  useState/Reducer │  Form state, UI toggles
└─────────────────────────────────────┘
```

### 3. API Layer Pattern

```
app/                         ← UI layer
  └── uses useUsers()        ← custom hook
        └── calls api/users  ← pure API functions (Axios)
              └── uses client.ts ← base Axios instance
```

Benefits: mudah di-mock saat testing, logic terpisah dari UI.

### 4. Component Conventions

-   Komponen **dumb/presentational** → `src/components/`
-   Komponen **smart/stateful** → inline di screen (`app/`)
-   Selalu export `default` dari screen, named export dari components.
-   Barrel exports (`index.ts`) di setiap folder untuk import yang bersih.

---

## 🔧 Key Configurations

### `package.json` — entry point

```json
{
    "main": "expo-router/entry"
}
```

### `app.json` — New Architecture enabled

```json
{
    "expo": {
        "newArchEnabled": true
    }
}
```

### `tsconfig.json` — path aliases

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "~/*": ["src/*"]
        }
    }
}
```

Import yang bersih: `import { Button } from '~/components'`

---

## 📱 Perintah Umum

| Command                    | Fungsi                             |
| -------------------------- | ---------------------------------- |
| `npx expo start`           | Start dev server                   |
| `npx expo start --ios`     | Start di iOS simulator             |
| `npx expo start --android` | Start di Android emulator          |
| `npx expo prebuild`        | Generate native projects           |
| `npx expo install`         | Install & sync compatible versions |
| `npx expo-doctor`          | Check dependency compatibility     |
| `eas build -p all`         | Build production (iOS + Android)   |
| `eas update`               | Push OTA update                    |

---

## ✅ Checklist Sebelum Production

-   [ ] Ganti `APP_NAME` di `app.json`
-   [ ] Set `.env` variables (API keys, base URL)
-   [ ] Configure `eas.json` untuk build profiles
-   [ ] Test di device fisik sebelum release
-   [ ] Run `npx expo-doctor` untuk validasi dependencies
-   [ ] Enable error tracking (Sentry / Bugsnag)
