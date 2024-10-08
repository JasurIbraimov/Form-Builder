import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { GetFormStats, GetForms } from "@/actions/form";
import {
    LuView,
    LuMousePointerClick,
    LuVote,
    LuFileEdit,
    LuActivity,
    LuArrowBigRight,
} from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import CreateFormButton from "@/components/CreateFormButton";
import { Form } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="container w-full">
            <Suspense fallback={<StatsCards loading={true} />}>
                <CardStatsWrapper />
            </Suspense>
            <Separator className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CreateFormButton />
                <Suspense
                    fallback={[1, 2, 3, 4, 5].map((_, i) => (
                        <FormCardSkeleton key={i} />
                    ))}
                >
                    <FormCards />
                </Suspense>
            </div>
        </div>
    );
}

async function CardStatsWrapper() {
    const stats = await GetFormStats();

    return <StatsCards loading={false} data={stats} />;
}

interface StatsCardsProps {
    loading: boolean;
    data?: Awaited<ReturnType<typeof GetFormStats>>;
}

function StatsCards({ loading, data }: StatsCardsProps) {
    return (
        <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Total visits"
                icon={<LuView className="text-lime-600" />}
                helperText="All time form visits"
                value={data?.visits.toLocaleString() || "0"}
                loading={loading}
                className="shadow-md shadow-lime-600"
            />
            <StatsCard
                title="Total submissions"
                icon={<LuVote className="text-green-600" />}
                helperText="All time form submissions"
                value={data?.submissions.toLocaleString() || "0"}
                loading={loading}
                className="shadow-md shadow-green-600"
            />
            <StatsCard
                title="Submission rate"
                icon={<LuMousePointerClick className="text-emerald-600" />}
                helperText="Visits that result in form submission"
                value={data?.submissionRate.toLocaleString() + "%" || "0%"}
                loading={loading}
                className="shadow-md shadow-emerald-600"
            />
            <StatsCard
                title="Bounce rate"
                icon={<LuActivity className="text-teal-600" />}
                helperText="Visits that leaves without interacting"
                value={data?.bounceRate.toLocaleString() + "%" || "0%"}
                loading={loading}
                className="shadow-md shadow-teal-600"
            />
        </div>
    );
}

interface StatsCardProps {
    title: string;
    helperText: string;
    icon: React.ReactNode;
    value: string;
    loading: boolean;
    className: string;
}

export function StatsCard({
    title,
    helperText,
    icon,
    value,
    loading,
    className,
}: StatsCardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {loading && (
                        <Skeleton>
                            <span className="opacity-0">0</span>
                        </Skeleton>
                    )}
                    {!loading && value}
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                    {helperText}
                </p>
            </CardContent>
        </Card>
    );
}

function FormCardSkeleton() {
    return <Skeleton className="border-2 border-primary/20 h-[190px] w-full" />;
}

async function FormCards() {
    const forms = await GetForms();
    return (
        <>
            {forms.map((form) => (
                <FormCard key={form.id} form={form} />
            ))}
        </>
    );
}

function FormCard({ form }: { form: Form }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <span className="truncate font-bold">{form.name}</span>

                    {form.published ? (
                        <Badge>Published</Badge>
                    ) : (
                        <Badge variant={"destructive"}>Draft</Badge>
                    )}
                </CardTitle>
                <CardDescription className="flex items-center justify-between text-muted-foreground">
                    {formatDistance(form.createdAt, new Date(), {
                        addSuffix: true,
                    })}
                    {form.published && (
                        <span className="flex items-center gap-2">
                            <LuView className="text-muted-foreground" />
                            <span>{form.visits.toLocaleString()}</span>
                            <LuVote className="text-muted-foreground" />
                            <span>{form.submissions.toLocaleString()}</span>
                        </span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
                {form.description || "No description"}
            </CardContent>

            <CardFooter className="gap-2">
                {form.published && (
                    <Button asChild className="w-full mt-2 text-md gap-4">
                        <Link href={`/forms/${form.id}`}>
                            View submission <LuArrowBigRight />
                        </Link>
                    </Button>
                )}
                {!form.published && (
                    <Button asChild className="w-full mt-2 text-md gap-4">
                        <Link href={`/builder/${form.id}`}>
                            Edit form <LuFileEdit />
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
