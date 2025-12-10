# Sanity CMS - Simplified Setup

## ✅ What's Already Working:
- React app is connected to Sanity (Project ID: y1pdy8w6)
- Blog page will fetch posts from Sanity
- Content schemas are ready (posts, pages, affiliate links)

## 🎯 Easy Option: Use Sanity's Hosted Studio

**Instead of installing locally**, use Sanity's managed studio:

1. Go to: https://y1pdy8w6.sanity.studio/
2. Or go to: https://www.sanity.io/manage
3. Click on "New Energy Initiative" project
4. Click "Vision" or use the Sanity Studio hosted version

## 🔄 To Add Your Schemas to the Cloud:

We need to upload the schemas (blog posts, pages, affiliate links) to your Sanity project. 

**Two options:**

### Option A: Use Sanity CLI (if npm works later)
```bash
cd sanity-studio
npm install sanity@latest
npx sanity deploy
```

### Option B: Manual Setup (easier!)
1. Go to https://www.sanity.io/manage/personal/project/y1pdy8w6
2. Click "Schemas" or "Studio"
3. I'll give you a simple way to add the schemas via their web interface

## 📝 For Now: Test the React Site

The React app is ready! Let's test it:

```bash
# In the main project directory
npm run dev
```

Visit `/blog` - it will show "No posts yet" which is correct since we haven't added any content.

Once npm is working better, we can deploy the Studio. Or use Sanity's web interface!
