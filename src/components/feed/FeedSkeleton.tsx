export default function FeedSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 animate-pulse"
                >
                    {/* Author row */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-3 bg-slate-200 rounded w-36" />
                            <div className="h-2.5 bg-slate-200 rounded w-52" />
                            <div className="h-2.5 bg-slate-200 rounded w-20" />
                        </div>
                    </div>

                    {/* Content lines */}
                    <div className="space-y-2 pt-1">
                        <div className="h-3 bg-slate-200 rounded w-full" />
                        <div className="h-3 bg-slate-200 rounded w-5/6" />
                        <div className="h-3 bg-slate-200 rounded w-4/6" />
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                        {[1, 2, 3, 4].map((j) => (
                            <div key={j} className="flex-1 h-8 bg-slate-100 rounded-md" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}