import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Grouped from "../pages/Grouped";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/grouped" element={<Grouped />} />
    </Routes>
  );
};

export default AppRouter;
