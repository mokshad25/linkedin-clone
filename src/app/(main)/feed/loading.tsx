export default function FeedLoading() {
  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4">
      <div className="flex gap-4 items-start">
        {/* Left sidebar skeleton */}
        <aside className="hidden md:block w-60 shrink-0">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden animate-pulse">
            <div className="h-14 bg-slate-200" />
            <div className="px-3 pb-3 pt-10">
              <div className="w-12 h-12 rounded-full bg-slate-200 -mt-7 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-32 mb-2" />
              <div className="h-2.5 bg-slate-200 rounded w-44" />
            </div>
          </div>
        </aside>

        {/* Feed skeleton */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Create post skeleton */}
          <div className="bg-white rounded-lg border border-slate-200 p-3 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 h-10 rounded-full bg-slate-100" />
            </div>
          </div>

          {/* Post card skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-slate-200 rounded w-36" />
                  <div className="h-2.5 bg-slate-200 rounded w-52" />
                  <div className="h-2.5 bg-slate-200 rounded w-20" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-5/6" />
                <div className="h-3 bg-slate-200 rounded w-3/4" />
              </div>
              <div className="flex gap-2 pt-1 border-t border-slate-100">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex-1 h-8 bg-slate-100 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right sidebar skeleton */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-lg border border-slate-200 p-4 animate-pulse space-y-3">
            <div className="h-3 bg-slate-200 rounded w-36" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="h-2.5 bg-slate-200 rounded w-24" />
                  <div className="h-2 bg-slate-200 rounded w-32" />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}