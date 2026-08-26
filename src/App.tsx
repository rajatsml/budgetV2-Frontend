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
import MyProjects from "./components/user/MyProjects";
import PDProjectDetail from "./components/user/PDProjectDetail";
import RoleProtectedRoute from "./RoleProtectedRoute";
import PDApprover from "./components/user/PDApprover";
import NonPDProjectDetail from "./components/user/NonPDProjectDetail";
import NonPDApprover from "./components/user/NonPDApprover";
import ProjectDetails from "./components/dashboard/ProjectDetails";
import AddProjectPD from "./components/project/AddProjectPD";
import PDInputs from "./components/user/PDInputs";

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
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <NavBar />
              <AllProjects />
              <Footer />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/addproject/:projectId?"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <NavBar />
              <AddProject />
              <Footer />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/project-detail"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <NavBar />
              <ProjectDetails />
              <Footer />
            </RoleProtectedRoute>
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
              <NonPDProjectDetail />
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

        <Route
          path="/myprojects"
          element={
            <RoleProtectedRoute allowedRoles={["User"]}>
              <NavBar />
              <MyProjects />
              <Footer />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/pd-project"
          element={
            <RoleProtectedRoute allowedRoles={["User"]}>
              <NavBar />
              <PDProjectDetail />
              <Footer />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/pd-project-approver"
          element={
            <RoleProtectedRoute allowedRoles={["User"]}>
              <NavBar />
              <PDApprover />
              <Footer />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/nonpd-project"
          element={
            <RoleProtectedRoute allowedRoles={["User"]}>
              <NavBar />
              <NonPDProjectDetail />
              <Footer />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/nonpd-project-approver"
          element={
            <RoleProtectedRoute allowedRoles={["User"]}>
              <NavBar />
              <NonPDApprover />
              <Footer />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/add-project-pd"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <NavBar />
              <AddProjectPD />
              <Footer />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/pd-form"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <NavBar />
              <PDInputs />
              <Footer />
            </RoleProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
