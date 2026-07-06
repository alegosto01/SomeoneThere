# Graph Report - HouseCheck  (2026-07-06)

## Corpus Check
- 74 files · ~31,044 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 583 nodes · 582 edges · 61 communities (53 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6b46d980`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_HOUSECHECK_AGENT_SETUP_GUIDE|HOUSECHECK_AGENT_SETUP_GUIDE.md]]
- [[_COMMUNITY_compress.py|compress.py]]
- [[_COMMUNITY_validate.py|validate.py]]
- [[_COMMUNITY_README|README.md]]
- [[_COMMUNITY_Phase 1 GitHub Issues|Phase 1 GitHub Issues]]
- [[_COMMUNITY_Problem Finder Report|Problem Finder Report]]
- [[_COMMUNITY_Product Requirements Document — HouseCheck MVP|Product Requirements Document — HouseCheck MVP]]
- [[_COMMUNITY_Caveman Help|Caveman Help]]
- [[_COMMUNITY_SKILL|SKILL.md]]
- [[_COMMUNITY_HouseCheck MVP Scope|HouseCheck MVP Scope]]
- [[_COMMUNITY_HouseCheck|HouseCheck]]
- [[_COMMUNITY_HouseCheck agent instructions|HouseCheck agent instructions]]
- [[_COMMUNITY_Caveman Compress|Caveman Compress]]
- [[_COMMUNITY_SKILL|SKILL.md]]
- [[_COMMUNITY_HouseCheck Agent Operating System|HouseCheck Agent Operating System]]
- [[_COMMUNITY_Verification Report Template|Verification Report Template]]
- [[_COMMUNITY_HouseCheck Product Principles|HouseCheck Product Principles]]
- [[_COMMUNITY_caveman-commit|caveman-commit]]
- [[_COMMUNITY_caveman-review|caveman-review]]
- [[_COMMUNITY_HouseCheck Agent Routing|HouseCheck Agent Routing]]
- [[_COMMUNITY_Market Research Plan|Market Research Plan]]
- [[_COMMUNITY_Verifier Safety SOP Draft|Verifier Safety SOP Draft]]
- [[_COMMUNITY_Technical Architecture|Technical Architecture]]
- [[_COMMUNITY_Decision Judge Review|Decision Judge Review]]
- [[_COMMUNITY_Problem Solver Response|Problem Solver Response]]
- [[_COMMUNITY_HouseCheck Business Model|HouseCheck Business Model]]
- [[_COMMUNITY_Landing Page Outline|Landing Page Outline]]
- [[_COMMUNITY_feature|feature.md]]
- [[_COMMUNITY_risk|risk.md]]
- [[_COMMUNITY_validation-experiment|validation-experiment.md]]
- [[_COMMUNITY_Codex Risk Review|Codex Risk Review]]
- [[_COMMUNITY_HouseCheck Claude instructions|HouseCheck Claude instructions]]
- [[_COMMUNITY_Business Model|Business Model]]
- [[_COMMUNITY_HouseCheck Legal Assumptions|HouseCheck Legal Assumptions]]
- [[_COMMUNITY_caveman-stats|caveman-stats]]
- [[_COMMUNITY_Giant Model Results|Giant Model Results]]
- [[_COMMUNITY_Landlord Data Legitimate-Interest Assessment Draft|Landlord Data Legitimate-Interest Assessment Draft]]
- [[_COMMUNITY_Legal Questions for Spanish Lawyer|Legal Questions for Spanish Lawyer]]
- [[_COMMUNITY_Refund Policy Draft|Refund Policy Draft]]
- [[_COMMUNITY_Verifier Checklist|Verifier Checklist]]
- [[_COMMUNITY_Ponytail|Ponytail]]
- [[_COMMUNITY_Telegram Policy|Telegram Policy]]
- [[_COMMUNITY_HouseCheck Competitor Map|HouseCheck Competitor Map]]
- [[_COMMUNITY_market-research|market-research.md]]
- [[_COMMUNITY_Check Live Runs|Check Live Runs]]
- [[_COMMUNITY_Legal and Risk Notes|Legal and Risk Notes]]
- [[_COMMUNITY_Competitor Matrix|Competitor Matrix]]
- [[_COMMUNITY_User Stories|User Stories]]
- [[_COMMUNITY_mvp-task|mvp-task.md]]
- [[_COMMUNITY_Codex Implementation Task Prompt|Codex Implementation Task Prompt]]
- [[_COMMUNITY_Codex Docs Update Task Prompt|Codex Docs Update Task Prompt]]
- [[_COMMUNITY_Codex Refactor Task Prompt|Codex Refactor Task Prompt]]
- [[_COMMUNITY_adversarial-loop.sh|adversarial-loop.sh]]
- [[_COMMUNITY___init__.py|__init__.py]]
- [[_COMMUNITY_decision-log|decision-log.md]]
- [[_COMMUNITY_risk-register|risk-register.md]]
- [[_COMMUNITY_decision-judge-run|decision-judge-run.md]]
- [[_COMMUNITY_full-agent-loop|full-agent-loop.md]]
- [[_COMMUNITY_problem-finder-run|problem-finder-run.md]]
- [[_COMMUNITY_problem-solver-run|problem-solver-run.md]]

## God Nodes (most connected - your core abstractions)
1. `validate()` - 14 edges
2. `compress_file()` - 12 edges
3. `HouseCheck` - 12 edges
4. `HouseCheck agent instructions` - 11 edges
5. `Verification Report Template` - 11 edges
6. `HouseCheck Product Principles` - 11 edges
7. `Verifier Safety SOP Draft` - 10 edges
8. `detect_file_type()` - 9 edges
9. `Problem Finder Report` - 9 edges
10. `HouseCheck Business Model` - 9 edges

## Surprising Connections (you probably didn't know these)
- `compress_file()` --calls--> `validate()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/compress.py → .agents/skills/caveman-compress/scripts/validate.py
- `benchmark_pair()` --calls--> `validate()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/benchmark.py → .agents/skills/caveman-compress/scripts/validate.py
- `main()` --calls--> `backup_dir_for()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/cli.py → .agents/skills/caveman-compress/scripts/compress.py
- `main()` --calls--> `compress_file()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/cli.py → .agents/skills/caveman-compress/scripts/compress.py
- `main()` --calls--> `detect_file_type()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/cli.py → .agents/skills/caveman-compress/scripts/detect.py

## Import Cycles
- None detected.

## Communities (61 total, 8 thin omitted)

### Community 0 - "HOUSECHECK_AGENT_SETUP_GUIDE.md"
Cohesion: 0.05
Nodes (38): 0. Instructions to GLM 5.2, 10. Optional Codex GitHub workflow template, 11. Update README, 12. Validation commands, 13. Final response GLM should give Alessandro, 14. First Claude Code command Alessandro should run, 15. First Codex command Alessandro should run, 16. Important principle (+30 more)

### Community 1 - "compress.py"
Cohesion: 0.12
Nodes (27): main(), print_usage(), backup_dir_for(), build_compress_prompt(), build_fix_prompt(), call_claude(), compress_file(), is_sensitive_path() (+19 more)

### Community 2 - "validate.py"
Cohesion: 0.16
Nodes (22): benchmark_pair(), count_tokens(), main(), print_table(), Path, count_bullets(), extract_code_blocks(), extract_headings() (+14 more)

### Community 3 - "README.md"
Cohesion: 0.09
Nodes (20): Before / After, Benchmarks, How It Work, <img src="../../docs/assets/dancing-rock.svg" width="20" height="20" alt="rock"/> Caveman (285 tokens), Install, 📄 Original (706 tokens), Part of Caveman, Security (+12 more)

### Community 4 - "Phase 1 GitHub Issues"
Cohesion: 0.11
Nodes (17): 10. Decide MVP stack, 11. Create initial database schema, 12. Create basic project skeleton, 1. Complete competitor research matrix, 2. Interview 10 target users, 3. Test willingness to pay, 4. Create landing page copy, 5. Build intake form (+9 more)

### Community 5 - "Problem Finder Report"
Cohesion: 0.11
Nodes (17): 1. Legal and regulatory risk, 2. Operational risk, 3. Financial risk, 4. Technical risk, 5. Trust and safety, 6. Product and market risk, Executive summary, Hidden assumptions (+9 more)

### Community 6 - "Product Requirements Document — HouseCheck MVP"
Cohesion: 0.13
Nodes (14): Admin side, Basic Check, Core MVP features, MVP non-goals, MVP solution, Premium Scam Check, Problem, Product Requirements Document — HouseCheck MVP (+6 more)

### Community 7 - "Caveman Help"
Cohesion: 0.14
Nodes (12): caveman-help, Example output, How to invoke, See also, What it does, Caveman Help, Configure Default Mode, Deactivate (+4 more)

### Community 8 - "SKILL.md"
Cohesion: 0.15
Nodes (11): cavecrew, Example chaining, How to invoke, See also, What it does, Auto-clarity (inherited), Chaining patterns, Output contracts (+3 more)

### Community 9 - "HouseCheck MVP Scope"
Cohesion: 0.15
Nodes (12): 1. Basic listing risk review, 2. Exterior/address verification, 3. Permission-first viewing attendance, 4. Verification report, Core MVP promise, HouseCheck MVP Scope, MVP goal, MVP services (+4 more)

### Community 10 - "HouseCheck"
Cohesion: 0.15
Nodes (12): Agent workflow, Current status, First milestone, HouseCheck, Initial positioning, Key hypothesis, Legal assumptions, MVP principle (+4 more)

### Community 11 - "HouseCheck agent instructions"
Cohesion: 0.17
Nodes (11): Before implementing any feature, Core product principle, Engineering preferences, graphify, graphify (reference), HouseCheck agent instructions, MANDATORY: Graphify First Rule, MVP boundaries (+3 more)

### Community 12 - "Caveman Compress"
Cohesion: 0.17
Nodes (11): Boundaries, Caveman Compress, Compress, Compression Rules, Pattern, Preserve EXACTLY (never modify), Preserve Structure, Process (+3 more)

### Community 13 - "SKILL.md"
Cohesion: 0.17
Nodes (10): caveman, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Intensity (+2 more)

### Community 14 - "HouseCheck Agent Operating System"
Cohesion: 0.17
Nodes (11): Agent roles, Codex, Decision Judge, Definition of done for an agent task, Do not automate these decisions fully, Goal, HouseCheck Agent Operating System, Problem Finder (+3 more)

### Community 15 - "Verification Report Template"
Cohesion: 0.17
Nodes (11): Address and building check, Disclaimer, Evidence attached, Final notes for user, Interior / viewing check, Landlord / agent interaction, Red flag checklist, Report metadata (+3 more)

### Community 16 - "HouseCheck Product Principles"
Cohesion: 0.17
Nodes (11): 10. Lawyer review for serious legal questions, 1. Evidence, not guarantees, 2. Permission-first, 3. Manual before automated, 4. Madrid-first, 5. Smallest useful step, 6. Make risks explicit, 7. Honest language (+3 more)

### Community 17 - "caveman-commit"
Cohesion: 0.18
Nodes (9): caveman-commit, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Examples (+1 more)

### Community 18 - "caveman-review"
Cohesion: 0.18
Nodes (9): caveman-review, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Examples (+1 more)

### Community 19 - "HouseCheck Agent Routing"
Cohesion: 0.18
Nodes (10): 1. The roles and their source files, 2. How to choose, per session, 3.1 Claude Code, 3.2 Codex CLI, 3.3 GLM (or any other LLM runtime), 3. Run commands, 4. Automated loop (Finder → Solver → Judge in one run), 5. Recommended fallback order when Claude tokens run out (+2 more)

### Community 20 - "Market Research Plan"
Cohesion: 0.18
Nodes (10): 1. Direct competitors, 2. Task marketplace substitutes, 3. Verified rental marketplaces, 4. Madrid/local substitutes, Evidence sources, Main question, Market Research Plan, Output format (+2 more)

### Community 21 - "Verifier Safety SOP Draft"
Cohesion: 0.18
Nodes (10): Abort rules, Before accepting a job, Check-in cadence, Emergency escalation, Exterior checks, Insurance to confirm, Interior or viewing attendance, Launch gate (+2 more)

### Community 22 - "Technical Architecture"
Cohesion: 0.18
Nodes (10): Core data models, Future marketplace features, Phase 0 — No-code/manual validation, Phase 1 — Lightweight custom MVP, Recommendation, Technical Architecture, User, VerificationJob (+2 more)

### Community 23 - "Decision Judge Review"
Cohesion: 0.20
Nodes (9): Decision Judge Review, Decision: <title>, Decisions, Features to avoid for now, Legal-review checklist, MVP-safe path, Questions for Alessandro, Summary (+1 more)

### Community 24 - "Problem Solver Response"
Cohesion: 0.20
Nodes (9): Implementation tasks, MVP-safe path, Problem Solver Response, Problem: <title>, Recommended changes to repo docs, Risk-by-risk mitigation plan, Rules, Summary (+1 more)

### Community 25 - "HouseCheck Business Model"
Cohesion: 0.20
Nodes (9): Acquisition channels for MVP, Cost structure (MVP, manual), Customer segments, HouseCheck Business Model, Key assumptions to validate, Out of scope for the business model in MVP, Revenue model, Revisit when (+1 more)

### Community 26 - "Landing Page Outline"
Cohesion: 0.20
Nodes (9): Call to action, Hero, How it works, Landing Page Outline, Packages, Problem, Solution, Trust message (+1 more)

### Community 27 - "feature.md"
Cohesion: 0.22
Nodes (8): Abuse cases, Acceptance criteria, MVP scope, Out of scope, Problem, Proposed solution, Risks, Target user

### Community 28 - "risk.md"
Cohesion: 0.22
Nodes (8): Acceptance criteria, Category, MVP decision, Probability, Proposed mitigation, Risk, Severity, Why it matters

### Community 29 - "validation-experiment.md"
Cohesion: 0.22
Nodes (8): Decision, Failure metric, Hypothesis, Method, Results, Script or procedure, Success metric, Target segment

### Community 30 - "Codex Risk Review"
Cohesion: 0.22
Nodes (8): Blocking issues, Codex Risk Review, Codex Risk Review Prompt, Non-blocking issues, Questions for Alessandro, Required doc updates, Suggested fixes, Summary

### Community 31 - "HouseCheck Claude instructions"
Cohesion: 0.25
Nodes (7): Choosing the model / runtime, Development philosophy, graphify, HouseCheck Claude instructions, Main workflow, Product language, Project summary

### Community 32 - "Business Model"
Cohesion: 0.25
Nodes (7): Best first channel hypotheses, Business Model, Cost structure, Initial business model, Key risks, Marketplace unit economics hypothesis, Suggested validation path

### Community 33 - "HouseCheck Legal Assumptions"
Cohesion: 0.25
Nodes (7): Broker risk, Core assumption, HouseCheck Legal Assumptions, Liability risk, Permission-first access, Photos and videos, Required lawyer review

### Community 34 - "caveman-stats"
Cohesion: 0.29
Nodes (5): caveman-stats, Example output, How to invoke, See also, What it does

### Community 35 - "Giant Model Results"
Cohesion: 0.29
Nodes (6): Common Data Locations, Finish With Verification, Giant Model Results, Rules, Useful Existing Commands, Workflow

### Community 36 - "Landlord Data Legitimate-Interest Assessment Draft"
Cohesion: 0.29
Nodes (6): Balancing safeguards, Landlord Data Legitimate-Interest Assessment Draft, Necessity test, Open lawyer questions, Processing purpose, Proposed lawful basis to review

### Community 37 - "Legal Questions for Spanish Lawyer"
Cohesion: 0.29
Nodes (6): Business model, Legal Questions for Spanish Lawyer, Liability and consumer protection, Privacy and GDPR, Property access, Verifiers

### Community 38 - "Refund Policy Draft"
Cohesion: 0.29
Nodes (6): Delivery evidence, Full refund cases, No refund after delivery, Partial or case-by-case refund cases, Payment timing, Refund Policy Draft

### Community 39 - "Verifier Checklist"
Cohesion: 0.29
Nodes (6): After visit, Before accepting a job, Before the visit, During exterior check, During interior viewing, Verifier Checklist

### Community 40 - "Ponytail"
Cohesion: 0.33
Nodes (5): Checks, Intensity, Not Lazy About, Ponytail, Rules

### Community 41 - "Telegram Policy"
Cohesion: 0.33
Nodes (5): Current Policy, Finish With Verification, Rules, Telegram Policy, Workflow

### Community 42 - "HouseCheck Competitor Map"
Cohesion: 0.33
Nodes (5): Competitors, HouseCheck Competitor Map, HouseCheck positioning, Revisit when, Why this matters

### Community 43 - "market-research.md"
Cohesion: 0.33
Nodes (5): Conclusion, Questions to answer, Research target, Sources, Why this matters

### Community 44 - "Check Live Runs"
Cohesion: 0.40
Nodes (4): Check Live Runs, Finish With Verification, Rules, Workflow

### Community 45 - "Legal and Risk Notes"
Cohesion: 0.40
Nodes (4): Important legal/risk areas, Legal and Risk Notes, MVP disclaimer draft, Safer language

### Community 46 - "Competitor Matrix"
Cohesion: 0.40
Nodes (4): Competitor Matrix, Competitor table, Metrics to collect for each competitor, Working conclusion

### Community 47 - "User Stories"
Cohesion: 0.40
Nodes (4): Admin / operator, Tenant / customer, User Stories, Verifier

### Community 48 - "mvp-task.md"
Cohesion: 0.40
Nodes (4): Acceptance criteria, Context, Goal, Notes

### Community 49 - "Codex Implementation Task Prompt"
Cohesion: 0.40
Nodes (4): Codex Implementation Task Prompt, Required checks, Rules, Task

### Community 50 - "Codex Docs Update Task Prompt"
Cohesion: 0.50
Nodes (3): Codex Docs Update Task Prompt, Goal, Rules

### Community 51 - "Codex Refactor Task Prompt"
Cohesion: 0.50
Nodes (3): Codex Refactor Task Prompt, Goal, Rules

## Knowledge Gaps
- **388 isolated node(s):** `What it does`, `How to invoke`, `Example chaining`, `See also`, `When to use cavecrew vs alternatives` (+383 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `validate()` connect `validate.py` to `compress.py`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `compress_file()` connect `compress.py` to `validate.py`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `Caveman compress scripts.  This package provides tools to compress natural langu`, `Split YAML frontmatter from body. Returns (frontmatter, body).      Memory files`, `Resolve the out-of-tree backup directory for a given source file.      Backups m` to the rest of the system?**
  _400 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HOUSECHECK_AGENT_SETUP_GUIDE.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `compress.py` be split into smaller, more focused modules?**
  _Cohesion score 0.12258064516129032 - nodes in this community are weakly interconnected._
- **Should `README.md` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Phase 1 GitHub Issues` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._