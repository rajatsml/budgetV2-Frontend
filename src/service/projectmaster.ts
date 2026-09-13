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

// GET DROPDOWN DATA FOR PROJECT MASTER
const GetDropdownData = async (type: string) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/Dropdowns/${type}`,
    );

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
    return [];
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

const ManageProjectWBS = async (payload: Record<string, unknown>) => {
  try {
    const response = await api.post(
      `${import.meta.env.VITE_API_URL}/api/ProjectWBS/ManageProjectWBS`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error managing project WBS:", error);
    throw error;
  }
};

const GetWBSDropdown = async (deptId: string | number) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/Dropdowns/6`,
      {
        params: {
          search: deptId,
          page: 1,
          pageSize: 100,
        },
      },
    );
    return response.data?.items || response.data || [];
  } catch (error) {
    console.error("Error fetching WBS dropdown:", error);
    return [];
  }
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

const GetNonPDMaster = async (
  projectID: string | undefined,
  deptId: any,
  recordId?: string | number,
) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/NonPDMaster`,
      {
        params: {
          ...(projectID ? { projectId: projectID } : {}),
          ...(recordId ? { recordId } : {}),
          deptId,
        },
      },
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching NonPD Master:", error);
    return [];
  }
};

/** Master records used by the non-PD input list. */
const GetNonPDRecords = async (deptId: string | number) => {
  const response = await api.get(
    `${import.meta.env.VITE_API_URL}/api/NonPDMaster/records`,
    { params: { deptId } },
  );
  return response.data?.items || response.data || [];
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

const GetUserProjects = async (userid: string) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/Projects/GetUserProjects?userId=${userid}`,
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return [];
  }
};
const GetBudgetManagerProjects = async (userid: string) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/Projects/GetBudgetManagerProjects?userId=${userid}`,
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching budget manager projects:", error);
    return [];
  }
};

const GetProjectsDropdown = async (FiYear: string) => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/Dropdowns/7`,
      {
        params: {
          search: FiYear,
          page: 1,
          pageSize: 100,
        },
      },
    );
    return response.data?.items || response.data || [];
  } catch (error) {
    console.error("Error in fetching Project Names dropdown:", error);
    return [];
  }
};

export interface AFCCSheetSummary {
  capital: number;
  revenue: number;
  carryForward: number;
  totalOutlay: number;
  askForCurrentYear: number;
}

export interface AFCCCapexBreakupEntry {
  deptId: string | number;
  departmentName: string;
  capexH1FY1: number;
  capexH1FY2: number;
  capexH2FY1: number;
  capexH2FY2: number;
  fy3: number;
  fy4: number;
  fy5: number;
  total: number;
}
export interface AFCCRevexBreakupEntry {
  deptId: string | number;
  departmentName: string;
  revexH1FY1: number;
  revexH1FY2: number;
  revexH2FY1: number;
  revexH2FY2: number;
  fy3: number;
  fy4: number;
  fy5: number;
  total: number;
}

export interface AFCCSheetResponse {
  afccSheet: AFCCSheetSummary;
  capexBreakup: AFCCCapexBreakupEntry[];
  revenueBreakup: AFCCRevexBreakupEntry[];
}

export interface AFCCSummaryEntry {
  deptId: string | number;
  departmentName: string;
  carryForward: number;
  fy1Capex: number;
  fy1Revex: number;
  fy1Total: number;
  fy2Onwards: number;
  overallOutlay: number;
}

const getResponseItems = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data.flatMap((value) => getResponseItems<T>(value));
  }
  if (!data || typeof data !== "object") return [];

  const response = data as Record<string, unknown>;
  const keys = Object.keys(response).map((key) => key.toLowerCase());
  const isRow = keys.some((key) =>
    ["capital", "departmentname", "fy1capex", "fy1total"].includes(key),
  );

  return isRow
    ? [data as T]
    : Object.values(response).flatMap((value) => getResponseItems<T>(value));
};

const getField = (row: Record<string, unknown>, field: string) => {
  const key = Object.keys(row).find(
    (candidate) => candidate.toLowerCase() === field.toLowerCase(),
  );
  return key ? row[key] : undefined;
};

const toNumber = (value: unknown) => Number(value ?? 0);

const mapAFCCCapexBreakupEntry = (
  row: Record<string, unknown>,
): AFCCCapexBreakupEntry => ({
  deptId: (getField(row, "deptId") ?? "") as string | number,
  departmentName: String(getField(row, "departmentName") ?? ""),
  capexH1FY1: toNumber(getField(row, "capexH1FY1")),
  capexH2FY1: toNumber(getField(row, "capexH2FY1")),
  capexH1FY2: toNumber(getField(row, "capexH1FY2")),
  capexH2FY2: toNumber(getField(row, "capexH2FY2")),
  fy3: toNumber(getField(row, "fy3")),
  fy4: toNumber(getField(row, "fy4")),
  fy5: toNumber(getField(row, "fy5")),
  total: toNumber(getField(row, "total")),
});
const mapAFCCRevexBreakupEntry = (
  row: Record<string, unknown>,
): AFCCRevexBreakupEntry => ({
  deptId: (getField(row, "deptId") ?? "") as string | number,
  departmentName: String(getField(row, "departmentName") ?? ""),
  revexH1FY1: toNumber(getField(row, "revexH1FY1")),
  revexH2FY1: toNumber(getField(row, "revexH2FY1")),
  revexH1FY2: toNumber(getField(row, "revexH1FY2")),
  revexH2FY2: toNumber(getField(row, "revexH2FY2")),
  fy3: toNumber(getField(row, "fy3")),
  fy4: toNumber(getField(row, "fy4")),
  fy5: toNumber(getField(row, "fy5")),
  total: toNumber(getField(row, "total")),
});

const mapAFCCSummaryEntry = (
  row: Record<string, unknown>,
): AFCCSummaryEntry => ({
  deptId: (getField(row, "deptId") ?? "") as string | number,
  departmentName: String(getField(row, "departmentName") ?? ""),
  carryForward: toNumber(getField(row, "carryForward")),
  fy1Capex: toNumber(getField(row, "fy1Capex")),
  fy1Revex: toNumber(getField(row, "fy1Revex")),
  fy1Total: toNumber(getField(row, "fy1Total")),
  fy2Onwards: toNumber(getField(row, "fy2Onwards")),
  overallOutlay: toNumber(getField(row, "overallOutlay")),
});

const GetAFCCSheetEntries = async (
  projectId: string,
): Promise<AFCCSheetResponse> => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/AFCC-budgeted/dashboard/${projectId}`,
    );
    const data = response.data as Record<string, unknown>;
    const sheet = (data.afccSheet ?? {}) as Record<string, unknown>;
    return {
      afccSheet: {
        capital: toNumber(getField(sheet, "capital")),
        revenue: toNumber(getField(sheet, "revenue")),
        carryForward: toNumber(getField(sheet, "carryForward")),
        totalOutlay: toNumber(getField(sheet, "totalOutlay")),
        askForCurrentYear: toNumber(getField(sheet, "askForCurrentYear")),
      },
      capexBreakup: getResponseItems<Record<string, unknown>>(
        data.capexBreakup,
      ).map(mapAFCCCapexBreakupEntry),
      revenueBreakup: getResponseItems<Record<string, unknown>>(
        data.revenueBreakup,
      ).map(mapAFCCRevexBreakupEntry),
    };
  } catch (error) {
    console.error("Error fetching AFCC sheet entries:", error);
    throw error;
  }
};

const GetAFCCSummary = async (
  projectId: string,
): Promise<AFCCSummaryEntry[]> => {
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/api/AFCC-budgeted/AFCCSummary`,
      { params: { projectId } },
    );
    return getResponseItems<Record<string, unknown>>(response.data).map(
      mapAFCCSummaryEntry,
    );
  } catch (error) {
    console.error("Error fetching AFCC summary:", error);
    throw error;
  }
};

const GetBudgetedByProject = async (projectId: string) => {
  const response = await api.post(
    `${import.meta.env.VITE_API_URL}/api/AFCC-budgeted/ManageAFCCBudgeted`,
    {
      type: 1,
      projectId,
    },
  );

  return response.data;
};

const InsertBudgeted = async (payload: any) => {
  const response = await api.post(
    `${import.meta.env.VITE_API_URL}/api/AFCC-budgeted/ManageAFCCBudgeted`,
    {
      type: 2,
      ...payload,
    },
  );

  return response.data;
};

const UpdateBudgeted = async (payload: any) => {
  const response = await api.post(
    `${import.meta.env.VITE_API_URL}/api/AFCC-budgeted/ManageAFCCBudgeted`,
    {
      type: 3,
      ...payload,
    },
  );

  return response.data;
};

const DeleteBudgeted = async (budgetedId: number) => {
  const response = await api.post(
    `${import.meta.env.VITE_API_URL}/api/AFCC-budgeted/ManageAFCCBudgeted`,
    {
      type: 4,
      budgetedId,
    },
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
  GetDropdownData,
  GetUserProjects,
  GetBudgetManagerProjects,
  GetProjectsDropdown,

  // PD Master
  InitializePDMaster,
  SavePDMaster,
  UpdatePDMaster,
  GetPDMaster,
  DeletePDMaster,
  UpdatePDStatus,
  GetPDApprovalHistory,
  ManageProjectWBS,
  GetWBSDropdown,

  // Non-PD Master
  InitializeNonPDMaster,
  SaveNonPDMaster,
  UpdateNonPDMaster,
  GetNonPDMaster,
  GetNonPDRecords,
  DeleteNonPDMaster,
  UpdateNonPDStatus,
  GetNonPDApprovalHistory,

  // Dashboard
  GetDashboardSummary,
  GetProjectHierarchy,
  GetBudgetDashboardDetails,

  // AFCC SHEET
  GetAFCCSheetEntries,
  GetAFCCSummary,
  GetBudgetedByProject,
  InsertBudgeted,
  UpdateBudgeted,
  DeleteBudgeted,
};
