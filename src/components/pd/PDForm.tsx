import { useState } from "react";
import PDHeader from "./PDHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const PDForm = () => {
  type PDFormDataWithId = PDFormData & {
    id: string;
  };
  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState<PDFormData>(initialFormState);

  const [rows, setRows] = useState<PDFormDataWithId[]>([]);

  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const isEditing = editingRowId !== null;
  const nextTab = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab((prev) => prev + 1);
    }
  };

  const prevTab = () => {
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

  const createRowId = () => `${Date.now()}-${Math.random()}`;

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingRowId(null);
  };

  const handleSave = () => {
    if (editingRowId) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingRowId ? { ...row, ...formData } : row,
        ),
      );
    } else {
      setRows((prev) => [
        ...prev,
        {
          id: createRowId(),
          ...formData,
        },
      ]);
    }

    resetForm();
  };

  const handleEdit = (id: string) => {
    const row = rows.find((r) => r.id === id);

    if (!row) return;

    setFormData(row);
    setEditingRowId(id);

    setActiveTab(0);
  };

  const handleDelete = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));

    if (editingRowId === id) {
      resetForm();
    }
  };

  const tabs = [
    "Capex",
    "Revenue",
    "Carry Forward",
    "Fund Flow",
    "C/F Fund Flow",
  ];
  const inputStyle =
    "w-full h-10 px-3 text-xs border border-slate-200 rounded-lg outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

  return (
    <div className="p-4 space-y-4">
      <PDHeader />

      <div className="rounded-2xl border-slate-200">
        {/* name of each tab group should be unique */}

        <div className="tabs tabs-box bg-slate-100 p-2 gap-x-2 tabs-xs">
          <input
            type="radio"
            name="my_tabs_2"
            className={`tab ${activeTab === 0 ? "font-semibold bg-red-500 text-white" : "text-gray-900 bg-white border shadow-sm border-gray-300"}`}
            checked={activeTab === 0}
            onClick={() => {
              setActiveTab(0);
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
                  className="textarea textarea-bordered w-full"
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
              setActiveTab(1);
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
              setActiveTab(2);
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
              setActiveTab(3);
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
              setActiveTab(4);
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
          <button className="btn btn-sm btn-neutral" onClick={prevTab}>
            <ChevronLeft />
            Back
          </button>
          <button className="btn btn-sm btn-neutral" onClick={nextTab}>
            Next
            <ChevronRight />
          </button>
          <button
            className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-red-600"
            onClick={handleSave}
          >
            {isEditing ? "Update Row" : "Add Row"}
          </button>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="mt-6 border border-slate-300 shadow-md overflow-hidden">
          <div className="overflow-x-auto w-full ">
            <table className="table table-zebra table-xs ">
              <thead className="sticky top-0 z-10 bg-slate-200 text-slate-800">
                <tr>
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

                  <th className="border border-slate-300 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="border border-slate-200 max-w-100 whitespace-normal wrap-break-word">
                      {row.capexDescription}
                    </td>
                    <td className="border border-slate-200 max-w-100 whitespace-normal wrap-break-word">
                      {row.capexRemarks}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.capexAmount}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.capexTotalPR}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.capexH1Fy1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.capexH2Fy1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.capexFy2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.capexFy3}
                    </td>

                    <td className="border border-slate-200 max-w-100 whitespace-normal wrap-break-word">
                      {row.revenueDescription}
                    </td>
                    <td className="border border-slate-200  max-w-100 whitespace-normal wrap-break-word">
                      {row.revenueRemarks}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.revenueAmount}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.revenueTotalPR}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.revenueH1Fy1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.revenueH2Fy1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.revenueFy2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.revenueFy3}
                    </td>

                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.carryForward}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.actualRevex}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.actualCapex}
                    </td>

                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.fundFlowCapH1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.fundFlowCapH2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.fundFlowRevH1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.fundFlowRevH2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.fundFlowH1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.fundFlowH2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.fundFlowTotal}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.fundFlow2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.fundFlow3}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.fundFlow4}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.fundFlow5}
                    </td>

                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.cfCapH1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.cfCapH2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.cfRevH1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.cfRevH2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.cfH1}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.cfH2}
                    </td>
                    <td className="border border-slate-200 whitespace-nowrap">
                      {row.cfTotal}
                    </td>

                    <td className="border border-slate-200 whitespace-nowrap">
                      <td className="border border-slate-200">
                        <div className="flex gap-2">
                          <button
                            className="btn btn-xs btn-primary"
                            onClick={() => handleEdit(row.id)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-xs btn-error"
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </td>
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

export default PDForm;
