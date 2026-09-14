import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import useUserStore from "../store/userStore";
import {
  LayoutDashboard,
  FolderKanban,
  PlusSquare,
  LogOut,
  UserCircle2,
  Building2,
  ShieldCheck,
} from "lucide-react";

const NavBar = () => {
  const logout = useUserStore((s: any) => s.logout);
  const user = useUserStore((s: any) => s.user);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const department = useUserStore((s: any) => s.department);

  const [showProjectsMenu, setShowProjectsMenu] = useState(false);

  const isAdmin = user?.role === "Admin";
  const isUser = user?.role === "User";

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowProjectsMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const navLinkClass = (path: string) =>
    `flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? "bg-rose-50 text-rose-600 shadow-sm border border-rose-100"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <Link
            to="/home"
            className="text-lg font-bold tracking-tight text-rose-600 hover:opacity-90"
          >
            SML Mahindra Limited
          </Link>

          <div className="flex items-center gap-1.5">
            {isAdmin && (
              <>
                <Link to="/home" className={navLinkClass("/home")}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link
                  to="/add-project-pd"
                  className={navLinkClass("/add-project-pd")}
                >
                  <PlusSquare size={16} />
                  Add PD Project
                </Link>
                <Link
                  to="/posted-projects"
                  className={navLinkClass("/posted-projects")}
                >
                  <FolderKanban size={16} />
                  Posted Projects
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProjectsMenu(!showProjectsMenu)}
                    className=" hover:cursor-pointer flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <FolderKanban size={16} />
                    Project Views
                    {showProjectsMenu ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>

                  {showProjectsMenu && (
                    <div className="absolute left-0 top-full mt-2 w-40 rounded border border-slate-200 bg-white shadow-lg z-50 p-2">
                      <Link
                        to="/afcc"
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
                      >
                        AFCC Sheet
                      </Link>

                      <Link
                        to="/afcc-summary"
                        className="block px-4 py-2 text-sm hover:bg-slate-100"
                      >
                        AFCC Summary
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {isUser && (
              <>
                <Link to="/home" className={navLinkClass("/home")}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link to="/myprojects" className={navLinkClass("/myprojects")}>
                  <FolderKanban size={16} />
                  Budget Inputs PD
                </Link>
                <Link
                  to="/nonpd-records"
                  className={navLinkClass("/nonpd-records")}
                >
                  <FolderKanban size={16} />
                  Budget Inputs Non PD
                </Link>
                {user?.isBudgetManager && (
                  <Link
                    to="/pd-budget-manager-projects"
                    className={navLinkClass("/pd-budget-manager-projects")}
                  >
                    <FolderKanban size={16} />
                    Actual Spent Projects
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* User Profile Card */}
          <div className="flex items-center gap-3 border-r border-slate-100 pr-6">
            <UserCircle2 size={36} className="text-slate-400 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800 max-w-100 truncate">
                  {user?.employeeName || "Guest"}
                  {user?.userId && (
                    <span className="ml-1 text-xs font-normal text-slate-500">
                      ({user.userId})
                    </span>
                  )}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-600 border border-rose-100">
                  <ShieldCheck size={10} />
                  {user?.gradeCode || "User"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Building2 size={12} className="text-slate-400" />
                <span className="max-w-30 truncate">
                  {department || user?.deptNameShort}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
