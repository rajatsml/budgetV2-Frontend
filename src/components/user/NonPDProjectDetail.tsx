import { useState, useEffect } from "react";
import PDHeader from "../pd/PDHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  SaveNonPDMaster,
  UpdateNonPDMaster,
  GetNonPDMaster,
  DeleteNonPDMaster,
  UpdateNonPDStatus,
  GetNonPDApprovalHistory,
} from "../../service/projectmaster";
import useUserStore from "../../store/userStore";

import { useLocation, useNavigate } from "react-router-dom";

type NonPDFormData = {
  id: string;
  division: string;
  category: string;
  groupName: string;
  location: string;
  projectUnit: string;

  currentScenarioJustification: string;
  deliverablesKPI: string;
  budgetBasedOn: string;
  requestFor: string;
  financial: string;
  projectOwner: string;
  capexRevenue: string;
  templateCategory: string;
  projectName: string;

  quantity: string;
  unitRate: string;
  currency: string;
  exchangeRate: string;
  basicsInLac: string;
  typeOfPurchase: string;
  nrTaxPercentage: string;
  netCost: string;

  h1PR: string;
  h2PR: string;
  total1: string;
  year2: string;
  h1CF: string;
  h2CF: string;
  total2: string;

  remarks: string;

  proposedQty: string;
  proposedBudget: string;
  remark: string;

  contingencyFactor: string;
  vital: string;
  essential: string;
  desirable: string;

  aprNetCF: string;
  mayNetCF: string;
  junNetCF: string;
  julNetCF: string;
  augNetCF: string;
  sepNetCF: string;
  octNetCF: string;
  novNetCF: string;
  decNetCF: string;
  janNetCF: string;
  febNetCF: string;
  marNetCF: string;

  prFy1H1: string;
  prFy1H2: string;
  prFy2H1: string;
  prFy2H2: string;
  prFy3H1: string;
  prFy3H2: string;
  prFy4H1: string;
  prFy4H2: string;

  cfFy1H1: string;
  cfFy1H2: string;
  cfFy2H1: string;
  cfFy2H2: string;
  cfFy3H1: string;
  cfFy3H2: string;
  cfFy4H1: string;
  cfFy4H2: string;
};

const initialFormState: NonPDFormData = {
  id: "",
  division: "",
  category: "",
  groupName: "",
  location: "",
  projectUnit: "",

  currentScenarioJustification: "",
  deliverablesKPI: "",
  budgetBasedOn: "",
  requestFor: "",
  financial: "",
  projectOwner: "",
  capexRevenue: "",
  templateCategory: "",
  projectName: "",

  quantity: "",
  unitRate: "",
  currency: "",
  exchangeRate: "",
  basicsInLac: "",
  typeOfPurchase: "",
  nrTaxPercentage: "",
  netCost: "",

  h1PR: "",
  h2PR: "",
  total1: "",
  year2: "",
  h1CF: "",
  h2CF: "",
  total2: "",

  remarks: "",

  proposedQty: "",
  proposedBudget: "",
  remark: "",

  contingencyFactor: "",
  vital: "",
  essential: "",
  desirable: "",

  aprNetCF: "",
  mayNetCF: "",
  junNetCF: "",
  julNetCF: "",
  augNetCF: "",
  sepNetCF: "",
  octNetCF: "",
  novNetCF: "",
  decNetCF: "",
  janNetCF: "",
  febNetCF: "",
  marNetCF: "",

  prFy1H1: "",
  prFy1H2: "",
  prFy2H1: "",
  prFy2H2: "",
  prFy3H1: "",
  prFy3H2: "",
  prFy4H1: "",
  prFy4H2: "",

  cfFy1H1: "",
  cfFy1H2: "",
  cfFy2H1: "",
  cfFy2H2: "",
  cfFy3H1: "",
  cfFy3H2: "",
  cfFy4H1: "",
  cfFy4H2: "",
};

const NonPDProjectDetail = () => {
  // type NonPDFormDataWithId = NonPDFormData & {
  //   id: string;
  // };

  const navigate = useNavigate();
  const [nonpdDetailId, setNonPDDetailId] = useState<number | null>(null);

  const location = useLocation();
  const [approvalHistory, setApprovalHistory] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState<NonPDFormData>(initialFormState);

  const [rows, setRows] = useState<any[]>([]);

  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const isEditing = editingRowId !== null;

  const data = location.state;

  console.log(data);
  console.log(data?.status);

  const canEdit = data?.status === "OPENED";

  const { user } = useUserStore();

  const buildPayload = (draftStat: string) => ({
    ProjectId: data?.projectID,
    RecordId: nonpdDetailId?.toString() || "0",
    DeptId: data?.deptID?.toString(),
    DraftStatus: draftStat,

    Id: formData.id,
    Division: formData.division,
    Category: formData.category,
    GroupName: formData.groupName,
    Location: formData.location,
    ProjectUnit: formData.projectUnit,

    CurrentScenerioJustification: formData.currentScenarioJustification,
    DeliverablesKPI: formData.deliverablesKPI,
    BudgetBasedOn: formData.budgetBasedOn,
    RequestFor: formData.requestFor,
    Financial: formData.financial,
    ProjectOwner: formData.projectOwner,
    Capex_Revenue: formData.capexRevenue,
    TemplateCategory: formData.templateCategory,
    ProjectName: formData.projectName,

    Quantity: formData.quantity,
    UnitRate: formData.unitRate,
    Currency: formData.currency,
    ExchangeRate: formData.exchangeRate,
    BasicsInLac: formData.basicsInLac,
    TypeOfPurchase: formData.typeOfPurchase,
    NRTaxPercentage: formData.nrTaxPercentage,
    NetCost: formData.netCost,

    H1PR: formData.h1PR,
    H2PR: formData.h2PR,
    Total1: formData.total1,
    Year2: formData.year2,
    H1CF: formData.h1CF,
    H2CF: formData.h2CF,
    Total2: formData.total2,

    Remarks: formData.remarks,

    ProposedQty: formData.proposedQty,
    ProposedBudget: formData.proposedBudget,
    Remark: formData.remark,

    ContingencyFactor: formData.contingencyFactor,
    Vital: formData.vital,
    Essential: formData.essential,
    Desirable: formData.desirable,

    AprNetCF: formData.aprNetCF,
    MayNetCF: formData.mayNetCF,
    JunNetCF: formData.junNetCF,
    JulNetCF: formData.julNetCF,
    AugNetCF: formData.augNetCF,
    SepNetCF: formData.sepNetCF,
    OctNetCF: formData.octNetCF,
    NovNetCF: formData.novNetCF,
    DecNetCF: formData.decNetCF,
    JanNetCF: formData.janNetCF,
    FebNetCF: formData.febNetCF,
    MarNetCF: formData.marNetCF,

    PR_Fy1H1: formData.prFy1H1,
    PR_Fy1H2: formData.prFy1H2,
    PR_Fy2H1: formData.prFy2H1,
    PR_Fy2H2: formData.prFy2H2,
    PR_Fy3H1: formData.prFy3H1,
    PR_Fy3H2: formData.prFy3H2,
    PR_Fy4H1: formData.prFy4H1,
    PR_Fy4H2: formData.prFy4H2,

    CF_Fy1H1: formData.cfFy1H1,
    CF_Fy1H2: formData.cfFy1H2,
    CF_Fy2H1: formData.cfFy2H1,
    CF_Fy2H2: formData.cfFy2H2,
    CF_Fy3H1: formData.cfFy3H1,
    CF_Fy3H2: formData.cfFy3H2,
    CF_Fy4H1: formData.cfFy4H1,
    CF_Fy4H2: formData.cfFy4H2,

    UserId: user?.userId, // replace with logged-in user
    FyYear: data?.FyYear,
    CategoryId: data?.categoryId || 1,
  });

  const fetchNonPDDetails = async () => {
    try {
      console.log(data?.projectID, data?.deptID);

      const response = await GetNonPDMaster(data?.projectID, data?.deptID);

      setRows(response);
    } catch (error) {
      console.error("Failed to fetch PD Details", error);
    }
  };

  const fetchApprovalHistory = async () => {
    try {
      const response = await GetNonPDApprovalHistory(
        data?.projectID,
        data?.deptID?.toString(),
      );

      setApprovalHistory(response || []);
    } catch (error) {
      console.error("Failed to fetch approval history", error);
    }
  };
  useEffect(() => {
    fetchNonPDDetails();
    fetchApprovalHistory();
  }, []);

  const savePDData = async () => {
    try {
      if (isRowEmpty()) {
        return false;
      }

      const payload = buildPayload("DRAFT");

      if (!nonpdDetailId) {
        const response = await SaveNonPDMaster(payload);
        setNonPDDetailId(response?.pdDetailId);
      } else {
        const response = await UpdateNonPDMaster(payload, nonpdDetailId);
        setNonPDDetailId(response?.pdDetailId);
      }

      return true;
    } catch (error) {
      console.error("PD Save Failed", error);
      return false;
    }
  };

  const changeTab = async (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const nextTab = async () => {
    const success = await savePDData();
    if (!success) return;

    console.log("This is success - NEXT", success);

    if (activeTab < tabs.length - 1) {
      setActiveTab((prev) => prev + 1);
    }

    fetchNonPDDetails();
  };

  const prevTab = async () => {
    const success = await savePDData();
    if (!success) return;

    console.log("This is success - NEXT", success);

    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    }
    fetchNonPDDetails();
  };

  const handleChange = (key: keyof NonPDFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // const createRowId = () => `${Date.now()}-${Math.random()}`;

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingRowId(null);
  };

  const handleSave = async () => {
    try {
      if (isRowEmpty()) {
        alert("Please enter at least one value before saving.");
        return;
      }
      const payload = buildPayload("COMPLETE");

      if (editingRowId) {
        await UpdateNonPDMaster(payload, Number(editingRowId));

        console.log("Row Updated");
      } else {
        if (!nonpdDetailId) {
          const response = await SaveNonPDMaster(payload);
          setNonPDDetailId(response?.pdDetailId);
        } else {
          const response = await UpdateNonPDMaster(payload, nonpdDetailId);
          setNonPDDetailId(response?.pdDetailId);
        }

        console.log("Row Saved");
      }

      await fetchNonPDDetails();

      resetForm();

      setNonPDDetailId(null);

      setActiveTab(0);
    } catch (error) {
      console.error("Error saving row:", error);
    }
  };

  const handleEdit = (id: number) => {
    const row = rows.find((r) => r.NonPDDetailId === id);

    if (!row) return;

    setNonPDDetailId(row.NonPDDetailId);

    setFormData({
      id: row.Id || "",
      division: row.Division || "",
      category: row.Category || "",
      groupName: row.GroupName || "",
      location: row.Location || "",
      projectUnit: row.ProjectUnit || "",

      currentScenarioJustification: row.CurrentScenerioJustification || "",
      deliverablesKPI: row.DeliverablesKPI || "",
      budgetBasedOn: row.BudgetBasedOn || "",
      requestFor: row.RequestFor || "",
      financial: row.Financial || "",
      projectOwner: row.ProjectOwner || "",
      capexRevenue: row.Capex_Revenue || "",
      templateCategory: row.TemplateCategory || "",
      projectName: row.ProjectName || "",

      quantity: row.Quantity || "",
      unitRate: row.UnitRate || "",
      currency: row.Currency || "",
      exchangeRate: row.ExchangeRate || "",
      basicsInLac: row.BasicsInLac || "",
      typeOfPurchase: row.TypeOfPurchase || "",
      nrTaxPercentage: row.NRTaxPercentage || "",
      netCost: row.NetCost || "",

      h1PR: row.H1PR || "",
      h2PR: row.H2PR || "",
      total1: row.Total1 || "",
      year2: row.Year2 || "",
      h1CF: row.H1CF || "",
      h2CF: row.H2CF || "",
      total2: row.Total2 || "",

      remarks: row.Remarks || "",

      proposedQty: row.ProposedQty || "",
      proposedBudget: row.ProposedBudget || "",
      remark: row.Remark || "",

      contingencyFactor: row.ContingencyFactor || "",
      vital: row.Vital || "",
      essential: row.Essential || "",
      desirable: row.Desirable || "",

      aprNetCF: row.AprNetCF || "",
      mayNetCF: row.MayNetCF || "",
      junNetCF: row.JunNetCF || "",
      julNetCF: row.JulNetCF || "",
      augNetCF: row.AugNetCF || "",
      sepNetCF: row.SepNetCF || "",
      octNetCF: row.OctNetCF || "",
      novNetCF: row.NovNetCF || "",
      decNetCF: row.DecNetCF || "",
      janNetCF: row.JanNetCF || "",
      febNetCF: row.FebNetCF || "",
      marNetCF: row.MarNetCF || "",

      prFy1H1: row.PR_Fy1H1 || "",
      prFy1H2: row.PR_Fy1H2 || "",
      prFy2H1: row.PR_Fy2H1 || "",
      prFy2H2: row.PR_Fy2H2 || "",
      prFy3H1: row.PR_Fy3H1 || "",
      prFy3H2: row.PR_Fy3H2 || "",
      prFy4H1: row.PR_Fy4H1 || "",
      prFy4H2: row.PR_Fy4H2 || "",

      cfFy1H1: row.CF_Fy1H1 || "",
      cfFy1H2: row.CF_Fy1H2 || "",
      cfFy2H1: row.CF_Fy2H1 || "",
      cfFy2H2: row.CF_Fy2H2 || "",
      cfFy3H1: row.CF_Fy3H1 || "",
      cfFy3H2: row.CF_Fy3H2 || "",
      cfFy4H1: row.CF_Fy4H1 || "",
      cfFy4H2: row.CF_Fy4H2 || "",
    });

    setEditingRowId(id.toString());

    setActiveTab(0);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?",
    );

    if (!confirmed) return;

    try {
      await DeleteNonPDMaster(id);

      await fetchNonPDDetails();

      if (editingRowId === id.toString()) {
        resetForm();
      }
    } catch (error) {
      console.error("Delete Failed", error);
    }
  };

  const isRowEmpty = () => {
    return Object.values(formData).every(
      (value) => !value || value.toString().trim() === "",
    );
  };

  const getNumber = (value: string) => Number(value || 0);
  const hasValue = (value: string) => value?.trim() !== "";

  const isCurrentTabValid = () => {
    switch (activeTab) {
      // Project / Basic Details
      case 0:
        return [
          formData.id,
          formData.division,
          formData.category,
          formData.groupName,
          formData.location,
          formData.projectUnit,
          formData.currentScenarioJustification,
          formData.deliverablesKPI,
          formData.budgetBasedOn,
          formData.requestFor,
          formData.financial,
          formData.projectOwner,
        ].some(hasValue);

      // Budget Details
      case 1:
        return [
          formData.capexRevenue,
          formData.templateCategory,
          formData.projectName,
          formData.quantity,
          formData.unitRate,
          formData.currency,
          formData.exchangeRate,
          formData.basicsInLac,
          formData.typeOfPurchase,
          formData.nrTaxPercentage,
          formData.netCost,
        ].some(hasValue);

      // PR / CF
      case 2:
        return [
          formData.h1PR,
          formData.h2PR,
          formData.total1,
          formData.year2,
          formData.h1CF,
          formData.h2CF,
          formData.total2,
          formData.remarks,
        ].some(hasValue);

      // Proposed / Priority
      case 3:
        return [
          formData.proposedQty,
          formData.proposedBudget,
          formData.remark,
          formData.contingencyFactor,
          formData.vital,
          formData.essential,
          formData.desirable,
        ].some(hasValue);

      // Monthly Net CF
      case 4:
        return [
          formData.aprNetCF,
          formData.mayNetCF,
          formData.junNetCF,
          formData.julNetCF,
          formData.augNetCF,
          formData.sepNetCF,
          formData.octNetCF,
          formData.novNetCF,
          formData.decNetCF,
          formData.janNetCF,
          formData.febNetCF,
          formData.marNetCF,
        ].some(hasValue);

      // PR Bifurcation
      case 5:
        return [
          formData.prFy1H1,
          formData.prFy1H2,
          formData.prFy2H1,
          formData.prFy2H2,
          formData.prFy3H1,
          formData.prFy3H2,
          formData.prFy4H1,
          formData.prFy4H2,
        ].some(hasValue);

      // CF Bifurcation
      case 6:
        return [
          formData.cfFy1H1,
          formData.cfFy1H2,
          formData.cfFy2H1,
          formData.cfFy2H2,
          formData.cfFy3H1,
          formData.cfFy3H2,
          formData.cfFy4H1,
          formData.cfFy4H2,
        ].some(hasValue);

      default:
        return false;
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      if (rows.length === 0) {
        alert("Please save at least one entry before submitting for approval.");

        return;
      }
      const response = await UpdateNonPDStatus({
        projectId: data?.projectID,
        deptId: data?.deptID?.toString(),
        userId: user?.userId!,
        actionPerformed: "POSTED",
        remarks: "Submitted for approval",
      });

      alert(response.message);

      navigate("/budgetV2/myprojects"); // your route
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNonPDDetails();
  }, []);

  const tabs = [
    "Project Details",
    "Budget Details",
    "PR / CF",
    "Proposed / Priority",
    "Monthly Net CF",
    "PR Bifurcation",
    "CF Bifurcation",
  ];
  const inputStyle =
    "w-full h-8  px-3 text-xs border border-slate-200 rounded outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

  const getTotal = (field: string) =>
    rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);

  const summary = canEdit
    ? {
        quantity: getNumber(formData.quantity),
        unitRate: getNumber(formData.unitRate),
        basicsInLac: getNumber(formData.basicsInLac),
        netCost: getNumber(formData.netCost),
        total1: getNumber(formData.total1),
        total2: getNumber(formData.total2),
        proposedBudget: getNumber(formData.proposedBudget),
      }
    : {
        quantity: getTotal("Quantity"),
        unitRate: getTotal("UnitRate"),
        basicsInLac: getTotal("BasicsInLac"),
        netCost: getTotal("NetCost"),
        total1: getTotal("Total1"),
        total2: getTotal("Total2"),
        proposedBudget: getTotal("ProposedBudget"),
      };

  return (
    <div className="p-4 space-y-4">
      {/* Project Info / Summary */}
      <div className="flex gap-x-2">
        <PDHeader
          projectID={data?.projectID}
          projectName={data?.projectName}
          deptName={data?.deptName}
          deptID={data?.deptID}
          category={data?.category}
          fyYear={data?.FyYear}
          pendingWith={data?.pendingWithUser}
          status={data?.status}
        />
        <div className="border border-slate-200 rounded p-4 bg-gray-200 shadow-sm w-1/2">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Summary</h3>

          <div className="overflow-x-auto rounded border border-base-300 bg-white">
            <table className="table w-full table-sm">
              <thead>
                <tr className="bg-base-200">
                  <th className="border-r border-base-300 font-medium">
                    Quantity
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Unit Rate
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Basics In Lac
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Net Cost
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Total 1
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Total 2
                  </th>
                  <th className="font-medium">Proposed Budget</th>
                </tr>
              </thead>

              <tbody>
                <tr className="hover">
                  <td className="border border-base-300 font-semibold text-right">
                    {summary.quantity}
                  </td>

                  <td className="border border-base-300 font-semibold text-right">
                    {summary.unitRate}
                  </td>

                  <td className="border border-base-300 font-semibold text-right">
                    {summary.basicsInLac}
                  </td>

                  <td className="border border-base-300 font-semibold text-right">
                    {summary.netCost}
                  </td>

                  <td className="border border-base-300 font-semibold text-right">
                    {summary.total1}
                  </td>

                  <td className="border border-base-300 font-semibold text-right">
                    {summary.total2}
                  </td>

                  <td className="border border-base-300 font-semibold text-right">
                    {summary.proposedBudget}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className=" border-slate-200 rounded">
        {/* name of each tab group should be unique */}

        {canEdit && (
          <div className="tabs tabs-box bg-gray-50 p-4 gap-x-2 tabs-xs border border-slate-200">
            {/* TAB 0 - PROJECT DETAILS */}
            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${
                activeTab === 0
                  ? "font-semibold bg-red-500 text-white"
                  : "text-gray-900 bg-white border shadow-sm border-gray-300"
              }`}
              checked={activeTab === 0}
              onClick={() => {
                changeTab(0);
              }}
              aria-label="Project Details"
            />

            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="grid grid-cols-1 lg:grid-cols-9 gap-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Division
                  </label>
                  <input
                    value={formData.division}
                    onChange={(e) => handleChange("division", e.target.value)}
                    placeholder="Division"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <input
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    placeholder="Category"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Group Name
                  </label>
                  <input
                    value={formData.groupName}
                    onChange={(e) => handleChange("groupName", e.target.value)}
                    placeholder="Group Name"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Location
                  </label>
                  <input
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="Location"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Project Unit
                  </label>
                  <input
                    value={formData.projectUnit}
                    onChange={(e) =>
                      handleChange("projectUnit", e.target.value)
                    }
                    placeholder="Project Unit"
                    className={inputStyle}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Current Scenario Justification
                  </label>
                  <textarea
                    value={formData.currentScenarioJustification}
                    onChange={(e) =>
                      handleChange(
                        "currentScenarioJustification",
                        e.target.value,
                      )
                    }
                    className={`${inputStyle} py-2 overflow-y-hidden`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Deliverables / KPI
                  </label>
                  <textarea
                    value={formData.deliverablesKPI}
                    onChange={(e) =>
                      handleChange("deliverablesKPI", e.target.value)
                    }
                    className={`${inputStyle} py-2 overflow-y-hidden`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Budget Based On
                  </label>
                  <textarea
                    value={formData.budgetBasedOn}
                    onChange={(e) =>
                      handleChange("budgetBasedOn", e.target.value)
                    }
                    className={`${inputStyle} py-2 overflow-y-hidden`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Request For
                  </label>
                  <input
                    value={formData.requestFor}
                    onChange={(e) => handleChange("requestFor", e.target.value)}
                    placeholder="Request For"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Financial
                  </label>
                  <input
                    value={formData.financial}
                    onChange={(e) => handleChange("financial", e.target.value)}
                    placeholder="Financial"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Project Owner
                  </label>
                  <input
                    value={formData.projectOwner}
                    onChange={(e) =>
                      handleChange("projectOwner", e.target.value)
                    }
                    placeholder="Project Owner"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Capex / Revenue
                  </label>
                  <input
                    value={formData.capexRevenue}
                    onChange={(e) =>
                      handleChange("capexRevenue", e.target.value)
                    }
                    placeholder="Capex / Revenue"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Template Category
                  </label>
                  <input
                    value={formData.templateCategory}
                    onChange={(e) =>
                      handleChange("templateCategory", e.target.value)
                    }
                    placeholder="Template Category"
                    className={inputStyle}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Project Name
                  </label>
                  <input
                    value={formData.projectName}
                    onChange={(e) =>
                      handleChange("projectName", e.target.value)
                    }
                    placeholder="Project Name"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* TAB 1 - COST DETAILS */}
            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${
                activeTab === 1
                  ? "font-semibold bg-red-500 text-white"
                  : "text-gray-900 bg-white border shadow-sm border-gray-300"
              }`}
              checked={activeTab === 1}
              onClick={() => {
                changeTab(1);
              }}
              aria-label="Cost Details"
            />

            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="grid grid-cols-1 lg:grid-cols-8 gap-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Quantity
                  </label>
                  <input
                    value={formData.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    placeholder="Quantity"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Unit Rate
                  </label>
                  <input
                    value={formData.unitRate}
                    onChange={(e) => handleChange("unitRate", e.target.value)}
                    placeholder="Unit Rate"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Currency
                  </label>
                  <input
                    value={formData.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    placeholder="Currency"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Exchange Rate
                  </label>
                  <input
                    value={formData.exchangeRate}
                    onChange={(e) =>
                      handleChange("exchangeRate", e.target.value)
                    }
                    placeholder="Exchange Rate"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Basics In Lac
                  </label>
                  <input
                    value={formData.basicsInLac}
                    onChange={(e) =>
                      handleChange("basicsInLac", e.target.value)
                    }
                    placeholder="Basics In Lac"
                    className={inputStyle}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Type Of Purchase
                  </label>
                  <input
                    value={formData.typeOfPurchase}
                    onChange={(e) =>
                      handleChange("typeOfPurchase", e.target.value)
                    }
                    placeholder="Type Of Purchase"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    NR Tax %
                  </label>
                  <input
                    value={formData.nrTaxPercentage}
                    onChange={(e) =>
                      handleChange("nrTaxPercentage", e.target.value)
                    }
                    placeholder="NR Tax %"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Net Cost
                  </label>
                  <input
                    value={formData.netCost}
                    onChange={(e) => handleChange("netCost", e.target.value)}
                    placeholder="Net Cost"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    H1 PR
                  </label>
                  <input
                    value={formData.h1PR}
                    onChange={(e) => handleChange("h1PR", e.target.value)}
                    placeholder="H1 PR"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    H2 PR
                  </label>
                  <input
                    value={formData.h2PR}
                    onChange={(e) => handleChange("h2PR", e.target.value)}
                    placeholder="H2 PR"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Total 1
                  </label>
                  <input
                    value={formData.total1}
                    onChange={(e) => handleChange("total1", e.target.value)}
                    placeholder="Total 1"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Year 2
                  </label>
                  <input
                    value={formData.year2}
                    onChange={(e) => handleChange("year2", e.target.value)}
                    placeholder="Year 2"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    H1 CF
                  </label>
                  <input
                    value={formData.h1CF}
                    onChange={(e) => handleChange("h1CF", e.target.value)}
                    placeholder="H1 CF"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    H2 CF
                  </label>
                  <input
                    value={formData.h2CF}
                    onChange={(e) => handleChange("h2CF", e.target.value)}
                    placeholder="H2 CF"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Total 2
                  </label>
                  <input
                    value={formData.total2}
                    onChange={(e) => handleChange("total2", e.target.value)}
                    placeholder="Total 2"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* TAB 2 - PROPOSED BUDGET */}
            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${
                activeTab === 2
                  ? "font-semibold bg-red-500 text-white"
                  : "text-gray-900 bg-white border shadow-sm border-gray-300"
              }`}
              checked={activeTab === 2}
              onClick={() => {
                changeTab(2);
              }}
              aria-label="Proposed Budget"
            />

            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Proposed Qty
                  </label>
                  <input
                    value={formData.proposedQty}
                    onChange={(e) =>
                      handleChange("proposedQty", e.target.value)
                    }
                    placeholder="Proposed Qty"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Proposed Budget
                  </label>
                  <input
                    value={formData.proposedBudget}
                    onChange={(e) =>
                      handleChange("proposedBudget", e.target.value)
                    }
                    placeholder="Proposed Budget"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Contingency Factor
                  </label>
                  <input
                    value={formData.contingencyFactor}
                    onChange={(e) =>
                      handleChange("contingencyFactor", e.target.value)
                    }
                    placeholder="Contingency Factor"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Vital
                  </label>
                  <input
                    value={formData.vital}
                    onChange={(e) => handleChange("vital", e.target.value)}
                    placeholder="Vital"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Essential
                  </label>
                  <input
                    value={formData.essential}
                    onChange={(e) => handleChange("essential", e.target.value)}
                    placeholder="Essential"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Desirable
                  </label>
                  <input
                    value={formData.desirable}
                    onChange={(e) => handleChange("desirable", e.target.value)}
                    placeholder="Desirable"
                    className={inputStyle}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    className={`${inputStyle} py-2 overflow-y-hidden`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Remark
                  </label>
                  <textarea
                    value={formData.remark}
                    onChange={(e) => handleChange("remark", e.target.value)}
                    className={`${inputStyle} py-2 overflow-y-hidden`}
                  />
                </div>
              </div>
            </div>

            {/* TAB 3 - NET CASH FLOW */}
            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${
                activeTab === 3
                  ? "font-semibold bg-red-500 text-white"
                  : "text-gray-900 bg-white border shadow-sm border-gray-300"
              }`}
              checked={activeTab === 3}
              onClick={() => {
                changeTab(3);
              }}
              aria-label="Net Cash Flow"
            />

            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
                {[
                  ["aprNetCF", "Apr Net CF"],
                  ["mayNetCF", "May Net CF"],
                  ["junNetCF", "Jun Net CF"],
                  ["julNetCF", "Jul Net CF"],
                  ["augNetCF", "Aug Net CF"],
                  ["sepNetCF", "Sep Net CF"],
                  ["octNetCF", "Oct Net CF"],
                  ["novNetCF", "Nov Net CF"],
                  ["decNetCF", "Dec Net CF"],
                  ["janNetCF", "Jan Net CF"],
                  ["febNetCF", "Feb Net CF"],
                  ["marNetCF", "Mar Net CF"],
                ].map(([field, label]) => (
                  <div key={field}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {label}
                    </label>

                    <input
                      value={formData[field as keyof NonPDFormData] as string}
                      onChange={(e) =>
                        handleChange(
                          field as keyof NonPDFormData,
                          e.target.value,
                        )
                      }
                      placeholder="Amount"
                      className={inputStyle}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* TAB 4 - PR / CF */}
            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${
                activeTab === 4
                  ? "font-semibold bg-red-500 text-white"
                  : "text-gray-900 bg-white border shadow-sm border-gray-300"
              }`}
              checked={activeTab === 4}
              onClick={() => {
                changeTab(4);
              }}
              aria-label="PR / C/F"
            />

            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-8">
                {[
                  ["prFy1H1", "PR FY1 H1"],
                  ["prFy1H2", "PR FY1 H2"],
                  ["prFy2H1", "PR FY2 H1"],
                  ["prFy2H2", "PR FY2 H2"],
                  ["prFy3H1", "PR FY3 H1"],
                  ["prFy3H2", "PR FY3 H2"],
                  ["prFy4H1", "PR FY4 H1"],
                  ["prFy4H2", "PR FY4 H2"],
                ].map(([field, label]) => (
                  <div key={field}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {label}
                    </label>

                    <input
                      value={formData[field as keyof NonPDFormData] as string}
                      onChange={(e) =>
                        handleChange(
                          field as keyof NonPDFormData,
                          e.target.value,
                        )
                      }
                      placeholder="Amount"
                      className={inputStyle}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">
                  C/F
                </h3>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-8">
                  {[
                    ["cfFy1H1", "CF FY1 H1"],
                    ["cfFy1H2", "CF FY1 H2"],
                    ["cfFy2H1", "CF FY2 H2"],
                    ["cfFy2H2", "CF FY2 H2"],
                    ["cfFy3H1", "CF FY3 H1"],
                    ["cfFy3H2", "CF FY3 H2"],
                    ["cfFy4H1", "CF FY4 H1"],
                    ["cfFy4H2", "CF FY4 H2"],
                  ].map(([field, label]) => (
                    <div key={field}>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        {label}
                      </label>

                      <input
                        value={formData[field as keyof NonPDFormData] as string}
                        onChange={(e) =>
                          handleChange(
                            field as keyof NonPDFormData,
                            e.target.value,
                          )
                        }
                        placeholder="Amount"
                        className={inputStyle}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-error self-center font-semibold">
              Please fill the entries and then click on next
            </p>
          </div>
        )}

        {canEdit && (
          <div className="flex gap-x-4 place-content-left m-4">
            <button
              className="btn btn-sm btn-neutral"
              onClick={prevTab}
              disabled={activeTab === 0}
            >
              <ChevronLeft />
              Back
            </button>

            <button
              className="btn btn-sm btn-neutral"
              onClick={nextTab}
              disabled={activeTab === tabs.length - 1 || !isCurrentTabValid()}
            >
              Next
              <ChevronRight />
            </button>

            {!isRowEmpty() && (
              <button
                className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600"
                onClick={handleSave}
                disabled={isRowEmpty()}
              >
                {isEditing ? "Update Row" : "Save All Entries"}
              </button>
            )}

            <button
              className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:border-gray-400"
              onClick={handleSubmitForApproval}
              disabled={rows.length === 0}
            >
              Submit For Approval
            </button>
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="mt-6 border border-slate-300 font-medium text-xs bg-white overflow-hidden">
          <div className="max-h-175 overflow-auto">
            <table className="table table-zebra table-xs w-full">
              <thead className="sticky top-0 z-30">
                {/* GROUP HEADER */}
                <tr className="bg-red-500 text-white text-xs">
                  <th className="sticky left-0 z-40 bg-red-500 border text-center">
                    Actions
                  </th>

                  {/* 11 columns */}
                  <th colSpan={11} className="text-center border">
                    PROJECT DETAILS
                  </th>

                  {/* 10 columns */}
                  <th colSpan={10} className="text-center border">
                    BUDGET DETAILS
                  </th>

                  {/* 5 columns */}
                  <th colSpan={5} className="text-center border">
                    PR / CF
                  </th>

                  {/* 5 columns */}
                  <th colSpan={5} className="text-center border">
                    YEAR 2 / CF
                  </th>

                  {/* 5 columns */}
                  <th colSpan={5} className="text-center border">
                    PROPOSED / PRIORITY
                  </th>

                  {/* 12 columns */}
                  <th colSpan={12} className="text-center border">
                    MONTHLY NET CF
                  </th>

                  {/* 8 columns */}
                  <th colSpan={8} className="text-center border">
                    PR BIFURCATION
                  </th>

                  {/* 8 columns */}
                  <th colSpan={8} className="text-center border">
                    CF BIFURCATION
                  </th>
                </tr>

                {/* COLUMN HEADER */}
                <tr className="bg-slate-100 text-slate-800">
                  <th></th>

                  {/* PROJECT DETAILS - 11 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    ID
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Division
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Category
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Group Name
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Location
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Project Unit
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Current Scenario Justification
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Deliverables / KPI
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Budget Based On
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Request For
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Financial
                  </th>

                  {/* BUDGET DETAILS - 10 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    Project Owner
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Capex / Revenue
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Template Category
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Project Name
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Quantity
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Unit Rate
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Currency
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Exchange Rate
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Basics In Lac
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Type Of Purchase
                  </th>

                  {/* PR / CF - 5 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    NR Tax %
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Net Cost
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    H1 PR
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    H2 PR
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Total 1
                  </th>

                  {/* YEAR 2 / CF - 5 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    Year 2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    H1 CF
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    H2 CF
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Total 2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Remarks
                  </th>

                  {/* PROPOSED / PRIORITY - 5 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    Proposed Qty
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Proposed Budget
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Remark
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Contingency Factor
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Vital
                  </th>

                  {/* MONTHLY NET CF - 12 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    Apr
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    May
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Jun
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Jul
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Aug
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Sep
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Oct
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Nov
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Dec
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Jan
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Feb
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Mar
                  </th>

                  {/* PR BIFURCATION - 8 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY1 H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY1 H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY2 H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY2 H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY3 H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY3 H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY4 H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    PR FY4 H2
                  </th>

                  {/* CF BIFURCATION - 8 */}

                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY1 H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY1 H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY2 H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY2 H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY3 H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY3 H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY4 H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    CF FY4 H2
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.NonPDDetailId} className="text-xs">
                    {/* ACTIONS */}
                    <td className="sticky left-0 z-20 bg-white border border-slate-200">
                      {canEdit && (
                        <div className="flex gap-1 justify-center">
                          <button
                            className="btn btn-xs bg-red-500 text-white"
                            onClick={() => handleEdit(row.NonPDDetailId)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-xs bg-red-500 text-white"
                            onClick={() => handleDelete(row.NonPDDetailId)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>

                    {/* PROJECT DETAILS */}
                    <td className="border border-slate-200">{row.Id}</td>

                    <td className="border border-slate-200">{row.Division}</td>

                    <td className="border border-slate-200">{row.Category}</td>

                    <td className="border border-slate-200">{row.GroupName}</td>

                    <td className="border border-slate-200">{row.Location}</td>

                    <td className="border border-slate-200">
                      {row.ProjectUnit}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.CurrentScenerioJustification}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.DeliverablesKPI}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.BudgetBasedOn}
                    </td>

                    <td className="border border-slate-200">
                      {row.RequestFor}
                    </td>

                    <td className="border border-slate-200">{row.Financial}</td>

                    {/* BUDGET DETAILS */}
                    <td className="border border-slate-200">
                      {row.ProjectOwner}
                    </td>

                    <td className="border border-slate-200">
                      {row.Capex_Revenue}
                    </td>

                    <td className="border border-slate-200">
                      {row.TemplateCategory}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.ProjectName}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.Quantity}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.UnitRate}
                    </td>

                    <td className="border border-slate-200">{row.Currency}</td>

                    <td className="border border-slate-200 text-right">
                      {row.ExchangeRate}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.BasicsInLac}
                    </td>

                    <td className="border border-slate-200">
                      {row.TypeOfPurchase}
                    </td>

                    {/* PR / CF */}
                    <td className="border border-slate-200 text-right">
                      {row.NRTaxPercentage}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.NetCost}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.H1PR}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.H2PR}
                    </td>

                    <td className="border border-slate-200 text-right font-semibold">
                      {row.Total1}
                    </td>

                    {/* YEAR 2 / CF */}
                    <td className="border border-slate-200 text-right">
                      {row.Year2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.H1CF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.H2CF}
                    </td>

                    <td className="border border-slate-200 text-right font-semibold">
                      {row.Total2}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.Remarks}
                    </td>

                    {/* PROPOSED / PRIORITY */}
                    <td className="border border-slate-200 text-right">
                      {row.ProposedQty}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.ProposedBudget}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.Remark}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.ContingencyFactor}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.Vital}
                    </td>

                    {/* MONTHLY NET CF */}
                    <td className="border border-slate-200 text-right">
                      {row.AprNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.MayNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.JunNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.JulNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.AugNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.SepNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.OctNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.NovNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.DecNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.JanNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.FebNetCF}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.MarNetCF}
                    </td>

                    {/* PR BIFURCATION */}
                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy1H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy1H2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy2H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy2H2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy3H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy3H2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy4H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.PR_Fy4H2}
                    </td>

                    {/* CF BIFURCATION */}
                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy1H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy1H2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy2H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy2H2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy3H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy3H2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy4H1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CF_Fy4H2}
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* TOTAL */}
              <tfoot>
                <tr className="sticky bottom-0 z-20 bg-amber-100 font-bold text-xs">
                  <td className="sticky left-0 z-40 bg-amber-100 font-semibold text-center">
                    Total
                  </td>

                  {/* PROJECT DETAILS */}
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>

                  {/* BUDGET DETAILS */}
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>
                  <td className="border border-slate-300"></td>

                  <td className="border border-slate-300">
                    {getTotal("Quantity")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("UnitRate")}
                  </td>

                  <td className="border border-slate-300"></td>

                  <td className="border border-slate-300">
                    {getTotal("ExchangeRate")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("BasicsInLac")}
                  </td>

                  <td className="border border-slate-300"></td>

                  {/* PR / CF */}
                  <td className="border border-slate-300">
                    {getTotal("NRTaxPercentage")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("NetCost")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("H1PR")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("H2PR")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("Total1")}
                  </td>

                  {/* YEAR 2 / CF */}
                  <td className="border border-slate-300">
                    {getTotal("Year2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("H1CF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("H2CF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("Total2")}
                  </td>

                  <td className="border border-slate-300"></td>

                  {/* PROPOSED */}
                  <td className="border border-slate-300">
                    {getTotal("ProposedQty")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("ProposedBudget")}
                  </td>

                  <td className="border border-slate-300"></td>

                  <td className="border border-slate-300">
                    {getTotal("ContingencyFactor")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("Vital")}
                  </td>

                  {/* MONTHLY NET CF */}
                  <td className="border border-slate-300">
                    {getTotal("AprNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("MayNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("JunNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("JulNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("AugNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("SepNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("OctNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("NovNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("DecNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("JanNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("FebNetCF")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("MarNetCF")}
                  </td>

                  {/* PR BIFURCATION */}
                  <td className="border border-slate-300">
                    {getTotal("PR_Fy1H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy1H2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy2H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy2H2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy3H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy3H2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy4H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("PR_Fy4H2")}
                  </td>

                  {/* CF BIFURCATION */}
                  <td className="border border-slate-300">
                    {getTotal("CF_Fy1H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy1H2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy2H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy2H2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy3H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy3H2")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy4H1")}
                  </td>

                  <td className="border border-slate-300">
                    {getTotal("CF_Fy4H2")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
      {approvalHistory.length > 0 && (
        <div className="mt-6 border border-slate-200 rounded bg-white overflow-hidden">
          <div className="px-4 py-3 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-700">
              Approval History
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra table-xs w-full">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th>S.No.</th>
                  <th>User ID</th>
                  <th>Employee</th>
                  <th>Action</th>
                  <th>Remarks</th>
                  <th>Date & Time</th>
                </tr>
              </thead>

              <tbody>
                {approvalHistory.map((item, index) => (
                  <tr key={item.HistoryId}>
                    <td>{index + 1}</td>

                    <td>{item.ActionPerformedBy}</td>
                    <td>{item.EmployeeName}</td>
                    <td>
                      <span className="badge badge-sm badge-neutral ">
                        {item.ActionPerformed}
                      </span>
                    </td>

                    <td>{item.Remarks || "-"}</td>

                    <td>{new Date(item.TDate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NonPDProjectDetail;
