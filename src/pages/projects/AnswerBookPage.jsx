// src/pages/AnswerBookPage.jsx
import React from "react";
import ProjectShowcase from "../../components/ProjectShowcase";
import { PROJECTS } from "../../data/projects";

export default function AnswerBookPage() {
  return <ProjectShowcase project={PROJECTS.answerbook} />;
}
