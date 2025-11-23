# Cloudflare Pages Deployment Guide

## Quick Deploy Steps

### Option 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**
   - Visit https://dash.cloudflare.com
   - Navigate to **Pages** in the sidebar
   - Click **Create a project**

2. **Connect Your Git Repository**
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Cloudflare to access your repository
   - Select the repository: `newarenastreams` (or your repo name)

3. **Configure Build Settings**
   - **Project name**: `arenastreams` (or your preferred name)
   - **Production branch**: `main`
   - **Build command**: (leave empty - no build needed)
   - **Build output directory**: `public`
   - **Root directory**: (leave empty or set to `/`)

4. **Environment Variables** (if needed)
   - Usually not needed for static sites
   - Add any API keys or secrets here if required

5. **Click "Save and Deploy"**
   - Cloudflare will build and deploy your site
   - You'll get a URL like: `https://arenastreams.pages.dev`

6. **Custom Domain** (Optional)
   - Go to your project settings
   - Click "Custom domains"
   - Add your domain (e.g., `arenastreams.com`)
   - Update DNS records as instructed

### Option 2: Deploy via Wrangler CLI

1. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy**
   ```bash
   wrangler pages deploy public --project-name=arenastreams
   ```

## Important Notes

- **No Build Required**: Your site is static HTML, so no build command is needed
- **Output Directory**: Set to `public` in Cloudflare Pages settings
- **No Workers**: This is a pure static site deployment (no Cloudflare Workers needed)
- **Custom 404**: Cloudflare Pages will automatically use `404.html` if it exists in your `public` folder

## File Structure

```
newarenastreams/
├── public/          ← This is your build output directory
│   ├── index.html
│   ├── *.html
│   ├── js/
│   ├── sitemap.xml
│   └── robots.txt
└── wrangler.toml    ← Configuration file (optional)
```

## After Deployment

Your site will be available at:
- `https://arenastreams.pages.dev` (or your custom domain)

All your HTML files, JavaScript, and assets in the `public` folder will be served directly.

