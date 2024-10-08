import React from "react";
import useDesigner from "./hooks/useDesigner";
import FormElementsSidebar from "./FormElementsSidebar";
import PropertiesFormSidebar from "./PropertiesFormSidebar";

const DesignerSidebar = () => {
    const { selectedElement } = useDesigner()
    return (
        <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow border-l-2 border-muted p-4 bg-background overflow-y-auto">
            {!selectedElement && <FormElementsSidebar/>}
            {selectedElement && <PropertiesFormSidebar/>}
        </aside>
    );
};

export default DesignerSidebar;
