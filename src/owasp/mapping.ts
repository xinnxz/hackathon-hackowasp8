import type { Finding, OwaspMapping } from "../types";

const owaspCatalog: Record<string, OwaspMapping> = {
  A01: {
    id: "A01:2021",
    name: "Broken Access Control",
    description: "Restrictions on authenticated users are not properly enforced.",
    link: "https://owasp.org/Top10/A01_2021-Broken_Access_Control/",
  },
  A02: {
    id: "A02:2021",
    name: "Cryptographic Failures",
    description: "Sensitive data is exposed due to weak or missing cryptography.",
    link: "https://owasp.org/Top10/A02_2021-Cryptographic_Failures/",
  },
  A03: {
    id: "A03:2021",
    name: "Injection",
    description: "Untrusted input is interpreted as code or command.",
    link: "https://owasp.org/Top10/A03_2021-Injection/",
  },
  A05: {
    id: "A05:2021",
    name: "Security Misconfiguration",
    description: "Configuration defaults and insecure options expand attack surface.",
    link: "https://owasp.org/Top10/A05_2021-Security_Misconfiguration/",
  },
  A06: {
    id: "A06:2021",
    name: "Vulnerable and Outdated Components",
    description: "Known-vulnerable dependencies are used in production code.",
    link: "https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/",
  },
  A07: {
    id: "A07:2021",
    name: "Identification and Authentication Failures",
    description: "Authentication or credential handling is weak and exploitable.",
    link: "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/",
  },
  A10: {
    id: "A10:2021",
    name: "Server-Side Request Forgery",
    description: "Server-side URL fetches are controllable by untrusted input.",
    link: "https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/",
  },
};

export function mapFindingToOwasp(finding: Finding): OwaspMapping | undefined {
  if (finding.type === "dependency") {
    return owaspCatalog.A06;
  }
  if (finding.type === "access-control") {
    return owaspCatalog.A01;
  }
  if (finding.type === "injection" || finding.type === "xss" || /sql|eval|command/i.test(finding.title)) {
    return owaspCatalog.A03;
  }
  if (finding.type === "ssrf" || /ssrf|server-side request/i.test(finding.title)) {
    return owaspCatalog.A10;
  }
  if (finding.type === "crypto") {
    return owaspCatalog.A02;
  }
  if (finding.type === "secret" || /token|password|credential|key/i.test(finding.title)) {
    return owaspCatalog.A07;
  }
  if (finding.type === "misconfiguration" || /cors|headers|debug|http/i.test(finding.title)) {
    return owaspCatalog.A05;
  }
  return undefined;
}
