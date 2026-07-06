# HouseCheck Risk Register

This document tracks legal, technical, financial, operational, marketplace, trust, and product risks.

| ID | Risk | Category | Severity | Probability | Mitigation | Status | Owner |
|---|---|---|---|---|---|---|---|
| R001 | Service could be interpreted as real estate brokerage | Legal | Critical | Medium | Avoid negotiation, lease advice, deposit handling, and property recommendations. Provide factual verification only. Get Spanish legal review. | Open | Alessandro |
| R002 | Verifier enters property without valid permission | Legal / Safety | Critical | Low | Permission-first policy. Written confirmation before interior visit. Exterior-only fallback. | Open | Alessandro |
| R003 | User believes HouseCheck guarantees a scam-free rental | Liability | High | High | Use evidence/risk-indicator language. No guarantee wording. Strong terms and report disclaimers. | Open | Alessandro |
| R004 | Verifier colludes with scammer | Trust | High | Medium | ID verification, random audits, geotagged evidence, reviewer QA, no direct deposit handling. | Open | Alessandro |
| R005 | Unit economics do not work | Financial | High | Medium | Test manual paid pilots before building marketplace. Track CAC, verifier cost, support time, refund rate. | Open | Alessandro |
| R006 | GDPR/privacy violation through photos, videos, or documents | Legal / Privacy | Critical | Medium | Minimize data collection. Define retention. Avoid sensitive docs in MVP. Get legal review. | Open | Alessandro |
| R007 | Landlord refuses access or photos | Operations | Medium | High | Offer exterior-only and live-call alternatives. Make report show access limitations clearly. | Open | Alessandro |
| R008 | Scammer uses HouseCheck to appear legitimate | Fraud | High | Medium | Never provide public badges in MVP. Reports are private to customer. QA review required. | Open | Alessandro |
| R009 | Verifier safety incident | Safety | Critical | Low | Safety protocol, no confrontation, location sharing, no high-risk visits, emergency process. | Open | Alessandro |
| R010 | Low willingness to pay | Market | High | Medium | Run paid pilots before building marketplace. Test price points. | Open | Alessandro |
