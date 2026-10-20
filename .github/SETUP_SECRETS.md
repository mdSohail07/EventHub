# EventHub — GitHub Secrets Setup Guide

## Step 1: Render Deploy Hook URL lao

1. Render Dashboard → **eventhub-backend** service
2. Left sidebar → **Settings**
3. Scroll down → **"Deploy Hook"** section
4. **"Create Deploy Hook"** click karo
5. URL copy karo — kuch aisa dikhega:
   ```
   https://api.render.com/deploy/srv-xxxxx?key=yyyyyyy
   ```

## Step 2: GitHub Secret Add Karo

1. GitHub → tere EventHub repo → **Settings**
2. Left sidebar → **Secrets and variables** → **Actions**
3. **"New repository secret"** click karo
4. Name: `RENDER_DEPLOY_HOOK_URL`
5. Value: (Step 1 mein copy kiya hua URL)
6. **"Add secret"** click karo

## Step 3: Verify Karo

Push karo koi bhi change:
```bash
git add .
git commit -m "ci: add github actions workflows"
git push origin main
```

GitHub → Actions tab mein workflows chalte dikhenge ✅
