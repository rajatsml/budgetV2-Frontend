import api from "./axios";

const FetchAllProjectsOfUser = async (url: string) => {
  try {
    const response = await api.get(url);
    return response.data?.items || [];
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return [];
  }
};

const CreateProject = async (payload: any) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_URL}/api/Projects`,
      payload,
    );

    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

/**
 * Get projects based on logged-in user.
 * Backend will automatically:
 * - return all projects for bp_admin
 * - return assigned projects for Makers/Approvers
 */
const GetProjects = async () => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/Projects`,
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

/**
 * Get single project details
 */
const GetProjectById = async (projectId: string) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/Projects/${projectId}`,
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw error;
  }
};

/**
 * Update Project
 */
const UpdateProject = async (projectId: string, payload: any) => {
  try {
    const response = await api.put(
      `${import.meta.env.VITE_API_URL}/api/Projects/${projectId}`,
      payload,
    );

    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

/**
 * Delete Project
 */
const DeleteProject = async (projectId: string) => {
  try {
    const response = await api.delete(
      `${import.meta.env.VITE_API_URL}/api/Projects/${projectId}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

const InitializePDMaster = async (payload: Record<string, unknown>) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_URL}/api/pdmaster/initialize`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error initializing PD master:", error);
    throw error;
  }
};

const SavePDMaster = async (payload: Record<string, unknown>) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_URL}/api/pdmaster`,
      payload,
    );

    return response.data;
  } catch (error) {
    console.error("Error saving PD Master:", error);
    throw error;
  }
};

const UpdatePDMaster = async (
  payload: Record<string, unknown>,
  pdRecordId: any,
) => {
  try {
    const response = await api.put(
      `${import.meta.env.VITE_API_URL}/api/pdmaster/${pdRecordId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error saving PD Master:", error);
    throw error;
  }
};

const GetPDMaster = async (projectID: string, deptId: any) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/PDMaster?projectId=${projectID}&deptId=${deptId}`,
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching PD Master :", error);
    return [];
  }
};

const DeletePDMaster = async (pdDetailId: number) => {
  const response = await api.delete(
    `${import.meta.env.VITE_API_URL}/api/PDMaster/${pdDetailId}`,
  );

  return response.data;
};

const UpdatePDStatus = async (payload: {
  projectId: string;
  deptId: string;
  userId: string;
  actionPerformed: string;
  remarks?: string;
}) => {
  const response = await api.post(
    `${import.meta.env.VITE_API_URL}/api/PDMaster/UpdatePDStatus`,
    payload,
  );

  return response.data;
};

const GetPDApprovalHistory = async (projectId: string, deptId: string) => {
  const response = await api.get(
    `${import.meta.env.VITE_API_URL}/api/PDMaster/GetPDApprovalHistory`,
    {
      params: {
        projectId,
        deptId,
      },
    },
  );

  return response.data;
};

const InitializeNonPDMaster = async (payload: Record<string, unknown>) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_URL}/api/NonPDMaster/initialize`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error initializing NonPD master:", error);
    throw error;
  }
};

const SaveNonPDMaster = async (payload: Record<string, unknown>) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_URL}/api/NonPDMaster`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error saving NonPD Master:", error);
    throw error;
  }
};

const UpdateNonPDMaster = async (
  payload: Record<string, unknown>,
  nonPDRecordId: number | string,
) => {
  try {
    const response = await api.put(
      `${import.meta.env.VITE_API_URL}/api/NonPDMaster/${nonPDRecordId}`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating NonPD Master:", error);
    throw error;
  }
};

const GetNonPDMaster = async (projectID: string, deptId: any) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/NonPDMaster?projectId=${projectID}&deptId=${deptId}`,
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching NonPD Master:", error);
    return [];
  }
};

const DeleteNonPDMaster = async (nonPDDetailId: number) => {
  const response = await api.delete(
    `${import.meta.env.VITE_API_URL}/api/NonPDMaster/${nonPDDetailId}`,
  );

  return response.data;
};

const UpdateNonPDStatus = async (payload: {
  projectId: string;
  deptId: string;
  userId: string;
  actionPerformed: string;
  approvalRemarks?: string;
}) => {
  const response = await api.post(
    `${import.meta.env.VITE_API_URL}/api/NonPDMaster/UpdateNonPDStatus`,
    payload,
  );

  return response.data;
};

const GetNonPDApprovalHistory = async (projectId: string, deptId: string) => {
  const response = await api.get(
    `${import.meta.env.VITE_API_URL}/api/NonPDMaster/GetNonPDApprovalHistory`,
    {
      params: {
        projectId,
        deptId,
      },
    },
  );

  return response.data;
};

const GetDashboardSummary = async (financialYear: string) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/BudgetDashboard/summary/${financialYear}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return null;
  }
};

/**
 * Get Project Approval Hierarchy
 */
const GetProjectHierarchy = async (projectId: string) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/BudgetDashboard/hierarchy/${projectId}`,
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching project hierarchy:", error);
    return [];
  }
};

/**
 * Get Department Details for Dashboard View
 * Works for both PD and Non-PD projects
 */
const GetBudgetDashboardDetails = async (
  projectId: string,
  deptId: string | number,
) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/BudgetDashboard/details/${projectId}/${deptId}`,
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching budget dashboard details:", error);
    return [];
  }
};

export {
  FetchAllProjectsOfUser,
  CreateProject,
  GetProjects,
  GetProjectById,
  UpdateProject,
  DeleteProject,

  // PD Master
  InitializePDMaster,
  SavePDMaster,
  UpdatePDMaster,
  GetPDMaster,
  DeletePDMaster,
  UpdatePDStatus,
  GetPDApprovalHistory,

  // Non-PD Master
  InitializeNonPDMaster,
  SaveNonPDMaster,
  UpdateNonPDMaster,
  GetNonPDMaster,
  DeleteNonPDMaster,
  UpdateNonPDStatus,
  GetNonPDApprovalHistory,

  // Dashboard
  GetDashboardSummary,
  GetProjectHierarchy,
  GetBudgetDashboardDetails,
};
