import Link from 'next/link'
import { PencilIcon } from 'lucide-react'

interface Props {
    about: string
    isOwnProfile: boolean
}

export default function ProfileAbout({ about, isOwnProfile }: Props) {
    return (
        <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-slate-900">About</h2>
                {isOwnProfile && (
                    <Link href="/profile/edit#about">
                        <PencilIcon className="w-4 h-4 text-slate-500 hover:text-slate-800 cursor-pointer" />
                    </Link>
                )}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{about}</p>
        </div>
    )
}