const PDHeader = () => {
  const inputStyle =
    "w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-100";
  return (
    <div className="rounded-2xl border border-slate-200 p-6">
      <h3 className="mb-5 text-lg font-semibold text-slate-800">
        Project Information
      </h3>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Project ID
          </label>

          <input defaultValue="PRJ-29391" className={inputStyle} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Project Name
          </label>

          <input placeholder="Project Name" className={inputStyle} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Department Name
          </label>

          <input placeholder="Department Name" className={inputStyle} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Department ID
          </label>

          <input placeholder="Department ID" className={inputStyle} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>

          <select defaultValue={1} className={inputStyle}>
            <option>Select Category</option>
            <option value={1}>PD</option>
            <option value={2}>Non PD</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            FY Year
          </label>

          <input placeholder="FY Year" className={inputStyle} />
        </div>
      </div>
    </div>
  );
};

export default PDHeader;
