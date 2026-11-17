---
title: Active Surface Enumeration & Web Fingerprinting
description: Direct target enumeration techniques using WhatWeb, ffuf, DNS zone queries, and web surface discovery.
---

While passive reconnaissance harvests public intelligence without communicating with target servers, **active enumeration** directly interacts with target network interfaces, web servers, and DNS resolvers. This produces definitive technical telemetry regarding active listening ports, software versions, web application stacks, and exposed administrative endpoints.

:::caution[Authorization Requirement]
Active enumeration transmits packets directly to target infrastructure and triggers events in Web Application Firewalls (WAFs), Network Intrusion Detection Systems (NIDS), and server logs. Ensure the target IPs and hostnames fall strictly within your authorized assessment scope.
:::

---

## Web Technology Fingerprinting (`WhatWeb`)

The `whatweb` utility analyzes HTTP headers, cookies, HTML source structure, DOM attributes, and script tags to identify web servers, reverse proxies, CMS platforms, and JavaScript libraries.

### Basic Web Stack Identification

```bash
whatweb http://192.168.1.10
```

**Interpreting the Output:**
```text
http://192.168.1.10 [200 OK] Apache[2.4.52], Country[RESERVED][ZZ], HTTPServer[Ubuntu Linux][Apache/2.4.52 (Ubuntu)], 
IP[192.168.1.10], PHP[8.1.2], Title[CALION Internal Portal], X-Powered-By[PHP/8.1.2ubuntu2.14]
```
- **Web Server:** Apache 2.4.52 on Ubuntu Linux.
- **Backend Language:** PHP 8.1.2.
- **Exposure:** Note that `X-Powered-By` discloses precise minor version information that assists vulnerability correlation.

### Aggressive Analysis with Subnet Sweep

```bash
# -a 3 triggers aggressive plugins (extracts CMS plugins, version hashes)
# --no-errors suppresses connection timeouts on inactive hosts
whatweb -a 3 --no-errors 192.168.1.0/24 --log-brief=web_inventory.txt
```

---

## Active DNS Enumeration & Transfer Checks

### DNS Record Enumeration with `dig`

Query all available DNS records across authoritative nameservers:

```bash
# Query any available DNS records
dig target.internal.lab ANY +noall +answer

# Query specific mail exchange records
dig target.internal.lab MX +short

# Query TXT records (frequently reveals SPF, DKIM, and internal verification keys)
dig target.internal.lab TXT +short
```

### Testing for Unrestricted Zone Transfers (AXFR)

An unrestricted DNS zone transfer occurs when a secondary DNS nameserver allows arbitrary hosts to download the entire zone database:

```bash
# Syntax: dig axfr @nameserver domain
dig axfr @ns1.target.internal.lab target.internal.lab
```

- **Vulnerable Behavior:** The command returns the complete list of subdomains, internal IP addresses, and records in one dump.
- **Defensive Fix:** Restrict `allow-transfer` in BIND (`named.conf`) to specific trusted static slave nameserver IP addresses only.

---

## Virtual Host & Subdomain Discovery (`ffuf`)

Modern cloud and web deployments route traffic based on the HTTP `Host` header (Virtual Hosting). Fuzzing the `Host` header reveals staging, internal, or testing applications sharing the same public IP address:

```bash
ffuf -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt \
     -u http://192.168.1.10/ \
     -H "Host: FUZZ.target.internal.lab" \
     -fs 178
```

### Options Breakdown:
- `-w /path/to/wordlist`: Path to wordlist containing subdomain strings.
- `-u http://...`: Target URL or IP address.
- `-H "Host: FUZZ.target.internal.lab"`: Injects the wordlist entry into the HTTP `Host` header.
- `-fs 178`: Filters out the default response size (178 bytes) returned when a virtual host is not found.

---

## Active Web Endpoint Fuzzing

Locating unlinked administrative dashboards, API endpoints, and backup artifacts:

```bash
ffuf -w /usr/share/wordlists/dirb/common.txt \
     -u http://192.168.1.10/FUZZ \
     -mc 200,204,301,302,307,401,403 \
     -e .php,.html,.json,.bak,.old
```

### Key Options:
- `-mc`: Comma-separated HTTP status codes to display.
- `-e`: Appends file extensions to each fuzzing keyword to identify hidden source code backups or API contracts.

---

## Surface Inventory Matrix

Consolidate discoveries into an actionable attack surface matrix during early engagement phases:

| Host / IP | Open Ports | Identified Technologies | Exposed Endpoints | Risk Flag |
| :--- | :--- | :--- | :--- | :--- |
| `192.168.1.10` | 80/tcp, 443/tcp | Apache 2.4.52, PHP 8.1.2 | `/admin/`, `/api/v1/health` | `X-Powered-By` header leak |
| `192.168.1.15` | 22/tcp, 8080/tcp | OpenSSH 8.9p1, Spring Boot | `/actuator/env`, `/actuator/health` | Spring Boot Actuator public access |
| `192.168.1.20` | 53/udp, 53/tcp | BIND 9.18 | DNS AXFR | Permissive Zone Transfer enabled |
