import { useState, useEffect } from "react";
import PDHeader from "../pd/PDHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  SavePDMaster,
  UpdatePDMaster,
  GetPDMaster,
  DeletePDMaster,
  UpdatePDStatus,
  GetPDApprovalHistory,
} from "../../service/projectmaster";
import useUserStore from "../../store/userStore";

import { useLocation, useNavigate } from "react-router-dom";

type PDFormData = {
  capexDescription: string;
  capexRemarks: string;
  capexAmount: string;
  capexTotalPR: string;
  capexH1Fy1: string;
  capexH2Fy1: string;
  capexFy2: string;
  capexFy3: string;

  revenueDescription: string;
  revenueRemarks: string;
  revenueAmount: string;
  revenueTotalPR: string;
  revenueH1Fy1: string;
  revenueH2Fy1: string;
  revenueFy2: string;
  revenueFy3: string;

  carryForward: string;
  actualRevex: string;
  actualCapex: string;

  fundFlowCapH1: string;
  fundFlowCapH2: string;
  fundFlowRevH1: string;
  fundFlowRevH2: string;
  fundFlowH1: string;
  fundFlowH2: string;
  fundFlowTotal: string;
  fundFlow2: string;
  fundFlow3: string;
  fundFlow4: string;
  fundFlow5: string;

  cfCapH1: string;
  cfCapH2: string;
  cfRevH1: string;
  cfRevH2: string;
  cfH1: string;
  cfH2: string;
  cfTotal: string;
};

const initialFormState: PDFormData = {
  capexDescription: "",
  capexRemarks: "",
  capexAmount: "",
  capexTotalPR: "",
  capexH1Fy1: "",
  capexH2Fy1: "",
  capexFy2: "",
  capexFy3: "",

  revenueDescription: "",
  revenueRemarks: "",
  revenueAmount: "",
  revenueTotalPR: "",
  revenueH1Fy1: "",
  revenueH2Fy1: "",
  revenueFy2: "",
  revenueFy3: "",

  carryForward: "",
  actualRevex: "",
  actualCapex: "",

  fundFlowCapH1: "",
  fundFlowCapH2: "",
  fundFlowRevH1: "",
  fundFlowRevH2: "",
  fundFlowH1: "",
  fundFlowH2: "",
  fundFlowTotal: "",
  fundFlow2: "",
  fundFlow3: "",
  fundFlow4: "",
  fundFlow5: "",

  cfCapH1: "",
  cfCapH2: "",
  cfRevH1: "",
  cfRevH2: "",
  cfH1: "",
  cfH2: "",
  cfTotal: "",
};

const PDProjectDetail = () => {
  // type PDFormDataWithId = PDFormData & {
  //   id: string;
  // };

  const navigate = useNavigate();
  const [pdDetailId, setPDDetailId] = useState<number | null>(null);

  const location = useLocation();
  const [approvalHistory, setApprovalHistory] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState<PDFormData>(initialFormState);

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
    RecordId: pdDetailId?.toString() || "0",
    DeptId: data?.deptID.toString(),
    DraftStatus: draftStat,

    CapexDescription: formData.capexDescription,
    CapexRemarks: formData.capexRemarks,
    CapexAmount: formData.capexAmount,
    CapexTotalPR: formData.capexTotalPR,
    CapexH1Fy1: formData.capexH1Fy1,
    CapexH2Fy1: formData.capexH2Fy1,
    CapexFy2: formData.capexFy2,
    CapexFy3: formData.capexFy3,

    RevenueDescription: formData.revenueDescription,
    RevenueRemarks: formData.revenueRemarks,
    RevenueAmount: formData.revenueAmount,
    RevenueTotalPR: formData.revenueTotalPR,
    RevenueH1Fy1: formData.revenueH1Fy1,
    RevenueH2Fy1: formData.revenueH2Fy1,
    RevenueFy2: formData.revenueFy2,
    RevenueFy3: formData.revenueFy3,

    CarryForward: formData.carryForward,
    ActualRevex: formData.actualRevex,
    ActualCapex: formData.actualCapex,

    FundFlowCapH1: formData.fundFlowCapH1,
    FundFlowCapH2: formData.fundFlowCapH2,
    FundFlowRevH1: formData.fundFlowRevH1,
    FundFlowRevH2: formData.fundFlowRevH2,
    FundFlowH1: formData.fundFlowH1,
    FundFlowH2: formData.fundFlowH2,
    FundFlowTotal: formData.fundFlowTotal,
    FundFlow2: formData.fundFlow2,
    FundFlow3: formData.fundFlow3,
    FundFlow4: formData.fundFlow4,
    FundFlow5: formData.fundFlow5,

    CFCapH1: formData.cfCapH1,
    CFCapH2: formData.cfCapH2,
    CFRevH1: formData.cfRevH1,
    CFRevH2: formData.cfRevH2,
    CFH1: formData.cfH1,
    CFH2: formData.cfH2,
    CFTotal: formData.cfTotal,

    UserId: user?.userId, // replace with logged-in user
    FyYear: data?.FyYear,
    CategoryId: data?.categoryId || 1,
  });

  const fetchPDDetails = async () => {
    try {
      console.log(data?.projectID, data?.deptID);

      const response = await GetPDMaster(data?.projectID, data?.deptID);

      setRows(response);
    } catch (error) {
      console.error("Failed to fetch PD Details", error);
    }
  };

  const fetchApprovalHistory = async () => {
    try {
      const response = await GetPDApprovalHistory(
        data?.projectID,
        data?.deptID?.toString(),
      );

      setApprovalHistory(response || []);
    } catch (error) {
      console.error("Failed to fetch approval history", error);
    }
  };
  useEffect(() => {
    fetchPDDetails();
    fetchApprovalHistory();
  }, []);

  // const savePDData = async () => {
  //   try {
  //     const payload = buildPayload("DRAFT");

  //     if (!pdDetailId) {
  //       console.log("PD VALUE NOT FOUND");
  //       const response = await SavePDMaster(payload);
  //       setPDDetailId(response?.pdDetailId);
  //       console.log("PD Saved SAVE Successfully", response);
  //     } else {
  //       console.log("PD VALUE FOUND");
  //       const response = await UpdatePDMaster(payload, pdDetailId);
  //       setPDDetailId(response?.pdDetailId);
  //       console.log("PD Saved UPDATE Successfully", response);
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error("PD Save Failed", error);
  //     return false;
  //   }
  // };

  const savePDData = async () => {
    try {
      if (isRowEmpty()) {
        return false;
      }

      const payload = buildPayload("DRAFT");

      if (!pdDetailId) {
        const response = await SavePDMaster(payload);
        setPDDetailId(response?.pdDetailId);
      } else {
        const response = await UpdatePDMaster(payload, pdDetailId);
        setPDDetailId(response?.pdDetailId);
      }

      return true;
    } catch (error) {
      console.error("PD Save Failed", error);
      return false;
    }
  };

  const changeTab = async (tabIndex: number) => {
    // Save will happen only at the next/back button click
    // const success = await savePDData();

    // if (!success) return;

    setActiveTab(tabIndex);
  };

  const nextTab = async () => {
    const success = await savePDData();
    if (!success) return;

    console.log("This is success - NEXT", success);

    if (activeTab < tabs.length - 1) {
      setActiveTab((prev) => prev + 1);
    }

    fetchPDDetails();
  };

  const prevTab = async () => {
    const success = await savePDData();
    if (!success) return;

    console.log("This is success - NEXT", success);

    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    }
    fetchPDDetails();
  };

  const handleChange = (key: keyof PDFormData, value: string) => {
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
        await UpdatePDMaster(payload, Number(editingRowId));

        console.log("Row Updated");
      } else {
        if (!pdDetailId) {
          const response = await SavePDMaster(payload);
          setPDDetailId(response?.pdDetailId);
        } else {
          const response = await UpdatePDMaster(payload, pdDetailId);
          setPDDetailId(response?.pdDetailId);
        }

        console.log("Row Saved");
      }

      await fetchPDDetails();

      resetForm();

      setPDDetailId(null);

      setActiveTab(0);
    } catch (error) {
      console.error("Error saving row:", error);
    }
  };

  const handleEdit = (id: number) => {
    const row = rows.find((r) => r.PDDetailId === id);

    if (!row) return;

    setPDDetailId(row.PDDetailId);

    setFormData({
      capexDescription: row.CapexDescription || "",
      capexRemarks: row.CapexRemarks || "",
      capexAmount: row.CapexAmount || "",
      capexTotalPR: row.CapexTotalPR || "",
      capexH1Fy1: row.CapexH1Fy1 || "",
      capexH2Fy1: row.CapexH2Fy1 || "",
      capexFy2: row.CapexFy2 || "",
      capexFy3: row.CapexFy3 || "",

      revenueDescription: row.RevenueDescription || "",
      revenueRemarks: row.RevenueRemarks || "",
      revenueAmount: row.RevenueAmount || "",
      revenueTotalPR: row.RevenueTotalPR || "",
      revenueH1Fy1: row.RevenueH1Fy1 || "",
      revenueH2Fy1: row.RevenueH2Fy1 || "",
      revenueFy2: row.RevenueFy2 || "",
      revenueFy3: row.RevenueFy3 || "",

      carryForward: row.CarryForward || "",
      actualRevex: row.ActualRevex || "",
      actualCapex: row.ActualCapex || "",

      fundFlowCapH1: row.FundFlowCapH1 || "",
      fundFlowCapH2: row.FundFlowCapH2 || "",
      fundFlowRevH1: row.FundFlowRevH1 || "",
      fundFlowRevH2: row.FundFlowRevH2 || "",
      fundFlowH1: row.FundFlowH1 || "",
      fundFlowH2: row.FundFlowH2 || "",
      fundFlowTotal: row.FundFlowTotal || "",
      fundFlow2: row.FundFlow2 || "",
      fundFlow3: row.FundFlow3 || "",
      fundFlow4: row.FundFlow4 || "",
      fundFlow5: row.FundFlow5 || "",

      cfCapH1: row.CFCapH1 || "",
      cfCapH2: row.CFCapH2 || "",
      cfRevH1: row.CFRevH1 || "",
      cfRevH2: row.CFRevH2 || "",
      cfH1: row.CFH1 || "",
      cfH2: row.CFH2 || "",
      cfTotal: row.CFTotal || "",
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
      await DeletePDMaster(id);

      await fetchPDDetails();

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
      case 0:
        return [
          formData.capexDescription,
          formData.capexRemarks,
          formData.capexAmount,
          formData.capexTotalPR,
          formData.capexH1Fy1,
          formData.capexH2Fy1,
          formData.capexFy2,
          formData.capexFy3,
        ].some(hasValue);

      case 1:
        return [
          formData.revenueDescription,
          formData.revenueRemarks,
          formData.revenueAmount,
          formData.revenueTotalPR,
          formData.revenueH1Fy1,
          formData.revenueH2Fy1,
          formData.revenueFy2,
          formData.revenueFy3,
        ].some(hasValue);

      case 2:
        return [
          formData.carryForward,
          formData.actualRevex,
          formData.actualCapex,
        ].some(hasValue);

      case 3:
        return [
          formData.fundFlowCapH1,
          formData.fundFlowCapH2,
          formData.fundFlowRevH1,
          formData.fundFlowRevH2,
          formData.fundFlowH1,
          formData.fundFlowH2,
          formData.fundFlowTotal,
          formData.fundFlow2,
          formData.fundFlow3,
          formData.fundFlow4,
          formData.fundFlow5,
        ].some(hasValue);

      case 4:
        return [
          formData.cfCapH1,
          formData.cfCapH2,
          formData.cfRevH1,
          formData.cfRevH2,
          formData.cfH1,
          formData.cfH2,
          formData.cfTotal,
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

      // alert("Please click on Save All Entries before submitting for approval.");`

      const response = await UpdatePDStatus({
        projectId: data?.projectID,
        deptId: data?.deptID?.toString(),
        userId: user?.userId!,
        actionPerformed: "POSTED",
        remarks: "Submitted for approval",
      });

      alert(response.message);

      navigate("/myprojects"); // your route
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPDDetails();
  }, []);

  const tabs = [
    "Capex",
    "Revenue",
    "Carry Forward",
    "Fund Flow",
    "C/F Fund Flow",
  ];
  const inputStyle =
    "w-full h-8  px-3 text-xs border border-slate-200 rounded outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

  const getTotal = (field: string) =>
    rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);

  const summary = canEdit
    ? {
        capex: getNumber(formData.capexAmount),
        revenue: getNumber(formData.revenueAmount),
        carryForward: getNumber(formData.carryForward),
        actualRevex: getNumber(formData.actualRevex),
        actualCapex: getNumber(formData.actualCapex),
        fundFlow: getNumber(formData.fundFlowTotal),
        cfFundFlow: getNumber(formData.cfTotal),
      }
    : {
        capex: getTotal("CapexAmount"),
        revenue: getTotal("RevenueAmount"),
        carryForward: getTotal("CarryForward"),
        actualRevex: getTotal("ActualRevex"),
        actualCapex: getTotal("ActualCapex"),
        fundFlow: getTotal("FundFlowTotal"),
        cfFundFlow: getTotal("CFTotal"),
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
                    Capex
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Revenue
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Carry Forward
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Actual Revex
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Actual Capex
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    Fund Flow
                  </th>
                  <th className="border-r border-base-300 font-medium">
                    C/F Fund Flow
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="hover">
                  <td className="border border-base-300 font-semibold">
                    {summary.capex}
                  </td>

                  <td className="border border-base-300 font-semibold">
                    {summary.revenue}
                  </td>

                  <td className="border border-base-300 font-semibold">
                    {summary.carryForward}
                  </td>

                  <td className="border border-base-300 font-semibold">
                    {summary.actualRevex}
                  </td>

                  <td className="border border-base-300 font-semibold">
                    {summary.actualCapex}
                  </td>

                  <td className="border border-base-300 font-semibold">
                    {summary.fundFlow}
                  </td>

                  <td className="border border-base-300 font-semibold">
                    {summary.cfFundFlow}
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
          <div className="tabs tabs-box bg-gray-50 p-4 gap-x-2 tabs-xs  border border-slate-200">
            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 0 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 0}
              onClick={() => {
                changeTab(0);
              }}
              aria-label={`Capex | Bifurcation`}
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-2">
                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    className={`${inputStyle} py-2 overflow-y-hidden`}
                    value={formData.capexDescription}
                    onChange={(e) =>
                      handleChange("capexDescription", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Remarks
                  </label>
                  <textarea
                    value={formData.capexRemarks}
                    onChange={(e) =>
                      handleChange("capexRemarks", e.target.value)
                    }
                    className={`${inputStyle} py-2 overflow-y-hidden`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Amount
                  </label>
                  <input
                    className={inputStyle}
                    placeholder="Amount"
                    value={formData.capexAmount}
                    onChange={(e) =>
                      handleChange("capexAmount", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Total PR
                  </label>
                  <input
                    value={formData.capexTotalPR}
                    onChange={(e) =>
                      handleChange("capexTotalPR", e.target.value)
                    }
                    placeholder="Total PR"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    H1 FY 27
                  </label>
                  <input
                    value={formData.capexH1Fy1}
                    onChange={(e) => handleChange("capexH1Fy1", e.target.value)}
                    placeholder="H1 FY 27"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    H2 FY 27
                  </label>
                  <input
                    value={formData.capexH2Fy1}
                    onChange={(e) => handleChange("capexH2Fy1", e.target.value)}
                    placeholder="H2 FY 27"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    FY 28
                  </label>
                  <input
                    value={formData.capexFy2}
                    onChange={(e) => handleChange("capexFy2", e.target.value)}
                    placeholder="FY 28"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    FY 29
                  </label>
                  <input
                    value={formData.capexFy3}
                    onChange={(e) => handleChange("capexFy3", e.target.value)}
                    placeholder="FY 29"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 1 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 1}
              onClick={() => {
                changeTab(1);
              }}
              aria-label={`Revenue | Bifurcation`}
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-2">
                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    value={formData.revenueDescription}
                    onChange={(e) =>
                      handleChange("revenueDescription", e.target.value)
                    }
                    className={`${inputStyle} py-2 overflow-y-hidden`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Remarks
                  </label>
                  <textarea
                    value={formData.revenueRemarks}
                    onChange={(e) =>
                      handleChange("revenueRemarks", e.target.value)
                    }
                    className={`${inputStyle} py-2 overflow-y-hidden`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Amount
                  </label>
                  <input
                    value={formData.revenueAmount}
                    onChange={(e) =>
                      handleChange("revenueAmount", e.target.value)
                    }
                    placeholder="Amount"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Total PR
                  </label>
                  <input
                    value={formData.revenueTotalPR}
                    onChange={(e) =>
                      handleChange("revenueTotalPR", e.target.value)
                    }
                    placeholder="Total PR"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    H1 FY 27
                  </label>
                  <input
                    value={formData.revenueH1Fy1}
                    onChange={(e) =>
                      handleChange("revenueH1Fy1", e.target.value)
                    }
                    placeholder="H1 FY 27"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    H2 FY 27
                  </label>
                  <input
                    value={formData.revenueH2Fy1}
                    onChange={(e) =>
                      handleChange("revenueH2Fy1", e.target.value)
                    }
                    placeholder="H2 FY 27"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    FY 28
                  </label>
                  <input
                    value={formData.revenueFy2}
                    onChange={(e) => handleChange("revenueFy2", e.target.value)}
                    placeholder="FY 28"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    FY 29
                  </label>
                  <input
                    value={formData.revenueFy3}
                    onChange={(e) => handleChange("revenueFy3", e.target.value)}
                    placeholder="FY 29"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 2 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 2}
              onClick={() => {
                changeTab(2);
              }}
              aria-label="Carry Forward | Actual Spent"
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-6 ">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Carry Forward
                  </label>

                  <input
                    value={formData.carryForward}
                    onChange={(e) =>
                      handleChange("carryForward", e.target.value)
                    }
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Revex
                  </label>

                  <input
                    value={formData.actualRevex}
                    onChange={(e) =>
                      handleChange("actualRevex", e.target.value)
                    }
                    placeholder="Revex"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Capex
                  </label>

                  <input
                    value={formData.actualCapex}
                    onChange={(e) =>
                      handleChange("actualCapex", e.target.value)
                    }
                    placeholder="Capex"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 3 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 3}
              onClick={() => {
                changeTab(3);
              }}
              aria-label="Fund Flow"
            />
            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-6 ">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Cap H1
                  </label>

                  <input
                    value={formData.fundFlowCapH1}
                    onChange={(e) =>
                      handleChange("fundFlowCapH1", e.target.value)
                    }
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Cap H2
                  </label>

                  <input
                    value={formData.fundFlowCapH2}
                    onChange={(e) =>
                      handleChange("fundFlowCapH2", e.target.value)
                    }
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Rev H1
                  </label>

                  <input
                    value={formData.fundFlowRevH1}
                    onChange={(e) =>
                      handleChange("fundFlowRevH1", e.target.value)
                    }
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Rev H2
                  </label>

                  <input
                    value={formData.fundFlowRevH2}
                    onChange={(e) =>
                      handleChange("fundFlowRevH2", e.target.value)
                    }
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    H1
                  </label>

                  <input
                    value={formData.fundFlowH1}
                    onChange={(e) => handleChange("fundFlowH1", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    H2
                  </label>

                  <input
                    value={formData.fundFlowH2}
                    onChange={(e) => handleChange("fundFlowH2", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Total
                  </label>

                  <input
                    value={formData.fundFlowTotal}
                    onChange={(e) =>
                      handleChange("fundFlowTotal", e.target.value)
                    }
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Fund Flow 28
                  </label>

                  <input
                    value={formData.fundFlow2}
                    onChange={(e) => handleChange("fundFlow2", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Fund Flow 29
                  </label>

                  <input
                    value={formData.fundFlow3}
                    onChange={(e) => handleChange("fundFlow3", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Fund Flow 30
                  </label>

                  <input
                    value={formData.fundFlow4}
                    onChange={(e) => handleChange("fundFlow4", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Fund Flow 31
                  </label>

                  <input
                    value={formData.fundFlow5}
                    onChange={(e) => handleChange("fundFlow5", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              className={`tab ${activeTab === 4 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
              checked={activeTab === 4}
              onClick={() => {
                changeTab(4);
              }}
              aria-label="C/F Fund Flow"
            />

            <div className="tab-content border-base-300 bg-base-100 p-4">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-7 ">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Cap H1
                  </label>

                  <input
                    value={formData.cfCapH1}
                    onChange={(e) => handleChange("cfCapH1", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Cap H2
                  </label>

                  <input
                    value={formData.cfCapH2}
                    onChange={(e) => handleChange("cfCapH2", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Rev H1
                  </label>

                  <input
                    value={formData.cfRevH1}
                    onChange={(e) => handleChange("cfRevH1", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Rev H2
                  </label>

                  <input
                    value={formData.cfRevH2}
                    onChange={(e) => handleChange("cfRevH2", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    H1
                  </label>

                  <input
                    value={formData.cfH1}
                    onChange={(e) => handleChange("cfH1", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    H2
                  </label>

                  <input
                    value={formData.cfH2}
                    onChange={(e) => handleChange("cfH2", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Total
                  </label>

                  <input
                    value={formData.cfTotal}
                    onChange={(e) => handleChange("cfTotal", e.target.value)}
                    placeholder="amount"
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            <p className="text-sm text-error self-center  font-semibold">
              Please fill the entries and then click on next
            </p>
          </div>
        )}

        {canEdit && (
          <div className="flex gap-x-4 place-content-left m-4 ">
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
              <thead className="sticky top-0 z-30 ">
                <tr className="bg-red-500 text-white text-xs">
                  <th className="sticky left-0 z-40 bg-red-500 border  text-center">
                    Actions
                  </th>

                  <th colSpan={8} className="text-center border ">
                    CAPEX
                  </th>

                  <th colSpan={8} className="text-center border">
                    REVENUE
                  </th>

                  <th colSpan={3} className="text-center border ">
                    ACTUALS
                  </th>

                  <th colSpan={11} className="text-center border">
                    FUND FLOW
                  </th>

                  <th colSpan={7} className="text-center border">
                    C/F FUND FLOW
                  </th>
                </tr>

                <tr className="bg-slate-100 text-slate-800 ">
                  <th></th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Capex Desc
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Capex Remarks
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Amount
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Total PR
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    FY28
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    FY29
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Revenue Desc
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Revenue Remarks
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Amount
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Total PR
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    FY28
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    FY29
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Carry Fwd
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Act Revex
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Act Capex
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Cap H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Cap H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Rev H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Rev H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Total
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    FY28
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    FY29
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    FY30
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    FY31
                  </th>

                  <th className="border border-slate-300 font-medium text-xs">
                    Cap H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Cap H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Rev H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Rev H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    H1
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    H2
                  </th>
                  <th className="border border-slate-300 font-medium text-xs">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.PDDetailId} className="text-xs">
                    {/* Actions */}
                    <td className="sticky left-0 z-20 bg-white border border-slate-200">
                      {canEdit && (
                        <div className="flex gap-1 justify-center">
                          <button
                            className="btn btn-xs bg-red-500 text-white"
                            onClick={() => handleEdit(row.PDDetailId)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-xs bg-red-500 text-white"
                            onClick={() => handleDelete(row.PDDetailId)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>

                    {/* CAPEX */}
                    <td className="border border-slate-200 max-w-55 wrap-break-word whitespace-normal leading-4">
                      {row.CapexDescription}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word  whitespace-normal leading-4">
                      {row.CapexRemarks}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CapexAmount}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CapexTotalPR}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CapexH1Fy1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CapexH2Fy1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CapexFy2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CapexFy3}
                    </td>

                    {/* REVENUE */}
                    <td className="border border-slate-200 max-w-55 wrap-break-word  whitespace-normal leading-4">
                      {row.RevenueDescription}
                    </td>

                    <td className="border border-slate-200 max-w-55 wrap-break-word  whitespace-normal leading-4">
                      {row.RevenueRemarks}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.RevenueAmount}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.RevenueTotalPR}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.RevenueH1Fy1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.RevenueH2Fy1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.RevenueFy2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.RevenueFy3}
                    </td>

                    {/* ACTUALS */}
                    <td className="border border-slate-200 text-right">
                      {row.CarryForward}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.ActualRevex}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.ActualCapex}
                    </td>

                    {/* FUND FLOW */}
                    <td className="border border-slate-200 text-right">
                      {row.FundFlowCapH1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.FundFlowCapH2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.FundFlowRevH1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.FundFlowRevH2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.FundFlowH1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.FundFlowH2}
                    </td>

                    <td className="border border-slate-200 text-right font-semibold">
                      {row.FundFlowTotal}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.FundFlow2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.FundFlow3}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.FundFlow4}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.FundFlow5}
                    </td>

                    {/* CF FUND FLOW */}
                    <td className="border border-slate-200 text-right">
                      {row.CFCapH1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CFCapH2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CFRevH1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CFRevH2}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CFH1}
                    </td>

                    <td className="border border-slate-200 text-right">
                      {row.CFH2}
                    </td>

                    <td className="border border-slate-200 text-right font-semibold">
                      {row.CFTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="sticky bottom-0 z-20 bg-amber-100 font-bold text-xs">
                  <td className="sticky left-0 z-40 bg-amber-100 font-semibold text-center">
                    Total
                  </td>

                  {/* Capex */}
                  <td className="border border-slate-300 font-medium text-xs"></td>
                  <td className="border border-slate-300 font-medium text-xs"></td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CapexAmount")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CapexTotalPR")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CapexH1Fy1")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CapexH2Fy1")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CapexFy2")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CapexFy3")}
                  </td>

                  {/* Revenue */}
                  <td className="border border-slate-300 font-medium text-xs"></td>
                  <td className="border border-slate-300 font-medium text-xs"></td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("RevenueAmount")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("RevenueTotalPR")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("RevenueH1Fy1")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("RevenueH2Fy1")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("RevenueFy2")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("RevenueFy3")}
                  </td>

                  {/* Carry Forward */}
                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CarryForward")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("ActualRevex")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("ActualCapex")}
                  </td>

                  {/* Fund Flow */}
                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("FundFlowCapH1")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("FundFlowCapH2")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("FundFlowRevH1")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("FundFlowRevH2")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("FundFlowH1")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("FundFlowH2")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("FundFlowTotal")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("FundFlow2")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("FundFlow3")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("FundFlow4")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("FundFlow5")}
                  </td>

                  {/* C/F Fund Flow */}
                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CFCapH1")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CFCapH2")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CFRevH1")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CFRevH2")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CFH1")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CFH2")}
                  </td>

                  <td className="border border-slate-300 font-medium text-xs">
                    {getTotal("CFTotal")}
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

export default PDProjectDetail;
