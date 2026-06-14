const projects = [
  { id: 'project-1', name: 'Website Redesign' },
  { id: 'project-2', name: 'Mobile App Build' },
];

export function getProjectById(id) {
  return projects.find((project) => project.id === id) || null;
}
