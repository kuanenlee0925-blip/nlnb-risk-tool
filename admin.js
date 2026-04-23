import {
  supabase,
  hasSupabaseConfig,
  SUPABASE_ADMIN_EMAILS,
  SUPABASE_TABLE,
} from "./supabase-client.js";

const adminLoginForm = document.querySelector("#adminLoginForm");
const adminEmailInput = document.querySelector("#adminEmailInput");
const adminPasswordInput = document.querySelector("#adminPasswordInput");
const adminRequestsOutput = document.querySelector("#adminRequestsOutput");
const adminStatusMessage = document.querySelector("#adminStatusMessage");
const adminSignOutBtn = document.querySelector("#adminSignOutBtn");
const allowedAdminEmails = (SUPABASE_ADMIN_EMAILS || []).map((email) =>
  String(email).trim().toLowerCase()
);

function setAdminMode(isActive) {
  document.body.classList.toggle("admin-authenticated", Boolean(isActive));
}

function setStatus(message) {
  adminStatusMessage.textContent = message;
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

function normalizeText(value) {
  return String(value || "").trim();
}

function formatAdminList() {
  return allowedAdminEmails.join(", ");
}

async function getSession() {
  if (!hasSupabaseConfig || !supabase) return null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

async function renderRequests() {
  if (!hasSupabaseConfig || !supabase) {
    setAdminMode(false);
    adminRequestsOutput.innerHTML = `
      <article class="request-card">
        <p>Supabase is not configured yet. Add your project URL and anon key in <code>supabase-config.js</code>.</p>
      </article>
    `;
    return;
  }

  const session = await getSession();
  if (!session) {
    setAdminMode(false);
    adminRequestsOutput.innerHTML = `
      <article class="request-card">
        <p>Sign in with an approved admin email and password to load pending requests.</p>
      </article>
    `;
    return;
  }
  setAdminMode(true);

  const { data, error } = await supabase
    .from(SUPABASE_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    adminRequestsOutput.innerHTML = `
      <article class="request-card">
        <p>Could not load requests: ${normalizeText(error.message)}</p>
      </article>
    `;
    return;
  }

  if (!data.length) {
    adminRequestsOutput.innerHTML = `
      <article class="request-card">
        <p>No requests found.</p>
      </article>
    `;
    return;
  }

  adminRequestsOutput.innerHTML = data
    .map(
      (request) => `
        <article class="request-card">
          <div class="recommendation-meta">
            <span class="pill">${normalizeText(request.category)}</span>
            <span class="pill">${normalizeText(request.status)}</span>
          </div>
          <h3>${normalizeText(request.question_text)}</h3>
          <p><strong>Systems:</strong> ${normalizeText(request.systems)}</p>
          <p><strong>Owner:</strong> ${normalizeText(request.owner)}</p>
          <p><strong>Response Type:</strong> ${normalizeText(request.response_type)}</p>
          <p><strong>Reason:</strong> ${normalizeText(request.reason)}</p>
          <p><strong>Requested:</strong> ${formatDate(request.created_at)}</p>
          <div class="toolbar">
            <button type="button" class="primary-button approve-request" data-id="${request.id}">Approve</button>
            <button type="button" class="secondary-button deny-request" data-id="${request.id}">Deny</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".approve-request").forEach((button) => {
    button.addEventListener("click", () => updateRequestStatus(button.dataset.id, "approved"));
  });

  document.querySelectorAll(".deny-request").forEach((button) => {
    button.addEventListener("click", () => updateRequestStatus(button.dataset.id, "denied"));
  });
}

async function updateRequestStatus(id, status) {
  if (!supabase) return;
  const updates =
    status === "approved"
      ? { status, approved_at: new Date().toISOString() }
      : { status, denied_at: new Date().toISOString() };

  const { error } = await supabase.from(SUPABASE_TABLE).update(updates).eq("id", id);

  if (error) {
    setStatus(`Could not update request: ${normalizeText(error.message)}`);
    return;
  }

  setStatus(`Request ${status}.`);
  renderRequests();
}

async function handleLogin(event) {
  event.preventDefault();

  if (!hasSupabaseConfig || !supabase) {
    setStatus("Add your Supabase URL and anon key in supabase-config.js first.");
    return;
  }

  const email = adminEmailInput.value.trim().toLowerCase();
  const password = adminPasswordInput.value;
  if (!allowedAdminEmails.includes(email)) {
    setStatus(`Only these admin emails can review requests: ${formatAdminList()}.`);
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setStatus(`Could not sign in: ${normalizeText(error.message)}`);
    return;
  }

  setStatus("Signed in. Loading review requests.");
  renderRequests();
}

async function handleSignOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
  setAdminMode(false);
  setStatus("Signed out.");
  renderRequests();
}

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", handleLogin);
}

if (adminSignOutBtn) {
  adminSignOutBtn.addEventListener("click", handleSignOut);
}

if (hasSupabaseConfig && supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    setAdminMode(Boolean(session));
  });
}

renderRequests();
