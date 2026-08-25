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
    imageUrl: "", // Empty for placeholder
    title: "END Design",
    location: "India, Kochi",
    iconUrl: "", // Empty for placeholder
    featured: false,
  },
  {
    id: "2",
    imageUrl: "",
    title: "END Design",
    location: "India, Kochi",
    iconUrl: "",
    featured: true, // This one gets the blue border hover/active state
  },
  {
    id: "3",
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
