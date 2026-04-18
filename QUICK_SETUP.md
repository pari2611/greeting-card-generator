# ⚡ Quick Setup Guide - GitHub + Vercel Deployment

**Total Time: 20 minutes**

## 🎯 Before You Start

Have these ready:
- [ ] GitHub account (https://github.com/)
- [ ] Vercel account (https://vercel.com/)
- [ ] Node.js installed (https://nodejs.org/)
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt open

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### STEP 1: Create GitHub Repository (2 minutes)

```bash
# 1. Go to https://github.com/new

# 2. Fill in:
Repository name: greeting-card-generator
Description: Professional serverless greeting card generator
Visibility: Public
Initialize with: README, .gitignore (Node), MIT License

# 3. Click "Create repository"

# 4. Copy the HTTPS URL (you'll use it next)
# Example: https://github.com/YOUR-USERNAME/greeting-card-generator.git
```

---

### STEP 2: Clone Repository & Set Up Project (3 minutes)

```bash
# Clone your repository
git clone https://github.com/YOUR-USERNAME/greeting-card-generator.git
cd greeting-card-generator

# Initialize npm project
npm init -y

# Install frontend dependencies
npm install react react-dom lucide-react axios
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer

# Create necessary directories
mkdir -p src api public
```

---

### STEP 3: Copy Frontend Files (2 minutes)

**Copy these files into your project:**

1. **`src/App.jsx`** - Copy the professional React component
2. **`src/main.jsx`** - Create with this content:
   ```jsx
   import React from 'react'
   import ReactDOM from 'react-dom/client'
   import App from './App'
   
   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>,
   )
   ```

3. **`index.html`** - Create with this content:
   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Greeting Card Generator</title>
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="/src/main.jsx"></script>
     </body>
   </html>
   ```

4. **`vite.config.js`** - Create with:
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   
   export default defineConfig({
     plugins: [react()],
   })
   ```

5. **`.env.local`** - Create:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

---

### STEP 4: Set Up Backend (3 minutes)

```bash
# Go to api folder
cd api

# Create package.json with this content:
```

**Create `api/package.json`:**
```json
{
  "name": "greeting-card-api",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "dev": "node server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "multer": "^1.4.5",
    "sharp": "^0.32.0",
    "uuid": "^9.0.0",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

```bash
# Install backend dependencies
npm install

# Copy server.js file into this folder
# (Copy the professional server.js we created)
```

**Create `api/.env`:**
```
PORT=3000
NODE_ENV=development
```

```bash
# Go back to root
cd ..
```

---

### STEP 5: Update Main package.json (1 minute)

**Edit your root `package.json`:**

```json
{
  "name": "greeting-card-generator",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.383.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

---

### STEP 6: Test Locally (3 minutes)

```bash
# Terminal 1: Start Backend
cd api
npm install
npm start
# You should see: "✨ Greeting Card Generator API Server running on port 3000"

# Terminal 2: Start Frontend
# (Open a new terminal in the project root)
npm install
npm run dev
# You should see: "Local: http://localhost:5173/"
```

**Test the app:**
1. Open http://localhost:5173 in your browser
2. Upload a test image
3. Enter a message
4. Click "Generate Card"
5. Verify it works!

---

### STEP 7: Push to GitHub (2 minutes)

```bash
# Make sure you're in the root directory
# Add all files
git add .

# Commit
git commit -m "Initial commit: Professional greeting card generator with React + Express"

# Push to GitHub
git branch -M main
git push -u origin main
```

**Verify:** Go to your GitHub repo, you should see all files there.

---

### STEP 8: Deploy Frontend to Vercel (3 minutes)

1. **Go to https://vercel.com/dashboard**
2. **Click "Add New Project"**
3. **Select your GitHub repository** (`greeting-card-generator`)
4. **Configure Build Settings:**
   - Framework: React
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Environment Variable:**
   - Name: `VITE_API_URL`
   - Value: (we'll update this after backend is deployed)
6. **Click "Deploy"**

**Wait for deployment to finish**

Your frontend is now live! You'll get a URL like:
```
https://greeting-card-generator.vercel.app
```

---

### STEP 9: Deploy Backend to Railway (3 minutes)

1. **Go to https://railway.app**
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Select your repository**
5. **Configure:**
   - Root Directory: `api`
   - Service name: `greeting-card-api`
6. **Add Environment Variables:**
   - `PORT`: `3000`
   - `NODE_ENV`: `production`
7. **Click "Deploy"**

**Wait for deployment**

Your backend is now live! You'll get a URL like:
```
https://greeting-card-api.up.railway.app
```

---

### STEP 10: Connect Frontend & Backend (2 minutes)

1. **Go to Vercel project settings**
2. **Go to "Environment Variables"**
3. **Update `VITE_API_URL`:**
   ```
   https://greeting-card-api.up.railway.app/api
   ```
4. **Click "Save"**
5. **Trigger redeploy** (should be automatic)

---

### STEP 11: Test Production App (2 minutes)

1. **Open your Vercel frontend URL**
2. **Upload an image**
3. **Enter a message**
4. **Click "Generate Card"**
5. **Verify processing works** ✅
6. **Download the result** ✅

---

## ✅ CONGRATULATIONS!

Your app is now **LIVE AND DEPLOYED!** 🚀

### What You Have:
- ✅ Frontend running on Vercel (CDN-powered)
- ✅ Backend running on Railway (auto-scaled)
- ✅ GitHub repository for version control
- ✅ CI/CD pipeline (auto-deploys on git push)
- ✅ Professional greeting card generator

### Your URLs:
- **Frontend:** `https://greeting-card-generator.vercel.app`
- **Backend API:** `https://greeting-card-api.up.railway.app`
- **GitHub:** `https://github.com/YOUR-USERNAME/greeting-card-generator`

---

## 🔄 How to Make Changes

From now on, every time you make changes:

```bash
# Make your changes
# (Edit files locally)

# Push to GitHub
git add .
git commit -m "Your message"
git push origin main

# Vercel & Railway automatically redeploy! ✅
```

---

## 📊 Monitor Your Apps

**Vercel:**
- Go to https://vercel.com/dashboard
- Click your project
- View deployments, logs, analytics

**Railway:**
- Go to https://railway.app
- Click your project
- View logs, resource usage

---

## 💡 Next Steps

1. Customize the design (edit `src/App.jsx`)
2. Add more features (edit `api/server.js`)
3. Update README.md with your name
4. Add to your portfolio
5. Share with friends!

---

## 🆘 Troubleshooting

**Frontend not loading?**
→ Wait 1-2 minutes for Vercel to build

**Processing fails?**
→ Check that API URL is correct in Vercel env vars
→ Check Railway backend logs

**Image won't upload?**
→ Check CORS settings in backend
→ Check file size (max 10MB)

**Can't see changes after pushing?**
→ Clear browser cache (Ctrl+Shift+Delete)
→ Wait for redeploy to complete

---

## 🎓 Show Your Professor!

Tell them you built:
- ✅ A **full-stack web application**
- ✅ **Cloud-based image processing**
- ✅ **Serverless architecture**
- ✅ **CI/CD deployment pipeline**
- ✅ **Professional design**

They will be **VERY impressed!** 🎓✨

---

**You did it! Your app is now production-ready!** 🎉🚀
