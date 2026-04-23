import {
  supabase,
  hasSupabaseConfig,
  SUPABASE_ADMIN_EMAILS,
  SUPABASE_TABLE,
} from "./supabase-client.js";

const adminLoginForm = document.querySelector("#adminLoginForm");
const adminEmailInput = document.querySelector("#adminEmailInput");
const adminRequestsOutput = document.querySelector("#adminRequestsOutput");
const adminStatusMessage = document.querySelector("#adminStatusMessage");
const adminSignOutBtn = document.querySelector("#adminSignOutBtn");
const allowedAdminEmails = (SUPABASE_ADMIN_EMAILS || []).map((email) =>
  String(email).trim().toLowerCase()
);

let showDenied = false;

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

async function deleteRequest(id) {
  if (!supabase) return;
  const confirmed = confirm("Permanently delete this denied request? This cannot be undone.");
  if (!confirmed) return;

  const { error } = await supabase.from(SUPABASE_TABLE).delete().eq("id", id);

  if (error) {
    setStatus(`Could not delete request: ${normalizeText(error.message)}`);
    return;
  }

  setStatus("Request permanently deleted.");
  renderRequests();
}

async function renderRequests() {
  if (!hasSupabaseConfig || !supabase) {
    adminRequestsOutput.innerHTML = `
      <article class="request-card">
        <p>Supabase is not configured yet. Add your project URL and anon key in <code>supabase-config.js</code>.</p>
      </article>
    `;
    return;
  }

  const session = await getSession();
  if (!session) {
    adminRequestsOutput.innerHTML = `
      <article class="request-card">
        <p>Sign in with the admin email to load pending requests.</p>
      </article>
    `;
    return;
  }

  let query = supabase
    .from(SUPABASE_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (!showDenied) {
    query = query.neq("status", "denied");
  }

  const { data, error } = await query;

  if (error) {
    adminRequestsOutput.innerHTML = `
      <article class="request-card">
        <p>Could not load requests: ${normalizeText(error.message)}</p>
      </article>
    `;
    return;
  }

  const toggleLabel = showDenied ? "Hide Denied" : "Show Denied";
  const toggleHtml = `
    <div class="toolbar" style="margin-bottom: 18px;">
      <button type="button" id="toggleDeniedBtn" class="secondary-button">${toggleLabel}</button>
    </div>
  `;

  if (!data.length) {
    adminRequestsOutput.innerHTML = `
      ${toggleHtml}
      <article class="request-card">
        <p>${showDenied ? "No requests found." : "No pending or approved requests. Use \"Show Denied\" to view denied ones."}</p>
      </article>
    `;
    document.querySelector("#toggleDeniedBtn").addEventListener("click", () => {
      showDenied = !showDenied;
      renderRequests();
    });
    return;
  }

  adminRequestsOutput.innerHTML =
    toggleHtml +
    data
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
            ${
              request.status !== "approved"
                ? `<button type="button" class="primary-button approve-request" data-id="${request.id}">Approve</button>`
                : ""
            }
            ${
              request.status !== "denied"
                ? `<button type="button" class="secondary-button deny-request" data-id="${request.id}">Deny</button>`
                : `<button type="button" class="remove-button delete-request" data-id="${request.id}" style="padding: 10px 16px; font-weight: 800; background: rgba(139,30,30,0.12); color: #7d1818; border-radius: 999px; cursor: pointer;">Delete</button>`
            }
          </div>
        </article>
      `
      )
      .join("");

  document.querySelector("#toggleDeniedBtn").addEventListener("click", () => {
    showDenied = !showDenied;
    renderRequests();
  });

  document.querySelectorAll(".approve-request").forEach((button) => {
    button.addEventListener("click", () => updateRequestStatus(button.dataset.id, "approved"));
  });

  document.querySelectorAll(".deny-request").forEach((button) => {
    button.addEventListener("click", () => updateRequestStatus(button.dataset.id, "denied"));
  });

  document.querySelectorAll(".delete-request").forEach((button) => {
    button.addEventListener("click", () => deleteRequest(button.dataset.id));
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
  if (!allowedAdminEmails.includes(email)) {
    setStatus(`Only these admin emails can review requests: ${formatAdminList()}.`);
    return;
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
    },
  });

  if (error) {
    setStatus(`Could not send magic link: ${normalizeText(error.message)}`);
    return;
  }

  setStatus("Magic link sent. Open your email, click the link, then return to this page.");
}

async function handleSignOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
  setStatus("Signed out.");
  renderRequests();
}

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", handleLogin);
}

if (adminSignOutBtn) {
  adminSignOutBtn.addEventListener("click", handleSignOut);
}

renderRequests();
