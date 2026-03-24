import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Education } from '@/types/database'
import { GraduationCapIcon, PencilIcon } from 'lucide-react'

interface Props {
    items: Education[]
    isOwnProfile: boolean
}

export default function ProfileEducation({ items, isOwnProfile }: Props) {
    return (
        <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">Education</h2>
                {isOwnProfile && (
                    <Link href="/profile/edit#education">
                        <PencilIcon className="w-4 h-4 text-slate-500 hover:text-slate-800 cursor-pointer" />
                    </Link>
                )}
            </div>

            <div className="space-y-5">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                            <GraduationCapIcon className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900">{item.school}</h3>
                            {(item.degree || item.field_of_study) && (
                                <p className="text-sm text-slate-700">
                                    {[item.degree, item.field_of_study].filter(Boolean).join(', ')}
                                </p>
                            )}
                            <p className="text-xs text-slate-500 mt-0.5">
                                {item.start_date ? formatDate(item.start_date) : ''}
                                {item.end_date || item.is_current
                                    ? ` – ${item.is_current ? 'Present' : formatDate(item.end_date!)}`
                                    : ''}
                            </p>
                            {item.description && (
                                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}