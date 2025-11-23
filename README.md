# Devscale Landing Pages

Landing page set for Devscale (home hero and dedicated Program page) built with Tailwind CSS v4 and Plus Jakarta Sans.

## Struktur
- `index.html` – hero/CTA beranda Devscale.
- `program.html` – halaman Program dengan kartu jalur belajar dan highlight support.
- `mentor.html` – halaman Mentor dengan showcase mentor & jadwal mentoring.
- `resource.html` – halaman Resources berisi toolkit, starter kit, dan newsletter.
- `pricing.html` – halaman Pricing dengan paket Starter, Pro, dan Team.
- `community.html` – halaman Community untuk event, challenge, dan networking.
- `masuk.html` – halaman login Devscale.
- `dist/global.css` – output Tailwind (dibangun dari `src/input.css`).

## Menjalankan secara lokal
1. Pastikan Bun terpasang: https://bun.sh
2. Install dependencies:
   ```bash
   bun install
   ```
3. Bangun CSS (sekali jalan):
   ```bash
   bunx @tailwindcss/cli -i ./src/input.css -o ./dist/global.css
   ```
   Atau mode watch:
   ```bash
   bun run tw
   ```
4. Buka `index.html` atau halaman lainnya di browser (open file atau serve statis pilihanmu).
5. Backend demo login:
   ```bash
   bun run server.js
   ```
   Endpoint: `POST http://localhost:3000/api/login` (dipakai oleh `masuk.html`).

## Tech stack
- Tailwind CSS v4 (CLI)
- Bun (package manager & runner)
- Node HTTP (backend demo login, berjalan via Bun)
