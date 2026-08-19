interface PDHeaderProps {
  projectID: string;
  projectName: string;
  deptName: string;
  deptID?: number;
  category: string;
  fyYear: string;
}

const PDHeader: React.FC<PDHeaderProps> = ({
  projectID,
  projectName,
  deptName,
  category,
  fyYear,
}) => {
  const inputStyle =
    "w-full h-8 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h3 className="mb-2 text-md font-semibold text-slate-800">
        Project Information
      </h3>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Project ID
          </label>
          <input value={projectID} readOnly className={inputStyle} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Project Name
          </label>
          <input value={projectName} readOnly className={inputStyle} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Department Name
          </label>
          <input value={deptName} readOnly className={inputStyle} />
        </div>

        {/* <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Department ID
          </label>
          <input value={deptID} readOnly className={inputStyle} />
        </div> */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>
          <input value={category} readOnly className={inputStyle} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            FY Year
          </label>
          <input value={fyYear} readOnly className={inputStyle} />
        </div>
      </div>
    </div>
  );
};

export default PDHeader;
