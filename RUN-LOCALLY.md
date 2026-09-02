# Running it on localhost

Three commands. No Supabase account, no `.env` file, no API keys needed —
everything on the homepage works without them.

## 1. Check Node

Next.js 15 needs **Node 18.18 or newer**. Node 20 or 22 LTS is the safe pick.

```powershell
node -v
```

No output, or "not recognized"? Install the **LTS** build from
<https://nodejs.org>, then close and reopen PowerShell so the PATH updates.

## 2. Install

Unzip `study-abroad-pro.zip`. **Note where it actually landed** — Windows
Explorer's "Extract All" creates a folder named after the zip, so you probably
have `D:\Study Abroad Pro\study-abroad-pro\sap` rather than
`D:\Study Abroad Pro\sap`.

Easiest route: open the folder containing `package.json` and double-click
**`start-dev.cmd`**. It runs from its own location, so it cannot be started in
the wrong directory, and it checks Node before installing.

Manually instead — find the folder first:

```powershell
Get-ChildItem "D:\Study Abroad Pro" -Recurse -Filter package.json -Depth 4 |
  Select-Object -ExpandProperty FullName
```

Then `cd` to the folder that printed (without the `\package.json`) and:

```powershell
npm install
```

First run pulls roughly 400 MB and takes a few minutes. Needs internet — the
fonts are downloaded at build time too, so a network that blocks
`fonts.googleapis.com` will fail the build.

## 3. Run

```powershell
npm run dev
```

Open <http://localhost:3000>.

---

## What to look at

The globe sequence needs a **window at least 1024px wide with a mouse**. Below
that, or on a touchscreen, it deliberately switches off: the hero shows a
slowly turning globe and the six destinations become a card grid. That is the
designed fallback, not a bug — narrow your window to see it.

| Where | What should happen |
|---|---|
| Hero | Globe sits low and right, sunset gradient, traveller in front |
| First ~2 screens of scroll | Hero pins, globe turns three times, copy fades, destinations heading arrives on the third turn |
| Next screen | Globe travels to centre and shrinks |
| Next ~6 screens | One destination per screen, globe rotating to each country's longitude, progress rail on the right |
| Rest of page | Nine content sections, each fading up as it enters |
| Counselling form | Fill it in and submit — see below |

## The form without Supabase

`POST /api/leads` has a development-only fallback: with no
`SUPABASE_SERVICE_ROLE_KEY` set, it logs the submission to your terminal and
returns success, so you can exercise validation and the confirmation state.
Watch the `npm run dev` terminal — the lead prints there.

That fallback is guarded on `NODE_ENV`. A production deploy missing its keys
still fails loudly rather than silently dropping real enquiries.

Two things worth trying: submit with an empty name (inline errors appear), and
submit within two seconds of the page loading (the timing check treats it as a
bot and returns success without recording anything).

## Connecting Supabase later

```powershell
copy .env.example .env.local
```

Fill in the two `NEXT_PUBLIC_` values and `SUPABASE_SERVICE_ROLE_KEY`, run
`supabase/schema.sql` in the SQL editor, restart `npm run dev`. The form starts
writing rows with no code change.

---

## If something goes wrong

**Browser says "localhost refused to connect"** — the server is not running.
The reason is in the terminal, not the browser. Either `npm install` failed, or
`npm run dev` exited with an error, or it was run in a folder with no
`package.json`. Scroll the terminal up and read the first red line.

**`npm run dev` says "Could not read package.json"** — wrong folder. See
step 2; use `start-dev.cmd`.

**`npm : The term 'npm' is not recognized`** — Node is not installed, or the
terminal was open before you installed it. Reopen PowerShell.

**`npm error code ETARGET` / `No matching version found`** — a dependency
version does not exist. Send me the package name it prints.

**`Error: Cannot find module …`** — `npm install` did not finish. Delete
`node_modules` and `package-lock.json` and run it again.

**Port 3000 already in use** — `npm run dev -- -p 3001`.

**The globe does not appear** — check the browser console for a WebGL error,
and confirm hardware acceleration is on in Chrome
(`chrome://settings/system`). The rest of the page works regardless.

**Fonts look wrong** — the build could not reach Google Fonts. It falls back to
system sans; check the network rather than the code.

**A section is invisible** — the reveal animation sets elements to
`opacity: 0` before ScrollTrigger runs. If JavaScript failed, they stay hidden.
The console will say why.

## Checking the production build

`npm run dev` is not representative of real performance — it is unminified and
compiles on demand. For the honest picture:

```powershell
npm run build
npm start
```

That is also the command that will surface any type or build error before it
reaches a deploy.
