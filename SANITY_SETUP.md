# New Energy Initiative - Sanity Setup Instructions

## What We're Building
A **headless CMS** setup so your dad can:
- Edit page content without touching code
- Write/publish blog posts
- Add/update affiliate links
- See changes go live automatically

## Setup Steps

### 1. Create Sanity Project (One-time)
Go to: https://www.sanity.io/manage
- Click "Create Project"
- Name: "New Energy Initiative"
- Plan: Free
- Copy the **Project ID** (looks like: `abc123xyz`)

### 2. Update Configuration
Create a file `.env.local` in the project root:
```
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production
```

### 3. Install Sanity Studio (Admin Dashboard)
```bash
npm create sanity@latest -- --template clean --create-project "New Energy Initiative" --dataset production --output-path sanity-studio
```

### 4. Deploy Studio
```bash
cd sanity-studio
npm run deploy
```
This gives you: `https://your-project.sanity.studio` (admin URL)

### 5. Connect React Site
Already done! The React site will fetch content from Sanity.

### 6. Push to GitHub → Auto-Deploy to Vercel
```bash
git add .
git commit -m "Add Sanity CMS integration"
git push origin sanity
```

Merge to main when ready!

---

## Daily Workflow (For Your Dad)
1. Go to `https://your-project.sanity.studio`
2. Log in
3. Click "Posts" → "Create new post"
4. Write content, add images, set affiliate links
5. Click "Publish"
6. Wait 2-3 minutes → Live on site!

---

## Next Steps
1. Get Project ID from Sanity
2. I'll create the content schemas (blog posts, pages, affiliate links)
3. We'll test it locally
4. Deploy to Vercel with environment variables
