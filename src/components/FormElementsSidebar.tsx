import React from "react";
import SidebarButtonElement from "./SidebarButtonElement";
import { FormElements } from "./FormElements";
import { Separator } from "./ui/separator";

const FormElementsSidebar = () => {
    return (
        <aside>
            <p className="text-sm text-foreground/70">Drag and drop elements</p>
            <Separator className="my-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
                <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">Layout Elements</p>
                <SidebarButtonElement formElement={FormElements.TitleField} />
                <SidebarButtonElement formElement={FormElements.SubTitleField} />
                <SidebarButtonElement formElement={FormElements.ParagraphField} />
                <SidebarButtonElement formElement={FormElements.SeparatorField} />
                <SidebarButtonElement formElement={FormElements.SpacerField} />
                
                <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">Form Elements</p>
                <SidebarButtonElement formElement={FormElements.TextField} />
                <SidebarButtonElement formElement={FormElements.NumberField} />
                <SidebarButtonElement formElement={FormElements.EmailFIeld} />
                <SidebarButtonElement formElement={FormElements.TextareaField} />
                <SidebarButtonElement formElement={FormElements.DateField} />
                <SidebarButtonElement formElement={FormElements.SelectField} />
                <SidebarButtonElement formElement={FormElements.CheckboxField} />
            
            </div>
        </aside>
    );
};

export default FormElementsSidebar;
