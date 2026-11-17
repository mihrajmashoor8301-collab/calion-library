---
title: OWASP Top 10 Web Security Reference
description: Quick reference guide for modern web application vulnerabilities and defensive mitigations.
---

The OWASP Top 10 represents the most critical web application security risks recognized globally.

## 1. Broken Access Control (A01:2021)
Failure to enforce proper permission boundaries allows users to act outside their intended permissions.

### Insecure Direct Object References (IDOR)
- **Vulnerability:** Applications use client-supplied input to access database records directly without verifying ownership.
- **Example:** `GET /api/documents?id=10043` accessed by User 10044.
- **Defensive Mitigation:** Enforce server-side authorization checks and Row Level Security (RLS) bound to `auth.uid()`.

## 2. Cryptographic Failures (A02:2021)
Exposing sensitive data in transit or at rest due to weak algorithms or protocol downgrade attacks.

### Defensive Mitigations
- Enforce TLS 1.3 with strong cipher suites.
- Mandate HTTP Strict Transport Security (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`).
- Use modern password hashing functions (Argon2id, bcrypt, PBKDF2) rather than MD5/SHA-1.

## 3. Injection (A03:2021)
Occurs when untrusted data is interpreted as command syntax by an interpreter (SQL, OS Command, LDAP).

### SQL Injection Mitigation
Always use parameterized queries and prepared statements:
```javascript
// SECURE: Parameterized Query
const { data } = await supabase
  .from('profiles')
  .select('username')
  .eq('id', userId);
```
Never concatenate raw strings into SQL queries.
