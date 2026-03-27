import { Skeleton } from "@/components/ui";

export default function ScenarioLoading() {
  return (
    <div className="flex flex-col gap-5 min-h-[80vh]">
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
}
