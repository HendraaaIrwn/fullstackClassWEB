import { createServer } from "http";
import crypto from "crypto";

const PORT = process.env.PORT ?? 3000;

// Demo user store; replace with DB lookup for production use.
const users = [
  { email: "demo@devscale.com", password: "password123", name: "Demo Devscale", role: "student" },
  { email: "mentor@devscale.com", password: "mentor123", name: "Mentor Devscale", role: "mentor" },
];

const sendJson = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });
  res.end(JSON.stringify(payload));
};

const parseJsonBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const bodyString = Buffer.concat(chunks).toString() || "{}";
  try {
    return JSON.parse(bodyString);
  } catch {
    return null;
  }
};

const generateToken = (email) => {
  return crypto.createHash("sha256").update(`${email}-${Date.now()}`).digest("hex");
};

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    });
    return res.end();
  }

  if (req.method === "POST" && req.url === "/api/login") {
    try {
      const body = await parseJsonBody(req);
      if (!body) {
        return sendJson(res, 400, { ok: false, message: "Format body tidak valid, gunakan JSON." });
      }

      const { email, password } = body;

      if (!email || !password) {
        return sendJson(res, 400, { ok: false, message: "Email dan password wajib diisi." });
      }

      const foundUser = users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
      if (!foundUser || foundUser.password !== password) {
        return sendJson(res, 401, { ok: false, message: "Email atau password salah." });
      }

      const token = generateToken(foundUser.email);
      return sendJson(res, 200, {
        ok: true,
        token,
        user: {
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
        },
        message: `Login berhasil. Selamat datang, ${foundUser.name}!`,
      });
    } catch (error) {
      console.error("Login error:", error);
      return sendJson(res, 500, { ok: false, message: "Terjadi kesalahan pada server." });
    }
  }

  res.writeHead(404, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify({ ok: false, message: "Route tidak ditemukan." }));
});

server.listen(PORT, () => {
  console.log(`API Devscale berjalan di http://localhost:${PORT}`);
});
