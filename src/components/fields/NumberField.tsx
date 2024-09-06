"use client";

import { Bs123  } from "react-icons/bs";
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

const type: ElementsType = "NumberField";
const fieldLabel = "Number Field";

const extraAttributes = {
    label: fieldLabel,
    helperText: "Helper text",
    required: false,
    placeholder: "0",
};

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
    placeholder: z.string().max(50),
});

export const NumberFieldFormElement: FormElement = {
    type,
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    designerButtonElement: {
        icon: Bs123 ,
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
            return currentValue.length > 0;
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
    const { label, required, placeholder, helperText } =
        element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>

            <Input readOnly type="number" disabled placeholder={placeholder} />
            {helperText && (
                <p className="text-muted-foreground text-[0.8rem]">
                    {helperText}
                </p>
            )}
        </div>
    );
}

function FormComponent({
    elementInstance,
    submitValue,
    isInvalid,
    defaultValue
}: {
    elementInstance: FormElementInstance;
    submitValue?: SubmitFunction;
    isInvalid?: boolean;
    defaultValue?: string;
}) {
    const element = elementInstance as CustomInstance;
    const { label, required, placeholder, helperText } =
        element.extraAttributes;
    const [value, setValue] = useState(defaultValue || "");
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(isInvalid === true);
    }, [isInvalid]);

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className={cn(error && "text-red-500")}>
                {label}
                {required && "*"}
            </Label>
            <Input
                className={cn(error && "border-red-500")}
                placeholder={placeholder}
                value={value}
                type="number"
                onBlur={(e) => {
                    if (!submitValue) return;
                    const valid = NumberFieldFormElement.validate(
                        element,
                        e.target.value
                    );
                    if (valid) {
                        submitValue(element.id, e.target.value);
                    } else {
                        setError(!valid);
                    }
                }}
                onChange={(e) => setValue(e.target.value)}
            />
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
            placeholder,
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
                    name="placeholder"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Placeholder</FormLabel>
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
                                The placeholder on the field
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
