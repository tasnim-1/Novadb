const API = process.env.REACT_APP_API_URL;

export const signup = async (data) => {
  return await fetch(`${API}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
};

export const login = async (data) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const getProfile = async (sessionId) => {
  const res = await fetch(`${API}/api/auth/profile`, {
    method: "GET",
    headers: {
      Authorization: sessionId
    }
  });

  return res.json();
};

export const logout = async (sessionId) => {
  return await fetch(`${API}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: sessionId
    }
  });
};