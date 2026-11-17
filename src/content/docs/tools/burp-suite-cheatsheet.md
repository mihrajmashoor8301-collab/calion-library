---
title: Burp Suite Command & Workflow Cheat Sheet
description: Structured operational reference for Burp Suite Proxy, Repeater, Intruder attack types, Match & Replace rules, and scope controls.
---

**Burp Suite** is an integrated platform for testing web application security. It functions as a local intercepting proxy, enabling practitioners to inspect, alter, and automate HTTP/S communication between client browsers and backend APIs.

:::caution[Target Scope Enforcement]
Always define your target scope in Burp Suite (`Target -> Scope`) before browsing or testing. Restricting passive logging and active tests to approved domains prevents inadvertent proxying or scanning of third-party SaaS services, CDNs, or payment processors.
:::

---

## 1. Proxy Interception & Configuration

### What It Does
Captures HTTP/HTTPS requests sent by your browser, pauses execution, and allows you to view or manipulate headers and body payloads before forwarding them to the server.

### Configuration
1. Default listener: `127.0.0.1:8080`.
2. Configure browser proxy (or FoxyProxy extension) to `127.0.0.1:8080`.
3. Browse to `http://burp` to download the root CA certificate (`cacert.der`).
4. Install certificate into browser Certificate Authorities to enable SSL inspection.

### Safe Example & Request Manipulation
Intercept an authentication POST request:
```http
POST /api/v1/auth/login HTTP/1.1
Host: target.internal.lab
User-Agent: Mozilla/5.0
Content-Type: application/json
Content-Length: 48

{"username":"admin' OR 1=1--","password":"test"}
```
*Interpretation:* The tester can manipulate the `username` field before it reaches the backend, testing for SQL injection without browser validation constraints.

---

## 2. Burp Repeater (Manual Request Replay)

### What It Does
Allows iterative, manual modification and re-sending of individual HTTP requests while observing server responses in real time.

### Keyboard Shortcuts
- `Ctrl + R` (or `Cmd + R`): Send active request from Proxy or Target to Repeater.
- `Ctrl + Space`: Send request in Repeater.

### Practical Use Cases
- Iteratively testing authorization headers (`Authorization: Bearer <token>`).
- Testing CORS headers by adding `Origin: https://evil.com`.
- Bypassing client-side JavaScript form validation.

---

## 3. Burp Intruder (Automated Parameter Fuzzing)

### What It Does
Automates customized attacks against web applications by injecting payload lists into defined positions.

### Attack Types Breakdown

| Attack Type | Positions & Payload Lists | How It Operates | Typical Use Case |
| :--- | :--- | :--- | :--- |
| **Sniper** | 1 payload set across multiple positions | Tests positions sequentially, one by one. | Fuzzing individual input fields for XSS or SQLi. |
| **Battering Ram** | 1 payload set across multiple positions | Injects the same payload value into all positions simultaneously. | Testing identical username/password combinations. |
| **Pitchfork** | Multiple payload sets | Iterates through multiple payload sets in lockstep (Index 0 with Index 0, Index 1 with Index 1). | Testing paired credentials (`user_1` with `pass_1`). |
| **Cluster Bomb** | Multiple payload sets | Tests every permutation (Cartesian product) across all payload sets. | Comprehensive credential brute forcing (`N` users × `M` passwords). |

---

## 4. Match & Replace Rules

### What It Does
Automatically rewrites headers or body content for all requests and responses flowing through the proxy.

### Common Configurations (`Proxy -> Options -> Match and Replace`)
1. **Emulate Mobile Client:**
   - Match: `User-Agent: .*`
   - Replace: `User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)`
2. **Disable Web Security Headers in Responses (for lab testing):**
   - Match: `Content-Security-Policy: .*`
   - Replace: *(Leave empty to strip CSP header)*
3. **Inject Custom Header into Outgoing Requests:**
   - Type: Request header
   - Match: *(empty)*
   - Replace: `X-Security-Audit: Authorized-Pentest-Engagement`

---

## 5. Defensive & Authorization Considerations

1. **Strict Target Scoping:** In `Target -> Scope`, enable "Use advanced scope control" and specify your target domain with regex (e.g. `^.*\.internal\.lab$`). Then check "Show only in-scope items" in the HTTP history tab to avoid capturing private browser traffic.
2. **Rate Limiting & Server Load:** Running high-concurrency Intruder attacks can exhaust web server thread pools, causing denial of service. Enforce request delays (e.g. 50-100ms) in Intruder Resource Pool settings.
3. **Data Protection:** Burp project files (`.burp`) contain full HTTP request/response histories, including passwords and session cookies. Ensure project files are saved onto encrypted volumes and deleted after reporting.
