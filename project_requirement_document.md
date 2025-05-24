**Create a Progressive Web App (PWA) Chat Application with FastAPI Backend Integration**

You are tasked with creating a Progressive Web App (PWA) chat application that integrates with a Python FastAPI backend hosted at `https://web-production-d7d37.up.railway.app`. The app must be installable on macOS, Windows, Linux, iOS, and Android via the browser’s address bar “install” icon. The developer has limited knowledge of web frameworks and only knows Python, so the solution must be beginner-friendly, well-documented, and include all necessary code with clear comments. Use **Next.js** (version 14 or later) with **Tailwind CSS** for styling and **next-pwa** for PWA functionality. The app should feature a chat interface with user messages on the right (blue) and AI responses on the left (gray), a sidebar for chat history with a “New Chat” button, smooth scrolling, and user signup/login/logout functionality. Communicate only with the backend’s endpoints, not directly with Supabase. Below are the detailed requirements and instructions.

### Project Requirements
1. **Purpose**: Build a chat application where users can:
   - Register and log in using the backend’s `/register` and `/token` endpoints.
   - Send text queries to the `/query` endpoint and display AI responses in a chat-like format (user messages on the right in blue, AI responses on the left in gray).
   - View chat history from the `Query` table, organized by `chat_id` (each `chat_id` is a unique chat thread).
   - Use a sidebar to list all chat threads (by `chat_id`) and a “New Chat” button to create a new thread with a unique `chat_id`.
   - Select a chat thread from the sidebar to display its queries and responses.
   - Log out to clear authentication and return to the login page.
   - Install the app as a PWA on macOS, Windows, Linux, iOS, and Android.
2. **Framework and Tools**:
   - Use **Next.js** (version 14 or later) with the App Router for the frontend.
   - Use **Tailwind CSS** for styling, with a responsive design supporting light and dark modes (toggleable via a button).
   - Use **next-pwa** for PWA functionality (manifest, service worker, offline support).
   - Use **axios** for HTTP requests to the backend.
   - Use **uuid** to generate unique `chat_id` values (e.g., `chat-<uuid>`).
   - Do **not** use `@supabase/supabase-js` or any direct Supabase integration.
3. **Backend Integration**:
   - **Base URL**: `https://web-production-d7d37.up.railway.app`.
   - **Endpoints**:
     - **POST /register**:
       - **Request**: JSON body `{ "username": "string", "password": "string", "phone_number": integer, "role": "string" }` (e.g., `{ "username": "user1", "password": "pass123", "phone_number": 1234567890, "role": "user" }`). `phone_number` and `role` are optional.
       - **Response**: JSON `{ "message": "Registered successfully", "userId": "string" }`.
       - **Notes**: Validate inputs to ensure `username` and `password` are provided.
     - **POST /token**:
       - **Request**: Form data `{ "username": "string", "password": "string" }` (OAuth2 password flow, `application/x-www-form-urlencoded`).
       - **Response**: JSON `{ "access_token": "string", "token_type": "bearer" }`.
       - **Notes**: Store `access_token` in `localStorage` for authenticated requests.
     - **POST /query**:
       - **Request**: JSON body `{ "query": "string", "chat_id": "string", "model": "string", "max_tokens": integer, "temperature": float }` (e.g., `{ "query": "Hello, AI!", "chat_id": "chat-123", "model": "gpt-3.5-turbo", "max_tokens": 1024, "temperature": 0.7 }`), with header `Authorization: Bearer <access_token>`.
       - **Response**: JSON `{ "response": "string", "query": "string", "chat_id": "string", "queryId": integer }`.
       - **Notes**: `model`, `max_tokens`, and `temperature` are optional (defaults: `gpt-3.5-turbo`, 1024, 0.7). Use the current `chat_id` for the active thread.
     - **GET /profile**:
       - **Request**: Requires `Authorization: Bearer <access_token>` header.
       - **Response**: JSON `{ "userId": "string", "username": "string", "max_file_size": integer, "role": "string", "phone_number": integer }`.
       - **Notes**: Use to verify authentication and display username in the UI.
     - **GET /queries** (hypothetical, to be implemented if needed):
       - **Request**: `Authorization: Bearer <access_token>`.
       - **Response**: JSON `{ "queries": [{ "queryId": integer, "userId": "string", "chatId": "string", "query_text": "string", "response": "string" }, ...] }`.
       - **Notes**: Fetch all `Query` table entries for the user, grouped by `chatId`.
   - **Chat History**:
     - Fetch chat history via `GET /queries` (assume it exists or provide a fallback).
     - Fallback: Store `/query` responses in `localStorage` or React state, grouped by `chat_id`.
     - Display threads in the sidebar, with each thread showing the `chat_id` or a derived title (e.g., first query text or timestamp).
     - Load the most recent chat thread on login (based on the latest `Query` entry).
   - Store `access_token` in `localStorage` and include it in all authenticated requests.
   - Handle errors:
     - 400: “Invalid input” (e.g., “Username already registered” for `/register`).
     - 401: Redirect to `/login` with “Session expired, please log in again”.
     - 500: “Something went wrong, please try again”.
4. **PWA Requirements**:
   - Generate `manifest.webmanifest`:
     - `name`: “AI Chat App”
     - `short_name`: “Chat”
     - `start_url`: “/”
     - `display`: “standalone”
     - `theme_color`: “#253045” (matching Crux Planner)
     - `background_color`: “#ffffff”
     - Icons: `icon-192x192.png`, `icon-512x512.png`, `apple-touch-icon.png` (192x192, 512x512, 180x180).
   - Add meta tags in `app/layout.js`:
     - `<meta name="mobile-web-app-capable" content="yes"/>`
     - `<meta name="apple-mobile-web-app-capable" content="yes"/>`
     - `<meta name="apple-mobile-web-app-title" content="AI Chat App"/>`
     - `<meta name="apple-mobile-web-app-status-bar-style" content="default"/>`
     - `<meta name="theme-color" content="#253045"/>`
     - `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"/>`
     - `<link rel="manifest" href="/manifest.webmanifest"/>`
     - `<link rel="apple-touch-startup-image" href="/splash/apple-splash-1170-2532.jpg" media="..."/>` (include multiple iOS splash screens as in Crux Planner).
   - Configure `next-pwa` to cache static assets and `/query` responses (if cacheable).
   - Ensure HTTPS (handled by Vercel).
   - Test PWA installation in Chrome, Edge, and Safari.
5. **UI Requirements**:
   - Create a single-page app with four views:
     - **Register Page (/register)**: Form with `username`, `password`, `phone_number` (optional), `role` (optional, default “user”), “Register” button, and link to `/login`.
     - **Login Page (/login)**: Form with `username`, `password`, “Login” button, and link to `/register`.
     - **Chat Page (/chat)**:
       - **Sidebar**: Lists all chat threads by `chat_id`, with a “New Chat” button to generate a new `chat_id` (e.g., `chat-${crypto.randomUUID()}`). Each thread shows a title (e.g., first query text or timestamp).
       - **Chat Area**: Scrollable, with user messages (right, `bg-blue-500 text-white`) and AI responses (left, `bg-gray-200 text-black`). Enable smooth scrolling (`scroll-behavior: smooth` or JavaScript).
       - **Input Form**: Text input and “Send” button at the bottom to call `/query` with the current `chat_id`.
       - **Header**: Fixed top bar with app name, dark mode toggle, username (from `/profile`), and logout button.
     - **Home Page (/**): Redirects to `/chat` if logged in, else to `/login`.
   - Use Tailwind CSS:
     - **Sidebar**: `fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background p-4 overflow-y-auto` (hidden on mobile, toggled via hamburger menu).
     - **Chat Area**: `flex-1 overflow-y-auto p-4 mt-16 mb-16 smooth-scroll`.
     - **Messages**: User (`bg-blue-500 text-white p-2 rounded-lg ml-auto max-w-[70%]`), AI (`bg-gray-200 text-black p-2 rounded-lg mr-auto max-w-[70%]`).
     - **Input Form**: `fixed bottom-0 w-full p-4 flex gap-2 bg-background`.
     - **Header**: `fixed top-0 w-full p-4 bg-background/90 backdrop-blur-sm flex justify-between`.
   - Support light/dark mode (`dark:bg-gray-800 dark:text-white`).
   - Mobile: Hide sidebar by default, toggle via hamburger menu (like Crux Planner’s `<svg class="lucide-menu">`).
6. **Chat History**:
   - Fetch via `GET /queries`:
     ```javascript
     // Response: { queries: [{ queryId: 1, userId: "uuid", chatId: "chat-123", query_text: "Hello", response: "Hi!" }, ...] }
     ```
   - Fallback: Store `/query` responses in `localStorage` or React state, grouped by `chat_id`.
   - Sidebar: List unique `chat_id` values, with titles derived from the first `query_text` or timestamp.
   - Load the most recent chat thread on login.
   - Update UI dynamically with new messages.
7. **Accessibility**:
   - ARIA: `aria-label` on buttons, `aria-live="polite"` on chat area.
   - Keyboard: Ensure forms, buttons, and sidebar are focusable (`tabindex`).
   - Semantic HTML: `<main>`, `<header>`, `<aside>` for sidebar.
8. **Offline Support**:
   - Cache static assets and `/query` responses (if cacheable).
   - Show “No internet connection” if offline (`navigator.onLine`).
9. **Error Handling**:
   - Form errors: Display below inputs (e.g., “Username already registered”).
   - API errors: Use toast notifications (`react-hot-toast`).
   - 401: Redirect to `/login` with “Session expired”.
10. **Developer Experience**:
    - `README.md`:
      - Setup: `npm install`, `npm run dev`.
      - Deployment: `vercel deploy`, ensure HTTPS.
      - Icon generation: Use https://realfavicongenerator.net/.
      - Backend: Suggest `GET /queries` implementation.
    - Comments: Explain PWA setup, API calls, components, Tailwind classes.

### Technical Instructions
1. **Project Structure**:
   ```
   /project-root
   ├── /public
   │   ├── /icons (generate simple ones)
   │   │   ├── icon-192x192.png
   │   │   ├── icon-512x512.png
   │   │   ├── apple-touch-icon.png
   │   ├── /splash
   │   │   ├── apple-splash-1170-2532.jpg
   │   │   ├── ... (iOS splash screens)
   │   ├── manifest.webmanifest
   ├── /src
   │   ├── /app
   │   │   ├── /components
   │   │   │   ├── Chat.js
   │   │   │   ├── Sidebar.js
   │   │   │   ├── Register.js
   │   │   │   ├── Login.js
   │   │   │   ├── Header.js
   │   │   ├── /lib
   │   │   │   ├── api.js
   │   │   ├── /pages
   │   │   │   ├── layout.js
   │   │   │   ├── page.js
   │   │   │   ├── register/page.js
   │   │   │   ├── login/page.js
   │   │   │   ├── chat/page.js
   │   │   ├── globals.css
   ├── package.json
   ├── next.config.mjs
   ├── tailwind.config.js
   ├── README.md
   ```
2. **Dependencies**:
   - `next@latest`, `react`, `react-dom`, `next-pwa`, `axios`, `uuid`, `react-hot-toast`, `tailwindcss`, `postcss`, `autoprefixer`.
   - `tailwind.config.js`:
     ```javascript
     module.exports = {
       content: ["./src/**/*.{js,ts,jsx,tsx}"],
       theme: { extend: { colors: { theme: "#253045" } } },
       darkMode: "class",
     };
     ```
3. **PWA Configuration**:
   - `manifest.webmanifest`: As above.
   - `next.config.mjs`:
     ```javascript
     import withPWA from "next-pwa";

     const nextConfig = {};
     export default withPWA({
       dest: "public",
       register: true,
       skipWaiting: true,
       cacheOnFrontEndNav: true,
       disable: process.env.NODE_ENV === "development",
     })(nextConfig);
     ```
   - Icons: Generate chat bubble design.
   - Splash screens: Match Crux Planner’s resolutions.
4. **API Integration** (`src/lib/api.js`):
   ```javascript
   import axios from "axios";

   const API_URL = "https://web-production-d7d37.up.railway.app";
   const api = axios.create({ baseURL: API_URL });

   export async function register({ username, password, phone_number, role }) {
     return api.post("/register", { username, password, phone_number, role });
   }

   export async function login({ username, password }) {
     const formData = new URLSearchParams();
     formData.append("username", username);
     formData.append("password", password);
     return api.post("/token", formData, {
       headers: { "Content-Type": "application/x-www-form-urlencoded" },
     });
   }

   export async function getProfile(token) {
     return api.get("/profile", {
       headers: { Authorization: `Bearer ${token}` },
     });
   }

   export async function sendQuery(token, query, chatId) {
     return api.post(
       "/query",
       { query, chat_id: chatId, model: "gpt-3.5-turbo", max_tokens: 1024, temperature: 0.7 },
       { headers: { Authorization: `Bearer ${token}` } }
     );
   }

   export async function getQueries(token) {
     return api.get("/queries", {
       headers: { Authorization: `Bearer ${token}` },
     });
   }
   ```
5. **Components**:
   - **Header.js**: App name, dark mode toggle, username, logout button.
   - **Sidebar.js**: List chat threads, “New Chat” button, toggleable on mobile.
   - **Chat.js**: Chat area, input form, smooth scrolling.
   - **Register.js**, **Login.js**: Forms with validation.
6. **Routing**:
   - `/`: Redirect to `/chat` or `/login`.
   - `/register`, `/login`, `/chat`: As described.
   - Auth check in `layout.js`:
     ```javascript
     if (!localStorage.getItem("token")) redirect("/login");
     ```
7. **Chat History**:
   - Fetch via `getQueries`, group by `chatId`.
   - Fallback: Store in `localStorage`.
   - Sidebar: Show `chatId` or derived title.
8. **Styling**:
   - Smooth scrolling: `scroll-behavior: smooth` or `useEffect` to scroll to bottom.
   - Mobile: Hamburger menu for sidebar (`hidden md:block`).

### Deliverables
- All files (`package.json`, `manifest.webmanifest`, `app/`, `public/`).
- `README.md`: Setup, deployment, icon generation, `GET /queries` suggestion:
  ```python
  @router.get("/queries")
  def get_queries(user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
      queries = db.query(Query).filter(Query.userId == user.userId).all()
      return {
          "queries": [
              {
                  "queryId": q.queryId,
                  "userId": q.userId,
                  "chatId": q.chatId,
                  "query_text": q.query_text,
                  "response": q.response
              } for q in queries
          ]
      }
  ```
- Comments: Explain all key logic.
- Test: Ensure PWA installation, chat history, and sidebar functionality.

### Placeholders
- `[QUERIES_ENDPOINT]`: Use `GET /queries` or store `/query` responses locally.
- `[MOBILE_SIDEBAR]`: Toggleable sidebar on mobile.
- `[DEFAULT_CHAT]`: Load most recent chat thread.

### Notes
- Simple React: Use `useState`, `useEffect`.
- Test with Chrome DevTools > Lighthouse.
- Debug errors with clear messages.
- Donot create fallback, display error message instead.
- set up a new vercel project 


**End of Prompt**