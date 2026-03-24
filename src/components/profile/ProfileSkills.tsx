import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PencilIcon } from 'lucide-react'
import { UserSkill, Skill } from '@/types/database'

interface Props {
    items: (UserSkill & { skill: Skill })[]
    isOwnProfile: boolean
}

export default function ProfileSkills({ items, isOwnProfile }: Props) {
    return (
        <div className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900">Skills</h2>
                {isOwnProfile && (
                    <Link href="/profile/edit#skills">
                        <PencilIcon className="w-4 h-4 text-slate-500 hover:text-slate-800 cursor-pointer" />
                    </Link>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map(({ skill, proficiency }) => (
                    <div key={skill.id} className="flex items-center gap-1.5">
                        <Badge
                            variant="secondary"
                            className="bg-[#eef3f8] text-[#0a66c2] border-0 font-medium text-xs px-3 py-1"
                        >
                            {skill.name}
                        </Badge>
                        {proficiency && (
                            <span className="text-xs text-slate-400 capitalize">{proficiency}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}