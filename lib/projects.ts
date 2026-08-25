export interface Project {
  id: string;
  imageUrl: string;
  title: string;
  location: string;
  iconUrl: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "1",
    imageUrl: "",
    title: "END Design",
    location: "India, Kochi",
    iconUrl: "",
    featured: false,
  },
  {
    id: "2",
    imageUrl: "",
    title: "END Design",
    location: "India, Kochi",
    iconUrl: "",
    featured: true,
  },
  {
    id: "3",
    imageUrl: "",
    title: "END Design",
    location: "India, Kochi",
    iconUrl: "",
    featured: false,
  },
  {
    id: "4",
    imageUrl: "",
    title: "END Design",
    location: "India, Kochi",
    iconUrl: "",
    featured: false,
  },
  {
    id: "5",
    imageUrl: "",
    title: "END Design",
    location: "India, Kochi",
    iconUrl: "",
    featured: false,
  },
  {
    id: "6",
    imageUrl: "",
    title: "END Design",
    location: "India, Kochi",
    iconUrl: "",
    featured: false,
  },
];

// Mock API fetch function
export async function getProjects(): Promise<Project[]> {
  // Simulate network delay
  return new Promise((resolve) => setTimeout(() => resolve(projects), 0));
}
