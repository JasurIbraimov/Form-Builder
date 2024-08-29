"use client";

import { LuTextCursorInput } from "react-icons/lu";
import {
    ElementsType,
    FormElement,
    FormElementInstance,
} from "../FormElements";

const type: ElementsType = "TextField";

export const TextFieldFormElement: FormElement = {
    type,
    designerComponent: DesignerComponent,
    formComponent: () => <div>Form component</div>,
    propertiesComponent: () => <div>Properties component</div>,
    designerButtonElement: {
        icon: LuTextCursorInput,
        label: "Text field",
    },
    construct: (id: string) => ({
        id,
        type,
        extraAttributes: {
            label: "Text field",
            helperText: "Helper text",
            required: false,
            placeholder: "Value here...",
        },
    }),
};

function DesignerComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    return (
        <div className="text-white">
            {elementInstance.extraAttributes?.label}
        </div>
    );
}
