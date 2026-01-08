import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SkillsAndHobbies from './pages/SkillsAndHobbies';
import ResourceHub from './pages/ResourceHub';
import AnswerBook from './pages/AnswerBook';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/skills-and-hobbies" element={<SkillsAndHobbies />} />
      <Route path="/projects/resourcehub" element={<ResourceHub />} />
      <Route path="/projects/answerbook" element={<AnswerBook />} />
    </Routes>
  );
}
