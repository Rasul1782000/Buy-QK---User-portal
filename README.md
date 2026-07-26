# BuyQK

A full-stack e-commerce user portal built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB. BuyQK is a localized grocery marketplace connecting customers with neighborhood stores and delivery partners.

## Features

- Multi-language support (English, Tamil, Hindi, Bengali, Kannada)
- User authentication (signup, login, logout, password reset)
- Category-based product browsing with grid layout
- Promo banners with auto-rotate carousel
- Location detection for delivery estimates
- Search functionality with popular search terms
- Responsive design (mobile, tablet, desktop)
- Fixed card layout — cards maintain their position across all language translations

## Tech Stack

| Layer        | Technology                            |
|--------------|---------------------------------------|
| Frontend     | React 18, Vite 8, Tailwind CSS v4, React Router 7 |
| Backend      | Node.js, Express                      |
| Database     | MongoDB (with fallback in-memory store) |
| Auth         | JSON Web Tokens (JWT)                 |
| Translations | Custom i18n with 5 languages          |
| Linting      | Oxlint                                |

## Project Structure

```
BuyQK/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── CategoryCard/     # Individual category card
│   │   │   ├── CategoryGrid/     # Grid of category cards
│   │   │   ├── PromoBanner/      # Rotating promo banner
│   │   │   ├── Header/           # Header with nav
│   │   │   ├── Footer/           # Site footer
│   │   │   ├── SearchBar/        # Search bar
│   │   │   ├── LocationDetector/ # Geolocation detector
│   │   │   └── WelcomeFlash/     # Splash screen
│   │   ├── context/           # React contexts
│   │   │   ├── LanguageContext.jsx  # Multi-language i18n
│   │   │   └── useAuth.js           # Auth hook
│   │   ├── pages/           # Page components
│   │   ├── translations/    # Language files (en, ta, hi, bn, kn)
│   │   ├── api/             # API client (Axios)
│   │   └── App.jsx          # Main app with routes
│   └── package.json
├── server/                  # Express backend
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   │   ├── auth.js       # Authentication routes
│   │   │   ├── categories.js # Category routes
│   │   │   ├── banners.js    # Banner/content routes
│   │   │   └── search.js     # Search routes
│   │   ├── models/          # Data models
│   │   ├── index.js         # Server entry point
│   │   └── seed.js          # Database seeder
│   └── package.json
└── README.md
```

## Client Routes

| Route            | Page                  | Description                         |
|------------------|-----------------------|-------------------------------------|
| `/`              | WelcomeFlash          | Splash/landing screen               |
| `/login`         | LoginPage             | User login                          |
| `/signup`        | SignupPage            | User registration                   |
| `/home`          | AppLayout → HomePage  | Main app layout with all sections   |
| `/forgot-password` | ForgotPasswordPage  | Password reset request              |

### HomePage Sections (under `/home`)

| Section          | Component       | Description                         |
|------------------|-----------------|-------------------------------------|
| Header           | Header          | Sticky top bar with nav, search, cart, language selector |
| PromoBanner      | PromoBanner     | Rotating promotional banners (3 slides) |
| CategoryGrid     | CategoryGrid    | Card grid of 16 shopping categories |
| Feature Cards    | (inline)        | Three feature highlight cards (Delivery, Pricing, Stores) |
| Footer           | Footer          | Site footer with links and app stores |

## Server API Routes

Base URL: `/api`

### Auth

| Method | Endpoint                  | Description            |
|--------|---------------------------|------------------------|
| POST   | `/api/auth/signup`        | Register new user      |
| POST   | `/api/auth/login`         | Login                  |
| POST   | `/api/auth/forgot-password` | Send reset link      |
| POST   | `/api/auth/reset-password`  | Reset password with token |
| GET    | `/api/auth/me`              | Get current user profile |

### Categories

| Method | Endpoint                  | Description            |
|--------|---------------------------|------------------------|
| GET    | `/api/categories`         | List all categories    |
| GET    | `/api/categories/:slug`   | Get category by slug   |

### Banners

| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| GET    | `/api/banners`        | List all promo banners  |

### Search

| Method | Endpoint                      | Description                      |
|--------|-------------------------------|----------------------------------|
| GET    | `/api/search/popular`         | Get popular search terms         |

### Health

| Method | Endpoint            | Description            |
|--------|---------------------|------------------------|
| GET    | `/api/health`       | Health check           |

## Supported Languages

| Code | Language  | Native Name       |
|------|-----------|-------------------|
| en   | English   | English           |
| ta   | Tamil     | தமிழ்             |
| hi   | Hindi     | हिन्दी             |
| bn   | Bengali   | বাংলা             |
| kn   | Kannada   | ಕನ್ನಡ             |

Language preference is stored in `localStorage` under the key `buyqk_lang`.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB (or use the in-memory fallback)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Rasul1782000/Buy-QK---User-portal.git
cd BuyQK
```

2. **Install dependencies**

```bash
cd client && npm install
cd ../server && npm install
```

3. **Configure the server**

Copy the server config and update values as needed:

```bash
cd ../server
cp src/config.js src/config.js.example
# Edit src/config.js with your MongoDB URI and other settings
```

4. **Seed the database (optional)**

```bash
npm run seed
```

5. **Run the development servers**

In separate terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev
```

```bash
# Terminal 2 — Frontend
cd client
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3001` (or as configured).

## Building for Production

```bash
cd client
npm run build
```

The build output is in `client/dist/`.

## Linting

```bash
cd client
npx oxlint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

© 2026 BuyQK. All rights reserved.
```

Then commit and push
<tool_call>bash
<arg_key>command</arg_key>
<arg_value>git add README.md