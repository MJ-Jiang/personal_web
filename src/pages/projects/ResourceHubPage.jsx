// src/pages/ResourceHubPage.jsx
import React from "react";
import ProjectShowcase from "../../components/ProjectShowcase";
import { PROJECTS } from "../../data/projects";

export default function ResourceHubPage() {
  return <ProjectShowcase project={PROJECTS.resourcehub} />;
}
