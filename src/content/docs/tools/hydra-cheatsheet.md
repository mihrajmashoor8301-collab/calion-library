---
title: THC-Hydra Command Cheat Sheet
description: Structured operational reference for THC-Hydra network authentication auditing, protocol modules, and defensive rate limiting.
---

**THC-Hydra** is a parallelized network login brute-forcer supporting over 50 protocols, including SSH, FTP, HTTP-POST-FORM, SMB, RDP, and MySQL. It is used in authorized security assessments to verify password policy enforcement and audit default credentials.

:::danger[High Operational Risk]
Hydra sends rapid authentication attempts across the network. Executing Hydra against production systems can trigger account lockouts across Active Directory or local PAM configurations, causing severe operational denial-of-service. Hydra must be used strictly on authorized test systems.
:::

---

## 1. General CLI Syntax & Essential Options

### General Syntax
```bash
hydra [OPTIONS] -l <username>|-L <userlist> -p <password>|-P <passlist> <target_ip> <service> [service_options]
```

### Key Options

| Flag | Description |
| :--- | :--- |
| `-l <user>` | Single username to test. |
| `-L <file>` | Path to file containing list of usernames. |
| `-p <pass>` | Single password to test. |
| `-P <file>` | Path to wordlist containing passwords (e.g. `rockyou.txt`). |
| `-t <num>` | Number of parallel tasks/threads (default 16; reduce for SSH/FTP to prevent bans). |
| `-f` | Exit immediately upon finding the first valid credential pair. |
| `-e nsr` | Additional password checks: `n` (null password), `s` (same as login), `r` (reversed login). |
| `-v` / `-V` | Verbose / Very verbose (displays tested login:pass attempts). |
| `-s <port>` | Specify non-standard service port. |

---

## 2. Auditing SSH Authentication

### What It Does
Tests dictionary passwords against an SSH daemon.

### Syntax & Safe Example
```bash
hydra -l audituser -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.10 -t 4 -f
```
*Note:* Keep threads low (`-t 4`) because OpenSSH daemons limit connection rates via `MaxStartups` and will drop rapid connection attempts.

**Expected Output:**
```text
Hydra v9.5 (c) 2023 by van Hauser / THC & David Maciejak - Please do not use in military or secret service organizations...
[DATA] max 4 tasks per 1 server, overall 4 tasks, 14344399 login tries (l:1/p:14344399), ~3586100 tries per task
[STATUS] attack finished for 192.168.1.10 (waiting for children to finish)
[22][ssh] host: 192.168.1.10   login: audituser   password: password123
1 of 1 target successfully completed, 1 valid password found
```
*Interpretation:* Credential pair `audituser:password123` verified successfully.

---

## 3. Auditing FTP & Database Services

### FTP Service
```bash
hydra -L test_users.txt -P passwords.txt 192.168.1.10 ftp -f
```

### PostgreSQL Database
```bash
hydra -l postgres -P /usr/share/wordlists/rockyou.txt 192.168.1.10 postgres -s 5432 -f
```

---

## 4. Auditing Web Application Login Forms (`http-post-form`)

### What It Does
Submits POST parameters to an HTTP form and analyzes the response body to detect successful authentication.

### Syntax & Format
The `http-post-form` module requires a colon-delimited string:
`"<url_path>:<post_body>:<failure_condition>"`

### Safe Example
```bash
hydra -l admin -P test_passwords.txt 192.168.1.10 http-post-form \
  "/login.php:username=^USER^&password=^PASS^:F=Incorrect credentials" -f
```

- `^USER^` and `^PASS^`: Substitution variables replaced by Hydra dynamically.
- `F=Incorrect credentials`: The **Failure condition**. If the HTTP response text contains "Incorrect credentials", Hydra considers the attempt failed. If absent, Hydra flags it as a valid credential.
- `S=Welcome to Dashboard`: Alternatively, the **Success condition** can be specified using `S=`.

---

## 5. Defensive Countermeasures & Lockout Prevention

1. **Implement Account Lockout & Delay:** Configure PAM (`pam_faillock` on Linux) to lock accounts after 5 consecutive failed attempts for 15 minutes.
2. **Deploy Fail2Ban or CrowdSec:** Automatically detect rapid authentication failures in `/var/log/auth.log` and inject temporary IP drop rules into UFW / nftables.
3. **Enforce Multi-Factor Authentication (MFA):** Even if a password is valid, multi-factor authentication (TOTP or WebAuthn) completely prevents automated network credential stuffing from succeeding.
