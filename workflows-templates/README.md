# GitHub Actions Workflow Setup Guide

## Files Included

This directory contains GitHub Actions workflow templates for automatic Firebase deployment:

1. **`firebase-deploy-simple.yml`** (Recommended)
   - Uses Firebase CI token
   - Simple and straightforward
   - Requires FIREBASE_TOKEN secret

2. **`firebase-deploy.yml`** (Advanced)
   - Uses Firebase Service Account
   - More secure for production
   - Requires FIREBASE_SERVICE_ACCOUNT secret

---

## Why These Are Not in `.github/workflows/`

GitHub Apps (used by this AI assistant) don't have permission to create workflow files directly.
You need to add them manually.

---

## Setup Instructions

### Step 1: Get Firebase CI Token

On your **local machine** (not in sandbox):

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login and get CI token
firebase login:ci
```

This will:
1. Open browser for Google authentication
2. Generate a CI token (looks like: `1//0abc123...`)
3. Display the token in terminal

**Copy this token!**

### Step 2: Add Token to GitHub Secrets

1. Go to: https://github.com/jbebakPark/samsung-gfc-recuritment/settings/secrets/actions

2. Click "New repository secret"

3. Enter:
   - **Name**: `FIREBASE_TOKEN`
   - **Value**: Paste the token from Step 1

4. Click "Add secret"

### Step 3: Create Workflow File

**Option A: Using GitHub Web Interface**

1. Go to: https://github.com/jbebakPark/samsung-gfc-recuritment

2. Click "Add file" → "Create new file"

3. Name: `.github/workflows/firebase-deploy.yml`

4. Copy content from `firebase-deploy-simple.yml` in this directory

5. Click "Commit new file"

**Option B: Using Git (On Your Local Machine)**

```bash
# Clone repository
git clone https://github.com/jbebakPark/samsung-gfc-recuritment.git
cd samsung-gfc-recuritment

# Create workflow directory
mkdir -p .github/workflows

# Copy workflow file
cp workflows-templates/firebase-deploy-simple.yml .github/workflows/

# Commit and push
git add .github/workflows/firebase-deploy-simple.yml
git commit -m "ci: Add Firebase auto-deploy workflow"
git push origin main
```

---

## Testing Auto-Deploy

After setup, test the workflow:

1. Make a small change (e.g., edit README.md)
2. Commit and push:
   ```bash
   git add .
   git commit -m "test: Trigger auto-deploy"
   git push origin main
   ```

3. Check GitHub Actions:
   - Go to: https://github.com/jbebakPark/samsung-gfc-recuritment/actions
   - You should see the workflow running
   - Wait ~2-3 minutes for deployment

4. Verify deployment:
   - Visit: https://samsung-gfc.web.app
   - Force refresh: Ctrl+Shift+R

---

## Workflow Files Explained

### firebase-deploy-simple.yml

```yaml
name: Firebase Deploy (Simple)

on:
  push:
    branches:
      - main          # Triggers on push to main
  workflow_dispatch:  # Allows manual trigger

jobs:
  deploy:
    name: Deploy to Firebase Hosting
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install Firebase CLI
        run: npm install -g firebase-tools
      
      - name: Deploy to Firebase
        run: firebase deploy --only hosting --token "$FIREBASE_TOKEN"
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

This workflow:
- Runs when you push to `main` branch
- Checks out your code
- Installs Node.js and Firebase CLI
- Deploys to Firebase Hosting using the token

---

## Troubleshooting

### Workflow Not Running

Check:
1. Workflow file is in `.github/workflows/` directory
2. File has `.yml` or `.yaml` extension
3. Go to: https://github.com/jbebakPark/samsung-gfc-recuritment/actions

### Deployment Failed

Common issues:
1. **FIREBASE_TOKEN not set**
   - Check: https://github.com/jbebakPark/samsung-gfc-recuritment/settings/secrets/actions
   - Ensure `FIREBASE_TOKEN` secret exists

2. **Token expired**
   - Generate new token: `firebase login:ci`
   - Update secret in GitHub

3. **Wrong project**
   - Check `firebase.json` has correct project ID
   - Should be: `samsung-gfc`

### Manual Trigger

If auto-deploy doesn't work, trigger manually:

1. Go to: https://github.com/jbebakPark/samsung-gfc-recuritment/actions
2. Click on "Firebase Deploy (Simple)"
3. Click "Run workflow"
4. Select branch: `main`
5. Click "Run workflow"

---

## Alternative: Deploy from Local Machine

If you prefer not to use GitHub Actions:

```bash
# On your local machine
git clone https://github.com/jbebakPark/samsung-gfc-recuritment.git
cd samsung-gfc-recuritment

# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy --only hosting
```

Site will be live at: https://samsung-gfc.web.app

---

## Summary

✅ Workflow templates created in `workflows-templates/`
✅ Instructions provided for manual setup
❌ Cannot create workflows directly (GitHub App permissions)

**Next Steps:**
1. Get Firebase CI token: `firebase login:ci`
2. Add to GitHub Secrets as `FIREBASE_TOKEN`
3. Copy workflow file to `.github/workflows/`
4. Push to GitHub
5. Auto-deploy is active!

---

## Contact

- **Email**: jb2park@naver.com
- **Phone**: 010-5137-2327
- **KakaoTalk**: https://open.kakao.com/o/svmDyNUg

---

## References

- GitHub Actions: https://docs.github.com/en/actions
- Firebase Hosting: https://firebase.google.com/docs/hosting
- Repository: https://github.com/jbebakPark/samsung-gfc-recuritment
- Firebase Console: https://console.firebase.google.com/project/samsung-gfc
