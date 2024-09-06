"use client";

import { GoSingleSelect } from "react-icons/go";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { LuPlus, LuX } from "react-icons/lu";
import { Button } from "../ui/button";

const type: ElementsType = "SelectField";
const fieldLabel = "Select Field";

const extraAttributes = {
    label: fieldLabel,
    helperText: "Helper text",
    required: false,
    placeholder: "Value here...",
    options: [],
};

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
    placeholder: z.string().max(50),
    options: z.array(z.string()).default([]),
});

export const SelectFieldFormElement: FormElement = {
    type,
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    designerButtonElement: {
        icon: GoSingleSelect,
        label: fieldLabel,
    },
    construct: (id: string) => ({
        id,
        type,
        extraAttributes,
    }),
    validate: (formElement: FormElementInstance, currentValue: string) => {
        const {
            extraAttributes: { required, options },
        } = formElement as CustomInstance;
        if (required) {
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
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
            </Select>
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
    defaultValue,
}: {
    elementInstance: FormElementInstance;
    submitValue?: SubmitFunction;
    isInvalid?: boolean;
    defaultValue?: string;
}) {
    const element = elementInstance as CustomInstance;
    const { label, required, placeholder, options, helperText } =
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
            <Select
                defaultValue={value}
                onValueChange={(value) => {
                    setValue(value);
                    if (!submitValue) return;
                    const valid = SelectFieldFormElement.validate(
                        element,
                        value
                    );
                    setError(!valid);
                    submitValue(element.id, value);
                }}
            >
                <SelectTrigger
                    className={cn("w-full", error && "border-red-500")}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
    const { updateElement, setSelectedElement } = useDesigner();

    const element = elementInstance as CustomInstance;
    const { label, helperText, placeholder, options, required } =
        element.extraAttributes;
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            label,
            helperText,
            placeholder,
            required,
            options,
        },
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [form, element]);

    function applyChanges(values: propertiesFormSchemaType) {
        const uniqueOptions = new Set(values.options);
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                ...values,
                options: Array.from(uniqueOptions),
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
                <Separator />
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
                <Separator />
                <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Options</FormLabel>
                                <Button
                                    variant={"outline"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        form.setValue(
                                            "options",
                                            field.value.concat(
                                                "New option #" +
                                                    (field.value.length + 1)
                                            )
                                        );
                                    }}
                                    className="gap-2"
                                >
                                    <LuPlus />
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {form.watch("options").map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between gap-1 items-center"
                                    >
                                        <Input
                                            onChange={(e) => {
                                                field.value[index] =
                                                    e.target.value;

                                                field.onChange(field.value);
                                            }}
                                            placeholder=""
                                            value={option}
                                        />
                                        <Button
                                            variant={"ghost"}
                                            size={"icon"}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const newOptions = [
                                                    ...field.value,
                                                ];
                                                newOptions.splice(index, 1);
                                                field.onChange(newOptions);
                                            }}
                                        >
                                            <LuX />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
