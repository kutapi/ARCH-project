import fs from "fs";
import path from "path";

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

const DATA_FILE = path.join(process.cwd(), "data", "cms-data.json");

export function getCmsData(): CmsData {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as CmsData;
}

export function saveCmsData(data: CmsData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function getProjects(): Project[] {
  return getCmsData().projects;
}

export function getEmployees(): Employee[] {
  return getCmsData().employees;
}
