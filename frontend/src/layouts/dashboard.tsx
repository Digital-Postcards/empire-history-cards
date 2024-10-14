import CollapsibleSideBar from "components/dashboard/sidebar";
import React, { ReactNode, useState } from "react";
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    const [sideBarOpen, setSidebarOpen] = useState(true);
    return (
        <React.Fragment>
            <div className={`
            h-screen w-screen 
            grid ${sideBarOpen ? "grid-cols-sidebar" : "grid-cols-sidebarCollapsed"}
            transition-[grid-template-columns] duration-50 ease-in-out
            `}
            >
                <CollapsibleSideBar collapseSidebar={setSidebarOpen} isCollapseSidebar={sideBarOpen} />
                <div className="grid grid-cols-5 gap-3">
                    <Outlet />
                </div>
            </div>
        </React.Fragment>
    )
}

export default DashboardLayout;