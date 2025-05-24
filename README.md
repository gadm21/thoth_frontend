This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Thoth
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```
   NEXT_PUBLIC_API_URL=your_api_url_here
   # For local development: http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Progressive Web App (PWA) Features

This application is a Progressive Web App (PWA), which means it can be installed on your device and work offline. Here's what you need to know:

### Installation

1. **Chrome/Edge/Opera**: Click the install button in the address bar when it appears (usually after a few seconds of visiting the site).
2. **Safari**: Tap the share button and select "Add to Home Screen".
3. **Firefox**: Click the menu button, then "Install" or "Add to Home Screen".

### Offline Support

- The app will work offline after the first load, caching important assets.
- If you're offline, you'll see a custom offline page when trying to access new content.

### Updating the App

- The app will automatically update when a new version is deployed.
- To force an update, close all app windows and reopen the app.

### Development

- PWA features are disabled in development mode by default.
- To test PWA features in development, build and start the production server:
  ```bash
  npm run build
  npm start
  ```

## Building for Production

To create an optimized production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

To start the production server:

```bash
npm start
# or
yarn start
# or
pnpm start
```

## PWA Features

This application is a Progressive Web App (PWA) with the following features:

- Offline support
- Installable on devices
- Fast loading with service workers
- Responsive design for all screen sizes

## Project Structure

```
Thoth/
├── public/                 # Static files
├── src/
│   ├── app/               # App router pages
│   ├── components/         # Reusable components
│   ├── contexts/           # React context providers
│   ├── lib/                # Utility functions and API client
│   ├── middleware.ts       # Next.js middleware for auth
│   └── types/              # TypeScript type definitions
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
