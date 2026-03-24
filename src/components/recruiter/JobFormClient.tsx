'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { jobSchema, JobValues } from '@/lib/validations/job'
import { JOB_TYPES, WORK_MODES } from '@/lib/constants'
import { Skill } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2Icon, PlusIcon, XIcon, ArrowLeftIcon } from 'lucide-react'

interface Props {
  userId: string
  companyId: string
  companyName: string
  allSkills: Skill[]
  existingJob: any
}

export default function JobFormClient({
  userId, companyId, companyName, allSkills, existingJob
}: Props) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(
    existingJob?.skills?.map((s: any) => s.skill) ?? []
  )
  const [skillSearch, setSkillSearch] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<JobValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: existingJob
      ? {
          title: existingJob.title,
          description: existingJob.description,
          requirements: existingJob.requirements ?? '',
          location: existingJob.location ?? '',
          type: existingJob.type,
          work_mode: existingJob.work_mode,
          salary_min: existingJob.salary_min,
          salary_max: existingJob.salary_max,
          experience_required: existingJob.experience_required ?? '',
          deadline: existingJob.deadline ?? '',
          is_active: existingJob.is_active,
        }
      : {
          type: 'full-time',
          work_mode: 'onsite',
          is_active: true,
        },
  })

  const filteredSkills = allSkills.filter(
    (s) =>
      !selectedSkills.find((sel) => sel.id === s.id) &&
      s.name.toLowerCase().includes(skillSearch.toLowerCase())
  )

  const addSkill = (skill: Skill) => {
    setSelectedSkills((prev) => [...prev, skill])
    setSkillSearch('')
  }

  const removeSkill = (skillId: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s.id !== skillId))
  }

  const onSubmit = async (values: JobValues) => {
    setIsSaving(true)
    const supabase = createClient()

    if (existingJob) {
      const { error } = await supabase
        .from('jobs')
        .update(values)
        .eq('id', existingJob.id)

      if (error) { toast.error('Failed to update job'); setIsSaving(false); return }

      // Sync skills
      await supabase.from('job_skills').delete().eq('job_id', existingJob.id)
      if (selectedSkills.length > 0) {
        await supabase.from('job_skills').insert(
          selectedSkills.map((s) => ({ job_id: existingJob.id, skill_id: s.id }))
        )
      }

      toast.success('Job updated!')
      router.push('/recruiter/dashboard')
    } else {
      const { data: job, error } = await supabase
        .from('jobs')
        .insert({ ...values, company_id: companyId, posted_by: userId })
        .select()
        .single()

      if (error) { toast.error('Failed to create job'); setIsSaving(false); return }

      if (selectedSkills.length > 0) {
        await supabase.from('job_skills').insert(
          selectedSkills.map((s) => ({ job_id: job.id, skill_id: s.id }))
        )
      }

      toast.success('Job posted successfully!')
      router.push('/recruiter/dashboard')
    }

    setIsSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-600">
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-xl font-bold text-slate-900">
          {existingJob ? 'Edit Job' : 'Post a Job'}
        </h1>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <p className="text-sm text-slate-500 mb-5">
          Posting for: <span className="font-semibold text-slate-700">{companyName}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Job Title *</Label>
            <Input placeholder="e.g. Senior Frontend Engineer" className="h-10 border-slate-200" {...register('title')} />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Type + Mode */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Job Type *</Label>
              <select className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]" {...register('type')}>
                {JOB_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Work Mode *</Label>
              <select className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]" {...register('work_mode')}>
                {WORK_MODES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location + Experience */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Location</Label>
              <Input placeholder="e.g. Bangalore, India" className="h-10 border-slate-200" {...register('location')} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Experience Required</Label>
              <Input placeholder="e.g. 2-4 years" className="h-10 border-slate-200" {...register('experience_required')} />
            </div>
          </div>

          {/* Salary */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Min Salary (₹/year)</Label>
              <Input type="number" placeholder="e.g. 800000" className="h-10 border-slate-200" {...register('salary_min')} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Max Salary (₹/year)</Label>
              <Input type="number" placeholder="e.g. 1500000" className="h-10 border-slate-200" {...register('salary_max')} />
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Application Deadline</Label>
            <Input type="date" className="h-10 border-slate-200" {...register('deadline')} />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Required Skills</Label>
            <div className="flex flex-wrap gap-2 min-h-[36px]">
              {selectedSkills.map((skill) => (
                <Badge key={skill.id} className="bg-[#eef3f8] text-[#0a66c2] border-0 font-medium flex items-center gap-1.5">
                  {skill.name}
                  <button type="button" onClick={() => removeSkill(skill.id)}>
                    <XIcon className="w-3 h-3 hover:text-red-500" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Search skills..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="h-9 border-slate-200 text-sm"
            />
            {skillSearch && (
              <div className="flex flex-wrap gap-1.5">
                {filteredSkills.slice(0, 12).map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 border border-slate-200 rounded-full text-slate-600 hover:border-[#0a66c2] hover:text-[#0a66c2] transition-colors"
                  >
                    <PlusIcon className="w-3 h-3" />
                    {skill.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Job Description *</Label>
            <Textarea
              placeholder="Describe the role, responsibilities, and what a typical day looks like..."
              rows={6}
              className="border-slate-200 resize-none"
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* Requirements */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Requirements</Label>
            <Textarea
              placeholder="List the required qualifications, skills, and experience..."
              rows={4}
              className="border-slate-200 resize-none"
              {...register('requirements')}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 py-1">
            <input id="is_active" type="checkbox" className="w-4 h-4 accent-[#0a66c2]" {...register('is_active')} />
            <Label htmlFor="is_active" className="text-sm text-slate-700 cursor-pointer">
              Job is <span className="font-semibold">active</span> and accepting applications
            </Label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => router.back()} className="text-slate-600">Cancel</Button>
            <Button type="submit" disabled={isSaving} className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold px-6">
              {isSaving
                ? <><Loader2Icon className="w-4 h-4 mr-2 animate-spin" />{existingJob ? 'Saving...' : 'Posting...'}</>
                : existingJob ? 'Save Changes' : 'Post Job'
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}