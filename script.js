import {
  supabase,
  hasSupabaseConfig,
  SUPABASE_TABLE,
} from "./supabase-client.js";

const STORAGE_KEY = "nlnb-risk-assessment-state";
const QUESTION_REQUESTS_KEY = "nlnb-question-requests";

const baseQuestions = [
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
    systems: ["NorthGo", "CMS"],
    owner: "Operations Team",
  },
  {
    id: "b3",
    category: "Business",
    text: "How confident is leadership that the bank could compete for a new customer against a digital-only bank like Chime or SoFi today?",
    systems: ["NorthGo", "CMS", "FIN"],
    owner: "Executive Leadership",
  },
  {
    id: "b4",
    category: "Business",
    text: "How often do vendor contracts get reviewed to make sure the bank is getting fair pricing and service terms?",
    systems: ["NorthGo", "PeoplePay", "WeHelp"],
    owner: "Vendor Management",
  },
  {
    id: "b5",
    category: "Business",
    text: "How dependent is the bank on any single vendor to keep daily operations running?",
    systems: ["NorthGo", "PeoplePay", "WeHelp", "ATM/FastCash"],
    owner: "Vendor Management",
  },
  {
    id: "b6",
    category: "Business",
    text: "How well does the bank currently track customer satisfaction after a technology outage or service disruption?",
    systems: ["CMS", "WeHelp"],
    owner: "Customer Operations",
  },
  {
    id: "b7",
    category: "Business",
    text: "How clearly defined is the bank's plan for modernizing its technology over the next three to five years?",
    systems: ["FIN", "BODPS", "CMS"],
    owner: "CIO / CTO",
  },
  {
    id: "b8",
    category: "Business",
    text: "How often does the bank lose customers or accounts to a competitor, and does the bank know why?",
    systems: ["CMS", "NorthGo"],
    owner: "Executive Leadership",
  },
  {
    id: "o1",
    category: "Operational",
    text: "If a critical system went down right now, how quickly could the bank restore full service to customers?",
    systems: ["FIN", "BODPS"],
    owner: "IT Infrastructure",
  },
  {
    id: "o2",
    category: "Operational",
    text: "How regularly are employees trained on what to do during a system outage or security incident?",
    systems: ["FIN", "BODPS", "CMS", "PeoplePay"],
    owner: "Operations Team",
  },
  {
    id: "o3",
    category: "Operational",
    text: "How confident are branch managers that they could continue serving customers if the online banking system became unavailable?",
    systems: ["NorthGo", "ATM/FastCash"],
    owner: "Branch Operations",
  },
  {
    id: "o4",
    category: "Operational",
    text: "How often does the bank test its backup and recovery systems to confirm they actually work?",
    systems: ["FIN", "BODPS", "iReport"],
    owner: "IT Infrastructure",
  },
  {
    id: "o5",
    category: "Operational",
    text: "How clearly does each team know who is responsible when a technology problem occurs?",
    systems: ["FIN", "BODPS", "CMS"],
    owner: "Operations Team",
  },
  {
    id: "o6",
    category: "Operational",
    text: "How well does the bank currently monitor its third-party vendors to ensure they are meeting their service commitments?",
    systems: ["NorthGo", "PeoplePay", "WeHelp"],
    owner: "Vendor Management",
  },
  {
    id: "o7",
    category: "Operational",
    text: "How often do manual errors in day-to-day processes cause delays, incorrect records, or customer complaints?",
    systems: ["BODPS", "iReport", "CMS"],
    owner: "Finance Operations",
  },
  {
    id: "o8",
    category: "Operational",
    text: "When a vendor experiences an outage, how quickly does the bank find out and how quickly can it respond?",
    systems: ["NorthGo", "PeoplePay", "WeHelp"],
    owner: "Vendor Management",
  },
  {
    id: "o9",
    category: "Operational",
    text: "How prepared is the bank to onboard and train new employees as experienced staff members retire?",
    systems: ["FIN", "BODPS", "CMS"],
    owner: "Human Resources",
  },
  {
    id: "t1",
    category: "Technical",
    text: "How confident is the IT team that the bank's systems are protected against the latest cybersecurity threats?",
    systems: ["FIN", "BODPS", "BeSecure"],
    owner: "Security Operations",
  },
  {
    id: "t2",
    category: "Technical",
    text: "How often does the bank apply security updates and patches to its systems, and does anything get skipped or delayed?",
    systems: ["FIN", "BODPS", "CMS"],
    owner: "IT Infrastructure",
  },
  {
    id: "t3",
    category: "Technical",
    text: "How well does customer data stay protected when it moves between the bank's internal systems and outside vendors?",
    systems: ["CMS", "PeoplePay", "WeHelp"],
    owner: "Security Operations",
  },
  {
    id: "t4",
    category: "Technical",
    text: "If the bank wanted to adopt a new technology today, how easily could it connect with the bank's existing systems?",
    systems: ["FIN", "BODPS", "NorthGo"],
    owner: "Architecture Team",
  },
  {
    id: "t5",
    category: "Technical",
    text: "How regularly does the bank review which outside companies have access to customer data, and what they are doing with it?",
    systems: ["CMS", "PeoplePay", "WeHelp", "NorthGo"],
    owner: "Vendor Management",
  },
  {
    id: "t6",
    category: "Technical",
    text: "How prepared is the bank to prove to a regulator that its financial reports and transaction records are accurate and complete?",
    systems: ["iReport", "BODPS", "BeSecure"],
    owner: "Chief Risk Officer",
  },
  {
    id: "t7",
    category: "Technical",
    text: "How confident is leadership that any automated decision the bank makes — such as flagging fraud or approving a loan — could be explained clearly to a customer or regulator?",
    systems: ["FIN", "CMS", "BeSecure"],
    owner: "Chief Risk Officer",
  },
  {
    id: "t8",
    category: "Technical",
    text: "How would the bank rate the overall reliability of its technology infrastructure on a normal business day, with no active incidents?",
    systems: ["FIN", "BODPS", "CMS", "ATM/FastCash"],
    owner: "IT Infrastructure",
  },
];

let questions = [...baseQuestions];

const systemDefinitions = {
  FIN: {
    category: "Technical",
    owner: "IT Infrastructure",
    businessRecommendation:
      "NLNB should back FIN resilience with a board-approved business continuity policy that mandates regular failover drills, sets a maximum downtime target of under five minutes, and reserves funding specifically for system resilience.",
    technicalRecommendation:
      "NLNB should design and implement a fully active-active FIN deployment across at least two geographically separate data centers so one node can immediately absorb traffic if the other fails.",
  },
  BODPS: {
    category: "Operational",
    owner: "Finance Operations",
    businessRecommendation:
      "NLNB should treat BODPS integrity as a top financial control issue because any corrupted downstream data can make regulatory reports and customer statements unreliable.",
    technicalRecommendation:
      "NLNB should add automated validation checks inside the BODPS pipeline and run nightly reconciliation jobs against raw FIN inputs, with immediate alerts when totals do not match.",
  },
  "NorthGo": {
    category: "Vendor",
    owner: "Vendor Management",
    businessRecommendation:
      "NLNB should reduce dependence on any single vendor by identifying backup providers, renegotiating contracts with stronger service protections, and maintaining a contingency plan for major vendor disruptions.",
    technicalRecommendation:
      "For NorthGo specifically, NLNB should require immediate outage notifications, periodic contract updates, access to service performance data, and a backup customer-facing site so account visibility continues during platform incidents.",
  },
  "ATM/FastCash": {
    category: "Operational",
    owner: "Branch Operations",
    businessRecommendation:
      "NLNB's board should require secondary network and service backups so branch operations can continue even when a primary ATM or supporting infrastructure layer fails.",
    technicalRecommendation:
      "NLNB should segment supporting networks with VLANs and redundant paths so ATM/FastCash disruptions stay contained and operations can recover without bringing down unrelated systems.",
  },
  iReport: {
    category: "Regulatory",
    owner: "Chief Risk Officer",
    businessRecommendation:
      "The Compliance Department and Chief Risk Officer should make continuous compliance monitoring a standing priority so NLNB stays ahead of FDIC, AML, KYC, and broader resilience obligations.",
    technicalRecommendation:
      "NLNB should upgrade iReport to support real-time suspicious activity flagging, stronger audit evidence capture, and API-based data ingestion from legacy systems and vendors into a continuous compliance dashboard.",
  },
  CMS: {
    category: "Business",
    owner: "Customer Operations",
    businessRecommendation:
      "NLNB should treat CMS security as a customer trust priority and enforce strict access so employees can only reach the customer records required for their role.",
    technicalRecommendation:
      "NLNB should encrypt customer data in CMS, enforce role-based access, monitor exfiltration attempts with DLP tools, and run penetration tests on CMS access points at least twice a year.",
  },
  BeSecure: {
    category: "Technical",
    owner: "Security Operations",
    businessRecommendation:
      "NLNB should establish a resilience and AI governance structure that reviews compliance and explainability metrics regularly so automated decisions remain defensible to regulators.",
    technicalRecommendation:
      "NLNB should use BeSecure in a continuous monitoring workflow that feeds alerts, control thresholds, and explainability evidence into escalation paths for incident response, recovery, and regulatory review.",
  },
  WeHelp: {
    category: "Vendor",
    owner: "Vendor Management",
    businessRecommendation:
      "NLNB should require WeHelp and similar vendors to fully disclose subcontractors and cloud providers so the bank is not blindsided by hidden supply-chain dependencies.",
    technicalRecommendation:
      "NLNB should add a vendor risk monitoring platform that continuously tracks WeHelp's security posture, downstream partners, and service health so the IT team gets earlier warning when something goes wrong.",
  },
  PeoplePay: {
    category: "Vendor",
    owner: "Vendor Management",
    businessRecommendation:
      "NLNB should reduce PeoplePay concentration risk by identifying backup payment options and renegotiating contracts to include stronger service guarantees and exit protections.",
    technicalRecommendation:
      "NLNB should validate PeoplePay resilience through incident-response commitments, dependency reviews, and contingency workflows that keep payment operations moving if the vendor fails or changes terms.",
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
  lastUpdated: null,
};

const form = document.querySelector("#assessmentForm");
const categorySummary = document.querySelector("#categorySummary");
const heatMap = document.querySelector("#heatMap");
const recommendationsOutput = document.querySelector("#recommendationsOutput");
const runAssessmentBtn = document.querySelector("#runAssessmentBtn");
const resetAssessmentBtn = document.querySelector("#resetAssessmentBtn");
const questionRequestForm = document.querySelector("#questionRequestForm");
const questionRequestsOutput = document.querySelector("#questionRequestsOutput");
const questionCountOutputs = document.querySelectorAll("[data-question-count]");

function setAdminMode(isActive) {
  document.body.classList.toggle("admin-authenticated", Boolean(isActive));
}

async function syncAdminMode() {
  if (!hasSupabaseConfig || !supabase) {
    setAdminMode(false);
    return;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  setAdminMode(Boolean(session));
}

function createRangeOptions(question) {
  if (question?.responseOptions) {
    return question.responseOptions
      .map((option) => `<option value="${option.value}">${option.label}</option>`)
      .join("");
  }

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

function buildResponseOptions(responseType) {
  if (responseType === "yes_partial_no") {
    return [
      { value: 1, label: "Yes" },
      { value: 3, label: "Partial" },
      { value: 5, label: "No" },
    ];
  }
  return undefined;
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

function loadQuestionRequests() {
  const saved = localStorage.getItem(QUESTION_REQUESTS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveQuestionRequests(requests) {
  localStorage.setItem(QUESTION_REQUESTS_KEY, JSON.stringify(requests));
}

function updateQuestionCount() {
  questionCountOutputs.forEach((element) => {
    element.textContent = String(questions.length);
  });
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
  state.lastUpdated = parsed.lastUpdated || new Date().toISOString();

  questions.forEach((question) => {
    if (!state.answers[question.id]) {
      state.answers[question.id] = 3;
    }
  });
}

async function loadApprovedQuestions() {
  if (!hasSupabaseConfig || !supabase) return;

  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .select("id, question_text, category, systems, owner, response_type")
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error || !data) return;

  const approvedQuestions = data.map((item) => ({
    id: `approved-${item.id}`,
    category: item.category,
    text: item.question_text,
    systems: item.systems
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    owner: item.owner,
    responseOptions: buildResponseOptions(item.response_type),
  }));

  questions = [...baseQuestions, ...approvedQuestions];
}

function renderQuestions() {
  if (!form) return;
  updateQuestionCount();
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
                      ${createRangeOptions(question)}
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
      if (!systemScores[system]) return;
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
    };
  });
}

function getRating(score) {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

function getRatingClass(rating) {
  return rating.toLowerCase();
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
  if (categorySummary) {
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
  }

  const overall = Math.round(
    stats.reduce((sum, item) => sum + item.score, 0) / stats.length
  );
  const overallRating = document.querySelector("#overallRating");
  if (overallRating) {
    overallRating.textContent = `${getRating(overall)} (${overall}/100)`;
  }
}

function renderHeatMap() {
  if (!heatMap) return;
  const allRisks = [...state.generatedRisks];
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

  const heatMapTimestamp = document.querySelector("#heatMapTimestamp");
  if (heatMapTimestamp) {
    heatMapTimestamp.textContent = state.lastUpdated
      ? `Updated ${formatDate(state.lastUpdated)}`
      : "Awaiting assessment run.";
  }
}

function renderRecommendations() {
  if (!recommendationsOutput) return;
  const topRisks = [...state.generatedRisks]
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  recommendationsOutput.innerHTML = topRisks
    .map(
      (risk) => `
        <article class="recommendation-card">
          <div class="recommendation-meta">
            <span class="pill">${risk.title}</span>
            <span class="rating ${getRatingClass(risk.rating)}">${risk.rating}</span>
          </div>
          <h3>${risk.title}</h3>
          <p>${risk.explanation}</p>
          <div>
            <p class="recommendation-section-title">Business Recommendation</p>
            <p class="recommendation-body">${risk.businessRecommendation}</p>
          </div>
          <div>
            <p class="recommendation-section-title">Technical Recommendation</p>
            <p class="recommendation-body">${risk.technicalRecommendation}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function getHeatColor(weight) {
  if (weight >= 20) return "#8b1e1e";
  if (weight >= 15) return "#b04e28";
  if (weight >= 10) return "#d89000";
  if (weight >= 6) return "#528e66";
  return "#2f6f73";
}

function updateSnapshot() {
  const allRisks = [...state.generatedRisks];
  const criticalCount = allRisks.filter((risk) => risk.rating === "Critical").length;
  const criticalCountElement = document.querySelector("#criticalCount");
  const lastUpdatedElement = document.querySelector("#lastUpdated");
  if (criticalCountElement) {
    criticalCountElement.textContent = String(criticalCount);
  }
  if (lastUpdatedElement) {
    lastUpdatedElement.textContent = state.lastUpdated
      ? formatDate(state.lastUpdated)
      : "Not yet run";
  }
}

function renderDashboard() {
  renderCategorySummary();
  renderHeatMap();
  renderRecommendations();
  updateSnapshot();
}

function renderLocalQuestionRequests() {
  if (!questionRequestsOutput) return;
  const requests = loadQuestionRequests();
  if (!requests.length) {
    questionRequestsOutput.innerHTML = `<article class="request-card"><p>No pending requests yet.</p></article>`;
    return;
  }

  questionRequestsOutput.innerHTML = requests
    .slice()
    .reverse()
    .map(
      (request) => `
        <article class="request-card">
          <div class="recommendation-meta">
            <span class="pill">${request.category}</span>
            <span class="pill">${request.status}</span>
          </div>
          <h3>${request.questionText}</h3>
          <p><strong>Systems:</strong> ${request.systems}</p>
          <p><strong>Owner:</strong> ${request.owner}</p>
          <p><strong>Response Type:</strong> ${request.responseType}</p>
          <p><strong>Requested:</strong> ${formatDate(request.createdAt)}</p>
          <p><strong>Reason:</strong> ${request.reason}</p>
        </article>
      `
    )
    .join("");
}

async function renderQuestionRequests() {
  if (!questionRequestsOutput) return;

  if (!hasSupabaseConfig || !supabase) {
    renderLocalQuestionRequests();
    return;
  }

  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .select("question_text, category, systems, owner, response_type, reason, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    questionRequestsOutput.innerHTML = `
      <article class="request-card">
        <p>Could not load requests from Supabase. Local fallback is still available.</p>
      </article>
    `;
    return;
  }

  if (!data.length) {
    questionRequestsOutput.innerHTML = `<article class="request-card"><p>No requests submitted yet.</p></article>`;
    return;
  }

  questionRequestsOutput.innerHTML = data
    .map(
      (request) => `
        <article class="request-card">
          <div class="recommendation-meta">
            <span class="pill">${request.category}</span>
            <span class="pill">${request.status}</span>
          </div>
          <h3>${request.question_text}</h3>
          <p><strong>Systems:</strong> ${request.systems}</p>
          <p><strong>Owner:</strong> ${request.owner}</p>
          <p><strong>Response Type:</strong> ${request.response_type}</p>
          <p><strong>Requested:</strong> ${formatDate(request.created_at)}</p>
          <p><strong>Reason:</strong> ${request.reason}</p>
        </article>
      `
    )
    .join("");
}

function runAssessment() {
  state.lastUpdated = new Date().toISOString();
  state.generatedRisks = calculateGeneratedRisks();
  renderDashboard();
  saveState();

  if (runAssessmentBtn) {
    window.location.href = "results.html";
  }
}

async function submitQuestionRequest() {
  if (!questionRequestForm) return;

  const formData = new FormData(questionRequestForm);
  const request = {
    id: `request-${Date.now()}`,
    questionText: String(formData.get("question_text")),
    category: String(formData.get("category")),
    systems: String(formData.get("systems")),
    owner: String(formData.get("owner")),
    responseType: String(formData.get("response_type")),
    reason: String(formData.get("reason")),
    status: "Pending review",
    createdAt: new Date().toISOString(),
  };

  if (hasSupabaseConfig && supabase) {
    const { error } = await supabase.from(SUPABASE_TABLE).insert({
      question_text: request.questionText,
      category: request.category,
      systems: request.systems,
      owner: request.owner,
      response_type: request.responseType,
      reason: request.reason,
      status: "pending",
    });

    if (error) {
      alert(`Could not save the request to Supabase: ${error.message}`);
      return;
    }
  } else {
    const requests = loadQuestionRequests();
    requests.push(request);
    saveQuestionRequests(requests);
  }

  const subject = encodeURIComponent("Question Request Review - NLNB Risk Tool");
  const body = encodeURIComponent(
    `Team GRQ question request:\n\nQuestion: ${request.questionText}\nCategory: ${request.category}\nSystems: ${request.systems}\nOwner: ${request.owner}\nResponse Type: ${request.responseType}\nReason: ${request.reason}\n\nPlease review this request.`
  );

  if (hasSupabaseConfig) {
    alert("Question request submitted for review. Click OK to open an optional email draft.");
  }

  questionRequestForm.reset();
  await renderQuestionRequests();
  window.location.href = `mailto:kxl5821@psu.edu?subject=${subject}&body=${body}`;
}

function attachEvents() {
  if (runAssessmentBtn) {
    runAssessmentBtn.addEventListener("click", runAssessment);
  }

  if (resetAssessmentBtn) {
    resetAssessmentBtn.addEventListener("click", () => {
      questions.forEach((question) => {
        state.answers[question.id] = 3;
      });
      renderQuestions();
      runAssessment();
    });
  }

  if (questionRequestForm) {
    questionRequestForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await submitQuestionRequest();
    });
  }
}

async function init() {
  await syncAdminMode();
  await loadApprovedQuestions();
  loadState();
  updateQuestionCount();
  renderQuestions();
  if (!state.generatedRisks.length) {
    state.generatedRisks = calculateGeneratedRisks();
  }
  renderDashboard();
  await renderQuestionRequests();
  attachEvents();
}

if (hasSupabaseConfig && supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    setAdminMode(Boolean(session));
  });
}

init();
