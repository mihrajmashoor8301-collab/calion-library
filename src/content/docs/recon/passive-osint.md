---
title: Passive OSINT & Reconnaissance
description: Methodologies and CLI techniques for zero-contact asset discovery.
---

Passive reconnaissance involves gathering actionable intelligence on target infrastructure without transmitting traffic directly to the target's primary systems.

## DNS Intelligence & Enumeration

### Querying Nameservers Directly
```bash
# Query Authoritative Nameservers for a Domain
dig ns example.com +short

# Query Mail Exchange (MX) Records
dig mx example.com +short

# Retrieve Sender Policy Framework (SPF) & TXT Records
dig txt example.com +short
```

### Zone Transfer Verification (AXFR)
Zone transfers should be disabled on production nameservers. Verify compliance:
```bash
dig axfr @ns1.example.com example.com
```

## WHOIS & ASN Mapping

```bash
# Query Domain Registration and Registrar Contacts
whois example.com

# Query Autonomous System Number (ASN) Allocation
whois -h whois.radb.net -- "-i origin AS15169"
```

## Security Best Practices
- Never execute active scans or zone transfers against non-authorized scopes.
- Cache external queries locally to reduce external query leakage during investigations.
