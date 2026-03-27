import { Skeleton, SkeletonCard } from "@/components/ui";

export default function PracticeLoading() {
  return (
    <div className="flex flex-col gap-5 min-h-[80vh]">
      <div>
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-6 w-2/3" />
      </div>
      <SkeletonCard />
    </div>
  );
}
