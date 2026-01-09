import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SkillsAndHobbies from './pages/SkillsAndHobbies';
import ResourceHubPage from './pages/projects/ResourceHubPage';
import AnswerBookPage from './pages/projects/AnswerBookPage';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/skills-and-hobbies" element={<SkillsAndHobbies />} />
      <Route path="/projects/resourcehub" element={<ResourceHubPage />} />
      <Route path="/projects/answerbook" element={<AnswerBookPage />} />
    </Routes>
  );
}
