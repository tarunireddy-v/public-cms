const API_BASE_URL = "http://localhost:5001/api";

const getToken = () => localStorage.getItem("token");

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const api = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    (() => {
      const safePayload = {
        email: payload?.email || "",
        passwordLength: String(payload?.password || "").length,
      };
      // #region agent log
      fetch('http://127.0.0.1:7310/ingest/01adc724-ab50-433b-84c6-e04288c98483',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e9425a'},body:JSON.stringify({sessionId:'e9425a',runId:'pre-fix',hypothesisId:'H4',location:'src/utils/api.js:36',message:'Frontend login payload prepared',data:safePayload,timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return request("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    })(),

  createComplaint: (payload) =>
    request("/complaints", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getComplaints: () => request("/complaints"),

  updateComplaint: (id, payload) =>
    request(`/complaints/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  updateComplaintStatus: (id, status) =>
    request(`/complaints/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  predictDepartment: (text) =>
    request("/complaints/predict-department", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
};

