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

export const DeletePDMaster = async (pdDetailId: number) => {
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

export {
  FetchAllProjectsOfUser,
  CreateProject,
  GetProjects,
  GetProjectById,
  UpdateProject,
  DeleteProject,
  InitializePDMaster,
  SavePDMaster,
  UpdatePDMaster,
  GetPDMaster,
  UpdatePDStatus,
};
