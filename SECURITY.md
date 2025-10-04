# Security Documentation

## Overview
This CTF platform implements **enterprise-grade security** to protect against unauthorized access, data breaches, and manipulation of requests.

## Security Features Implemented

### 1. **JWT Authentication (Required)**
- JWT tokens are **MANDATORY** for authentication in web applications
- Tokens are sent in HTTP headers - this is **industry standard and secure**
- The `SUPABASE_ANON_KEY` is **public by design** - it only grants RLS-restricted access
- **IMPORTANT**: Seeing JWT tokens in requests is NORMAL and EXPECTED - they cannot be removed

### 2. **Server-Side Secret Management**
- **Service Role Key**: NEVER exposed to clients, only used in Edge Functions
- All privileged operations (flag verification, admin actions) run server-side
- Client receives only encrypted/hashed data, never plaintext secrets

### 3. **Flag Security**
- Flags are **bcrypt-hashed** (industry standard, 12 rounds)
- Verification happens **server-side only** via Edge Functions
- No plaintext flags stored in database
- Constant-time comparison to prevent timing attacks

### 4. **Row-Level Security (RLS)**
All tables have comprehensive RLS policies:
- `profiles`: Users can only see their own profile, admins see all
- `challenges`: Only published challenges visible during CTF window, admins always see all
- `flags`: **ZERO client access** - only server can read
- `submissions`: Users see own submissions, admins see all
- `user_roles`: Admin-only management with server-side verification

### 5. **Admin Role Management**
- Roles stored in separate `user_roles` table (prevents privilege escalation)
- Admin status verified **server-side** using security definer functions
- `has_role()` function bypasses RLS recursion issues
- Client cannot modify or fake admin status

### 6. **CTF Timer Protection**
- Challenges automatically hidden outside CTF window via RLS
- Server-side function `is_ctf_active()` validates access
- Admins bypass timer restrictions for management
- Real-time updates to scoreboard during active CTF

### 7. **Automatic Blockchain Identity**
- Each user gets a unique blockchain address on signup
- Generated using SHA-256 cryptographic hashing
- Ethereum-style address format (0x... 40 hex chars)
- Deterministic based on user ID + email
- Cryptographic signature for verification
- No wallet connection required - fully automated
- Provides immutable proof of identity

### 8. **Request Tampering Prevention**
All critical operations are protected:
- **Flag Submission**: Server validates, client cannot bypass
- **Challenge Access**: RLS + timer checks on server
- **Admin Actions**: Role verification server-side
- **Score Calculation**: Computed server-side, read-only view

### 9. **Data Exposure Protection**
- Email addresses not exposed in public profiles
- IP addresses stored for audit but restricted access
- No sensitive data in client-accessible tables
- Signed URLs for file access (short-lived, auto-expiring)

### 10. **Real-Time Security**
- WebSocket connections authenticated via RLS
- Realtime subscriptions respect RLS policies
- No privileged data pushed to unauthorized clients

## What Burp Suite Would Capture

### ✅ **Normal & Expected** (Cannot Be Avoided)
1. **JWT Token** - Required for auth, validated server-side
2. **Anon Key** - Public by design, restricted by RLS
3. **API Calls** - Protected by RLS and server-side validation
4. **Session Cookies** - Standard authentication mechanism

### ❌ **NEVER Exposed** (Critical Secrets)
1. **Service Role Key** - Only in Edge Functions environment
2. **Plaintext Flags** - Hashed with bcrypt
3. **Admin Credentials** - Hashed by Supabase Auth
4. **Blockchain Addresses** - Generated server-side, deterministic but non-reversible

## Request Tampering Scenarios & Protections

### Scenario 1: Tampering Flag Submission
**Attack**: User modifies flag in request
**Protection**: Server-side bcrypt verification, rate limiting, submission locking

### Scenario 2: Accessing Hidden Challenges
**Attack**: Direct API call to unpublished challenge
**Protection**: RLS policies + `is_ctf_active()` function enforces access control

### Scenario 3: Faking Admin Status
**Attack**: Modifying JWT claims or localStorage
**Protection**: Server-side role verification using `has_role()` function + separate `user_roles` table

### Scenario 4: Score Manipulation
**Attack**: Submitting fake scores
**Protection**: Scores computed server-side from submissions, read-only access for clients

### Scenario 5: Bypassing CTF Timer
**Attack**: Accessing challenges outside window
**Protection**: RLS policy checks `is_ctf_active()` server-side function for every query

## Encryption Notes

### Why NOT Custom Encryption?
- **Industry standard**: bcrypt, JWT, TLS are battle-tested
- **Security through obscurity fails**: Custom crypto is vulnerable
- **Compliance**: Standard algorithms are audited and certified
- **Performance**: Optimized implementations prevent timing attacks

### Data Protection Layers
1. **Transport**: HTTPS/TLS (automatic with Supabase)
2. **Storage**: bcrypt for flags, Supabase Auth for passwords
3. **Access**: RLS + server-side validation
4. **Audit**: All admin actions logged

## Audit & Monitoring

All sensitive operations are logged:
- Admin flag updates → `audit_logs`
- User submissions → `submissions` (with result, timestamp, IP)
- Challenge modifications → tracked with `created_by`, `updated_at`
- Blockchain verifications → stored signatures

## Compliance

This implementation follows:
- OWASP Top 10 protections
- NIST password guidelines (via Supabase Auth)
- Zero-trust architecture principles
- Principle of least privilege

**⚠️ Action Required**: Enable leaked password protection in Supabase Auth settings:
1. Go to [Auth Providers](https://supabase.com/dashboard/project/rtvauvrqbfqbkibtbgnq/auth/providers)
2. Navigate to Password settings
3. Enable "Password Strength and Leaked Password Protection"
4. This prevents users from using compromised passwords from data breaches

## Testing Security

To verify security:
1. **Non-admin cannot access admin panel** - redirects to home
2. **Flags cannot be read from database** - RLS denies access
3. **Challenges hidden outside CTF window** - RLS enforces timer
4. **Tampering requests fails** - server validates all data
5. **JWT manipulation detected** - Supabase validates signatures

## Important Notes

⚠️ **JWT Tokens in Requests Are SECURE**
- They are signed and validated server-side
- They expire automatically
- They cannot be forged without the secret key
- Seeing them in Burp Suite is NORMAL and EXPECTED

⚠️ **Anon Key is PUBLIC by Design**
- It's meant to be in client code
- It only allows RLS-restricted access
- Critical operations require Service Role Key (server-only)

⚠️ **Perfect Security Doesn't Exist**
- This is defense-in-depth strategy
- Multiple layers protect against compromise
- Regular security audits recommended
- Keep dependencies updated

## Conclusion

The platform implements **maximum security** while maintaining functionality. All critical data is protected, all operations validated server-side, and all access controlled via RLS. Request capture tools like Burp Suite will see standard authentication tokens, which is expected and secure.
