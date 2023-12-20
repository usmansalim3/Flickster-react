import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Watchlist from "./Pages/Watchlist";
import NavBar from "./Components/NavBar";
import MovieDetailsScreen from "./Components/MovieDetailsScreen";



function App() {
  return (
    <Router>
      <NavBar/>
      <MovieDetailsScreen/>
      <Routes>
        <Route path="/auth" element={<Login/>} /> 
        <Route path="/" element={<LandingPage/>} />
        <Route path="/watchlist" element={<Watchlist/>} /> 
      </Routes>
    </Router>
  );
}

export default App;
