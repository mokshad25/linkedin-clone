'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import { profileSchema, ProfileValues } from '@/lib/validations/profile'
import { uploadResume } from '@/lib/supabase/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
    Loader2Icon,
    ArrowLeftIcon,
    UploadIcon,
    FileTextIcon,
} from 'lucide-react'
import type {
    Profile,
    Education,
    Experience,
    Certification,
    Project,
    Skill,
    UserSkill,
} from '@/types/database'
import EducationSection from './edit/EducationSection'
import ExperienceSection from './edit/ExperienceSection'
import CertificationSection from './edit/CertificationSection'
import ProjectSection from './edit/ProjectSection'
import SkillsSection from './edit/SkillsSection'

interface Props {
    profile: Profile | null
    education: Education[]
    experience: Experience[]
    certifications: Certification[]
    projects: Project[]
    userSkills: (UserSkill & { skill: Skill })[]
    allSkills: Skill[]
    userId: string
}

export default function EditProfileForm({
    profile,
    education,
    experience,
    certifications,
    projects,
    userSkills,
    allSkills,
    userId,
}: Props) {
    const router = useRouter()
    const { setProfile } = useAuthStore()
    const [isSaving, setIsSaving] = useState(false)
    const [uploadingResume, setUploadingResume] = useState(false)
    const [resumeUrl, setResumeUrl] = useState<string>(profile?.resume_url ?? '')

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: profile?.full_name ?? '',
            headline: profile?.headline ?? '',
            about: profile?.about ?? '',
            location: profile?.location ?? '',
            website: profile?.website ?? '',
            github_url: profile?.github_url ?? '',
            twitter_url: profile?.twitter_url ?? '',
            phone: profile?.phone ?? '',
            is_open_to_work: profile?.is_open_to_work ?? false,
        },
    })

    const onSubmit = async (values: ProfileValues) => {
        setIsSaving(true)
        const supabase = createClient()

        const { data, error } = await supabase
            .from('profiles')
            .update({
                ...values,
                resume_url: resumeUrl || null,
            })
            .eq('id', userId)
            .select()
            .single()

        setIsSaving(false)

        if (error) {
            toast.error('Failed to save profile')
            return
        }

        setProfile(data)
        toast.success('Profile saved successfully')
        router.push('/profile')
    }

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are accepted')
            return
        }

        setUploadingResume(true)
        const url = await uploadResume(userId, file)
        setUploadingResume(false)

        if (url) {
            setResumeUrl(url)
            toast.success('Resume uploaded successfully')
        } else {
            toast.error('Failed to upload resume')
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 space-y-4">

            {/* Page Header */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/profile')}
                    className="text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Back to profile
                </Button>
                <h1 className="text-xl font-bold text-slate-900">Edit Profile</h1>
            </div>

            {/* Basic Information Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
                <h2 className="text-base font-semibold text-slate-900 mb-4">
                    Basic Information
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Row 1: Name + Location */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-slate-700">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="e.g. John Doe"
                                className="h-10 border-slate-200 focus-visible:ring-[#0a66c2]"
                                {...register('full_name')}
                            />
                            {errors.full_name && (
                                <p className="text-xs text-red-500">{errors.full_name.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-slate-700">
                                Location
                            </Label>
                            <Input
                                placeholder="e.g. Bangalore, India"
                                className="h-10 border-slate-200 focus-visible:ring-[#0a66c2]"
                                {...register('location')}
                            />
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-slate-700">
                            Headline
                        </Label>
                        <Input
                            placeholder="e.g. Software Engineer at Google | React · Node.js · Open Source"
                            className="h-10 border-slate-200 focus-visible:ring-[#0a66c2]"
                            {...register('headline')}
                        />
                        {errors.headline && (
                            <p className="text-xs text-red-500">{errors.headline.message}</p>
                        )}
                    </div>

                    {/* About */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-slate-700">
                            About
                        </Label>
                        <Textarea
                            placeholder="Tell your professional story — your background, what you are passionate about, and what you are looking for..."
                            rows={5}
                            className="border-slate-200 focus-visible:ring-[#0a66c2] resize-none"
                            {...register('about')}
                        />
                        {errors.about && (
                            <p className="text-xs text-red-500">{errors.about.message}</p>
                        )}
                    </div>

                    <Separator />

                    {/* Contact and Links heading */}
                    <h3 className="text-sm font-semibold text-slate-800">
                        Contact and Links
                    </h3>

                    {/* Row: Website + Phone */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-slate-700">
                                Website
                            </Label>
                            <Input
                                placeholder="https://yourwebsite.com"
                                className="h-10 border-slate-200 focus-visible:ring-[#0a66c2]"
                                {...register('website')}
                            />
                            {errors.website && (
                                <p className="text-xs text-red-500">{errors.website.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-slate-700">
                                Phone
                            </Label>
                            <Input
                                placeholder="+91 98765 43210"
                                className="h-10 border-slate-200 focus-visible:ring-[#0a66c2]"
                                {...register('phone')}
                            />
                        </div>

                        {/* Row: GitHub + Twitter */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-slate-700">
                                GitHub URL
                            </Label>
                            <Input
                                placeholder="https://github.com/username"
                                className="h-10 border-slate-200 focus-visible:ring-[#0a66c2]"
                                {...register('github_url')}
                            />
                            {errors.github_url && (
                                <p className="text-xs text-red-500">{errors.github_url.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-slate-700">
                                Twitter / X URL
                            </Label>
                            <Input
                                placeholder="https://twitter.com/username"
                                className="h-10 border-slate-200 focus-visible:ring-[#0a66c2]"
                                {...register('twitter_url')}
                            />
                            {errors.twitter_url && (
                                <p className="text-xs text-red-500">{errors.twitter_url.message}</p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Resume Upload */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-800">
                            Resume
                            <span className="ml-1.5 text-xs font-normal text-slate-400">
                                PDF only, max 10MB
                            </span>
                        </Label>

                        <div className="flex items-center gap-3 flex-wrap">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={handleResumeUpload}
                                />
                                <div className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors select-none">
                                    {uploadingResume
                                        ? <Loader2Icon className="w-4 h-4 animate-spin" />
                                        : <UploadIcon className="w-4 h-4" />
                                    }
                                    <span>
                                        {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                                    </span>
                                </div>
                            </label>

                            {resumeUrl && (
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-[#0a66c2] hover:underline font-medium"
                                >
                                    <FileTextIcon className="w-3.5 h-3.5" />
                                    View current resume
                                </a>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Open to Work */}
                    <div className="flex items-center gap-3 py-1">
                        <input
                            id="open_to_work"
                            type="checkbox"
                            className="w-4 h-4 rounded accent-[#0a66c2] cursor-pointer"
                            {...register('is_open_to_work')}
                        />
                        <Label
                            htmlFor="open_to_work"
                            className="text-sm text-slate-700 cursor-pointer leading-tight"
                        >
                            I am{' '}
                            <span className="font-semibold text-slate-900">#OpenToWork</span>
                            {' '}— show this badge on my profile
                        </Label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.push('/profile')}
                            className="text-slate-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full px-6 font-semibold"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2Icon className="mr-2 w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save changes'
                            )}
                        </Button>
                    </div>

                </form>
            </div>

            {/* Profile Section Editors */}
            <ExperienceSection userId={userId} initialItems={experience} />
            <EducationSection userId={userId} initialItems={education} />
            <SkillsSection userId={userId} userSkills={userSkills} allSkills={allSkills} />
            <ProjectSection userId={userId} initialItems={projects} />
            <CertificationSection userId={userId} initialItems={certifications} />

        </div>
    )
}