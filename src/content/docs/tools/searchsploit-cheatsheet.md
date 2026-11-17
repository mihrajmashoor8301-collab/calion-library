---
title: Searchsploit & Exploit-DB Command Cheat Sheet
description: Structured command reference for Searchsploit CLI, title filtering, CVE queries, Nmap XML correlation, and safe mirror operations.
---

`searchsploit` is a command-line search utility for **Exploit-DB**, allowing security researchers and auditors to perform fast, offline queries against thousands of published proof-of-concept exploits, advisories, and papers.

:::caution[Code Safety Warning]
Public proof-of-concept exploits downloaded from the internet may contain errors, backdoors, or unintended destructive routines. Always inspect source code thoroughly in an isolated sandbox before execution.
:::

---

## 1. Title Search by Software Name & Version

### What It Does
Performs an offline grep across exploit titles stored in the local Exploit-DB database.

### Syntax & Options
```bash
searchsploit -t <software_name_and_version>
```
- `-t`: Restricts search solely to exploit titles rather than searching the full advisory body, significantly reducing false positives.

### Safe Example & Interpretation
```bash
searchsploit -t "vsftpd 2.3.4"
```
**Expected Output:**
```text
---------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                        |  Path
---------------------------------------------------------------------- ---------------------------------
vsftpd 2.3.4 - Backdoor Command Execution                            | unix/remote/49757.py
vsftpd 2.3.4 - Backdoor Command Execution (Metasploit)                | unix/remote/17491.rb
---------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
```
*Interpretation:* Two public proof-of-concept scripts exist for `vsftpd 2.3.4`. Their local files are located relative to `/usr/share/exploitdb/exploits/`.

---

## 2. Searching by CVE Identifier

### What It Does
Directly locates exploit entries mapped to an official Common Vulnerabilities and Exposures (CVE) number.

### Syntax & Options
```bash
searchsploit --cve <YYYY-NNNNN>
```

### Safe Example & Interpretation
```bash
searchsploit --cve 2021-41773
```
**Expected Output:**
```text
---------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                        |  Path
---------------------------------------------------------------------- ---------------------------------
Apache HTTP Server 2.4.49 - Path Traversal & Remote Code Execution    | multiple/webapps/50383.sh
---------------------------------------------------------------------- ---------------------------------
```
*Interpretation:* Quickly identifies the exact bash script exploit for the Apache 2.4.49 path traversal vulnerability.

---

## 3. Mirroring Exploit Files Locally (`-m`)

### What It Does
Copies the chosen exploit file directly into your current working directory without modifying the system's core Exploit-DB repository.

### Syntax & Options
```bash
searchsploit -m <exploit_path_or_id>
```

### Safe Example & Interpretation
```bash
searchsploit -m unix/remote/49757.py
```
**Expected Output:**
```text
  Exploit: vsftpd 2.3.4 - Backdoor Command Execution
      URL: https://www.exploit-db.com/exploits/49757
     Path: /usr/share/exploitdb/exploits/unix/remote/49757.py
File Type: Python script, ASCII text executable

Copied to: /home/mihraj/49757.py
```
*Interpretation:* The script is now available locally at `./49757.py` where it can be inspected and audited with a text editor (`cat` or `nano`) before any authorized testing.

---

## 4. Correlating Nmap Scan XML Output (`--nmap`)

### What It Does
Automatically parses an Nmap XML output file and runs searchsploit queries for every identified service banner.

### Syntax & Options
```bash
# 1. Run Nmap with XML output
nmap -sV -oX scan.xml 192.168.1.10

# 2. Correlate with searchsploit
searchsploit --nmap scan.xml
```

### Safe Example & Interpretation
```bash
searchsploit --nmap scan.xml
```
**Expected Output:**
```text
[i] SearchSploit's XML mode (Scanning for service versions)
[i] Reading XML file: scan.xml
[i] Found 3 services:
    - Service: Apache httpd 2.4.49 -> 2 exploits found
    - Service: OpenSSH 8.9p1       -> 0 exploits found
    - Service: vsftpd 2.3.4        -> 2 exploits found
```
*Interpretation:* Eliminates manual searching for each open port identified during the reconnaissance phase.

---

## 5. Defensive & Authorization Considerations

1. **Malicious Exploit Payloads:** Exploit-DB archives community submissions. Historically, malicious actors have occasionally submitted PoCs containing embedded wiper scripts or reverse shells connecting to unexpected third-party C2 servers. Always audit the Python, C, or Ruby source code prior to running.
2. **Compilation Precautions:** If compiling C exploits (`gcc exploit.c -o exploit`), do so inside an unprivileged virtual machine or container to prevent accidental local privilege corruption.
3. **Database Currency:** Run `searchsploit -u` periodically on systems with internet access to refresh the local Git mirror against the latest published CVEs.
