"use client";

import { LuCalendar } from "react-icons/lu";
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
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
const type: ElementsType = "DateField";
const fieldLabel = "Date Field";

const extraAttributes = {
    label: fieldLabel,
    helperText: "Pick a date",
    required: false,
};

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
});

export const DateFieldFormElement: FormElement = {
    type,
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    designerButtonElement: {
        icon: LuCalendar,
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
    const { label, required, helperText } = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>

            <Button
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
            >
                <LuCalendar className="mr-2 h-4 w-4" /> Pick a date
            </Button>
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
    const { label, required, helperText } = element.extraAttributes;
    const [date, setDate] = useState<Date | undefined>(
        defaultValue ? new Date(defaultValue) : undefined
    );
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
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full h-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                            error && "border-red-500"
                        )}
                    >
                        <LuCalendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 h-auto" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(dt) => {
                            setDate(dt);
                            if(!submitValue) return;
                            const value = dt?.toUTCString() || "";
                            const valid = DateFieldFormElement.validate(element, value);
                            setError(!valid);
                            submitValue(element.id, value);
                        }}
                    />
                </PopoverContent>
            </Popover>
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
    const { label, helperText, required } =
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
