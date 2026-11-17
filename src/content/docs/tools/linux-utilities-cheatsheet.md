---
title: Linux Core Security Utilities Cheat Sheet
description: Structured operational reference for essential Linux security utilities including curl, netcat, openssl, tcpdump, and ufw.
---

This reference provides syntax, examples, expected output, and security considerations for the core command-line utilities standard across Linux security environments.

---

## 1. `curl` (Client for URLs)

### What It Does
Transfers data to or from servers supporting HTTP, HTTPS, FTP, and dozens of other protocols without browser overhead.

### Key Syntax & Options
```bash
curl [options] <URL>
```
- `-I`: Fetch HTTP response headers only (HEAD request).
- `-s`: Silent mode (suppresses progress meters).
- `-v`: Verbose mode (displays full TLS handshake and HTTP exchange).
- `-k` / `--insecure`: Bypasses SSL certificate verification (use only in self-signed lab environments).
- `-x <proxy_url>`: Routes request through an HTTP or SOCKS proxy (e.g. `http://127.0.0.1:8080`).
- `-d <data>`: Sends HTTP POST data.

### Safe Example & Output Interpretation
```bash
curl -s -I https://notes.endlessus.in
```
**Expected Output:**
```http
HTTP/2 200 
date: Tue, 17 Nov 2026 10:45:00 GMT
content-type: text/html; charset=utf-8
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
x-frame-options: DENY
content-security-policy: default-src 'self'; ...
```
*Interpretation:* Verifies server status and confirms key defensive headers (`HSTS`, `X-Content-Type-Options`, `X-Frame-Options`, `CSP`) are active.

---

## 2. `netcat` (The Network Swiss Army Knife)

### What It Does
Reads and writes data across network connections using TCP or UDP. Used for port checking, banner grabbing, and simple service mocking.

### Key Syntax & Options
```bash
nc [options] <host> <port>
```
- `-z`: Zero-I/O mode (scans for listening daemons without transmitting data).
- `-v`: Verbose output.
- `-n`: Numeric-only IP addresses (disables reverse DNS lookups).
- `-l`: Listen mode (waits for inbound connections).
- `-p <port>`: Local port specification.

### Safe Example & Output Interpretation
```bash
nc -zvn 192.168.1.10 22 80 443 3306
```
**Expected Output:**
```text
(UNKNOWN) [192.168.1.10] 22 (ssh) open
(UNKNOWN) [192.168.1.10] 80 (http) open
(UNKNOWN) [192.168.1.10] 443 (https) open
(UNKNOWN) [192.168.1.10] 3306 (mysql) : Connection refused
```
*Interpretation:* Quick confirmation that web and SSH services are running, while MySQL is closed or bound only to localhost.

---

## 3. `openssl` (Cryptographic Toolkit)

### What It Does
Performs SSL/TLS handshakes, certificate parsing, CSR generation, and cryptographic hashing.

### Key Syntax & Options
```bash
openssl s_client -connect <host>:<port> [options]
```
- `-connect <host>:<port>`: Establishes TLS socket to destination.
- `-servername <domain>`: Transmits Server Name Indication (SNI) for virtual hosted SSL certificates.
- `-tls1_2` / `-tls1_3`: Enforces specific TLS protocol version to test for legacy protocol support.

### Safe Example & Output Interpretation
```bash
openssl s_client -connect notes.endlessus.in:443 -servername notes.endlessus.in < /dev/null 2>/dev/null | openssl x509 -noout -dates -subject -issuer
```
**Expected Output:**
```text
notBefore=Nov  1 00:00:00 2026 GMT
notAfter=Jan 30 23:59:59 2027 GMT
subject=CN = notes.endlessus.in
issuer=C = US, O = Let's Encrypt, CN = R3
```
*Interpretation:* Confirms the active SSL certificate issuer, common name, and validity expiration dates without browser reliance.

---

## 4. `tcpdump` (Command-Line Packet Sniffer)

### What It Does
Captures and displays raw network packet headers and payloads matching a Berkeley Packet Filter (BPF) rule.

### Key Syntax & Options
```bash
sudo tcpdump [options] [filter_expression]
```
- `-i <iface>`: Captures on specified network interface (`eth0`, `lo`, `any`).
- `-nn`: Avoids hostname and port resolution.
- `-c <num>`: Exits after receiving specified count of packets.
- `-w <file>`: Writes raw packets directly to PCAP file.

### Safe Example & Output Interpretation
```bash
sudo tcpdump -i any -nn -c 3 port 53
```
**Expected Output:**
```text
16:15:02.102391 IP 192.168.1.50.48201 > 1.1.1.1.53: 1421+ A? notes.endlessus.in. (38)
16:15:02.124102 IP 1.1.1.1.53 > 192.168.1.50.48201: 1421 1/0/0 A 172.67.180.12 (54)
```
*Interpretation:* Displays a standard DNS A record resolution query to Cloudflare DNS (`1.1.1.1`) and the returned IPv4 response.

---

## 5. `ufw` (Uncomplicated Firewall)

### What It Does
Provides an administrator-friendly interface for managing Netfilter / iptables firewall rules on Linux.

### Key Syntax & Options
```bash
sudo ufw [command]
```
- `default <allow|deny> <incoming|outgoing>`: Sets baseline traffic policy.
- `allow <port>/<protocol>`: Creates inbound permit rule.
- `limit <port>/<protocol>`: Rate-limits connections (e.g. drops IPs that attempt >6 connections in 30 seconds).
- `status verbose`: Shows active rules and defaults.

### Safe Example & Output Interpretation
```bash
sudo ufw status verbose
```
**Expected Output:**
```text
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp                     LIMIT IN    Anywhere                   # Rate-limited SSH
80/tcp                     ALLOW IN    Anywhere                   # HTTP
443/tcp                    ALLOW IN    Anywhere                   # HTTPS
```
*Interpretation:* The firewall is active with a secure default-deny incoming posture, with only rate-limited SSH and standard web ports exposed.
