import useUserStore from "../store/userStore";
import NavBar from "../components/NavBar";

const Home = () => {
  const user = useUserStore((s: any) => s.user);

  // Sample Data
  const pdProjects = [
    {
      srNo: 1,
      projectName: "Engine Upgrade",
      financialYear: "2025-26",
    },
    {
      srNo: 2,
      projectName: "Plant Automation",
      financialYear: "2026-27",
    },
    {
      srNo: 3,
      projectName: "New Product Design",
      financialYear: "2026-27",
    },
  ];

  const nonPdProjects = [
    {
      srNo: 1,
      projectName: "Training Program",
      financialYear: "2025-26",
    },
    {
      srNo: 2,
      projectName: "IT Infrastructure",
      financialYear: "2025-26",
    },
    {
      srNo: 3,
      projectName: "Office Renovation",
      financialYear: "2026-27",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <NavBar />

      <main className="mx-auto max-w-7xl p-6">
        {/* Welcome Section */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-8">
            <h2 className="text-3xl font-bold text-white">
              Welcome, {user?.userId ?? "User"} 👋
            </h2>

            <p className="mt-2 text-red-100">
              Manage and track your PD and Non PD projects from one place.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* PD Projects */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  PD Projects
                </h3>

                <p className="text-sm text-slate-500">
                  Product Development Projects
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {pdProjects.length} Projects
              </span>
            </div>

            <div className="space-y-3 p-4">
              {pdProjects.map((project) => (
                <div
                  key={project.srNo}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                      {project.srNo}
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {project.projectName}
                      </h4>

                      <p className="text-sm text-slate-500">
                        FY {project.financialYear}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Non PD Projects */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Non PD Projects
                </h3>

                <p className="text-sm text-slate-500">
                  Operations & Administrative Projects
                </p>
              </div>

              <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
                {nonPdProjects.length} Projects
              </span>
            </div>

            <div className="space-y-3 p-4">
              {nonPdProjects.map((project) => (
                <div
                  key={project.srNo}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-rose-300 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 font-bold text-rose-700">
                      {project.srNo}
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {project.projectName}
                      </h4>

                      <p className="text-sm text-slate-500">
                        FY {project.financialYear}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
