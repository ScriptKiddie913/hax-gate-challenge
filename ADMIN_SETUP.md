# HaxGate CTF - Admin Setup Guide

## 🔐 Security Overview

This CTF platform is built with production-grade security:

- **Service role key never exposed to clients** - Only used server-side in Edge Functions
- **Hashed flags** - Flags are hashed with bcrypt (12 rounds) before storage
- **Row Level Security (RLS)** - All tables have proper RLS policies with `user_roles` separation
- **Automatic Blockchain Identity** - Each user gets a unique blockchain address via SHA-256 hashing
- **Real-time scoreboard** - Updates automatically via Supabase Realtime
- **Email verification required** - Users must verify email before accessing challenges
- **Locked submissions** - Once a challenge is solved, no more submissions accepted
- **CTF Timer Control** - Challenges only visible during configured time window

## 🎯 Creating the Admin Account

### Step 1: Sign Up as Admin

1. Visit your deployed CTF platform
2. Click "Sign Up"
3. Register with your admin email and a strong password
4. Check your email and click the verification link

### Step 2: Grant Admin Privileges

After signing up and verifying your email, run this SQL command in Supabase SQL Editor:

```sql
-- Insert admin role for the admin user
-- Replace 'your-admin-email@example.com' with your actual admin email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM public.profiles
WHERE email = 'your-admin-email@example.com'
ON CONFLICT DO NOTHING;
```

**Important**: This grants admin privileges via the secure `user_roles` table, not via the profile directly. This prevents privilege escalation attacks.

### Step 3: Verify Admin Access

1. Log in with your admin credentials
2. You should now see an "Admin" button in the navigation bar
3. Click it to access the admin dashboard

## 📋 Admin Capabilities

### User Management
- View all registered users with blockchain identities
- Ban/unban users
- Delete users
- View user registration dates and verification status
- See auto-generated blockchain addresses for all users

### Blockchain Identity Management
- View all user blockchain addresses (Ethereum-style 0x... format)
- See verification status (all auto-verified)
- Copy addresses for sharing or verification
- Statistics on connected identities

### CTF Timer Configuration
- Set CTF start time and date
- Set CTF end time and date
- Activate/deactivate CTF manually
- View live CTF status
- Challenges automatically hidden outside time window
- Admins can always access challenges regardless of timer

### Challenge Management
- Create new challenges with:
  - Title, category, points
  - Markdown description
  - Files and links (optional)
  - Securely hashed flags
- Edit existing challenges
- Publish/unpublish challenges
- Delete challenges
- Set or update flags (always hashed server-side)

### Submissions Monitoring
- View all user submissions in real-time
- See correct vs incorrect attempts
- Track timestamps and IP addresses
- Monitor user activity

## 🚀 Creating Your First Challenge

1. Go to Admin Dashboard → Challenges tab
2. Click "New Challenge"
3. Fill in the details:
   ```
   Title: Example Web Challenge
   Category: web
   Points: 100
   Description: Find the hidden flag in the website source code.
   Flag: flag{example_hidden_flag}
   ```
4. Click "Create"
5. Click "Publish" to make it available to users

**Note**: The flag will be automatically hashed with bcrypt before storage. Users will never see the actual flag in the database or network requests.

## 🔒 Security Best Practices

### Automatic Blockchain Identity
Every user automatically receives:
- **Unique Ethereum-style address** (0x... format, 42 characters)
- **Generated via SHA-256 hashing** using user ID + email
- **Cryptographic signature** for verification
- **Auto-verified** since it's system-generated
- **No wallet required** - fully automated process

### What's Secure
✅ Service role key only in server environment (Edge Functions)
✅ Flags hashed with bcrypt (salt rounds: 12)
✅ Client only uses SUPABASE_ANON_KEY (public by design)
✅ RLS policies prevent unauthorized data access
✅ Edge Functions validate all privileged operations
✅ Email verification enforced before challenge access
✅ Admin status verified server-side via `user_roles` table
✅ CTF timer enforced via RLS policies
✅ Blockchain addresses generated deterministically server-side

### What Users Can't Do
❌ Access service role key (not in client code or responses)
❌ Read raw flags from database (RLS denies all access)
❌ Bypass email verification
❌ Submit flags after solving a challenge
❌ Manipulate admin status (separate `user_roles` table)
❌ View other users' submissions (unless admin)
❌ Access challenges outside CTF time window
❌ Forge blockchain identities (server-generated only)

### What You Should Do
- Keep admin credentials secure and never share them
- Monitor audit logs regularly
- Review submissions for suspicious patterns
- Update challenge difficulties based on solve rates
- Backup your database regularly via Supabase dashboard

## 📊 Monitoring

### View Logs
- **Edge Function Logs**: Supabase Dashboard → Functions → [Function Name] → Logs
- **Database Logs**: Supabase Dashboard → Database → Logs
- **Audit Logs**: Admin Dashboard → View in submissions tab

### Real-time Updates
The platform uses Supabase Realtime for:
- Live scoreboard updates
- Instant submission notifications in admin panel
- Automatic refresh when new users register

## ⚠️ Important Notes

1. **Email Verification**: Users must verify their email before accessing challenges. To disable this for testing:
   - Go to Supabase Dashboard → Authentication → Settings
   - Turn off "Confirm email"

2. **Flag Format**: Always use format `flag{content_here}` for consistency

3. **Rate Limiting**: The platform has submission rate limiting to prevent brute force attacks

4. **First Solve Only**: Users earn points only on their first correct submission per challenge. Once solved, the challenge is locked.

## 🆘 Troubleshooting

### Admin Can't Access Dashboard
- Verify the SQL command was run with your correct email
- Check the user_roles table has the admin role
- Try logging out and back in

### Users Can't Submit Flags
- Check if email verification is enabled and user has verified
- Check Edge Function logs for errors
- Verify RLS policies are active

### Scoreboard Not Updating
- Check if realtime is enabled on submissions table
- Verify `get_scoreboard()` function exists
- Check browser console for WebSocket errors

## 📞 Support

For issues or questions:
- Check Supabase logs for detailed error messages
- Review Edge Function logs for submission issues

## 🔐 Security Checklist

Before going live:
- [ ] Admin account created and verified
- [ ] Admin role set in `user_roles` table
- [ ] Test user registration and email verification
- [ ] Test challenge creation and flag submission
- [ ] Configure CTF timer with proper start/end dates
- [ ] Verify service role key not exposed (check browser DevTools → Network)
- [ ] Test RLS policies (try accessing data as non-admin)
- [ ] Review and understand all security warnings
- [ ] Enable leaked password protection in Supabase Auth settings
- [ ] Verify blockchain addresses auto-generated for new users
- [ ] Test challenges are hidden outside CTF window
- [ ] Set up monitoring for suspicious activity

## 🎉 You're All Set!

Your secure CTF platform is ready to host challenges. Good luck with your event!
