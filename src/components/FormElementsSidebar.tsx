import React from "react";
import SidebarButtonElement from "./SidebarButtonElement";
import { FormElements } from "./FormElements";

const FormElementsSidebar = () => {
    return (
        <aside >
            <SidebarButtonElement formElement={FormElements.TextField} />
        </aside>
    );
};

export default FormElementsSidebar;
