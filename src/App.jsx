import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SkillsAndHobbies from './pages/SkillsAndHobbies';
import Projects from './pages/Projects';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/skills-and-hobbies" element={<SkillsAndHobbies />} />
    </Routes>
  );
}
