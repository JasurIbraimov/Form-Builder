import React, { useTransition } from "react";
import { LuSave } from "react-icons/lu";
import { Button } from "./ui/button";
import useDesigner from "./hooks/useDesigner";
import { UpdateFormContent } from "@/actions/form";
import { toast } from "./ui/use-toast";
import { FaSpinner } from "react-icons/fa";

const SaveFormBtn = ({id}: {id: number}) => {
    const {elements} = useDesigner();
    const [loading, startTransition] = useTransition()

    const updateFormContent = async () => {
        try {
            const jsonElements = JSON.stringify(elements);
            await UpdateFormContent(id, jsonElements);
            toast({
                title: "Success",
                description: "Your form has been saved!"
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive"
            })
        }
    }
    return (
        <Button disabled={loading} onClick={() => {
            startTransition(updateFormContent)
        }} value="outline" className="gap-2">
            <LuSave className="h-6 w-6" /> Save
            {loading && <FaSpinner className="animate-spin"/>}
        </Button>
    );
};

export default SaveFormBtn;
