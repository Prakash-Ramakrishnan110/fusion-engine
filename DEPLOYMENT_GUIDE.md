# 🚀 How to Deploy Fusion Engine

This project is optimized for **Vercel**, but can be deployed to any static hosting provider (Netlify, GitHub Pages, etc.).

## Option 1: Vercel (Recommended)

1.  **Install Vercel CLI** (Optional):
    ```bash
    npm i -g vercel
    ```
2.  **Deploy**:
    Run `vercel` in the project root and follow the prompts.
3.  **Environment Variables**:
    In the Vercel Dashboard, go to **Settings > Environment Variables** and add:
    - `VITE_GEMINI_API_KEY`: [Your actual API Key]

## Option 2: Manual Build (Any Host)

1.  **Build the project**:
    ```bash
    npm run build
    ```
2.  **Upload the `dist` folder**:
    Take the contents of the `dist` directory and upload them to your web server or hosting provider.

## ⚠️ Important Checklist
- [ ] Ensure `VITE_GEMINI_API_KEY` is set in your production environment.
- [ ] Verify that all image assets in `public/assets` are correctly linked.
- [ ] Run `npm run build` locally first to ensure there are no TypeScript or Linting errors.
