const STORAGE_KEY = "nlnb-risk-assessment-state";

const questions = [
  {
    id: "b1",
    category: "Business",
    text: "How exposed is NLNB to a FIN outage disrupting core transaction intake?",
    systems: ["FIN"],
    owner: "Executive Leadership",
  },
  {
    id: "b2",
    category: "Business",
    text: "How severe would the customer impact be if digital banking services were unavailable for several hours?",
    systems: ["CMS", "PeoplePay", "ATM/FastCash"],
    owner: "Operations Team",
  },
  {
    id: "b3",
    category: "Business",
    text: "How dependent is NLNB on BODPS for end-of-day reconciliation and reporting accuracy?",
    systems: ["BODPS", "iReport"],
    owner: "Finance Operations",
  },
  {
    id: "b4",
    category: "Business",
    text: "How much revenue or reputation damage would follow a recurring outage tied to NorthGo or PeoplePay?",
    systems: ["NorthGo", "PeoplePay"],
    owner: "Vendor Management",
  },
  {
    id: "b5",
    category: "Business",
    text: "How likely is vendor lock-in limiting NLNB's ability to negotiate favorable service terms?",
    systems: ["NorthGo", "PeoplePay", "WeHelp"],
    owner: "Vendor Management",
  },
  {
    id: "b6",
    category: "Business",
    text: "How well can branch operations continue if ATM/FastCash services become unstable?",
    systems: ["ATM/FastCash"],
    owner: "Branch Operations",
  },
  {
    id: "b7",
    category: "Business",
    text: "How exposed is NLNB to strategic delay because legacy systems slow cloud modernization?",
    systems: ["FIN", "BODPS", "CMS"],
    owner: "CIO / CTO",
  },
  {
    id: "b8",
    category: "Business",
    text: "How difficult would it be for executives to prioritize risk without a trusted scoring model?",
    systems: ["FIN", "BODPS", "CMS", "iReport"],
    owner: "Chief Risk Officer",
  },
  {
    id: "b9",
    category: "Business",
    text: "How vulnerable is NLNB to customer churn if technology incidents continue over the next year?",
    systems: ["CMS", "PeoplePay", "ATM/FastCash"],
    owner: "Executive Leadership",
  },
  {
    id: "b10",
    category: "Business",
    text: "How significant is competitive pressure from banks adopting AI and digital services faster than NLNB?",
    systems: ["FIN", "CMS", "NorthGo"],
    owner: "Strategy Office",
  },
  {
    id: "o1",
    category: "Operational",
    text: "How prepared is NLNB to recover quickly from a single point of failure in FIN?",
    systems: ["FIN"],
    owner: "IT Infrastructure",
  },
  {
    id: "o2",
    category: "Operational",
    text: "How strong is backup and continuity planning for BODPS processing jobs?",
    systems: ["BODPS"],
    owner: "IT Infrastructure",
  },
  {
    id: "o3",
    category: "Operational",
    text: "How consistently are operational teams trained on new workflows, incidents, and escalation paths?",
    systems: ["FIN", "BODPS", "CMS", "PeoplePay"],
    owner: "Operations Team",
  },
  {
    id: "o4",
    category: "Operational",
    text: "How reliable is coordination with third-party vendors during outages or degraded service events?",
    systems: ["NorthGo", "PeoplePay", "WeHelp"],
    owner: "Vendor Management",
  },
  {
    id: "o5",
    category: "Operational",
    text: "How visible are fourth-party dependencies underneath current banking vendors?",
    systems: ["NorthGo", "PeoplePay", "WeHelp"],
    owner: "Vendor Management",
  },
  {
    id: "o6",
    category: "Operational",
    text: "How well does NLNB track system health, incidents, and audit trails through iReport?",
    systems: ["iReport"],
    owner: "Chief Risk Officer",
  },
  {
    id: "o7",
    category: "Operational",
    text: "How stable is ATM/FastCash service across day-to-day branch operations?",
    systems: ["ATM/FastCash"],
    owner: "Branch Operations",
  },
  {
    id: "o8",
    category: "Operational",
    text: "How effective is user support and remediation workflow for customer-facing incidents in CMS?",
    systems: ["CMS", "WeHelp"],
    owner: "Customer Support",
  },
  {
    id: "o9",
    category: "Operational",
    text: "How quickly can BeSecure findings be turned into action by the bank's teams?",
    systems: ["BeSecure"],
    owner: "Security Operations",
  },
  {
    id: "o10",
    category: "Operational",
    text: "How at risk is NLNB from manual process errors affecting risk monitoring and issue response?",
    systems: ["FIN", "BODPS", "iReport"],
    owner: "Operations Team",
  },
  {
    id: "t1",
    category: "Technical",
    text: "How severe is the cybersecurity exposure created by legacy Windows 10 or unsupported infrastructure?",
    systems: ["FIN", "BODPS", "CMS"],
    owner: "Security Operations",
  },
  {
    id: "t2",
    category: "Technical",
    text: "How likely is a cloud architecture weakness causing outages, latency, or failover problems?",
    systems: ["FIN", "NorthGo", "PeoplePay"],
    owner: "Cloud Engineering",
  },
  {
    id: "t3",
    category: "Technical",
    text: "How strong are the controls protecting customer and transaction data across CMS and PeoplePay?",
    systems: ["CMS", "PeoplePay"],
    owner: "Security Operations",
  },
  {
    id: "t4",
    category: "Technical",
    text: "How well integrated are FIN, BODPS, and iReport for accurate, timely data exchange?",
    systems: ["FIN", "BODPS", "iReport"],
    owner: "Architecture Team",
  },
  {
    id: "t5",
    category: "Technical",
    text: "How exposed is NLNB to vendor API or SaaS compatibility failures involving NorthGo, WeHelp, or PeoplePay?",
    systems: ["NorthGo", "WeHelp", "PeoplePay"],
    owner: "Architecture Team",
  },
  {
    id: "t6",
    category: "Technical",
    text: "How mature are access controls, logging, and threat detection for privileged banking systems?",
    systems: ["FIN", "BODPS", "CMS", "BeSecure"],
    owner: "Security Operations",
  },
  {
    id: "t7",
    category: "Technical",
    text: "How ready is NLNB's environment to support AI-driven or agentic banking initiatives safely?",
    systems: ["FIN", "CMS", "BeSecure"],
    owner: "CIO / CTO",
  },
  {
    id: "t8",
    category: "Technical",
    text: "How prepared is NLNB for AML, KYC, FDIC, SEC, and OCC scrutiny across reporting and controls?",
    systems: ["iReport", "BeSecure", "CMS"],
    owner: "Chief Risk Officer",
  },
  {
    id: "t9",
    category: "Technical",
    text: "How likely is a compliance gap being discovered before an audit because evidence collection is weak?",
    systems: ["iReport", "BeSecure"],
    owner: "Compliance Team",
  },
  {
    id: "t10",
    category: "Technical",
    text: "How resilient is the network, storage, and server foundation supporting NLNB's major applications?",
    systems: ["FIN", "BODPS", "CMS", "ATM/FastCash"],
    owner: "IT Infrastructure",
  },
];

const systemDefinitions = {
  FIN: {
    category: "Technical",
    owner: "IT Infrastructure",
    businessRecommendation:
      "Prioritize FIN in executive continuity planning and allocate investment toward eliminating the single-point-of-failure dependency.",
    technicalRecommendation:
      "Implement redundancy, failover testing, and dependency mapping for FIN transaction intake and connected services.",
  },
  BODPS: {
    category: "Operational",
    owner: "Finance Operations",
    businessRecommendation:
      "Treat BODPS stability as a financial integrity issue and tighten oversight of reconciliation controls and process ownership.",
    technicalRecommendation:
      "Harden batch recovery, monitoring, and data validation between BODPS and upstream reporting systems.",
  },
  "NorthGo": {
    category: "Vendor",
    owner: "Vendor Management",
    businessRecommendation:
      "Review vendor concentration risk, renegotiate service expectations, and build contingency planning into leadership reporting.",
    technicalRecommendation:
      "Document API dependencies, resilience requirements, and fourth-party disclosures for NorthGo integrations.",
  },
  "ATM/FastCash": {
    category: "Operational",
    owner: "Branch Operations",
    businessRecommendation:
      "Establish branch-level outage communications and fallback service procedures to reduce customer disruption.",
    technicalRecommendation:
      "Increase ATM monitoring, transaction retry controls, and recovery playbooks for service interruptions.",
  },
  iReport: {
    category: "Regulatory",
    owner: "Chief Risk Officer",
    businessRecommendation:
      "Strengthen reporting governance so executives and regulators receive timely, defensible risk and audit information.",
    technicalRecommendation:
      "Improve audit log integrity, report validation, and evidence retention for compliance workflows.",
  },
  CMS: {
    category: "Business",
    owner: "Customer Operations",
    businessRecommendation:
      "Protect CMS reliability as a customer trust priority and align service improvements with retention goals.",
    technicalRecommendation:
      "Improve data protection, access management, and issue resolution flows tied to the customer platform.",
  },
  BeSecure: {
    category: "Technical",
    owner: "Security Operations",
    businessRecommendation:
      "Use BeSecure outputs in executive risk reviews so cyber findings drive funding and remediation decisions faster.",
    technicalRecommendation:
      "Integrate BeSecure findings into patching, alert triage, and control validation workflows.",
  },
  WeHelp: {
    category: "Vendor",
    owner: "Vendor Management",
    businessRecommendation:
      "Clarify service ownership and escalation expectations with WeHelp to reduce operational ambiguity during incidents.",
    technicalRecommendation:
      "Track integration health, downstream dependencies, and support response metrics for WeHelp services.",
  },
  PeoplePay: {
    category: "Vendor",
    owner: "Vendor Management",
    businessRecommendation:
      "Reduce overreliance on PeoplePay by evaluating contractual leverage, risk-sharing terms, and fallback payment options.",
    technicalRecommendation:
      "Review payment pipeline controls, third-party dependencies, and resilience testing for PeoplePay transactions.",
  },
};

const categoryDescriptions = {
  Business: "Strategic, customer, revenue, and modernization exposure.",
  Operational: "Day-to-day continuity, training, service delivery, and recovery readiness.",
  Technical: "Infrastructure, cybersecurity, compliance, and integration resilience.",
};

const state = {
  answers: {},
  generatedRisks: [],
  customRisks: [],
  lastUpdated: null,
};

const form = document.querySelector("#assessmentForm");
const registryBody = document.querySelector("#registryBody");
const categorySummary = document.querySelector("#categorySummary");
const heatMap = document.querySelector("#heatMap");
const customRiskForm = document.querySelector("#customRiskForm");
const runAssessmentBtn = document.querySelector("#runAssessmentBtn");
const resetAssessmentBtn = document.querySelector("#resetAssessmentBtn");

function createRangeOptions() {
  return [1, 2, 3, 4, 5]
    .map(
      (value) =>
        `<option value="${value}">${value} - ${[
          "",
          "Low",
          "Guarded",
          "Moderate",
          "High",
          "Critical",
        ][value]}</option>`
    )
    .join("");
}

function renderQuestions() {
  const groups = ["Business", "Operational", "Technical"];
  form.innerHTML = groups
    .map((group) => {
      const groupQuestions = questions.filter((question) => question.category === group);
      return `
        <section class="question-group">
          <p class="eyebrow">${group}</p>
          <h3>${group} Risk</h3>
          <p>${categoryDescriptions[group]}</p>
          <div class="question-list">
            ${groupQuestions
              .map(
                (question, index) => `
                  <article class="question-card">
                    <label for="${question.id}">${index + 1}. ${question.text}</label>
                    <select id="${question.id}" name="${question.id}">
                      ${createRangeOptions()}
                    </select>
                    <p>Affects: ${question.systems.join(", ")}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");

  questions.forEach((question) => {
    const select = document.getElementById(question.id);
    select.value = state.answers[question.id] || "3";
    select.addEventListener("change", (event) => {
      state.answers[question.id] = Number(event.target.value);
      saveState();
    });
  });
}

function buildImpactExplanation(name, impact, likelihood, score, drivers) {
  return `${name} scored ${score}/100 because the assessment indicates impact ${impact}/5 and likelihood ${likelihood}/5. Primary drivers: ${drivers.join(", ")}.`;
}

function calculateGeneratedRisks() {
  const systemScores = {};

  Object.keys(systemDefinitions).forEach((system) => {
    systemScores[system] = {
      system,
      total: 0,
      count: 0,
      driverIds: [],
    };
  });

  questions.forEach((question) => {
    const answer = Number(state.answers[question.id] || 3);
    question.systems.forEach((system) => {
      const record = systemScores[system];
      record.total += answer;
      record.count += 1;
      if (answer >= 4) {
        record.driverIds.push(question.text);
      }
    });
  });

  return Object.values(systemScores).map((record) => {
    const average = record.count ? record.total / record.count : 0;
    const impact = Math.max(1, Math.min(5, Math.round(average + 0.2)));
    const likelihood = Math.max(
      1,
      Math.min(5, Math.round(average + (record.driverIds.length >= 2 ? 0.4 : 0)))
    );
    const score = Math.round(((impact * likelihood) / 25) * 100);
    const definition = systemDefinitions[record.system];
    const rating = getRating(score);
    return {
      id: `generated-${record.system}`,
      title: record.system,
      owner: definition.owner,
      category: definition.category,
      impact,
      likelihood,
      score,
      rating,
      updatedAt: state.lastUpdated || new Date().toISOString(),
      explanation: buildImpactExplanation(
        record.system,
        impact,
        likelihood,
        score,
        record.driverIds.length ? record.driverIds.slice(0, 3) : ["baseline risk posture"]
      ),
      businessRecommendation: definition.businessRecommendation,
      technicalRecommendation: definition.technicalRecommendation,
      source: "generated",
    };
  });
}

function getRating(score) {
  if (score >= 80) {
    return "Critical";
  }
  if (score >= 60) {
    return "High";
  }
  if (score >= 35) {
    return "Medium";
  }
  return "Low";
}

function getRatingClass(rating) {
  return rating.toLowerCase();
}

function runAssessment() {
  state.lastUpdated = new Date().toISOString();
  state.generatedRisks = calculateGeneratedRisks();
  renderDashboard();
  saveState();
}

function getCategoryStats() {
  const grouped = {
    Business: [],
    Operational: [],
    Technical: [],
  };

  questions.forEach((question) => {
    grouped[question.category].push(Number(state.answers[question.id] || 3));
  });

  return Object.entries(grouped).map(([category, values]) => {
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    const score = Math.round((average / 5) * 100);
    return {
      category,
      score,
      rating: getRating(score),
    };
  });
}

function renderCategorySummary() {
  const stats = getCategoryStats();
  categorySummary.innerHTML = stats
    .map(
      (stat) => `
        <article class="summary-card">
          <h3>${stat.category}</h3>
          <div class="score-line">
            <span>${stat.score}/100</span>
            <span class="rating ${getRatingClass(stat.rating)}">${stat.rating}</span>
          </div>
          <div class="bar"><span style="width:${stat.score}%"></span></div>
        </article>
      `
    )
    .join("");

  const overall = Math.round(
    stats.reduce((sum, item) => sum + item.score, 0) / stats.length
  );
  document.querySelector("#overallRating").textContent = `${getRating(overall)} (${overall}/100)`;
}

function renderHeatMap() {
  const allRisks = [...state.generatedRisks, ...state.customRisks];
  const cellCounts = {};

  for (let impact = 1; impact <= 5; impact += 1) {
    for (let likelihood = 1; likelihood <= 5; likelihood += 1) {
      cellCounts[`${impact}-${likelihood}`] = [];
    }
  }

  allRisks.forEach((risk) => {
    cellCounts[`${risk.impact}-${risk.likelihood}`].push(risk.title);
  });

  heatMap.innerHTML = Array.from({ length: 25 }, (_, index) => {
    const likelihood = Math.floor(index / 5) + 1;
    const impact = (index % 5) + 1;
    const weight = impact * likelihood;
    const items = cellCounts[`${impact}-${likelihood}`];
    return `
      <article
        class="heat-cell"
        style="background:${getHeatColor(weight)}"
        title="${items.join(", ") || "No risks in this cell"}"
      >
        <span>Impact ${impact} • Likelihood ${likelihood}</span>
        <strong>${items.length}</strong>
        <span>${items.slice(0, 2).join(", ") || "No mapped risks"}</span>
      </article>
    `;
  }).join("");

  document.querySelector("#heatMapTimestamp").textContent = state.lastUpdated
    ? `Updated ${formatDate(state.lastUpdated)}`
    : "Awaiting assessment run.";
}

function getHeatColor(weight) {
  if (weight >= 20) return "#8b1e1e";
  if (weight >= 15) return "#b04e28";
  if (weight >= 10) return "#d89000";
  if (weight >= 6) return "#528e66";
  return "#2f6f73";
}

function renderRegistry() {
  const allRisks = [...state.generatedRisks, ...state.customRisks].sort(
    (a, b) => b.score - a.score
  );

  registryBody.innerHTML = allRisks
    .map(
      (risk) => `
        <tr>
          <td><strong>${risk.title}</strong><small>${risk.source === "generated" ? "Assessment-generated" : "Custom entry"}</small></td>
          <td>${risk.owner}</td>
          <td>${risk.category}</td>
          <td>${risk.impact}/5</td>
          <td>${risk.likelihood}/5</td>
          <td>${risk.score}/100</td>
          <td><span class="rating ${getRatingClass(risk.rating)}">${risk.rating}</span></td>
          <td>${formatDate(risk.updatedAt)}</td>
          <td>${risk.explanation}</td>
          <td>${risk.businessRecommendation}</td>
          <td>${risk.technicalRecommendation}</td>
          <td>
            ${
              risk.source === "custom"
                ? `<button type="button" class="remove-button" data-id="${risk.id}">Remove</button>`
                : `<span class="pill">Protected</span>`
            }
          </td>
        </tr>
      `
    )
    .join("");

  document.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.customRisks = state.customRisks.filter((risk) => risk.id !== button.dataset.id);
      renderDashboard();
      saveState();
    });
  });

  const criticalCount = allRisks.filter((risk) => risk.rating === "Critical").length;
  document.querySelector("#criticalCount").textContent = String(criticalCount);
  document.querySelector("#registryCount").textContent = String(allRisks.length);
  document.querySelector("#lastUpdated").textContent = state.lastUpdated
    ? formatDate(state.lastUpdated)
    : "Not yet run";
}

function renderDashboard() {
  renderCategorySummary();
  renderHeatMap();
  renderRegistry();
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    questions.forEach((question) => {
      state.answers[question.id] = 3;
    });
    state.generatedRisks = calculateGeneratedRisks();
    state.lastUpdated = new Date().toISOString();
    return;
  }

  const parsed = JSON.parse(saved);
  state.answers = parsed.answers || {};
  state.generatedRisks = parsed.generatedRisks || [];
  state.customRisks = parsed.customRisks || [];
  state.lastUpdated = parsed.lastUpdated || new Date().toISOString();

  questions.forEach((question) => {
    if (!state.answers[question.id]) {
      state.answers[question.id] = 3;
    }
  });
}

function seedCustomRiskSelects() {
  ["impact", "likelihood"].forEach((fieldName) => {
    customRiskForm.elements[fieldName].innerHTML = createRangeOptions();
    customRiskForm.elements[fieldName].value = "3";
  });
}

function attachEvents() {
  runAssessmentBtn.addEventListener("click", runAssessment);

  resetAssessmentBtn.addEventListener("click", () => {
    questions.forEach((question) => {
      state.answers[question.id] = 3;
    });
    renderQuestions();
    runAssessment();
  });

  customRiskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(customRiskForm);
    const impact = Number(formData.get("impact"));
    const likelihood = Number(formData.get("likelihood"));
    const score = Math.round(((impact * likelihood) / 25) * 100);
    const risk = {
      id: `custom-${Date.now()}`,
      title: String(formData.get("title")),
      owner: String(formData.get("owner")),
      category: String(formData.get("category")),
      impact,
      likelihood,
      score,
      rating: getRating(score),
      updatedAt: new Date().toISOString(),
      explanation: String(formData.get("explanation")),
      businessRecommendation: String(formData.get("businessRecommendation")),
      technicalRecommendation: String(formData.get("technicalRecommendation")),
      source: "custom",
    };
    state.customRisks.unshift(risk);
    state.lastUpdated = new Date().toISOString();
    customRiskForm.reset();
    seedCustomRiskSelects();
    renderDashboard();
    saveState();
  });
}

loadState();
renderQuestions();
seedCustomRiskSelects();
if (!state.generatedRisks.length) {
  state.generatedRisks = calculateGeneratedRisks();
}
renderDashboard();
attachEvents();
