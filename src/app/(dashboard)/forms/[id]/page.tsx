import React, { ReactNode } from "react";
import { GetFormById, GetFormWithSubmissions } from "@/actions/form";
import VisitBtn from "@/components/VisitBtn";
import FormLinkShare from "@/components/FormLinkShare";
import { StatsCard } from "../../page";
import {
    LuActivity,
    LuMousePointerClick,
    LuView,
    LuVote,
} from "react-icons/lu";
import { ElementsType, FormElementInstance } from "@/components/FormElements";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const FormDetailsPage = async ({
    params,
    children,
}: {
    params: { id: string };
    children: ReactNode;
}) => {
    const { id } = params;
    const form = await GetFormById(Number(id));
    if (!form) {
        throw new Error("form not found");
    }

    const { visits, submissions } = form;
    let submissionRate = 0;
    let bounceRate = 0;

    if (visits > 0) {
        submissionRate = (submissions / visits) * 100;
        bounceRate = 100 - submissionRate;
    }

    return (
        <div className="flex flex-col flex-grow">
            <div className="py-10 border-t border-b border-muted flex flex-col">
                <div className="flex justify-between container">
                    <h1 className="text-4xl font-bold truncate">{form.name}</h1>
                    <VisitBtn shareUrl={form.sharedUrl} />
                </div>
                <div className="py-4">
                    <div className="container flex gap-2 justify-between items-center">
                        <FormLinkShare shareUrl={form.sharedUrl} />
                    </div>
                </div>
            </div>
            <div className="w-full pt-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
                <StatsCard
                    title="Total visits"
                    icon={<LuView className="text-lime-600" />}
                    helperText="All time form visits"
                    value={visits.toLocaleString() || "0"}
                    loading={false}
                    className="shadow-md shadow-lime-600"
                />
                <StatsCard
                    title="Total submissions"
                    icon={<LuVote className="text-green-600" />}
                    helperText="All time form submissions"
                    value={submissions.toLocaleString() || "0"}
                    loading={false}
                    className="shadow-md shadow-green-600"
                />
                <StatsCard
                    title="Submission rate"
                    icon={<LuMousePointerClick className="text-emerald-600" />}
                    helperText="Visits that result in form submission"
                    value={submissionRate.toLocaleString() + "%" || "0%"}
                    loading={false}
                    className="shadow-md shadow-emerald-600"
                />
                <StatsCard
                    title="Bounce rate"
                    icon={<LuActivity className="text-teal-600" />}
                    helperText="Visits that leaves without interacting"
                    value={bounceRate.toLocaleString() + "%" || "0%"}
                    loading={false}
                    className="shadow-md shadow-teal-600"
                />
            </div>

            <div className="container pt-10">
                <SubmissionsTable id={form.id} />
            </div>
        </div>
    );
};
type Row = {
    [key: string]: string;
} & {
    submittedAt: Date;
};
async function SubmissionsTable({ id }: { id: number }) {
    const form = await GetFormWithSubmissions(id);
    if (!form) {
        throw new Error("Form not found!");
    }

    const formElements = JSON.parse(form.content) as FormElementInstance[];
    const columns: {
        id: string;
        label: string;
        required: boolean;
        type: ElementsType;
    }[] = [];
    const rows: Row[] = [];
    form.FormSubmissions.forEach((submission) => {
        const content = JSON.parse(submission.content);
        rows.push({
            ...content,
            submittedAt: submission.createdAt,
        });
    });

    formElements.forEach(({ id, extraAttributes, type }) => {
        switch (type) {
            case "TextField":
            case "TextareaField":
            case "DateField":
            case "SelectField":
            case "CheckboxField":
            case "EmailFIeld":
            case "NumberField": {
                columns.push({
                    id,
                    label: extraAttributes?.label,
                    type,
                    required: extraAttributes?.required,
                });
                break;
            }
            default: {
                break;
            }
        }
    });
    return (
        <>
            <h1 className="text-2xl font-bold my-4">Submissions</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    className="uppercase"
                                    key={column.id}
                                >
                                    {column.label}
                                </TableHead>
                            ))}
                            <TableHead className="text-muted-foreground text-right uppercase">
                                Submitted at
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((column) => (
                                    <RowCell
                                        key={column.id}
                                        type={column.type}
                                        value={row[column.id]}
                                    />
                                ))}
                                <TableCell className="text-muted-foreground text-right">
                                    {formatDistance(
                                        row.submittedAt,
                                        new Date(),
                                        {
                                            addSuffix: true,
                                        }
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
    let node: ReactNode = value;

    switch (type) {
        case "DateField":
            if (!value) break;
            const date = new Date(value);
            node = (
                <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>
            );
            break;
        case "CheckboxField":
            const checked = value === "true"
            node = <Checkbox checked={checked} disabled/>
            break;
    }

    return <TableCell>{node}</TableCell>;
}

export default FormDetailsPage;
