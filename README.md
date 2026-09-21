# Portfolio v2 — Supabase backend

Your existing design, unchanged. Content moved out of the JS bundle and into a real database, with a separate admin app at `/admin`.

```
GitHub Pages
  ├── /            your existing Vite React site  ──┐
  └── /admin/      new static admin app           ──┤
                                                    ▼
                                              Supabase
                                     Postgres · Auth · Storage
```

---

## Before you start: I need your `src/` folder

The ZIP you uploaded is a **compiled Vite build** — `index.html` plus `assets/index-3yaRcJLA.js`. There is no `src/`, no `package.json`, no components. Everything in that JS file has been minified: your component names are now `Pd`, `Id`, `vb`, and your Tailwind classes are baked into `assets/index-D1hyBE3k.css`.

That matters for exactly one requirement — swapping the hard-coded arrays inside your React components for Supabase calls. I can't edit a component that doesn't exist in the upload, and rewriting it from the minified output is how designs quietly drift, which is the thing you asked me not to do.

So this package contains everything that does **not** depend on your source, all of it ready to run:

| Delivered | Needs your `src/` |
|---|---|
| Database schema, RLS, storage buckets | Wiring 6 components to the loaders |
| Migration of your current content | |
| The whole admin app | |
| The data layer your components will import | |
| GitHub Actions deploy | |

Send me the repo (or just `src/`) and step 6 below is about 30 minutes of work, with your JSX untouched apart from the array each component reads from.

**Also worth knowing:** v5 has no Experience section and no Resume button. Your requirement lists both. The `experiences` table is built and the admin manages it, but there is no component to render it yet — v21, which you sent earlier, does have one. Tell me which version is the real base.

---

## 1. Create the Supabase project

New project at [supabase.com](https://supabase.com). From **Settings → API**, copy the **Project URL** and the **anon public** key. Never copy the `service_role` key into anything.

## 2. Run the SQL

**SQL Editor → New query**, run these in order:

1. `supabase/01_schema.sql` — tables, triggers, indexes
2. `supabase/02_rls.sql` — row level security
3. `supabase/03_storage.sql` — the four buckets and their policies
4. `supabase/04_seed.sql` — your current content

Every string in the seed was read out of your bundle. Where v5 itself ships placeholder copy (`Add Project Title`, `Add Certificate Title`) that placeholder is carried over, so the site looks identical on day one. Nothing is invented, and `experiences` is deliberately left empty.

## 3. Create your admin account

**Authentication → Users → Add user**, with your email and a password. Tick *Auto Confirm*. Then copy the new user's UUID and run:

```sql
insert into public.admins (user_id, email)
values ('PASTE-THE-UUID', 'you@example.com');
```

Then **Authentication → Providers → Email** and turn **Enable signups** off, so nobody else can create an account.

Being signed in is not enough to write — `is_admin()` checks this table on every insert, update and delete.

## 4. Deploy the admin

Copy `admin/` into your repo. Locally, copy `config.example.js` to `config.js` and fill it in. On GitHub Pages the workflow writes `config.js` from your repo secrets, which is why `admin/config.js` is gitignored.

Add these under **Settings → Secrets and variables → Actions**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Then **Settings → Pages → Source: GitHub Actions**. The admin lands at `https://your-site/admin/`.

The anon key being visible in the page source is fine and intended. It identifies the project, it doesn't grant permission. Permission comes from RLS.

## 5. Add the data layer

Copy `src/lib/` into your project and install the client:

```bash
npm install @supabase/supabase-js
```

Copy `.env.example` to `.env.local` and fill it in for local dev.

One thing to do by hand: `src/lib/fallback.js` has `techBadges` with empty `icon` values. Your real icons are the base64 strings in the `Md` array in your source. Paste them in, and the four About-strip badges keep working even with no network.

## 6. Wire the components

Each component changes by one line. Example, your projects section:

```jsx
// before
const projects = [
  { title: 'Add Project Title', category: 'Data Analysis', … },
  …
];

// after
import { useProjects } from '../lib/content';

const { data: projects } = useProjects();
```

The loaders return the exact key names your cards already destructure — `title`, `category`, `description`, `tags`, `match`, `episode` for projects; `category` and `skills` for skill cards; `number`, `title`, `text`, `className`, `aosType`, `aosDelay` for expertise. **No JSX changes, no class changes, no animation changes.**

| Component | Hook |
|---|---|
| Hero + About | `useProfile()`, `useFeaturedSkills()` |
| Expertise | `useExpertise()`, `useProfile()` |
| Skills | `useSkills()`, `useProfile()` |
| Projects | `useProjects()` |
| Certificates | `useCertificates()` |
| Experience | `useExperience()` |

Two notes on the hero. `expertise.position_class` carries the `md:absolute md:top-[450px] … md:-rotate-6` classes that place each card on the dotted path — it is stored in the database so the layout survives, but Tailwind only generates classes it can see at build time, so **keep the existing class strings present in your JSX** (a `safelist` in `tailwind.config.js` is the clean way) or the styles get purged. And `hero_video_url` only replaces the `src`; `autoPlay`, `loop`, `muted`, `playsInline`, the overlay and the mute-toggle animation all stay in the component.

## 7. Keep your bundled media

Nothing in this package touches `/assets`. `herovideo-DoafQIuO.mp4`, `image-DaXzU-ni.png`, `python-L4-wjWMV.png`, `powerbi-CoPNeTso.jpeg` and `sql-TZ-D_qws.jpeg` stay exactly where they are, and the seed points at those paths. Supabase Storage is only for things you upload from now on.

---

## Using the admin

**Dashboard** — counts, recent edits, and what is live versus draft.

**Each section** — Add, Edit, Duplicate, Delete, drag to reorder, and an eye icon to publish or unpublish. Duplicate always creates a new unpublished record and leaves the original alone. Delete always asks first.

**Draft → preview → publish.** Untick *Published* while you work. Unpublished rows aren't hidden by the interface, they're refused by the database policy, so there's no way for a draft to leak.

**Media** — drag files in, preview them, copy a URL, delete. Before deleting, it runs `media_usage()` and tells you which projects or certificates still point at that file.

**Videos** — for project demos you can paste a YouTube or Cloudinary URL, or upload to Supabase. Upload only short clips; the video bucket caps at 200 MB and Supabase egress is not free. Your hero video is untouched either way.

## Testing it

Work down this list once after setup: sign in, sign out, create a project, edit it, duplicate it, delete the copy, drag two projects into a new order and reload the public site to confirm the order held, unpublish one and confirm it disappears from the public site, then repeat for experience, skills and certificates. Upload an image and a PDF, preview both, copy a URL, try deleting one that's in use and check the warning names the right record. Edit About and Expertise. Finally, open the public site side by side with the original build — the colours, the hero video, the dotted-path animation and the card hovers should be pixel for pixel identical, because none of them were touched.
