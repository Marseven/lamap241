import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameRoom from './pages/GameRoom';
import Rules from './pages/Rules';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<GameRoom />} />
        <Route path="/rules" element={<Rules />} />
      </Routes>
    </Router>
  );
}