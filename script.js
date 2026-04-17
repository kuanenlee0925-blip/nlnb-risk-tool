const STORAGE_KEY = "nlnb-risk-assessment-state";

const questions = [
  {
    id: "b1",
    category: "Business",
    text: "How often do customers contact the bank to report they cannot access their accounts or complete a transaction?",
    systems: ["NorthGo", "ATM/FastCash", "CMS"],
    owner: "Customer Operations",
  },
  {
    id: "b2",
    category: "Business",
    text: "If the bank's online banking system went offline for several hours, how prepared is the bank to keep customers informed and redirect them to alternatives?",
    systems: ["NorthGo", "CMS", "VendorConcentration"],
    owner: "Operations Team",
  },
  {
    id: "b3",
    category: "Business",
    text: "How confident is leadership that the bank could compete for a new customer against a digital-only bank like Chime or SoFi today?",
    systems: ["NorthGo", "CMS", "FIN", "Competition"],
    owner: "Executive Leadership",
  },
  {
    id: "b4",
    category: "Business",
    text: "How often do vendor contracts get reviewed to make sure the bank is getting fair pricing and service terms?",
    systems: ["NorthGo", "PeoplePay", "WeHelp", "VendorConcentration"],
    owner: "Vendor Management",
  },
  {
    id: "b5",
    category: "Business",
    text: "How dependent is the bank on any single vendor to keep daily operations running?",
    systems: ["NorthGo", "PeoplePay", "WeHelp", "VendorConcentration", "FourthParty"],
    owner: "Vendor Management",
  },
  {
    id: "b6",
    category: "Business",
    text: "How well does the bank currently track customer satisfaction after a technology outage or service disruption?",
    systems: ["CMS", "WeHelp", "Competition"],
    owner: "Customer Operations",
  },
  {
    id: "b7",
    category: "Business",
    text: "How clearly defined is the bank's plan for modernizing its technology over the next three to five years?",
    systems: ["FIN", "BODPS", "CMS", "LegacyOS"],
    owner: "CIO / CTO",
  },
  {
    id: "b8",
    category: "Business",
    text: "How often does the bank lose customers or accounts to a competitor, and does the bank know why?",
    systems: ["CMS", "NorthGo", "Competition"],
    owner: "Executive Leadership",
  },
  {
    id: "o1",
    category: "Operational",
    text: "If a critical system went down right now, how quickly could the bank restore full service to customers?",
    systems: ["FIN", "BODPS", "NetworkInfra"],
    owner: "IT Infrastructure",
  },
  {
    id: "o2",
    category: "Operational",
    text: "How regularly are employees trained on what to do during a system outage or security incident?",
    systems: ["FIN", "BODPS", "CMS", "PeoplePay", "TalentRisk"],
    owner: "Operations Team",
  },
  {
    id: "o3",
    category: "Operational",
    text: "How confident are branch managers that they could continue serving customers if the online banking system became unavailable?",
    systems: ["NorthGo", "ATM/FastCash", "VendorConcentration"],
    owner: "Branch Operations",
  },
  {
    id: "o4",
    category: "Operational",
    text: "How often does the bank test its backup and recovery systems to confirm they actually work?",
    systems: ["FIN", "BODPS", "iReport", "NetworkInfra"],
    owner: "IT Infrastructure",
  },
  {
    id: "o5",
    category: "Operational",
    text: "How clearly does each team know who is responsible when a technology problem occurs?",
    systems: ["FIN", "BODPS", "CMS", "TalentRisk"],
    owner: "Operations Team",
  },
  {
    id: "o6",
    category: "Operational",
    text: "How well does the bank currently monitor its third-party vendors to ensure they are meeting their service commitments?",
    systems: ["NorthGo", "PeoplePay", "WeHelp", "FourthParty"],
    owner: "Vendor Management",
  },
  {
    id: "o7",
    category: "Operational",
    text: "How often do manual errors in day-to-day processes cause delays, incorrect records, or customer complaints?",
    systems: ["BODPS", "iReport", "CMS", "TalentRisk"],
    owner: "Finance Operations",
  },
  {
    id: "o8",
    category: "Operational",
    text: "When a vendor experiences an outage, how quickly does the bank find out and how quickly can it respond?",
    systems: ["NorthGo", "PeoplePay", "WeHelp", "FourthParty"],
    owner: "Vendor Management",
  },
  {
    id: "o9",
    category: "Operational",
    text: "How prepared is the bank to onboard and train new employees as experienced staff members retire?",
    systems: ["FIN", "BODPS", "CMS", "TalentRisk"],
    owner: "Human Resources",
  },
  {
    id: "t1",
    category: "Technical",
    text: "How confident is the IT team that the bank's systems are protected against the latest cybersecurity threats?",
    systems: ["FIN", "BODPS", "BeSecure", "LegacyOS"],
    owner: "Security Operations",
  },
  {
    id: "t2",
    category: "Technical",
    text: "How often does the bank apply security updates and patches to its systems, and does anything get skipped or delayed?",
    systems: ["FIN", "BODPS", "CMS", "LegacyOS"],
    owner: "IT Infrastructure",
  },
  {
    id: "t3",
    category: "Technical",
    text: "How well does customer data stay protected when it moves between the bank's internal systems and outside vendors?",
    systems: ["CMS", "PeoplePay", "WeHelp", "FourthParty"],
    owner: "Security Operations",
  },
  {
    id: "t4",
    category: "Technical",
    text: "If the bank wanted to adopt a new technology today, how easily could it connect with the bank's existing systems?",
    systems: ["FIN", "BODPS", "NorthGo", "LegacyOS"],
    owner: "Architecture Team",
  },
  {
    id: "t5",
    category: "Technical",
    text: "How regularly does the bank review which outside companies have access to customer data, and what they are doing with it?",
    systems: ["CMS", "PeoplePay", "WeHelp", "NorthGo", "FourthParty"],
    owner: "Vendor Management",
  },
  {
    id: "t6",
    category: "Technical",
    text: "How prepared is the bank to prove to a regulator that its financial reports and transaction records are accurate and complete?",
    systems: ["iReport", "BODPS", "BeSecure", "Compliance"],
    owner: "Chief Risk Officer",
  },
  {
    id: "t7",
    category: "Technical",
    text: "How confident is leadership that any automated decision the bank makes, such as flagging fraud or approving a loan, could be explained clearly to a customer or regulator?",
    systems: ["FIN", "CMS", "BeSecure", "AIReadiness"],
    owner: "Chief Risk Officer",
  },
  {
    id: "t8",
    category: "Technical",
    text: "How would the bank rate the overall reliability of its technology infrastructure on a normal business day, with no active incidents?",
    systems: ["FIN", "BODPS", "CMS", "ATM/FastCash", "NetworkInfra"],
    owner: "IT Infrastructure",
  },
];

const systemDefinitions = {
  FIN: {
    riskId: "R-01",
    riskName: "FIN system single point of failure",
    category: "Technical",
    owner: "IT Infrastructure",
    impact: 5,
    baselikelihood: 4,
    justification: "FIN is the intake point for every transaction at NLNB. A failure halts ATM processing, online banking, and all downstream reporting simultaneously. NLNB already experienced this in September 2022, resulting in a $100M loss, proving it is a demonstrated vulnerability and not a theoretical one.",
    businessRecommendation: "Elevate FIN resilience to board-level priority. Allocate dedicated capital in the next budget cycle to eliminate single-point-of-failure dependency before the next modernization sprint.",
    technicalRecommendation: "Deploy active-active redundancy for FIN with automated failover. Implement circuit-breaker patterns on all downstream integrations and conduct quarterly failover drills.",
  },
  TalentRisk: {
    riskId: "R-02",
    riskName: "Staff training and experience gap",
    category: "Operational",
    owner: "Human Resources",
    impact: 4,
    baselikelihood: 5,
    justification: "This is the highest-probability risk in the register because it is actively occurring now. Senior engineers are being poached by tech firms, and veteran staff are approaching retirement. An undertrained workforce directly increases the likelihood of every other risk on this list materializing.",
    businessRecommendation: "Launch the NLNB Tech-Academy initiative and partner with Penn State IST for talent pipeline recruitment. Establish knowledge-transfer programs pairing senior engineers with junior hires before retirements.",
    technicalRecommendation: "Document all undocumented FIN and BODPS operational procedures. Implement role-based training tracks covering AI tooling, incident escalation, and legacy system maintenance.",
  },
  LegacyOS: {
    riskId: "R-03",
    riskName: "Windows Server 2010 end-of-life OS",
    category: "Technical",
    owner: "IT Infrastructure",
    impact: 4,
    baselikelihood: 4,
    justification: "FIN, BODPS, BeSecure, and WeHelp all run on Windows Server 2010, which Microsoft no longer patches. Every day without migration is another day of unaddressed vulnerabilities. This directly conflicts with the bank's AI and cloud modernization goals and creates persistent exposure that cannot be closed without a migration.",
    businessRecommendation: "Establish a formal legacy OS retirement roadmap with executive sign-off. Budget for migration to supported server environments as part of the five-year cloud modernization plan.",
    technicalRecommendation: "Apply compensating controls immediately including network segmentation and enhanced monitoring. Begin phased migration to Windows Server 2022 or Linux equivalents, starting with lowest-risk systems.",
  },
  VendorConcentration: {
    riskId: "R-04",
    riskName: "Vendor concentration and lock-in",
    category: "Vendor",
    owner: "SaaS & Vendor Mgmt",
    impact: 4,
    baselikelihood: 4,
    justification: "NorthGo handles internet banking, PeoplePay handles payroll for over 10,000 employees, and WeHelp manages all customer service records. Losing any one of them disrupts a core function with no internal fallback. The deeper these vendors are embedded, the more leverage they gain over contract renegotiations.",
    businessRecommendation: "Diversify critical vendor dependencies. Negotiate multi-vendor SLAs that include financial penalties for downtime and require 90-day exit transition support clauses in all contracts.",
    technicalRecommendation: "Build vendor-agnostic API abstraction layers so core systems can switch providers with minimal re-integration. Maintain and test contingency runbooks for each vendor outage scenario.",
  },
  Competition: {
    riskId: "R-05",
    riskName: "Competitive displacement by fintech and Big Four",
    category: "Business",
    owner: "CEO / Strategy",
    impact: 4,
    baselikelihood: 4,
    justification: "JPMorgan, Bank of America, Wells Fargo, and fintechs like Chime and SoFi offer AI-driven, mobile-first experiences NLNB currently cannot match. These competitors already have mature platforms deployed, and every NLNB outage accelerates the decision for customers to switch permanently.",
    businessRecommendation: "Accelerate the NorthGo modernization roadmap. Invest in personalized digital banking features targeting the 18-35 demographic. Track NPS scores monthly against competitor benchmarks.",
    technicalRecommendation: "Adopt Open Banking API frameworks to enable third-party app integrations. Prioritize mobile-first UX upgrades to NorthGo and implement 99.9% uptime SLAs for all customer-facing systems.",
  },
  BODPS: {
    riskId: "R-06",
    riskName: "BODPS financial integrity failure",
    category: "Operational",
    owner: "Finance Operations",
    impact: 5,
    baselikelihood: 3,
    justification: "BODPS transforms all raw transaction data into finalized records and feeds iReport for regulatory filings. Corruption or failure propagates errors through all compliance reporting and reconciliation. Its dependency on FIN data quality and aging infrastructure keeps likelihood meaningfully elevated.",
    businessRecommendation: "Classify BODPS as a Tier-1 critical system requiring dedicated operational oversight and an executive-level continuity sponsor within the CFO organization.",
    technicalRecommendation: "Implement data validation checksums between FIN, BODPS, and iReport. Deploy automated batch-job monitoring with immediate alerting and conduct bi-annual end-to-end reconciliation testing.",
  },
  CMS: {
    riskId: "R-07",
    riskName: "CMS customer data breach",
    category: "Business",
    owner: "Customer Operations",
    impact: 5,
    baselikelihood: 3,
    justification: "CMS holds Social Security numbers, routing numbers, spending patterns, and behavioral profiles for the entire customer base. A breach would trigger FDIC regulatory action, class-action litigation, and lasting reputational damage. It runs on Windows Server 2010 and connects to offshore vendor environments, creating exposure existing controls do not fully close.",
    businessRecommendation: "Treat CMS data protection as equivalent to vault security. Conduct annual third-party penetration testing and establish a cyber incident response retainer with a specialized firm.",
    technicalRecommendation: "Enforce field-level encryption for all PII in CMS. Implement strict role-based access controls, privileged access management, and real-time anomaly detection on all CMS database queries.",
  },
  Compliance: {
    riskId: "R-08",
    riskName: "FDIC / AML / KYC regulatory non-compliance",
    category: "Regulatory",
    owner: "Chief Risk Officer",
    impact: 5,
    baselikelihood: 3,
    justification: "Non-compliance with federal banking regulations carries consequences including financial penalties, loss of FDIC insurance, and potential loss of charter. The transition to cloud environments and AI-driven decisions introduces new compliance gaps that current tools were not designed to cover.",
    businessRecommendation: "Establish a standing Regulatory Risk Committee with CRO sponsorship. Engage external legal counsel to conduct a full compliance gap assessment against current FDIC, FinCEN, and OCC requirements.",
    technicalRecommendation: "Enhance iReport pipeline integrity from BODPS with automated AML category code validation. Integrate real-time transaction monitoring thresholds and produce audit-ready evidence packages quarterly.",
  },
  FourthParty: {
    riskId: "R-09",
    riskName: "Fourth-party vendor visibility gap",
    category: "Vendor",
    owner: "SaaS & Vendor Mgmt",
    impact: 4,
    baselikelihood: 3,
    justification: "NLNB vendors rely on their own subcontractors and cloud hosting providers that NLNB knows nothing about. Sensitive customer data flows through these hidden layers. This type of cascading vendor failure is increasingly common across the banking industry, and NLNB currently has no formal program to monitor it.",
    businessRecommendation: "Require all primary vendors to disclose fourth-party subcontractors and cloud providers as a contract condition. Establish a vendor risk scorecard reviewed quarterly by the CIO and Chief Risk Officer.",
    technicalRecommendation: "Implement a Third-Party Risk Management platform to continuously monitor vendor health, security certifications, and subcontractor changes. Request SOC 2 Type II reports from all critical vendors annually.",
  },
  AIReadiness: {
    riskId: "R-10",
    riskName: "AI and explainable AI regulatory readiness",
    category: "Regulatory",
    owner: "CIO / Compliance",
    impact: 4,
    baselikelihood: 3,
    justification: "As NLNB moves AI into production for fraud detection and credit decisions, federal regulators require human-readable explanations for every automated outcome. NLNB is still in early AI deployment stages, giving it a narrow window to implement proper XAI frameworks before enforcement becomes a real risk.",
    businessRecommendation: "Define an AI governance policy and assign an AI Risk Officer role. Engage regulators proactively through pre-approval discussions before deploying AI in any credit or fraud decision workflow.",
    technicalRecommendation: "Implement Explainable AI frameworks such as SHAP or LIME for all production models. Create model cards and audit trails for each AI decision and conduct bias testing before deploying any model that affects customers.",
  },
  iReport: {
    riskId: "R-11",
    riskName: "DORA continuous compliance gap",
    category: "Regulatory",
    owner: "Chief Risk Officer",
    impact: 4,
    baselikelihood: 3,
    justification: "DORA requires continuous operational resilience rather than periodic reporting, which is a meaningful shift from how NLNB currently operates. The bank has existing compliance infrastructure, but it was built for a different regulatory model and has not been updated to meet DORA continuous monitoring requirements.",
    businessRecommendation: "Assign DORA compliance ownership to the Chief Risk Officer with board-level reporting. Develop a DORA roadmap with quarterly milestones and tie vendor contracts to DORA-aligned SLA requirements.",
    technicalRecommendation: "Deploy continuous compliance monitoring tooling to automate evidence collection for DORA ICT risk management, incident reporting, and digital resilience testing requirements.",
  },
  NorthGo: {
    riskId: "R-12",
    riskName: "Cloud-legacy hybrid instability and NorthGo outage risk",
    category: "Vendor",
    owner: "Digital Products",
    impact: 3,
    baselikelihood: 4,
    justification: "The hybrid model mixing on-premises Windows Server 2010 with cloud-hosted SaaS creates constant compatibility problems. NorthGo already went down in December 2022. A vendor-pushed update can silently break FIN or BODPS compatibility, and NLNB has no internal control over update timing.",
    businessRecommendation: "Renegotiate NorthGo SLA to include financial penalties for unplanned downtime. Establish a Change Advisory Board that must approve all vendor updates before they touch production environments connected to FIN or BODPS.",
    technicalRecommendation: "Implement real-time availability monitoring for NorthGo with automated alerting. Develop integration test suites that validate FIN and BODPS compatibility after any vendor update is applied.",
  },
  NetworkInfra: {
    riskId: "R-14",
    riskName: "Network infrastructure single-layer vulnerability",
    category: "Technical",
    owner: "IT Infrastructure",
    impact: 4,
    baselikelihood: 3,
    justification: "All of NLNB's applications share one router, firewall, and switch. A failure or targeted breach at that shared layer simultaneously takes down FIN, BODPS, CMS, and all vendor connections. Network infrastructure is generally stable, but the total lack of redundancy means there is no fallback if it fails.",
    businessRecommendation: "Present a network resilience investment case to the CFO and CIO demonstrating the cost of a full network outage versus the cost of redundant architecture. Prioritize in the next capital budget cycle.",
    technicalRecommendation: "Deploy redundant network paths with automated failover for Tier-1 systems. Implement network segmentation to isolate vendor traffic from internal banking systems and reduce blast radius of any breach.",
  },
  BeSecure: {
    riskId: "R-14b",
    riskName: "Cybersecurity monitoring gaps",
    category: "Technical",
    owner: "Security Operations",
    impact: 4,
    baselikelihood: 3,
    justification: "BeSecure scans internal networks and reports high-risk incidents, but it runs on Windows Server 2010 and was not designed to monitor AI workloads or cloud-hosted vendor environments. As the attack surface expands with hybrid-cloud adoption, the monitoring coverage gap grows.",
    businessRecommendation: "Use BeSecure outputs in executive risk reviews so cyber findings drive funding and remediation decisions faster. Budget for a next-generation SIEM solution as part of the modernization roadmap.",
    technicalRecommendation: "Integrate BeSecure findings into patching, alert triage, and control validation workflows. Expand monitoring coverage to include cloud-hosted vendor endpoints and AI model serving infrastructure.",
  },
  ATM_FastCash: {
    riskId: "R-13",
    riskName: "ATM/FastCash multi-platform instability",
    category: "Operational",
    owner: "Branch Operations",
    impact: 3,
    baselikelihood: 3,
    justification: "The FastCash ATM network must drive a single application across multiple hardware platforms from multiple vendors. Real-time data consistency between ATMs and FIN is difficult to guarantee, creating transaction log integrity risks particularly during peak usage periods.",
    businessRecommendation: "Establish branch-level outage communications and fallback service procedures to reduce customer disruption when ATM networks degrade.",
    technicalRecommendation: "Increase ATM monitoring frequency, implement transaction retry controls, and create recovery playbooks specifically for ATM service interruptions.",
  },
  PeoplePay: {
    riskId: "R-04b",
    riskName: "PeoplePay payroll dependency",
    category: "Vendor",
    owner: "Vendor Management",
    impact: 4,
    baselikelihood: 3,
    justification: "PeoplePay processes payroll for over 10,000 employees twice a month. A failure during a pay cycle would immediately affect every employee at NLNB and create legal exposure around delayed compensation. As a hosted external service, NLNB has no ability to self-recover from a vendor-side failure.",
    businessRecommendation: "Reduce overreliance on PeoplePay by evaluating contractual leverage, risk-sharing terms, and fallback payment options such as a secondary payroll processor.",
    technicalRecommendation: "Review payment pipeline controls and third-party dependencies. Implement resilience testing for PeoplePay transactions and maintain documented manual payroll procedures as a fallback.",
  },
  WeHelp: {
    riskId: "R-09b",
    riskName: "WeHelp offshore CRM exposure",
    category: "Vendor",
    owner: "Vendor Management",
    impact: 3,
    baselikelihood: 3,
    justification: "WeHelp is an offshore call center hosting NLNB's CRM and all customer inquiry records. Sensitive customer data stored here is subject to foreign jurisdiction data laws, creating regulatory complexity. Any breach or disruption at WeHelp directly degrades NLNB's customer service capability.",
    businessRecommendation: "Clarify service ownership and escalation expectations with WeHelp to reduce operational ambiguity during incidents. Review data sovereignty implications of storing customer records at an offshore location.",
    technicalRecommendation: "Track integration health, downstream dependencies, and support response metrics for WeHelp services. Enforce data residency controls and ensure all WeHelp data handling meets FDIC and OCC standards.",
  },
  Crypto: {
    riskId: "R-15",
    riskName: "Cryptocurrency integration operational risk",
    category: "Technical",
    owner: "Chief Risk Officer",
    impact: 5,
    baselikelihood: 2,
    justification: "Integrating crypto custody into Windows Server 2010 and AS400 infrastructure creates severe compatibility risk. AML and KYC enforcement on pseudonymous blockchain transactions is difficult to verify. A breach of a third-party crypto wallet results in permanent, irrecoverable financial loss, a risk profile that does not exist with traditional banking failures.",
    businessRecommendation: "Establish a Cryptocurrency Risk Committee before any crypto product launch. Require board-level approval and an independent security audit as preconditions for offering any digital asset custody services.",
    technicalRecommendation: "Isolate all crypto infrastructure from legacy banking systems using strict network segmentation. Partner only with custodians holding SOC 2 Type II certification and maintain zero commingling of crypto and fiat systems.",
  },
};

const systemKeyMap = { "ATM/FastCash": "ATM_FastCash" };

const categoryDescriptions = {
  Business: "Strategic, customer, revenue, and modernization exposure.",
  Operational: "Day-to-day continuity, training, service delivery, and recovery readiness.",
  Technical: "Infrastructure, cybersecurity, compliance, and integration resilience.",
};

const state = { answers: {}, generatedRisks: [], lastUpdated: null, hasRun: false };

const form = document.querySelector("#assessmentForm");
const categorySummary = document.querySelector("#categorySummary");
const heatMap = document.querySelector("#heatMap");
const recommendationsOutput = document.querySelector("#recommendationsOutput");
const runAssessmentBtn = document.querySelector("#runAssessmentBtn");
const resetAssessmentBtn = document.querySelector("#resetAssessmentBtn");

function resolveSystemKey(name) { return systemKeyMap[name] || name; }

function createRangeOptions(question) {
  if (question?.responseOptions) {
    return question.responseOptions.map((o) => `<option value="${o.value}">${o.label}</option>`).join("");
  }
  return [1, 2, 3, 4, 5]
    .map((v) => `<option value="${v}">${v} - ${["", "Low", "Guarded", "Moderate", "High", "Critical"][v]}</option>`)
    .join("");
}

function renderQuestions() {
  const groups = ["Business", "Operational", "Technical"];
  form.innerHTML = groups.map((group) => {
    const gq = questions.filter((q) => q.category === group);
    return `
      <section class="question-group">
        <p class="eyebrow">${group}</p>
        <h3>${group} Risk</h3>
        <p>${categoryDescriptions[group]}</p>
        <div class="question-list">
          ${gq.map((question, index) => `
            <article class="question-card">
              <label for="${question.id}">${index + 1}. ${question.text}</label>
              <select id="${question.id}" name="${question.id}">${createRangeOptions(question)}</select>
              <p>Affects: ${question.systems.filter((s) => systemDefinitions[resolveSystemKey(s)]).join(", ")}</p>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }).join("");

  questions.forEach((question) => {
    const select = document.getElementById(question.id);
    select.value = state.answers[question.id] || "3";
    select.addEventListener("change", (event) => {
      state.answers[question.id] = Number(event.target.value);
      saveState();
    });
  });
}

function calculateGeneratedRisks() {
  const systemScores = {};
  Object.keys(systemDefinitions).forEach((system) => {
    systemScores[system] = { system, total: 0, count: 0, driverIds: [] };
  });

  questions.forEach((question) => {
    const answer = Number(state.answers[question.id] || 3);
    question.systems.forEach((rawSystem) => {
      const system = resolveSystemKey(rawSystem);
      const record = systemScores[system];
      if (!record) return;
      record.total += answer;
      record.count += 1;
      if (answer >= 4) record.driverIds.push(question.text);
    });
  });

  return Object.values(systemScores).map((record) => {
    const definition = systemDefinitions[record.system];
    const average = record.count ? record.total / record.count : 3;
    const answerBias = average - 3;
    const impact = Math.max(1, Math.min(5, definition.impact + (answerBias > 0.5 ? 1 : answerBias < -0.5 ? -1 : 0)));
    const likelihood = Math.max(1, Math.min(5, definition.baselikelihood + (record.driverIds.length >= 2 ? 1 : 0)));
    const score = Math.round(((impact * likelihood) / 25) * 100);
    return {
      id: `generated-${record.system}`,
      title: definition.riskName,
      systemKey: record.system,
      riskId: definition.riskId,
      owner: definition.owner,
      category: definition.category,
      impact,
      likelihood,
      score,
      rating: getRating(score),
      updatedAt: state.lastUpdated || new Date().toISOString(),
      explanation: definition.justification,
      businessRecommendation: definition.businessRecommendation,
      technicalRecommendation: definition.technicalRecommendation,
    };
  });
}

function getRating(score) {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

function getRatingClass(rating) { return rating.toLowerCase(); }

function runAssessment() {
  state.lastUpdated = new Date().toISOString();
  state.generatedRisks = calculateGeneratedRisks();
  state.hasRun = true;
  renderDashboard();
  saveState();
  const recSection = document.querySelector(".recommendations-panel");
  if (recSection) recSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getCategoryStats() {
  const grouped = { Business: [], Operational: [], Technical: [] };
  questions.forEach((q) => grouped[q.category].push(Number(state.answers[q.id] || 3)));
  return Object.entries(grouped).map(([category, values]) => {
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const score = Math.round((avg / 5) * 100);
    return { category, score, rating: getRating(score) };
  });
}

function renderCategorySummary() {
  const stats = getCategoryStats();
  categorySummary.innerHTML = stats.map((stat) => `
    <article class="summary-card">
      <h3>${stat.category}</h3>
      <div class="score-line">
        <span>${stat.score}/100</span>
        <span class="rating ${getRatingClass(stat.rating)}">${stat.rating}</span>
      </div>
      <div class="bar"><span style="width:${stat.score}%"></span></div>
    </article>
  `).join("");
  const overall = Math.round(stats.reduce((s, i) => s + i.score, 0) / stats.length);
  document.querySelector("#overallRating").textContent = `${getRating(overall)} (${overall}/100)`;
}

function renderHeatMap() {
  const cellCounts = {};
  for (let i = 1; i <= 5; i++) for (let l = 1; l <= 5; l++) cellCounts[`${i}-${l}`] = [];
  state.generatedRisks.forEach((risk) => cellCounts[`${risk.impact}-${risk.likelihood}`].push(risk.riskId || risk.title));

  heatMap.innerHTML = Array.from({ length: 25 }, (_, index) => {
    const likelihood = Math.floor(index / 5) + 1;
    const impact = (index % 5) + 1;
    const weight = impact * likelihood;
    const items = cellCounts[`${impact}-${likelihood}`];
    return `
      <article class="heat-cell" style="background:${getHeatColor(weight)}" title="${items.join(", ") || "No risks"}">
        <span>Impact ${impact} • Likelihood ${likelihood}</span>
        <strong>${items.length}</strong>
        <span>${items.slice(0, 2).join(", ") || "No mapped risks"}</span>
      </article>
    `;
  }).join("");

  document.querySelector("#heatMapTimestamp").textContent = state.lastUpdated
    ? `Updated ${formatDate(state.lastUpdated)}` : "Awaiting assessment run.";
}

function renderRecommendations() {
  if (!state.hasRun) {
    recommendationsOutput.innerHTML = `
      <div class="rec-placeholder">
        <div class="rec-placeholder-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        </div>
        <p class="rec-placeholder-title">No results yet</p>
        <p class="rec-placeholder-sub">Complete the diagnostic questions above and click <strong>Run Assessment</strong> to generate prioritized business and technical recommendations for each risk area.</p>
      </div>
    `;
    return;
  }

  const topRisks = [...state.generatedRisks].sort((a, b) => b.score - a.score).slice(0, 8);

  recommendationsOutput.innerHTML = `
    <p class="rec-results-meta">Showing top ${topRisks.length} risks by score. Last run ${formatDate(state.lastUpdated)}.</p>
    <div class="rec-grid">
      ${topRisks.map((risk) => `
        <article class="recommendation-card">
          <div class="recommendation-meta">
            <span class="pill">${risk.riskId}</span>
            <span class="rating ${getRatingClass(risk.rating)}">${risk.rating}</span>
            <span class="pill">${risk.category}</span>
          </div>
          <h3>${risk.title}</h3>
          <p>${risk.explanation}</p>
          <div class="rec-section">
            <p class="recommendation-section-title">Business recommendation</p>
            <p class="recommendation-body">${risk.businessRecommendation}</p>
          </div>
          <div class="rec-section">
            <p class="recommendation-section-title">Technical recommendation</p>
            <p class="recommendation-body">${risk.technicalRecommendation}</p>
          </div>
          <div class="rec-score-row">
            <span>Impact ${risk.impact}/5</span>
            <span>Likelihood ${risk.likelihood}/5</span>
            <span>Score ${risk.score}/100</span>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function getHeatColor(weight) {
  if (weight >= 20) return "#8b1e1e";
  if (weight >= 15) return "#b04e28";
  if (weight >= 10) return "#d89000";
  if (weight >= 6) return "#528e66";
  return "#2f6f73";
}

function updateSnapshot() {
  const criticalCount = state.generatedRisks.filter((r) => r.rating === "Critical").length;
  document.querySelector("#criticalCount").textContent = String(criticalCount);
  document.querySelector("#lastUpdated").textContent = state.lastUpdated ? formatDate(state.lastUpdated) : "Not yet run";
}

function renderDashboard() {
  renderCategorySummary();
  renderHeatMap();
  renderRecommendations();
  updateSnapshot();
}

function formatDate(isoString) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(isoString));
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      questions.forEach((q) => { state.answers[q.id] = 3; });
      state.generatedRisks = calculateGeneratedRisks();
      state.lastUpdated = new Date().toISOString();
      return;
    }
    const parsed = JSON.parse(saved);
    state.answers = parsed.answers || {};
    state.generatedRisks = parsed.generatedRisks || [];
    state.lastUpdated = parsed.lastUpdated || null;
    state.hasRun = parsed.hasRun || false;
    questions.forEach((q) => { if (!state.answers[q.id]) state.answers[q.id] = 3; });
  } catch (e) {
    questions.forEach((q) => { state.answers[q.id] = 3; });
  }
}

function attachEvents() {
  runAssessmentBtn.addEventListener("click", runAssessment);
  resetAssessmentBtn.addEventListener("click", () => {
    questions.forEach((q) => { state.answers[q.id] = 3; });
    state.hasRun = false;
    renderQuestions();
    state.generatedRisks = calculateGeneratedRisks();
    renderDashboard();
    saveState();
  });
}

loadState();
renderQuestions();
if (!state.generatedRisks.length) state.generatedRisks = calculateGeneratedRisks();
renderDashboard();
attachEvents();
