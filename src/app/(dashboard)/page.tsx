import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetFormStats } from "../../../actions/form";
import { LuView } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
export default function Home() {
  return <div>
    <Suspense fallback={<StatsCards loading={true}/>}>
      <CardStatsWrapper/>
    </Suspense>
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
        icon={<LuView className="text-orange-600" />}
        helperText="All time form visits"
        value={data?.visits.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-orange-600"
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
      <CardTitle>
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
      </div>
    </CardContent>
  </Card>
}