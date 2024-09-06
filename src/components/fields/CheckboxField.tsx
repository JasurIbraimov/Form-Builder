"use client";

import { LuCheckSquare } from "react-icons/lu";
import {
    ElementsType,
    FormElement,
    FormElementInstance,
    SubmitFunction,
} from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";

const type: ElementsType = "CheckboxField";
const fieldLabel = "Checkbox Field";

const extraAttributes = {
    label: fieldLabel,
    helperText: "Helper text",
    required: false,
};

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
});

export const CheckboxFieldFormElement: FormElement = {
    type,
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    designerButtonElement: {
        icon: LuCheckSquare,
        label: fieldLabel,
    },
    construct: (id: string) => ({
        id,
        type,
        extraAttributes,
    }),
    validate: (formElement: FormElementInstance, currentValue: string) => {
        const element = formElement as CustomInstance;
        if (element.extraAttributes.required) {
            return currentValue === "true";
        }

        return true;
    },
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
    const { label, required, helperText } = element.extraAttributes;
    const id = `checkbox-${element.id}`;

    return (
        <div className="flex items-start space-x-2">
            <Checkbox id={id} />
            <div className="grid gap-1.5 leading-none">
                <Label htmlFor={id}>
                    {label}
                    {required && "*"}
                </Label>

                {helperText && (
                    <p className="text-muted-foreground text-[0.8rem]">
                        {helperText}
                    </p>
                )}
            </div>
        </div>
    );
}

function FormComponent({
    elementInstance,
    submitValue,
    isInvalid,
    defaultValue,
}: {
    elementInstance: FormElementInstance;
    submitValue?: SubmitFunction;
    isInvalid?: boolean;
    defaultValue?: string;
}) {
    const element = elementInstance as CustomInstance;
    const { label, required, helperText } =
        element.extraAttributes;
    const [value, setValue] = useState<boolean>(
        defaultValue === "true" ? true : false
    );
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(isInvalid === true);
    }, [isInvalid]);

    const id = `checkbox-${element.id}`;

    return (
        <div className="flex items-start space-x-2">
            <Checkbox
                id={id}
                checked={value}
                className={cn(error && "border-red-500")}
                onCheckedChange={(checked) => {
                    setValue(checked === true);
                    if (!submitValue) return;
                    const stringValue = checked === true ? "true" : "false";
                    const valid = CheckboxFieldFormElement.validate(
                        element,
                        stringValue
                    );
                    setError(!valid);
                    submitValue(element.id, stringValue);
                }}
            />
            <div className="grid gap-1.5 leading-none">
                <Label htmlFor={id} className={cn(error && "text-red-500")}>
                    {label}
                    {required && "*"}
                </Label>

                {helperText && (
                    <p
                        className={cn(
                            "text-muted-foreground text-[0.8rem]",
                            error && "text-red-500"
                        )}
                    >
                        {helperText}
                    </p>
                )}
            </div>
        </div>
    );
}

function PropertiesComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance;
}) {
    const { updateElement } = useDesigner();

    const element = elementInstance as CustomInstance;
    const { label, helperText, placeholder, required } =
        element.extraAttributes;
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            label,
            helperText,
            required,
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
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input
                                    onKeyDown={(e) => {
                                        if (e.key == "Enter") {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                The label on the field
                                <br />
                                It will be displayed above the field
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="helperText"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Helper text</FormLabel>
                            <FormControl>
                                <Input
                                    onKeyDown={(e) => {
                                        if (e.key == "Enter") {
                                            e.currentTarget.blur();
                                        }
                                    }}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                The helper text of the field <br />
                                It will be displayed below the field
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="required"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg p-3 border shadow-sm">
                            <div className="space-y-0.5 ">
                                <FormLabel>Required</FormLabel>
                                <FormDescription>
                                    Provides requirement of the field
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
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
