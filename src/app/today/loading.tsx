import { Skeleton, SkeletonCard } from "@/components/ui";

export default function TodayLoading() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-7 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <SkeletonCard />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>
  );
}
