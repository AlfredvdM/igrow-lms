# Clerk Setup Guide - Troubleshooting 422 Error

## Error: Sign-up request failed with 422

This error usually means Clerk's sign-up settings need to be configured. Here's how to fix it:

### Step 1: Check Clerk Dashboard Settings

Go to your [Clerk Dashboard](https://dashboard.clerk.com/) and check these settings:

#### 1. **User & Authentication → Email, Phone, Username**
   - **Enable Email address** ✅
   - Set it to **Required**
   - Enable "Verify at sign-up"

#### 2. **User & Authentication → Restrictions**
   - Check if there are any restrictions blocking sign-ups
   - Make sure "Allow sign-ups" is enabled

#### 3. **User & Authentication → Social Connections** (Optional)
   - If you want social login, enable Google, GitHub, etc.
   - If not, make sure email/password is the primary method

### Step 2: Check Your Environment Variables

Make sure your `.env.local` has both keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Step 3: Restart the Development Server

After updating Clerk settings:
```bash
# Stop the current server (Ctrl+C)
# Then restart
PORT=3009 npm run dev
```

### Step 4: Common 422 Error Causes

| Issue | Solution |
|-------|----------|
| Email not configured as sign-up method | Enable "Email address" in Clerk Dashboard |
| Password requirements too strict | Adjust password settings in Dashboard |
| Email verification required but not set up | Configure email provider in Clerk |
| Blocklist/Allowlist restrictions | Check restrictions in Dashboard |
| Missing required user fields | Remove or make fields optional |

### Step 5: Alternative - Use Clerk's Pre-built Components

If issues persist, we can use Clerk's hosted sign-up page instead of custom components.

Update the sign-up page to use Clerk's hosted version:

**Option A: Redirect to Clerk's hosted page**
- Set this in your Clerk Dashboard → Paths
- Sign-up URL: Leave blank to use Clerk's hosted page

**Option B: Use Clerk's embedded component** (Already implemented)
- This is what we're currently using
- Should work once Dashboard is configured

### Quick Fix: Use Email + Password Only

In Clerk Dashboard:
1. Go to **User & Authentication → Email, Phone, Username**
2. Enable **"Email address"** and set to **Required**
3. Disable **Phone number** and **Username** (for now)
4. Go to **User & Authentication → Attack Protection**
5. Disable **CAPTCHA** (for testing, re-enable in production)

### Debug Mode

To see more details about the error, check your browser's Console (F12 → Console tab).

The error details will show exactly what Clerk expects.

### Still Having Issues?

1. Share the error message from browser console
2. Check Clerk Dashboard → Logs to see the exact error
3. Verify your Clerk keys are correct (no extra spaces)

---

## Next Steps After Fixing

Once sign-up works:
1. Create your first user (admin account)
2. Add user metadata for roles (admin, team, client)
3. Configure Google Sheets API
4. Start seeing real lead data!
