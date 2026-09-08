import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
// import AddProject from "./components/project/AddProject";
import AllProjects from "./components/project/AllProjects";

import MyProjects from "./components/user/MyProjects";
import PDProjectDetail from "./components/user/PDProjectDetail";
import RoleProtectedRoute from "./RoleProtectedRoute";
import PDApprover from "./components/user/PDApprover";
// import NonPDProjectDetail from "./components/user/NonPDProjectDetail";
// import NonPDApprover from "./components/user/NonPDApprover";
import ProjectDetails from "./components/dashboard/ProjectDetails";
import AddProjectPD from "./components/project/AddProjectPD";
// import PDInputs from "./components/user/PDInputs";
import PostedProjects from "./components/user/PostedProjects";
import WBSProjects from "./components/user/WBSProjects";
import WBSActualSpent from "./components/user/WBSActualSpent";
import AFCCSheet from "./components/dashboard/AFCCSheet";
import AFCCSummary from "./components/dashboard/AFCCSummary";

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
          path="/afcc"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <NavBar />
              <AFCCSheet />
              <Footer />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/afcc-summary"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <NavBar />
              <AFCCSummary />
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
          path="/pd-budget-manager-projects"
          element={
            <RoleProtectedRoute allowedRoles={["User"]}>
              <NavBar />
              <WBSProjects />
              <Footer />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/wbs-actual-spent"
          element={
            <RoleProtectedRoute allowedRoles={["User"]}>
              <NavBar />
              <WBSActualSpent />
              <Footer />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/posted-projects"
          element={
            <RoleProtectedRoute allowedRoles={["User"]}>
              <NavBar />
              <PostedProjects />
              <Footer />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/add-project-pd"
          element={
            <RoleProtectedRoute allowedRoles={["User"]}>
              <NavBar />
              <AddProjectPD />
              <Footer />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/add-project-pd/:projectId?"
          element={
            <RoleProtectedRoute allowedRoles={["User"]}>
              <NavBar />
              <AddProjectPD />
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
