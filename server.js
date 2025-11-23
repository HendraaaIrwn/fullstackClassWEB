import { createServer } from "http";

const PORT = process.env.PORT ?? 3000;

const sendJson = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });
  res.end(JSON.stringify(payload));
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
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const bodyString = Buffer.concat(chunks).toString() || "{}";
      const { email, password } = JSON.parse(bodyString);

      if (!email || !password) {
        return sendJson(res, 400, { ok: false, message: "Email dan password wajib diisi." });
      }

      const isDemoUser = email.endsWith("@devscale.com") || email.endsWith("@gmail.com");
      const isStrongEnough = password.length >= 6;

      if (isDemoUser && isStrongEnough) {
        return sendJson(res, 200, {
          ok: true,
          token: "devscale-demo-token",
          message: `Login berhasil (demo). Selamat datang, ${email}!`,
        });
      }

      return sendJson(res, 401, {
        ok: false,
        message: "Kredensial demo tidak valid. Gunakan email devscale.com/gmail.com dan password min. 6 karakter.",
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
