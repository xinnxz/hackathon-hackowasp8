# OWASP Guardrail Security Report

> **Status:** ❌ FAIL | **Security Score:** **F** (0/100) — Critical — Immediate action required
> **Scan Target:** `E:\DATA\Ngoding\aio-wallet-generator`
> **Generated:** 2026-04-19T20:41:28.719Z
> **Policy:** Fail on [high, critical]

## Summary

| Severity | Count |
|---|---|
| 🔴 Critical | 0 |
| 🟠 High     | 47 |
| 🟡 Medium   | 7 |
| 🟢 Low      | 4 |
| **Total**   | **58** |

## OWASP Top 10 Coverage

| Category | Findings |
|---|---|
| A03:2021 — Injection | 44 |
| A06:2021 — Vulnerable and Outdated Components | 10 |
| A07:2021 — Identification and Authentication Failures | 2 |
| A05:2021 — Security Misconfiguration | 2 |

## Findings

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\content\scanner.js:188`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:99`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:144`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:177`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:178`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:208`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:216`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:228`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:231`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:279`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:284`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:322`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:333`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:335`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:348`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:351`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `extension\popup\popup.js:388`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — High-entropy credential-like value found

- **File:** `mobile\package-lock.json:6709`
- **Type:** secret
- **OWASP:** [A07:2021 Identification and Authentication Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)

**Description:** A long high-entropy string appears next to a secret-like variable name.

**Recommendation:** Replace the hardcoded value with an environment variable and rotate the credential.

**AI Fix Suggestion** _(📋 Static)_

Replace the hardcoded value with an environment variable and rotate the credential.

```
const token = process.env.API_TOKEN;
if (!token) throw new Error('Missing API_TOKEN env var');
```

**References:**
- https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/

---

### 🟠 `HIGH` — High-entropy credential-like value found

- **File:** `package-lock.json:3436`
- **Type:** secret
- **OWASP:** [A07:2021 Identification and Authentication Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)

**Description:** A long high-entropy string appears next to a secret-like variable name.

**Recommendation:** Replace the hardcoded value with an environment variable and rotate the credential.

**AI Fix Suggestion** _(📋 Static)_

Replace the hardcoded value with an environment variable and rotate the credential.

```
const token = process.env.API_TOKEN;
if (!token) throw new Error('Missing API_TOKEN env var');
```

**References:**
- https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\app.js:199`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\app.js:202`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\app.js:348`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\app.js:382`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\app.js:384`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\app.js:439`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\app.js:444`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\bulktools.js:86`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\bulktools.js:89`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\chains.js:71`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\chains.js:81`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\chains.js:112`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\converter.js:256`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\encrypt.js:211`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\encrypt.js:243`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\hdwallet.js:81`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\hdwallet.js:94`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\hdwallet.js:116`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\nav.js:98`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\nav.js:155`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\paperwallet.js:59`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\paperwallet.js:78`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\qrcode-page.js:95`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\qrcode-page.js:155`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\qrcode-page.js:165`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\qrcode-page.js:218`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Potential XSS sink detected

- **File:** `web\validator.js:425`
- **Type:** xss
- **OWASP:** [A03:2021 Injection](https://owasp.org/Top10/A03_2021-Injection/)

**Description:** Direct HTML sinks can enable script injection when content is not sanitized.

**Recommendation:** Sanitize untrusted content or use safer rendering APIs.

**AI Fix Suggestion** _(📋 Static)_

Sanitize untrusted content or use safer rendering APIs.

```
// Use DOMPurify or framework escaping instead of innerHTML
const safe = DOMPurify.sanitize(userInput);
element.textContent = safe;
```

**References:**
- https://owasp.org/Top10/A03_2021-Injection/

---

### 🟠 `HIGH` — Dependency vulnerability: xlsx

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 2 advisory item(s) detected for xlsx. Range: *.

**Recommendation:** Review xlsx manually and replace it with a maintained alternative if no safe upgrade exists.

**AI Fix Suggestion** _(📋 Static)_

Review xlsx manually and replace it with a maintained alternative if no safe upgrade exists.

```
// Review the finding, apply the recommendation, and re-run the scanner.
```

**References:**
- https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/

---

### 🟡 `MEDIUM` — Insecure HTTP endpoint hardcoded

- **File:** `web\circuit-bg.js:11`
- **Type:** misconfiguration
- **OWASP:** [A05:2021 Security Misconfiguration](https://owasp.org/Top10/A05_2021-Security_Misconfiguration/)

**Description:** Hardcoded non-TLS URL can leak data over plaintext transport.

**Recommendation:** Use HTTPS endpoints and enforce TLS for outbound calls.

**AI Fix Suggestion** _(📋 Static)_

Use HTTPS endpoints and enforce TLS for outbound calls.

```
app.use(cors({ origin: process.env.ALLOWED_ORIGIN?.split(',') ?? [] }));
```

**References:**
- https://owasp.org/Top10/A05_2021-Security_Misconfiguration/

---

### 🟡 `MEDIUM` — Insecure HTTP endpoint hardcoded

- **File:** `web\icons.js:16`
- **Type:** misconfiguration
- **OWASP:** [A05:2021 Security Misconfiguration](https://owasp.org/Top10/A05_2021-Security_Misconfiguration/)

**Description:** Hardcoded non-TLS URL can leak data over plaintext transport.

**Recommendation:** Use HTTPS endpoints and enforce TLS for outbound calls.

**AI Fix Suggestion** _(📋 Static)_

Use HTTPS endpoints and enforce TLS for outbound calls.

```
app.use(cors({ origin: process.env.ALLOWED_ORIGIN?.split(',') ?? [] }));
```

**References:**
- https://owasp.org/Top10/A05_2021-Security_Misconfiguration/

---

### 🟡 `MEDIUM` — Dependency vulnerability: axios

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 2 advisory item(s) detected for axios. Range: 1.0.0 - 1.14.0.

**Recommendation:** Upgrade axios to the patched version recommended by npm audit.

**AI Fix Suggestion** _(📋 Static)_

Upgrade axios to the patched version recommended by npm audit.

```
// Review the finding, apply the recommendation, and re-run the scanner.
```

**References:**
- https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/

---

### 🟡 `MEDIUM` — Dependency vulnerability: esbuild

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 1 advisory item(s) detected for esbuild. Range: <=0.24.2.

**Recommendation:** Upgrade esbuild to the patched version recommended by npm audit.

**AI Fix Suggestion** _(📋 Static)_

Upgrade esbuild to the patched version recommended by npm audit.

```
// Review the finding, apply the recommendation, and re-run the scanner.
```

**References:**
- https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/

---

### 🟡 `MEDIUM` — Dependency vulnerability: follow-redirects

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 1 advisory item(s) detected for follow-redirects. Range: <=1.15.11.

**Recommendation:** Upgrade follow-redirects to the patched version recommended by npm audit.

**AI Fix Suggestion** _(📋 Static)_

Upgrade follow-redirects to the patched version recommended by npm audit.

```
// Review the finding, apply the recommendation, and re-run the scanner.
```

**References:**
- https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/

---

### 🟡 `MEDIUM` — Dependency vulnerability: tronweb

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 1 advisory item(s) detected for tronweb. Range: 5.3.5 || >=6.0.3.

**Recommendation:** Upgrade tronweb to the patched version recommended by npm audit.

**AI Fix Suggestion** _(📋 Static)_

Upgrade tronweb to the patched version recommended by npm audit.

```
// Review the finding, apply the recommendation, and re-run the scanner.
```

**References:**
- https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/

---

### 🟡 `MEDIUM` — Dependency vulnerability: vite

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 2 advisory item(s) detected for vite. Range: <=6.4.1.

**Recommendation:** Upgrade vite to the patched version recommended by npm audit.

**AI Fix Suggestion** _(📋 Static)_

Upgrade vite to the patched version recommended by npm audit.

```
// Review the finding, apply the recommendation, and re-run the scanner.
```

**References:**
- https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/

---

### 🟢 `LOW` — Dependency vulnerability: @cosmjs/amino

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 1 advisory item(s) detected for @cosmjs/amino. Range: <=0.33.1.

**Recommendation:** Upgrade @cosmjs/amino to the patched version recommended by npm audit.

**AI Fix Suggestion** _(📋 Static)_

Upgrade @cosmjs/amino to the patched version recommended by npm audit.

```
// Review the finding, apply the recommendation, and re-run the scanner.
```

**References:**
- https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/

---

### 🟢 `LOW` — Dependency vulnerability: @cosmjs/crypto

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 1 advisory item(s) detected for @cosmjs/crypto. Range: <=0.33.1.

**Recommendation:** Upgrade @cosmjs/crypto to the patched version recommended by npm audit.

**AI Fix Suggestion** _(📋 Static)_

Upgrade @cosmjs/crypto to the patched version recommended by npm audit.

```
// Review the finding, apply the recommendation, and re-run the scanner.
```

**References:**
- https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/

---

### 🟢 `LOW` — Dependency vulnerability: @cosmjs/proto-signing

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 2 advisory item(s) detected for @cosmjs/proto-signing. Range: 0.25.0-alpha.0 - 0.33.1.

**Recommendation:** Upgrade @cosmjs/proto-signing to the patched version recommended by npm audit.

**AI Fix Suggestion** _(📋 Static)_

Upgrade @cosmjs/proto-signing to the patched version recommended by npm audit.

```
// Review the finding, apply the recommendation, and re-run the scanner.
```

**References:**
- https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/

---

### 🟢 `LOW` — Dependency vulnerability: elliptic

- **File:** `package.json:1`
- **Type:** dependency
- **OWASP:** [A06:2021 Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/)

**Description:** 1 advisory item(s) detected for elliptic. Range: *.

**Recommendation:** Upgrade elliptic to the patched version recommended by npm audit.

**AI Fix Suggestion** _(📋 Static)_

Upgrade elliptic to the patched version recommended by npm audit.

```
// Review the finding, apply the recommendation, and re-run the scanner.
```

**References:**
- https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/

---

_Report generated by [OWASP Guardrail](https://github.com/xinnxz/hackowasp8) v2.0_