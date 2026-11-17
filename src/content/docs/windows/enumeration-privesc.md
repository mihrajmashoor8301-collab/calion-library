---
title: Windows Host Enumeration & Privilege Escalation
description: Practical enumeration techniques, Windows services misconfigurations, access token privileges, and defensive hardening.
---

Windows privilege escalation involves identifying configuration weaknesses, vulnerable services, weak filesystem permissions, or abused token privileges on a local Windows host to transition from a standard user context to `NT AUTHORITY\SYSTEM`.

:::caution[Educational Scope]
The commands and enumeration methodologies outlined below are intended strictly for authorized security evaluations, CTF laboratories, and administrative audits.
:::

---

## Initial Situational Awareness

Upon gaining initial low-privilege access to a Windows system, gather baseline host, user, network, and architecture data.

### Command Prompt & PowerShell Triage

```cmd
:: Current user identity, security identifiers (SIDs), and token privileges
whoami /all

:: Operating system version, patch level, and system architecture
systeminfo | findstr /B /C:"OS Name" /C:"OS Version" /C:"System Type"

:: Local users and group memberships
net user
net localgroup Administrators

:: Active network connections and listening sockets
netstat -ano | findstr LISTENING

:: Environment variables and execution path
set PATH
```

### Critical User Privileges to Inspect

When inspecting the output of `whoami /priv`, look for high-value access token rights:

| Privilege Name | Default State | Escalation Vector / Significance |
| :--- | :--- | :--- |
| **`SeImpersonatePrivilege`** | Disabled / Enabled | Allows token impersonation from elevated processes (Potato exploits). Common in IIS service accounts (`iis apppool`). |
| **`SeBackupPrivilege`** | Disabled | Grants read access to any file on the system, bypassing ACLs (allows reading NTDS.dit or SAM/SYSTEM hives). |
| **`SeRestorePrivilege`** | Disabled | Grants write access to any file on the system, allowing replacement of service binaries. |
| **`SeDebugPrivilege`** | Disabled | Allows attaching debuggers to arbitrary processes, including `lsass.exe`. |

---

## Service Misconfigurations

Windows services run in high-privilege accounts (often `NT AUTHORITY\SYSTEM`). When services are configured with permissive permissions or unquoted paths, local users can manipulate execution flows.

### 1. Unquoted Service Paths

An unquoted service path occurs when a service binary path containing spaces is stored without enclosing quotes in the Windows Registry.

For example, given:
`C:\Program Files\Development Tools\ServiceApp\engine.exe`

Windows attempts execution in this order:
1. `C:\Program.exe`
2. `C:\Program Files\Development.exe`
3. `C:\Program Files\Development Tools\ServiceApp\engine.exe`

If an unprivileged user has write access to `C:\`, dropping `Program.exe` will execute when the service starts.

**Detecting Unquoted Service Paths via Command Prompt:**
```cmd
wmic service get name,displayname,pathname,startmode | findstr /i /v "c:\windows\\" | findstr /i /v """
```

**Querying Configuration via `sc`:**
```cmd
sc qc CustomService
```

### 2. Weak Service Permissions & Modifiable Binaries

If low-privilege users possess `SERVICE_CHANGE_CONFIG` or `SERVICE_ALL_ACCESS` rights over a service, they can modify the service binary path (`binPath`) directly:

```cmd
# Inspecting service permissions using Sysinternals AccessChk (in authorized labs)
accesschk.exe -uwcqv "Users" *

# Modifying binary path of a vulnerable service
sc config VulnerableService binpath= "C:\path\to\custom_binary.exe"
sc stop VulnerableService
sc start VulnerableService
```

---

## Registry Autoruns & AlwaysInstallElevated

### AlwaysInstallElevated

If the `AlwaysInstallElevated` registry policy is enabled, Windows allows any user to install Windows Installer package (`.msi`) files with full elevated administrative privileges:

```cmd
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
```

If both return `0x1`, any `.msi` package runs under `NT AUTHORITY\SYSTEM`.

**Defensive Remediation:** Set both values to `0` or remove the registry key in Group Policy:
```powershell
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Installer" -Name "AlwaysInstallElevated" -Value 0
```

---

## Defensive Hardening & Detection

1. **Principle of Least Privilege for Service Accounts:** Configure non-system services to run under managed service accounts (gMSA) or virtual accounts with restricted privileges rather than `LocalSystem`.
2. **Quote All Service Paths:** Audit registry keys under `HKLM\SYSTEM\CurrentControlSet\Services` and wrap all binary paths containing spaces in double quotes.
3. **Restrict File & Folder ACLs:** Ensure non-administrative users do not possess write or modify permissions over root drive directories (`C:\`) or application directories under `C:\Program Files\`.
4. **Enable PowerShell Script Block Logging:** Enable Event ID `4104` to record executed script blocks for centralized SIEM analysis.
