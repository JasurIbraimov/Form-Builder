"use client";

import React, { useCallback, useRef, useState, useTransition } from "react";
import { FormElementInstance, FormElements } from "./FormElements";
import { Button } from "./ui/button";
import { LuMousePointerClick } from "react-icons/lu";
import { toast } from "./ui/use-toast";
import { FaSpinner } from "react-icons/fa";
import { SubmitForm } from "@/actions/form";
import Confetti from "react-confetti";

const FormSubmitComponent = ({
    formUrl,
    content,
}: {
    formUrl: string;
    content: FormElementInstance[];
}) => {
    const formValues = useRef<{ [key: string]: string }>({});
    const formErrors = useRef<{ [key: string]: boolean }>({});
    const [renderKey, setRenderKey] = useState(new Date().getTime());
    const [submitted, setSubmitted] = useState(false);
    const [pending, startTransition] = useTransition();

    const validateForm = useCallback(() => {
        content.forEach((element) => {
            const value = formValues.current[element.id] || "";
            const valid = FormElements[element.type].validate(element, value);
            if (!valid) {
                formErrors.current[element.id] = true;
            }
        });
        return !(Object.keys(formErrors.current).length > 0);
    }, [content]);

    const submitValue = (key: string, value: string) => {
        formValues.current[key] = value;
    };

    const submitForm = async () => {
        formErrors.current = {};
        const valid = validateForm();
        if (!valid) {
            setRenderKey(new Date().getTime());
            toast({
                title: "Error",
                description: "Please check the form for errors!",
                variant: "destructive",
            });
            return;
        }

        try {
            const jsonContent = JSON.stringify(formValues.current);
            await SubmitForm(formUrl, jsonContent);
            setSubmitted(true);
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong!",
                variant: "destructive",
            });
        }
    };

    if (submitted) {
        return (
            <div className="flex justify-center w-full items-center p-8">
                <Confetti
                    recycle={false}
                    width={window.innerWidth}
                    height={window.innerHeight}
                />
                <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl rounded">
                    <h1 className="text-2xl text-center font-bold">🎉Form submitted 🎉</h1>
                    <p className="text-muted-foreground">
                        Thank you for submitting the form, you can close this
                        page now.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex justify-center w-full h-full items-center p-8">
            <div
                key={renderKey}
                className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl rounded"
            >
                {content.map((element) => {
                    const FormComponent =
                        FormElements[element.type].formComponent;
                    return (
                        <FormComponent
                            key={element.id}
                            elementInstance={element}
                            submitValue={submitValue}
                            isInvalid={formErrors.current[element.id]}
                            defaultValue={formValues.current[element.id]}
                        />
                    );
                })}
                <Button
                    disabled={pending}
                    className="mt-8 gap-2"
                    onClick={() => startTransition(submitForm)}
                >
                    {!pending && (
                        <>
                            Submit <LuMousePointerClick />
                        </>
                    )}
                    {pending && <FaSpinner className="animate-spin" />}
                </Button>
            </div>
        </div>
    );
};

export default FormSubmitComponent;
