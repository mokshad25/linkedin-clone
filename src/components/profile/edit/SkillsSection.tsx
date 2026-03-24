'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Skill, UserSkill } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { XIcon, PlusIcon } from 'lucide-react'

interface Props {
    userId: string
    userSkills: (UserSkill & { skill: Skill })[]
    allSkills: Skill[]
}

export default function SkillsSection({ userId, userSkills, allSkills }: Props) {
    const [mySkills, setMySkills] = useState<(UserSkill & { skill: Skill })[]>(userSkills)
    const [search, setSearch] = useState('')

    const mySkillIds = new Set(mySkills.map((s) => s.skill_id))

    const filtered = allSkills.filter(
        (s) => !mySkillIds.has(s.id) && s.name.toLowerCase().includes(search.toLowerCase())
    )

    const addSkill = async (skill: Skill) => {
        const supabase = createClient()
        const { error } = await supabase
            .from('user_skills')
            .insert({ user_id: userId, skill_id: skill.id })

        if (error) { toast.error('Failed to add skill'); return }
        setMySkills([...mySkills, { user_id: userId, skill_id: skill.id, proficiency: null, skill }])
        toast.success(`${skill.name} added`)
    }

    const removeSkill = async (skillId: string, skillName: string) => {
        const supabase = createClient()
        const { error } = await supabase
            .from('user_skills')
            .delete()
            .eq('user_id', userId)
            .eq('skill_id', skillId)

        if (error) { toast.error('Failed to remove skill'); return }
        setMySkills(mySkills.filter((s) => s.skill_id !== skillId))
        toast.success(`${skillName} removed`)
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-5" id="skills">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Skills</h2>

            {/* Current skills */}
            <div className="flex flex-wrap gap-2 mb-4 min-h-[36px]">
                {mySkills.length === 0 && (
                    <p className="text-sm text-slate-400">No skills added yet</p>
                )}
                {mySkills.map(({ skill }) => (
                    <Badge
                        key={skill.id}
                        className="bg-[#eef3f8] text-[#0a66c2] border-0 font-medium text-xs px-3 py-1 flex items-center gap-1.5"
                    >
                        {skill.name}
                        <button
                            onClick={() => removeSkill(skill.id, skill.name)}
                            className="hover:text-red-500 transition-colors ml-0.5"
                        >
                            <XIcon className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
            </div>

            {/* Search & add */}
            <div className="space-y-2">
                <Input
                    placeholder="Search skills to add..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 text-sm border-slate-200"
                />
                {search && (
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                        {filtered.slice(0, 20).map((skill) => (
                            <button
                                key={skill.id}
                                onClick={() => addSkill(skill)}
                                className="flex items-center gap-1 text-xs px-3 py-1.5 border border-slate-200 rounded-full text-slate-600 hover:border-[#0a66c2] hover:text-[#0a66c2] transition-colors"
                            >
                                <PlusIcon className="w-3 h-3" />
                                {skill.name}
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <p className="text-xs text-slate-400 py-2">No matching skills found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}