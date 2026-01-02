# Vercel Deployment Setup

## Environment Variables Setup

To deploy this app on Vercel, you need to add the MongoDB connection string as an environment variable.

### Steps to Add Environment Variable in Vercel:

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project (Expense-Tracker)

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** tab
   - Click on **Environment Variables** in the left sidebar

3. **Add MONGODB_URI**
   - Click **Add New**
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://syedbilalsiddique360_db_user:LZzW2HLSvAUbO2gK@cluster0.5igzkfy.mongodb.net/?appName=Cluster0`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**

4. **Redeploy**
   - After adding the environment variable, go to **Deployments** tab
   - Click on the three dots (⋯) on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger automatic redeployment

### Alternative: Using Vercel CLI

If you prefer using CLI:

```bash
vercel env add MONGODB_URI
# Paste: mongodb+srv://syedbilalsiddique360_db_user:LZzW2HLSvAUbO2gK@cluster0.5igzkfy.mongodb.net/?appName=Cluster0
# Select: Production, Preview, Development
```

Then redeploy:
```bash
vercel --prod
```

## Important Notes

- The `.env.local` file is for local development only
- Vercel uses environment variables from the dashboard
- Make sure to add the variable to all environments (Production, Preview, Development)
- After adding, you must redeploy for changes to take effect

