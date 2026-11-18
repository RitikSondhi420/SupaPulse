# 🚀 Step-by-Step Guide: Deploying SupaPulse Live for FREE

This guide shows you how to deploy the fullstack **SupaPulse (Asana + Supabase Clone)** with **free custom subdomains**, **free HTTPS (SSL)**, and **free cloud hosting** for both frontend and backend.

---

## 🏗️ 100% Free Deployment Architecture

```mermaid
flowchart LR
    A["User Browser"] -->|"Free Domain: https://supapulse.netlify.app"| B["Frontend (React + Vite)\nHosted on Netlify (Free)"]
    B -->|"GraphQL API Calls"| C["Backend (NestJS + Apollo)\nHosted on Render.com (Free)"]
    C -->|"Prisma ORM Connection"| D["PostgreSQL Database\nHosted on Supabase.com (Free)"]
```

| Component | Platform | Free Subdomain / URL | Cost |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/) | `https://your-name.netlify.app` | **$0 / Free Forever** |
| **Backend API** | [Render](https://render.com/) or [Railway](https://railway.app/) | `https://your-api.onrender.com` | **$0 / Free Tier** |
| **Database** | [Supabase](https://supabase.com/) | Cloud PostgreSQL Instance | **$0 / Free Tier** |

---

## Step 1: Push Code to GitHub

Your local workspace is already initialized with Git! All you need is to push it to a new GitHub repository:

1. Go to [GitHub.com](https://github.com/new) and create a new repository named `supapulse` (can be Public or Private).
2. In your terminal, link your repository and push:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/supapulse.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Create Free PostgreSQL Database on Supabase

1. Go to [Supabase.com](https://supabase.com/) and sign in (Free).
2. Click **New Project** and name it `supapulse-db`. Choose a strong database password and your nearest region.
3. Once created, go to **Project Settings** ➔ **Database**.
4. Under **Connection String**, select **URI** (or Transaction Pooler mode). It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Copy this URL (save it for Step 3).

---

## Step 3: Deploy Backend on Render.com (Free Web Service)

1. Sign up or log in at [Render.com](https://render.com/) (Free).
2. Click **New +** ➔ **Web Service**.
3. Select your GitHub repository (`supapulse`).
4. Configure the settings:
   - **Name**: `supapulse-api` (will get `https://supapulse-api.onrender.com`)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Instance Type**: **Free**
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `4000`
   - `DATABASE_URL`: *(Paste your Supabase connection string from Step 2)*
   - `JWT_SECRET`: *(Any random 32-character secret string)*
   - `CLIENT_URL`: `https://your-frontend-domain.netlify.app` (or `*`)
6. Click **Create Web Service**.
7. Render will build and deploy your NestJS server! Your GraphQL playground will be live at:
   ```
   https://supapulse-api.onrender.com/graphql
   ```

*(Optional: Run `npm run prisma:seed` in Render's shell to seed the default Admin and sample tasks!)*

---

## Step 4: Deploy Frontend on Netlify (Free Web Hosting & Domain)

1. Go to [Netlify.com](https://www.netlify.com/) and sign in with GitHub.
2. Click **Add new site** ➔ **Import an existing project**.
3. Select your `supapulse` GitHub repository.
4. Netlify will automatically detect `netlify.toml` from the repository:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. Under **Environment variables**, click **Add a variable**:
   - Key: `VITE_GRAPHQL_ENDPOINT`
   - Value: `https://supapulse-api.onrender.com/graphql` *(your live Render backend URL from Step 3)*
6. Click **Deploy Site**.
7. In **Site Configuration** ➔ **Change site name**, you can pick your own custom free name, e.g.:
   ```
   https://supapulse-asana.netlify.app
   ```

---

## Step 5: (Optional) Custom Free Domain

If you want a custom domain (instead of `.netlify.app`):
- You can get a free domain from registrars like **Freenom**, or purchase a domain for $1-$2 on Namecheap/Cloudflare.
- In Netlify, go to **Domain management** ➔ **Add domain** and point your DNS CNAME / A records to Netlify. Netlify will provision a free Let's Encrypt SSL certificate automatically!

---

## ⚡ Summary of Config Files Already Created in Your Project

| File | Purpose |
| :--- | :--- |
| `netlify.toml` | Configures Netlify build directory, base path, and SPA rewrites (`/*` -> `/index.html`) |
| `vercel.json` | Configures Vercel alternative build if you prefer Vercel |
| `render.yaml` | Infrastructure blueprint for deploying on Render |
| `server/Dockerfile` | Production Docker image for deploying on Railway, Fly.io, or Render |
| `.gitignore` | Prevents uploading `node_modules`, build artifacts, and secrets |
