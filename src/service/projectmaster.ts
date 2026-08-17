import api from "./axios";

const FetchAllAdminProjects = async (url: string) => {
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

export { FetchAllAdminProjects, CreateProject };
