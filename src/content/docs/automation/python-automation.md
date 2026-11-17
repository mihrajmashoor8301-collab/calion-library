---
title: Security Automation with Python
description: Developing lightweight Python tools for port verification, HTTP security header auditing, regex log triage, and concurrent probes.
---

Automation bridges manual security assessments and repeatable operational controls. Writing lightweight, targeted Python utilities enables security engineers to audit network surfaces, inspect API responses, parse log streams for threat indicators, and automate triage workflows without heavyweight third-party dependencies.

---

## The Automation Philosophy

- **Favor the Standard Library:** Utilizing built-in modules (`socket`, `urllib`, `re`, `argparse`, `concurrent.futures`, `json`) ensures your scripts run reliably across air-gapped or minimal container environments without `pip install` failures.
- **Always Enforce Timeouts:** Unhandled socket hangs or network delays will freeze automated triage loops. Always set explicit timeouts on every network call.
- **Structured Output:** Emit findings as structured JSON or CSV for seamless pipeline ingestion into SIEMs, databases, or notification webhooks.

---

## 1. Zero-Dependency TCP Port Probe

A standalone socket script to check listening services across target endpoints:

```python
#!/usr/bin/env python3
import socket
import sys

def probe_port(host: str, port: int, timeout: float = 2.0) -> bool:
    """Attempt TCP handshake to determine if a port is actively listening."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    try:
        sock.connect((host, port))
        sock.close()
        return True
    except (socket.timeout, ConnectionRefusedError, OSError):
        return False

def audit_target(host: str, ports: list[int]):
    print(f"[*] Auditing host: {host}")
    for port in ports:
        is_open = probe_port(host, port)
        status = "OPEN" if is_open else "CLOSED/FILTERED"
        print(f"    Port {port:5d}/tcp : {status}")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1"
    audit_target(target, [21, 22, 80, 443, 3306, 5432, 8080])
```

---

## 2. HTTP Security Header Inspector

Auditing security-relevant HTTP response headers using Python `requests` or `urllib.request`:

```python
#!/usr/bin/env python3
import urllib.request
import ssl
import sys

TARGET_URL = sys.argv[1] if len(sys.argv) > 1 else "https://notes.endlessus.in"

SECURITY_HEADERS = {
    "Strict-Transport-Security": "Enforces HTTPS connections and defends against SSL-stripping.",
    "Content-Security-Policy": "Restricts execution of unauthorized scripts to prevent XSS.",
    "X-Frame-Options": "Defends against clickjacking UI redressing attacks.",
    "X-Content-Type-Options": "Prevents MIME-sniffing vulnerabilities.",
    "Referrer-Policy": "Controls information passed in HTTP Referer headers."
}

def inspect_headers(url: str):
    ctx = ssl.create_default_context()
    req = urllib.request.Request(url, headers={"User-Agent": "CALION-Security-Auditor/1.0"})
    
    print(f"[*] Inspecting headers for: {url}")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=5) as resp:
            headers = {k.lower(): v for k, v in resp.headers.items()}
            
            for header, desc in SECURITY_HEADERS.items():
                val = headers.get(header.lower())
                if val:
                    print(f"  [+] {header}: Present\n      Value: {val}")
                else:
                    print(f"  [-] {header}: MISSING\n      Impact: {desc}")
    except Exception as e:
        print(f"[!] Request failed: {e}")

if __name__ == "__main__":
    inspect_headers(TARGET_URL)
```

---

## 3. High-Speed Regex Indicator Extraction

Extracting CVE identifiers and IPv4 addresses from raw firewall or web server logs:

```python
#!/usr/bin/env python3
import re
import json

LOG_SAMPLE = """
2026-11-17 12:45:01 web-srv1 [crit] Request matched CVE-2021-41773 from 192.168.1.105
2026-11-17 12:45:04 web-srv1 [warn] Probing endpoint /api/v1 from 10.0.0.22
2026-11-17 12:46:12 db-srv2 [err] Exploitation attempt CVE-2023-38606 from 192.168.1.105
"""

IPV4_REGEX = r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'
CVE_REGEX = r'\bCVE-\d{4}-\d{4,7}\b'

def extract_indicators(log_text: str) -> dict:
    ips = sorted(list(set(re.findall(IPV4_REGEX, log_text))))
    cves = sorted(list(set(re.findall(CVE_REGEX, log_text))))
    return {
        "unique_ips": ips,
        "unique_cves": cves,
        "total_ip_count": len(ips),
        "total_cve_count": len(cves)
    }

if __name__ == "__main__":
    results = extract_indicators(LOG_SAMPLE)
    print(json.dumps(results, indent=2))
```

---

## 4. Concurrent Scanning with `concurrent.futures`

Scale network audits across subnets using thread pools without external async libraries:

```python
from concurrent.futures import ThreadPoolExecutor
import socket

def check_host_port(target_tuple: tuple[str, int]) -> tuple[str, int, bool]:
    host, port = target_tuple
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1.0)
    try:
        s.connect((host, port))
        s.close()
        return (host, port, True)
    except Exception:
        return (host, port, False)

# Audit a slice of 10 hosts concurrently with max 20 threads
targets = [(f"192.168.1.{i}", 80) for i in range(1, 11)]

with ThreadPoolExecutor(max_workers=20) as executor:
    for host, port, is_open in executor.map(check_host_port, targets):
        if is_open:
            print(f"[!] Port open: {host}:{port}")
```
