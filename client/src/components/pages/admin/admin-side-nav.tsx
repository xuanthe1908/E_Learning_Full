import React, { useState } from "react";
import { Card, Typography, List, Button } from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import { APP_LOGO } from "../../../constants/common";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearToken } from "../../../redux/reducers/authSlice";

const navItems = [
  { icon: PresentationChartBarIcon, label: "Dashboard", path: "/admin" },
  { icon: AcademicCapIcon, label: "Instructors", path: "/admin/instructors" },
  { icon: UserGroupIcon, label: "Students", path: "/admin/students" },
  { icon: BookOpenIcon, label: "Categories", path: "/admin/categories" },
  { icon: Square3Stack3DIcon, label: "Courses", path: "/admin/courses" },
  { icon: Cog6ToothIcon, label: "Settings", path: "/admin/settings" },
];

export function AdminSideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getSelectedLabel = () => {
    const match = navItems.find((item) => location.pathname === item.path);
    if (match) return match.label;
    if (location.pathname.startsWith("/admin/instructors")) return "Instructors";
    if (location.pathname.startsWith("/admin/students")) return "Students";
    if (location.pathname.startsWith("/admin/categories")) return "Categories";
    if (location.pathname.startsWith("/admin/courses")) return "Courses";
    if (location.pathname.startsWith("/admin/settings")) return "Settings";
    return "Dashboard";
  };

  const [selected, setSelected] = useState(getSelectedLabel());

  const handleLogout = () => {
    dispatch(clearToken());
    navigate("/admin");
  };

  const renderNavItem = (
    icon: React.ElementType,
    label: string,
    path: string
  ) => {
    const isSelected = selected === label;
    const content = (
      <li
        className={`cursor-pointer flex items-center gap-2 p-2.5 rounded-lg ${
          isSelected ? "" : "font-semibold text-xs uppercase m-1"
        }`}
        onClick={() => setSelected(label)}
      >
        {React.createElement(icon, { className: "h-6 w-6" })}
        {label}
      </li>
    );

    return (
      <Link to={path} key={label}>
        {isSelected ? (
          <Button fullWidth className="p-1 text-xs m-1" size="sm" variant="gradient">
            {content}
          </Button>
        ) : (
          content
        )}
      </Link>
    );
  };

  return (
    <Card className="h-[calc(100vh-1rem)] w-full max-w-[20rem] p-4 m-3 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 flex items-center gap-4 p-4">
        <img src={APP_LOGO} alt="brand" className="h-8 w-8" />
        <Typography variant="h5" color="blue-gray">
          TutorTrek
        </Typography>
      </div>
      <List>
        {navItems.map(({ icon, label, path }) => renderNavItem(icon, label, path))}
        <li
          className="cursor-pointer font-semibold text-xs uppercase flex items-center gap-2 p-2.5 m-1 rounded-lg text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <PowerIcon className="h-6 w-6" />
          Log Out
        </li>
      </List>
    </Card>
  );
}
