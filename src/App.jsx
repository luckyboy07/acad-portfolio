import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Papers from "./pages/Papers";
import Publications from "./pages/Publications";
import Archives from "./pages/Archives";
import CV from "./pages/CV";
import Contact from "./pages/Contact";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="papers" element={<Papers />} />
        <Route path="publications" element={<Navigate to="/publications/journal-articles" replace />} />
        <Route path="publications/:category" element={<Publications />} />
        <Route path="archives" element={<Archives />} />
        <Route path="courses" element={<Navigate to="/archives" replace />} />
        <Route path="cv" element={<CV />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
