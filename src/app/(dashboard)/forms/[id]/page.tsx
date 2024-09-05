import React, { ReactNode } from "react";
import { GetFormById } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";

const BuilderPage = async ({
    params,
    children,
}: {
    params: { id: string };
    children: ReactNode;
}) => {
    const { id } = params;
    const form = await GetFormById(Number(id));
    if(!form) {
        throw new Error("form not found");
    }
    return <></>;
};

export default BuilderPage;

// 3:00