'use client'

import { useProfile } from '@/hooks/useProfile'
import { useAuthStore } from '@/store/authStore'
import ProfileHeader from './ProfileHeader'
import ProfileAbout from './ProfileAbout'
import ProfileExperience from './ProfileExperience'
import ProfileEducation from './ProfileEducation'
import ProfileSkills from './ProfileSkills'
import ProfileProjects from './ProfileProjects'
import ProfileCertifications from './ProfileCertifications'
import ProfileCompletion from './ProfileCompletion'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
    userId: string
    isOwnProfile: boolean
}

export default function ProfileView({ userId, isOwnProfile }: Props) {
    const { user } = useAuthStore()
    const { profile, education, experience, certifications, projects, skills, isLoading } =
        useProfile(userId)

    if (isLoading) return <ProfileSkeleton />

    return (
        <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 space-y-3">
            <ProfileHeader
                profile={profile}
                isOwnProfile={isOwnProfile}
                currentUserId={user?.id}
            />

            {isOwnProfile && (
                <ProfileCompletion score={profile?.profile_completion ?? 0} />
            )}

            {profile?.about && (
                <ProfileAbout about={profile.about} isOwnProfile={isOwnProfile} />
            )}

            {experience.length > 0 && (
                <ProfileExperience items={experience} isOwnProfile={isOwnProfile} />
            )}

            {education.length > 0 && (
                <ProfileEducation items={education} isOwnProfile={isOwnProfile} />
            )}

            {skills.length > 0 && (
                <ProfileSkills items={skills} isOwnProfile={isOwnProfile} />
            )}

            {projects.length > 0 && (
                <ProfileProjects items={projects} isOwnProfile={isOwnProfile} />
            )}

            {certifications.length > 0 && (
                <ProfileCertifications items={certifications} isOwnProfile={isOwnProfile} />
            )}
        </div>
    )
}

function ProfileSkeleton() {
    return (
        <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 space-y-3">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <Skeleton className="h-36 w-full" />
                <div className="px-5 pb-5 pt-14">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-72 mb-1" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-slate-200 p-5 space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            ))}
        </div>
    )
}