"use client";
import { Form } from "@prisma/client";
import React, { useEffect, useState } from "react";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import Designer from "./Designer";
import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";
import useDesigner from "./hooks/useDesigner";
import { ImSpinner2 } from "react-icons/im";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import Link from "next/link";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import Confetti from "react-confetti";

const FormBuilder = ({ form }: { form: Form }) => {
    const { setElements } = useDesigner();
    const [isReady, setIsReady] = useState(false);

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 300,
            tolerance: 5,
        },
    });
    const sensors = useSensors(mouseSensor, touchSensor);

    useEffect(() => {
        if (isReady) return;
        const elements = JSON.parse(form.content);
        setElements(elements);
        const readyTimeout = setTimeout(() => setIsReady(true), 500);
        return () => clearTimeout(readyTimeout);
    }, [form, setElements, isReady]);
    

    if (!isReady) {
        return (
            <div className="flex flex-col items-center justify-center w-full">
                <ImSpinner2 className="animate-spin w-12 h-12 text-primary" />
            </div>
        );
    }

   

    const shareUrl = `${window.location.origin}/submit/${form.sharedUrl}`;

    if (form.published) {
        return (
            <>
                <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false}/>
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="max-w-md">
                        <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
                            🎉Form published 🎉
                        </h1>
                        <h2 className="text-2xl">Share this form</h2>
                        <h3 className="text-xl text-muted-foreground border-b pb-10">
                            Anyone with the link can view and submit the form
                            now.
                        </h3>
                        <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
                            <Input
                                className="w-full"
                                readOnly
                                value={shareUrl}
                            />
                            <Button
                                onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    toast({
                                        title: "Copied",
                                        description:
                                            "Link copied to clipboard!",
                                    });
                                }}
                                className="mt-2 w-full"
                            >
                                Copy link
                            </Button>
                        </div>
                        <div className="flex justify-between">
                            <Button variant={"link"} asChild>
                                <Link href={"/"} className="gap-2">
                                    <LuArrowLeft className="mr-2"/> Go back home
                                </Link>
                            </Button>
                            <Button variant={"link"} asChild>
                                <Link href={`/forms/${form.id}`} className="gap-2">
                                    Form details <LuArrowRight className="ml-2"/>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    return (
        <DndContext sensors={sensors}>
            <main className="flex flex-col w-full">
                <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
                    <h2 className="truncate font-medium">
                        <span className="text-muted-foreground mr-2">
                            Form:
                        </span>
                        {form.name}
                    </h2>
                    <div className="flex items-center gap-2">
                        <PreviewDialogBtn />
                        {!form.published && (
                            <>
                                <SaveFormBtn id={form.id} />
                                <PublishFormBtn id={form.id} />
                            </>
                        )}
                    </div>
                </nav>
                <div className="flex w-full bg-[url(/plus.svg)] dark:bg-[url(/plus-dark.svg)] flex-grow justify-center items-center relative overflow-y-auto h-[200px] bg-accent">
                    <Designer />
                </div>
            </main>
            <DragOverlayWrapper />
        </DndContext>
    );
};

export default FormBuilder;
// 1:29:38
