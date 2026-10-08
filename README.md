# MemGuard

**Zero-Trust Memory Security Layer for Autonomous AI Agents**

*Because what AI remembers determines what AI does.*

---

## 🏆 Hackathon MVP Submission

MemGuard is a deterministic security middleware built to intercept, analyze, and quarantine malicious memories *before* they can poison an AI agent's long-term context. It solves the critical vulnerability of LLM gullibility when parsing untrusted external documents, emails, and web pages.

### 🚀 Key Features Built in this MVP
1. **Zero-Trust Write Guard:** Every incoming memory candidate is intercepted and evaluated.
2. **Provenance Tracking:** We record exactly where information originated to prevent "Agent Laundering" (where an AI summarizes an attack and saves it as its own trusted thought).
3. **Deterministic Conflict Engine:** Resolves contradictions between incoming untrusted data and verified ground truth (e.g., catching malicious financial routing redirects).
4. **Retrieval Guard:** Ensures that any data marked as `quarantined` or `review` is physically excluded from the AI's context window.

---

## 💻 Running the Demo Locally

### Prerequisites
- Node.js v20+

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Reset and seed the SQLite database with the base "Verified" state
npx prisma db push --force-reset
npx tsx scripts/seed.ts

# 3. Start the development server
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎬 Hackathon Live Demo Script (3 Minutes)

Follow this exact flow for the most impactful judge presentation:

### Step 1: The Setup (Security Center - `/`)
1. Open the **Security Center** dashboard.
2. Explain the premise: *"AI Agents are increasingly given long-term memory to act autonomously. But what happens if an attacker feeds the AI a malicious document that rewrites its memory? What it remembers determines what it does."*
3. Point to the **Verified Memories** metric (1). Explain that we have pre-seeded a verified ground-truth memory: *"ACME Corporation verified payment account is ****4421"*.

### Step 2: The Attack (Attack Lab - `/attack-lab`)
1. Navigate to the **Attack Lab**.
2. Select the **"Attack: Financial Redirect"** scenario. 
3. *Narrative:* "An attacker sends a compromised invoice PDF to the Agent. The PDF contains instructions to update the ACME payment account to 9758. A standard LLM would read this and happily overwrite its memory."
4. Click **Execute MemGuard Pipeline**.
5. Watch the real-time evaluation. Point out:
   - **Origin Trust** is low (45/100) because it's an uploaded document.
   - **Sensitivity** is CRITICAL because it detects financial routing.
   - **Conflict Detector** catches the contradiction against the verified ****4421 account.
   - **Decision:** QUARANTINE.

### Step 3: The Investigation (Quarantine - `/quarantine`)
1. Navigate to the **Quarantine Zone**.
2. Show the intercepted memory. Explain: *"Because MemGuard is deterministic, it doesn't rely on the LLM to figure out it's being tricked. The memory is trapped here, requiring human verification."*

### Step 4: The Audit Trail (Security Events - `/events`)
1. Navigate to the **Security Audit Log**.
2. Show the immutable ledger of the intervention, proving compliance and traceability.

### Step 5: The Visualization (Memory Graph - `/graph`)
1. Navigate to the **Memory Graph**.
2. Visually demonstrate the topology. Point out the green verified node and the red quarantined node, connected by a conflict edge. 
3. *Closing Statement:* "By decoupling memory security from the LLM's own inference, MemGuard ensures autonomous agents remain safe, reliable, and uncompromised. Because what AI remembers determines what AI does."

---

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS, shadcn/ui, Lucide Icons
- **Database:** SQLite + Prisma ORM (v7) + LibSQL
- **Visualization:** React Flow (`@xyflow/react`)
- **Testing:** Vitest
