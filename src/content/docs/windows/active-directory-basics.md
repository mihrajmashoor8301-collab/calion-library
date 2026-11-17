---
title: Active Directory & Windows Security Basics
description: Fundamental architectural concepts of Kerberos, NTLM, and domain reconnaissance.
---

Active Directory Domain Services (AD DS) provides centralized identity management, authentication, and policy enforcement across enterprise Windows environments.

## Kerberos Authentication Protocol

Kerberos operates via a trusted third party, the Key Distribution Center (KDC), typically hosted on a Domain Controller (DC).

### 3-Step Ticket Exchange Process
1. **Authentication Service (AS) Exchange:**
   - Client sends `AS-REQ` containing timestamp encrypted with user password hash.
   - KDC verifies and returns `AS-REP` containing Ticket Granting Ticket (TGT) and session key.
2. **Ticket Granting Service (TGS) Exchange:**
   - Client presents TGT via `TGS-REQ` requesting access to a Service Principal Name (SPN).
   - KDC issues a Service Ticket (`TGS-REP`).
3. **Application Exchange (AP):**
   - Client presents Service Ticket (`AP-REQ`) to target application server.

## Common Attack Vectors

### Kerberoasting
- **Mechanism:** Any valid domain user can request a TGS ticket for any service account configured with a Service Principal Name (SPN).
- **Impact:** The TGS ticket is encrypted with the service account's password hash. Attackers extract this ticket offline and perform brute-force attacks to recover the plaintext password.

### AS-REP Roasting
- **Mechanism:** If a user account has the attribute `DONT_REQ_PREAUTH` enabled, anyone can request an `AS-REP` message without presenting pre-authentication data.
- **Impact:** The response contains data encrypted with the user's password hash, crackable offline.
