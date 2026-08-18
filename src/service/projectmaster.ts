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

export {
  FetchAllProjectsOfUser,
  CreateProject,
  GetProjects,
  GetProjectById,
  UpdateProject,
  DeleteProject,
};
