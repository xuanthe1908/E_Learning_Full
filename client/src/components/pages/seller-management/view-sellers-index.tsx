import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Viewsellers from "./view-sellers";
import CustomBreadCrumbs from "../../common/bread-crumbs";
import TopNav from "./top-nav";
const ViewsellersIndex: React.FC = () => {
  const location = useLocation();
  return (
    <div className=''> 
      <TopNav  />  
      <div className="pl-5 pr-5 pt-3 ">
      <CustomBreadCrumbs  paths={location.pathname}/>
      {location.pathname === "/admin/sellers" && <Viewsellers />}
      <Outlet />
      </div>  
    </div>
  );
};

export default ViewsellersIndex;



























