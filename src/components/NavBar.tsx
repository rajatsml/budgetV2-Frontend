import { Link, useLocation, useNavigate } from "react-router-dom";

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
  const department = useUserStore((s: any) => s.department);

  const isAdmin = user?.role === "Admin";
  const isUser = user?.role === "User";

  console.log(user);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
                  to="/allprojects"
                  className={navLinkClass("/allprojects")}
                >
                  <FolderKanban size={16} />
                  All Projects
                </Link>
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
                  My Projects
                </Link>

                <Link
                  to="/add-project-pd"
                  className={navLinkClass("/add-project-pd")}
                >
                  <PlusSquare size={16} />
                  Add PD Project
                </Link>
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
