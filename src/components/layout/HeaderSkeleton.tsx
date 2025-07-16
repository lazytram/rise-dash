import { memo } from "react";

export const HeaderSkeleton = memo(function HeaderSkeleton() {
  return (
    <div className="flex items-start absolute top-4 left-4 right-4 z-1 justify-end">
      <div className="flex flex-col items-end gap-y-4">
        {/* Auth button skeleton */}
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />

        {/* Language selector skeleton */}
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
});
