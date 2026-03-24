import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { BriefcaseIcon } from 'lucide-react'

export default async function RightSidebar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let suggested: any[] = []

    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, headline, username')
            .neq('id', user.id)
            .not('full_name', 'is', null)
            .order('created_at', { ascending: false })
            .limit(3)

        suggested = data ?? []
    }

    return (
        <div className="space-y-2">
            {/* People you may know */}
            {suggested.length > 0 && (
                <div className="bg-white rounded-lg border border-slate-200 p-3">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                        People you may know
                    </h3>
                    <div className="space-y-3">
                        {suggested.map((person) => (
                            <div key={person.id} className="flex items-center gap-2">
                                <Link href={`/u/${person.username}`} className="shrink-0">
                                    <Avatar className="w-9 h-9">
                                        <AvatarImage src={person.avatar_url ?? undefined} />
                                        <AvatarFallback className="text-xs bg-slate-200 text-slate-700">
                                            {getInitials(person.full_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/u/${person.username}`} className="hover:underline">
                                        <p className="text-xs font-semibold text-slate-800 truncate">
                                            {person.full_name}
                                        </p>
                                    </Link>
                                    {person.headline && (
                                        <p className="text-xs text-slate-500 truncate">{person.headline}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link
                        href="/network"
                        className="block mt-3 text-xs font-semibold text-slate-600 hover:text-[#0a66c2]"
                    >
                        See all suggestions →
                    </Link>
                </div>
            )}

            {/* Jobs you may like */}
            <div className="bg-white rounded-lg border border-slate-200 p-3">
                <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                    <BriefcaseIcon className="w-4 h-4" />
                    Jobs you may like
                </h3>
                <div className="space-y-3">
                    {[
                        { title: 'Frontend Developer', company: 'Google', location: 'Bangalore' },
                        { title: 'Product Manager', company: 'Microsoft', location: 'Hyderabad' },
                        { title: 'Data Analyst', company: 'Amazon', location: 'Remote' },
                    ].map((job) => (
                        <Link
                            key={job.title}
                            href="/jobs"
                            className="block hover:bg-slate-50 -mx-1 px-1 py-1 rounded transition-colors"
                        >
                            <p className="text-xs font-semibold text-slate-800 hover:text-[#0a66c2]">
                                {job.title}
                            </p>
                            <p className="text-xs text-slate-500">
                                {job.company} · {job.location}
                            </p>
                        </Link>
                    ))}
                </div>
                <Link
                    href="/jobs"
                    className="block mt-3 text-xs font-semibold text-slate-600 hover:text-[#0a66c2]"
                >
                    Show all jobs →
                </Link>
            </div>

            {/* Footer links */}
            <div className="px-2">
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {['About', 'Help', 'Privacy', 'Terms'].map((item) => (
                    <a
                        key = { item }
              href="#"
              className = "text-xs text-slate-400 hover:text-slate-600 hover:underline"
                        >
                        { item }
            </a>
          ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">LinkedIn © {new Date().getFullYear()}</p>
        </div>
    </div >
  )
}
