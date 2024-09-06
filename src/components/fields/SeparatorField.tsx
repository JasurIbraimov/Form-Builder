"use client";

import { CgFormatSeparator  } from "react-icons/cg";
import {
    ElementsType,
    FormElement,
    FormElementInstance,
} from "../FormElements";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
const type: ElementsType = "SeparatorField";

export const SeparatorFieldFormElement: FormElement = {
    type,
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    designerButtonElement: {
        icon: CgFormatSeparator,
        label: "Separator Field",
    },
    construct: (id: string) => ({
        id,
        type,
    }),
    validate: () => true,
};

function DesignerComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-muted-foreground">Separator field</Label>
            <Separator />
        </div>
    );
}

function FormComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    return <Separator />;
}

function PropertiesComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    return <p>No properties for this element.</p>;
}
