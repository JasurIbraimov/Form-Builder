import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetFormStats } from "../../../actions/form";
import { LuView } from "react-icons/lu";
import {FaWpforms} from "react-icons/fa"
import {HiCursorClick} from "react-icons/hi"
import {TbArrowBounce} from "react-icons/tb"
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import CreateFormButton from "@/components/CreateFormButton";


export default function Home() {
  return <div className="container w-full">
    <Suspense fallback={<StatsCards loading={true}/>}>
      <CardStatsWrapper/>
    </Suspense>
    <Separator className="my-6"/>
    <CreateFormButton />
    <Separator className="mt-6"/>
  </div>;
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
        icon={<LuView className="text-yellow-600" />}
        helperText="All time form visits"
        value={data?.visits.toLocaleString() || "0"}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />
      <StatsCard
        title="Total submissions"
        icon={<FaWpforms className="text-orange-600" />}
        helperText="All time form submissions"
        value={data?.submissions.toLocaleString() || "0"}
        loading={loading}
        className="shadow-md shadow-orange-600"
      />
      <StatsCard
        title="Submission rate"
        icon={<HiCursorClick className="text-rose-600" />}
        helperText="Visits that result in form submission"
        value={data?.submissionRate.toLocaleString() + "%" || "0%"}
        loading={loading}
        className="shadow-md shadow-rose-600"
      />
      <StatsCard
        title="Bounce rate"
        icon={<TbArrowBounce className="text-red-600" />}
        helperText="Visits that leaves without interacting"
        value={data?.bounceRate.toLocaleString() + "%" || "0%"}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
}

interface StatsCardProps {
  title: string,
  helperText: string,
  icon: React.ReactNode,
  value: string,
  loading: boolean,
  className: string
}

function StatsCard({title, helperText, icon, value, loading, className} : StatsCardProps) {
  return <Card className={className}>
    <CardHeader>
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {
          loading && <Skeleton>
            <span className="opacity-0">0</span>
          </Skeleton>
        }
        {!loading && value}
      </div>
      <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
    </CardContent>
  </Card>
}