import { neon } from "@neondatabase/serverless";

// ─── Types (unchanged — no downstream breakage) ───────────────────────────────

export interface Project {
  id: string;
  imageUrl: string;
  iconUrl: string;
  title: string;
  description: string;
  location: string;
  featured: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface CmsData {
  heroImage: string;
  projects: Project[];
  employees: Employee[];
}

// ─── Neon client ──────────────────────────────────────────────────────────────

function getDb() {
  return neon(process.env.DATABASE_URL!);
}

// ─── Lazy table initialisation (idempotent — safe to call many times) ─────────

let _initDone = false;

export async function ensureInit(): Promise<void> {
  if (_initDone) return;
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS cms_settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id          TEXT PRIMARY KEY,
      image_url   TEXT NOT NULL DEFAULT '',
      icon_url    TEXT NOT NULL DEFAULT '',
      title       TEXT NOT NULL DEFAULT 'Untitled',
      description TEXT NOT NULL DEFAULT '',
      location    TEXT NOT NULL DEFAULT '',
      featured    BOOLEAN NOT NULL DEFAULT FALSE,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS employees (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL DEFAULT '',
      role       TEXT NOT NULL DEFAULT '',
      bio        TEXT NOT NULL DEFAULT '',
      image_url  TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  _initDone = true;
}

// ─── Hero image ───────────────────────────────────────────────────────────────

export async function getHeroImage(): Promise<string> {
  await ensureInit();
  const sql = getDb();
  const rows = await sql`SELECT value FROM cms_settings WHERE key = 'heroImage'`;
  return (rows[0]?.value as string) ?? "";
}

export async function setHeroImage(url: string): Promise<void> {
  await ensureInit();
  const sql = getDb();
  await sql`
    INSERT INTO cms_settings (key, value) VALUES ('heroImage', ${url})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProject(row: any): Project {
  return {
    id: row.id,
    imageUrl: row.image_url,
    iconUrl: row.icon_url,
    title: row.title,
    description: row.description,
    location: row.location,
    featured: row.featured,
  };
}

export async function getProjects(): Promise<Project[]> {
  await ensureInit();
  const sql = getDb();
  const rows = await sql`SELECT * FROM projects ORDER BY created_at ASC`;
  return rows.map(rowToProject);
}

export async function getProject(id: string): Promise<Project | null> {
  await ensureInit();
  const sql = getDb();
  const rows = await sql`SELECT * FROM projects WHERE id = ${id}`;
  return rows[0] ? rowToProject(rows[0]) : null;
}

export async function upsertProject(p: Project): Promise<Project> {
  await ensureInit();
  const sql = getDb();
  const rows = await sql`
    INSERT INTO projects (id, image_url, icon_url, title, description, location, featured)
    VALUES (${p.id}, ${p.imageUrl}, ${p.iconUrl}, ${p.title}, ${p.description}, ${p.location}, ${p.featured})
    ON CONFLICT (id) DO UPDATE SET
      image_url   = EXCLUDED.image_url,
      icon_url    = EXCLUDED.icon_url,
      title       = EXCLUDED.title,
      description = EXCLUDED.description,
      location    = EXCLUDED.location,
      featured    = EXCLUDED.featured
    RETURNING *
  `;
  return rowToProject(rows[0]);
}

export async function deleteProject(id: string): Promise<void> {
  await ensureInit();
  const sql = getDb();
  await sql`DELETE FROM projects WHERE id = ${id}`;
}

// ─── Employees ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToEmployee(row: any): Employee {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    imageUrl: row.image_url,
  };
}

export async function getEmployees(): Promise<Employee[]> {
  await ensureInit();
  const sql = getDb();
  const rows = await sql`SELECT * FROM employees ORDER BY created_at ASC`;
  return rows.map(rowToEmployee);
}

export async function upsertEmployee(e: Employee): Promise<Employee> {
  await ensureInit();
  const sql = getDb();
  const rows = await sql`
    INSERT INTO employees (id, name, role, bio, image_url)
    VALUES (${e.id}, ${e.name}, ${e.role}, ${e.bio}, ${e.imageUrl})
    ON CONFLICT (id) DO UPDATE SET
      name      = EXCLUDED.name,
      role      = EXCLUDED.role,
      bio       = EXCLUDED.bio,
      image_url = EXCLUDED.image_url
    RETURNING *
  `;
  return rowToEmployee(rows[0]);
}

export async function deleteEmployee(id: string): Promise<void> {
  await ensureInit();
  const sql = getDb();
  await sql`DELETE FROM employees WHERE id = ${id}`;
}

// ─── Convenience aggregate (used by app/page.tsx) ────────────────────────────

export async function getCmsData(): Promise<CmsData> {
  const [heroImage, projects, employees] = await Promise.all([
    getHeroImage(),
    getProjects(),
    getEmployees(),
  ]);
  return { heroImage, projects, employees };
}
