import React from "react";
import { FormElements } from "./FormElements";
import SidebarButtonElement from "./SidebarButtonElement";

const DesignerSidebar = () => {
    return (
        <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow border-l-2 border-muted p-4 bg-background overflow-y-auto">
            <SidebarButtonElement formElement={FormElements.TextField} />
        </aside>
    );
};

export default DesignerSidebar;
