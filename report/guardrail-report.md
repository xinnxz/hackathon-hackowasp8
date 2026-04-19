# OWASP Guardrail Security Report

> **Status:** ❌ FAIL | **Security Score:** **F** (0/100) — Critical — Immediate action required
> **Scan Target:** `E:\DATA\Ngoding\hackowasp8\demo\vulnerable-app`
> **Generated:** 2026-04-19T11:09:43.318Z
> **Policy:** Fail on [high, critical]

## Summary

| Severity | Count |
|---|---|
| 🔴 Critical | 2 |
| 🟠 High     | 6 |
| 🟡 Medium   | 2 |
| 🟢 Low      | 3 |
| **Total**   | **13** |

## OWASP Top 10 Coverage

| Category | Findings |
|---|---|
| A06:2021 — Vulnerable and Outdated Components | 8 |
| A07:2021 — Identification and Authentication Failures | 3 |
| A03:2021 — Injection | 1 |
| A01:2021 — Broken Access Control | 1 |

## Findings

### 🔴 `CRITICAL` — Possible GitHub token committed

- **File:** `src\app.js:5`
- **Type:** secret
- **OWASP:** [A07:2021 Identification and Authentication Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)

**Description:** Secret-like content was detected in source control: const apiToken = "ghp_1234567890abcdefghijklmnopqrstuv";

**Recommendation:** Remove the token, rotate it, and load credentials from environment variables or a secrets manager.

---

### 🔴 `CRITICAL` — String-concatenated SQL query detected

- **File:** `src\app.js:15`
- **Type:** injection
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Manual query concatenation can enable SQL injection and data exposure.

**Recommendation:** Use parameterized queries or a query builder that binds untrusted input safely.

---

### 🟠 `HIGH` — Hardcoded JWT or API secret

- **File:** `src\app.js:5`
- **Type:** secret
- **OWASP:** [A07:2021 Identification and Authentication Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)

**Description:** Secret-like content was detected in source control: const apiToken = "ghp_1234567890abcdefghijklmnopqrstuv";

**Recommendation:** Move credentials into environment variables and rotate compromised values.

---

### 🟠 `HIGH` — High-entropy credential-like value found

- **File:** `src\app.js:6`
- **Type:** secret
- **OWASP:** [A07:2021 Identification and Authentication Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)

**Description:** A long high-entropy string appears next to a secret-like variable name.

**Recommendation:** Replace the hardcoded value with an environment variable and rotate the credential.

---

### 🟠 `HIGH` — Dependency vulnerability: body-parser

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 2 advisory item(s) detected for body-parser. Range: <=1.20.3 || 2.0.0-beta.1 - 2.0.2.

**Recommendation:** Upgrade body-parser to the patched version recommended by npm audit.

---

### 🟠 `HIGH` — Dependency vulnerability: express

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 8 advisory item(s) detected for express. Range: <=4.21.2 || 5.0.0-alpha.1 - 5.0.1.

**Recommendation:** Upgrade express to the patched version recommended by npm audit.

---

### 🟠 `HIGH` — Dependency vulnerability: lodash

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 6 advisory item(s) detected for lodash. Range: <=4.17.23.

**Recommendation:** Upgrade lodash to the patched version recommended by npm audit.

---

### 🟠 `HIGH` — Dependency vulnerability: path-to-regexp

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 3 advisory item(s) detected for path-to-regexp. Range: <=0.1.12.

**Recommendation:** Upgrade path-to-regexp to the patched version recommended by npm audit.

---

### 🟡 `MEDIUM` — Route handler without obvious authorization middleware

- **File:** `src\app.js:13`
- **Type:** access-control
- **OWASP:** [A01:2021 Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)

**Description:** A direct route handler was found without an earlier auth middleware in the same line.

**Recommendation:** Protect sensitive routes with authentication and authorization middleware before the handler.

---

### 🟡 `MEDIUM` — Dependency vulnerability: qs

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 2 advisory item(s) detected for qs. Range: <=6.14.1.

**Recommendation:** Upgrade qs to the patched version recommended by npm audit.

---

### 🟢 `LOW` — Dependency vulnerability: cookie

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 1 advisory item(s) detected for cookie. Range: <0.7.0.

**Recommendation:** Upgrade cookie to the patched version recommended by npm audit.

---

### 🟢 `LOW` — Dependency vulnerability: send

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 1 advisory item(s) detected for send. Range: <0.19.0.

**Recommendation:** Upgrade send to the patched version recommended by npm audit.

---

### 🟢 `LOW` — Dependency vulnerability: serve-static

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 2 advisory item(s) detected for serve-static. Range: <=1.16.0.

**Recommendation:** Upgrade serve-static to the patched version recommended by npm audit.

---

_Report generated by [OWASP Guardrail](https://github.com/xinnxz/hackowasp8) v2.0_