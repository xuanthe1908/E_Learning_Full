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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearToken } from "../../../redux/reducers/authSlice";
import { toast } from "react-toastify";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  isLogout?: boolean;
}

export function AdminSideNav() {
  const [selected, setSelected] = useState("Dashboard"); // Set the default selected item here
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const navItems: NavItem[] = [
    { icon: PresentationChartBarIcon, label: "Dashboard", path: "" },
    { icon: AcademicCapIcon, label: "Sellers", path: "sellers" },
    { icon: UserGroupIcon, label: "Customers", path: "customers" },
    { icon: BookOpenIcon, label: "Categories", path: "categories" },
    { icon: Square3Stack3DIcon, label: "Products", path: "products" },
    { icon: Cog6ToothIcon, label: "Settings", path: "settings" },
    { icon: PowerIcon, label: "Log Out", path: "", isLogout: true },
  ];

  const handleNavItemSelect = (val: string) => {
    setSelected(val);
  };

  const handleLogout = () => {
    dispatch(clearToken());
    toast.success("Đã đăng xuất thành công", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    navigate("/admin");
  };  

  return (
    <Card className="h-[calc(100vh-1rem)] w-full max-w-[20rem] p-4 m-3 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 flex items-center gap-4 p-4">
        <img src={APP_LOGO} alt="brand" className="h-8 w-auto" />
        {/* <Typography variant="h5" color="blue-gray">
          Hyper
        </Typography> */}
      </div>
      <List>
        {navItems.map((item, index) => {
          if (item.isLogout) {
            // Logout button - no Link, just onClick handler
            return (
              <li
                key={index}
                className={`cursor-pointer font-semibold text-xs uppercase flex items-center gap-2 p-2.5 m-1 rounded-lg hover:bg-red-50 hover:text-red-600`}
                onClick={handleLogout}
              >
                {React.createElement(item.icon, { className: "h-6 w-6" })}
                {item.label}
              </li>
            );
          }
          
          // Regular nav items with Link
          return (
            <Link to={`/admin/${item.path}`} key={index}>
              {selected === item.label ? (
                <Button fullWidth className="p-1 text-xs m-1" size="sm" variant="gradient">
                  <li
                    className={`cursor-pointer  flex items-center gap-2 p-2.5 rounded-lg`}
                    onClick={() => handleNavItemSelect(item.label)}
                  >
                    {React.createElement(item.icon, { className: "h-6 w-6" })}
                    {item.label}
                  </li>
                </Button>
              ) : (
                <li  
                  className={`cursor-pointer font-semibold text-xs uppercase flex items-center gap-2 p-2.5 m-1 rounded-lg`}
                  onClick={() => handleNavItemSelect(item.label)}
                >
                  {React.createElement(item.icon, { className: "h-6 w-6" })}
                  {item.label}   
                </li>
              )}
            </Link>
          );
        })}
      </List>
    </Card>
  );
}