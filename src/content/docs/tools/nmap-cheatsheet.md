---
title: Nmap Command Cheatsheet & Scanner Reference
description: Comprehensive CLI options, scan timing, and script engine usage for network discovery.
---

Nmap (Network Mapper) is the industry-standard open-source network discovery and vulnerability scanner.

## Scan Types

```bash
# TCP SYN Stealth Scan (Default as Root, Sends SYN, Tears down with RST)
sudo nmap -sS -p- 192.168.1.1

# TCP Connect Scan (Full 3-Way Handshake, Used when non-root)
nmap -sT -p 80,443 192.168.1.1

# UDP Service Scan (Slow, audits DNS, SNMP, DHCP)
sudo nmap -sU --top-ports 50 192.168.1.1

# Comprehensive Service Version & Default Script Scan
nmap -sV -sC -O -oA scan_results 192.168.1.1
```

## Performance & Timing Controls

Control packets-per-second and timeout thresholds:

| Template | Timing Name | Use Case |
| :--- | :--- | :--- |
| `-T0` | Paranoid | IDS/IPS evasion, extremely slow (5 minutes per probe) |
| `-T1` | Sneaky | Slow scans over unstable or sensitive networks |
| `-T2` | Polite | Bandwidth-conserving scan |
| `-T3` | Normal | Default Nmap timing (dynamic adjustments) |
| `-T4` | Aggressive | Fast scans on reliable local networks (**Recommended**) |
| `-T5` | Insane | High-speed local gigabit networks, risk of dropped packets |

## Nmap Scripting Engine (NSE)

```bash
# Run vulnerability detection scripts
nmap --script "vuln" -p 80,443 192.168.1.1

# Search for specific scripts by category
ls /usr/share/nmap/scripts/ | grep -i smb
nmap --script "smb-enum-shares,smb-enum-users" -p 445 192.168.1.1
```
