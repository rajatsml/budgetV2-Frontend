import api from "./axios";

const FetchDropDownData = async (url: string) => {
  try {
    const response = await api.get(url);
    console.log(url);
    console.log(response.data.items);
    return response.data?.items || [];
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return [];
  }
};

export { FetchDropDownData };
