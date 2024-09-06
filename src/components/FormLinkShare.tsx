"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { LuCheck, LuCopy } from "react-icons/lu";
import { cn } from "@/lib/utils";

const FormLinkShare = ({ shareUrl }: { shareUrl: string }) => {
    const [mounted, setMounted] = useState(false);
	const [copied, setCopied] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

	useEffect(() => {
		if(!copied) return;
		const copiedTimeout = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(copiedTimeout)
	})

    if (!mounted) return null;

    const link = `${window.location.origin}/submit/${shareUrl}`;
    return (
        <div className="flex  flex-grow gap-4 items-center">
			<Input readOnly value={shareUrl}/>
			<Button className={"max-w-[250px]"} onClick={() => {
				navigator.clipboard.writeText(link);
				setCopied(true);
				toast({ 
					title: "Copied",
					description:
						"Link copied to clipboard!",
				});
			}}>
				{copied? <LuCheck className="w-5 h-5"/> : <><LuCopy className="w-5 h-5 mr-2"/> Copy</>}
			</Button>
		</div>
    );
};

export default FormLinkShare;
