---
title: Network Port & Service Enumeration
description: Standard port mappings, handshake mechanics, and network discovery commands.
---

Network port enumeration determines what network services and applications are actively listening on a target host.

## Common Ports & Default Services

| Port | Protocol | Common Service | Security Considerations |
| :--- | :--- | :--- | :--- |
| **21** | TCP | FTP | Cleartext authentication; check for anonymous access |
| **22** | TCP | SSH | Encrypted shell; inspect for weak key algorithms or password auth |
| **23** | TCP | Telnet | Cleartext legacy terminal; highly vulnerable to packet sniffing |
| **25** | TCP | SMTP | Mail transfer; check for open mail relays (`VRFY`, `EXPN`) |
| **53** | TCP/UDP | DNS | Domain resolution; verify zone transfer restrictions |
| **80** | TCP | HTTP | Cleartext web; check for missing TLS redirects |
| **88** | TCP/UDP | Kerberos | Active Directory ticket authentication |
| **443** | TCP | HTTPS | Encrypted web; audit TLS configuration and cipher suites |
| **445** | TCP | SMB | File sharing; audit signing requirements and SMBv1 exposure |
| **3389** | TCP | RDP | Windows Remote Desktop; audit Network Level Authentication (NLA) |

## Netcat / Bash Quick Port Checks

Test port connectivity directly from the Linux shell without external tools:
```bash
# Check if port 443 is accepting connections via bash pseudo-device
(echo > /dev/tcp/127.0.0.1/443) >/dev/null 2>&1 && echo "Port 443 OPEN" || echo "Port 443 CLOSED"

# Banner grab via Netcat
nc -nv 192.168.1.1 21
```
