import { useState, useEffect } from "react";
import PDHeader from "../pd/PDHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  SavePDMaster,
  UpdatePDMaster,
  GetPDMaster,
  DeletePDMaster,
} from "../../service/projectmaster";

import { useLocation } from "react-router-dom";

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

const PDProjecDetail = () => {
  // type PDFormDataWithId = PDFormData & {
  //   id: string;
  // };

  const [pdDetailId, setPDDetailId] = useState<number | null>(null);

  const location = useLocation();

  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState<PDFormData>(initialFormState);

  const [rows, setRows] = useState<any[]>([]);

  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const isEditing = editingRowId !== null;

  const data = location.state;

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

    UserId: "13254", // replace with logged-in user
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

  const savePDData = async () => {
    try {
      const payload = buildPayload("DRAFT");

      if (!pdDetailId) {
        console.log("PD VALUE NOT FOUND");
        const response = await SavePDMaster(payload);
        setPDDetailId(response?.pdDetailId);
        console.log("PD Saved SAVE Successfully", response);
      } else {
        console.log("PD VALUE FOUND");
        const response = await UpdatePDMaster(payload, pdDetailId);
        setPDDetailId(response?.pdDetailId);
        console.log("PD Saved UPDATE Successfully", response);
      }

      return true;
    } catch (error) {
      console.error("PD Save Failed", error);
      return false;
    }
  };

  const changeTab = async (tabIndex: number) => {
    const success = await savePDData();

    if (!success) return;

    setActiveTab(tabIndex);
  };

  const nextTab = async () => {
    const success = await savePDData();
    if (!success) return;

    console.log("This is success - NEXT", success);

    if (activeTab < tabs.length - 1) {
      setActiveTab((prev) => prev + 1);
    }
  };

  const prevTab = async () => {
    const success = await savePDData();
    if (!success) return;

    console.log("This is success - NEXT", success);

    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    }
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
  ``;

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
    "w-full h-8  px-3 text-xs border border-slate-200 rounded-lg outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

  return (
    <div className="p-4 space-y-4">
      <PDHeader
        projectID={data?.projectID}
        projectName={data?.projectName}
        deptName={data?.deptName}
        deptID={data?.deptID}
        category={data?.category}
        fyYear={data?.FyYear}
      />

      <div className=" border-slate-200 rounded-xl">
        {/* name of each tab group should be unique */}

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
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={1}
                  className="textarea textarea-xs"
                  value={formData.capexDescription}
                  onChange={(e) =>
                    handleChange("capexDescription", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Remarks
                </label>
                <textarea
                  rows={1}
                  value={formData.capexRemarks}
                  onChange={(e) => handleChange("capexRemarks", e.target.value)}
                  className="textarea textarea-bordered w-full"
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
                  onChange={(e) => handleChange("capexAmount", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Total PR
                </label>
                <input
                  value={formData.capexTotalPR}
                  onChange={(e) => handleChange("capexTotalPR", e.target.value)}
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

              {/* Left Side */}
              {/* <div className="space-y-4"></div> */}

              {/* Right Side */}
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div> */}
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
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={formData.revenueDescription}
                  onChange={(e) =>
                    handleChange("revenueDescription", e.target.value)
                  }
                  className="textarea textarea-bordered w-full h-20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Remarks
                </label>
                <textarea
                  value={formData.revenueRemarks}
                  onChange={(e) =>
                    handleChange("revenueRemarks", e.target.value)
                  }
                  className="textarea textarea-bordered w-full h-20"
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
                  onChange={(e) => handleChange("revenueH1Fy1", e.target.value)}
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
                  onChange={(e) => handleChange("revenueH2Fy1", e.target.value)}
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

              {/* Left Side */}

              {/* Right Side */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
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
                  onChange={(e) => handleChange("carryForward", e.target.value)}
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
                  onChange={(e) => handleChange("actualRevex", e.target.value)}
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
                  onChange={(e) => handleChange("actualCapex", e.target.value)}
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
        </div>

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
            disabled={activeTab === tabs.length - 1}
          >
            Next
            <ChevronRight />
          </button>
          <button
            className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600"
            onClick={handleSave}
          >
            {isEditing ? "Update Row" : "Save All Entries"}
          </button>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="mt-6 border border-slate-300 shadow-md overflow-hidden">
          <div className="overflow-x-auto w-full ">
            <table className="table table-zebra table-xs ">
              <thead className="sticky top-0 z-10 bg-slate-200 text-slate-800">
                <tr>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Actions
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap ">
                    Capex Desc
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Capex Remarks
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Capex Amount
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Capex Total PR
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Capex H1
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Capex H2
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Capex FY28
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Capex FY29
                  </th>

                  <th className="border border-slate-300 whitespace-nowrap">
                    Revenue Desc
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Revenue Remarks
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Revenue Amount
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Revenue Total PR
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Revenue H1
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Revenue H2
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Revenue FY28
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Revenue FY29
                  </th>

                  <th className="border border-slate-300 whitespace-nowrap">
                    Carry Forward
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Actual Revex
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    Actual Capex
                  </th>

                  <th className="border border-slate-300 whitespace-nowrap">
                    FF Cap H1
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    FF Cap H2
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    FF Rev H1
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    FF Rev H2
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    FF H1
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    FF H2
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    FF Total
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    FF 28
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    FF 29
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    FF 30
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    FF 31
                  </th>

                  <th className="border border-slate-300 whitespace-nowrap">
                    CF Cap H1
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    CF Cap H2
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    CF Rev H1
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    CF Rev H2
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    CF H1
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    CF H2
                  </th>
                  <th className="border border-slate-300 whitespace-nowrap">
                    CF Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.PDDetailId}>
                    <td className="border border-slate-200 whitespace-nowrap">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="btn btn-xs btn-neutral"
                          onClick={() => handleEdit(row.PDDetailId)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-xs btn-neutral text-white"
                          onClick={() => handleDelete(row.PDDetailId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>

                    {/* Capex */}
                    <td className="border border-slate-200 max-w-48 whitespace-normal wrap-break-word">
                      {row.CapexDescription}
                    </td>
                    <td className="border border-slate-200 max-w-48 whitespace-normal wrap-break-word">
                      {row.CapexRemarks}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CapexAmount}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CapexTotalPR}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CapexH1Fy1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CapexH2Fy1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CapexFy2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CapexFy3}
                    </td>

                    {/* Revenue */}
                    <td className="border border-slate-200 max-w-48 whitespace-normal wrap-break-word">
                      {row.RevenueDescription}
                    </td>
                    <td className="border border-slate-200 max-w-48 whitespace-normal wrap-break-word">
                      {row.RevenueRemarks}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.RevenueAmount}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.RevenueTotalPR}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.RevenueH1Fy1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.RevenueH2Fy1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.RevenueFy2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.RevenueFy3}
                    </td>

                    {/* Carry Forward */}
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CarryForward}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.ActualRevex}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.ActualCapex}
                    </td>

                    {/* Fund Flow */}
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.FundFlowCapH1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.FundFlowCapH2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.FundFlowRevH1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.FundFlowRevH2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.FundFlowH1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.FundFlowH2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.FundFlowTotal}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.FundFlow2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.FundFlow3}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.FundFlow4}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.FundFlow5}
                    </td>

                    {/* C/F Fund Flow */}
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CFCapH1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CFCapH2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CFRevH1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CFRevH2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CFH1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CFH2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.CFTotal}
                    </td>

                    {/* Actions */}
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

export default PDProjecDetail;
