"use client";

import { CgSpaceBetweenV  } from "react-icons/cg";
import {
    ElementsType,
    FormElement,
    FormElementInstance,
} from "../FormElements";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "../hooks/useDesigner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Slider } from "../ui/slider";

const type: ElementsType = "SpacerField";
const fieldLabel = "Spacer Field";

const extraAttributes = {
    height: 20,
};

const propertiesSchema = z.object({
    height: z.number().min(5).max(200),
});

export const SpacerFieldFormElement: FormElement = {
    type,
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    designerButtonElement: {
        icon: CgSpaceBetweenV,
        label: fieldLabel,
    },
    construct: (id: string) => ({
        id,
        type,
        extraAttributes,
    }),
    validate: () => true,
};

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
};

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function DesignerComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    const element = elementInstance as CustomInstance;
    const { height } = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full items-center">
            <Label className="text-muted-foreground">
                {fieldLabel}: {height}px
            </Label>
            <CgSpaceBetweenV  className="h-8 w-8" />
        </div>
    );
}

function FormComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    const element = elementInstance as CustomInstance;
    const { height } = element.extraAttributes;
    return <div style={{ height, width: "100%" }}></div>;
}

function PropertiesComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    const { updateElement } = useDesigner();

    const element = elementInstance as CustomInstance;
    const { height } = element.extraAttributes;
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            height,
        },
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [form, element]);

    function applyChanges(values: propertiesFormSchemaType) {
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                ...values,
            },
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => e.preventDefault()}
                onBlur={form.handleSubmit(applyChanges)}
                className="space-y-3"
            >
                <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Height: {form.watch("height")}px
                            </FormLabel>
                            <FormControl className="pt-2">
                                <Slider
                                    defaultValue={[field.value]}
                                    min={5}
                                    max={200}
                                    step={1}
                                    onValueChange={(value) => {
                                        field.onChange(value[0]);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
