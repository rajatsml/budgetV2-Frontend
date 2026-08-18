import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import AddProject from "./components/project/AddProject";
import AllProjects from "./components/project/AllProjects";
import NewPD from "./components/pd/NewPD";
import NonNewPD from "./components/nonpd/NonNewPD";
import PDProject from "./components/pd/PDProject";
import NonPD2 from "./components/nonpd/NonPD2";
import PDForm from "./components/pd/PDForm";

function App() {
  return (
    <BrowserRouter basename="/budgetV2">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <NavBar />
              <Home />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/allprojects"
          element={
            <ProtectedRoute>
              <NavBar />
              <AllProjects />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addproject"
          element={
            <ProtectedRoute>
              <NavBar />
              <AddProject />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pd"
          element={
            <ProtectedRoute>
              <NavBar />
              <NewPD />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pd2"
          element={
            <ProtectedRoute>
              <NavBar />
              <PDProject />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nonpd"
          element={
            <ProtectedRoute>
              <NavBar />
              <NonNewPD />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nonpd2"
          element={
            <ProtectedRoute>
              <NavBar />
              <NonPD2 />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pdform"
          element={
            <ProtectedRoute>
              <NavBar />
              <PDForm />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nonpdform"
          element={
            <ProtectedRoute>
              <NavBar />
              <NonPD2 />
              <Footer />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
