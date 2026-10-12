# VK Marusya — Online Cinema Service

A beta version of VK's streaming service "Marusya". Users can search for movies, browse them by genres and categories, watch trailers, and add movies to their favorites.

## 🚀 Technologies

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Redux Toolkit** + **React Redux** — state management
- **React Router v6** — routing
- **Axios / Fetch API** — backend communication
- **Sass (SCSS)** — styling based on Figma designs

## ✨ Features

### Home Page
- Random daily movie with buttons: "Trailer", "About", add to favorites, and get a new random movie.
- Top-10 movies by IMDb rating.

### Pages
- **Genres** — list of genres displayed as cards.
- **Genre Movies** — filters by genre, load 10 more movies with the "Show More" button.
- **Movie Page** — cover image, full description (language, budget, revenue, director, production, awards), trailer, favorites.
- **Account** — personal data and favorite movies (available after login), with tabs for "Favorite Movies" and "Account Settings".

### Authentication
- Registration and login via modal window (field validation, error highlighting).
- Session stored in cookies; user data is additionally saved in `localStorage`, so authentication is preserved on page reload.
- After registration, a "Registration Complete" screen is displayed.

### Search
- Live search for movies by title in the site header with a dropdown list of results.

### Additional
- Transition animations between pages, modals, and cards.
- Toast notifications for errors and actions.
- Preloaders and loaders for asynchronous operations.
- Responsive design for 375px / 1440px based on Figma layouts.

## 🛠 Installation and Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production version
npm run build

# Preview the built project locally
npm run preview
```

The application will be available at http://localhost:5173/ (or the next available port).

## 📁 Project Structure

```
src/
├── components/
│   ├── molecules/       # Cards, modals, loaders
│   └── organisms/       # Header, Footer, Layout, transition animations
├── pages/               # Application pages
├── services/            # API integration
├── store/               # Redux slices (auth, movie, genre, favorites, toast)
├── styles/              # SCSS styles (base, pages)
├── types/               # TypeScript types
└── utils/               # Utilities (formatting, genre translation)
```

## 🔌 API

Backend: [https://cinemaguide.skillbox.cc](https://cinemaguide.skillbox.cc) (documentation at `/docs`).

Integration details:
- Authentication via session cookies; all requests are sent with `credentials: include`.
- Endpoints `POST /user` (registration), `POST /auth/login`, and `POST /favorites` accept data in **`application/x-www-form-urlencoded`** format.
- After login, the profile (first name, last name, email) is fetched separately via `GET /profile`.
- Movie list pagination is controlled by `page` and `count` parameters.

## 📜 Scripts

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `npm run dev`    | Start the dev server                |
| `npm run build`  | Type checking + production build    |
| `npm run preview`| Preview the production build        |
