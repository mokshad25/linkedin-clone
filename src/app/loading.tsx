export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* LinkedIn-style logo pulse */}
        <div className="w-10 h-10 bg-[#0a66c2] rounded-lg flex items-center justify-center animate-pulse">
          <span className="text-white font-extrabold text-xl leading-none">in</span>
        </div>

        {/* Three bouncing dots */}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#0a66c2] animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 rounded-full bg-[#0a66c2] animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 rounded-full bg-[#0a66c2] animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}