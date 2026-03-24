'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'
import { uploadAvatar, uploadBanner } from '@/lib/supabase/storage'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import { Profile } from '@/types/database'
import {
    PencilIcon,
    MapPinIcon,
    GlobeIcon,
    GithubIcon,
    TwitterIcon,
    PhoneIcon,
    BriefcaseIcon,
    CameraIcon,
    FileTextIcon,
} from 'lucide-react'
import ConnectButton from '@/components/network/ConnectButton'

// Update Props interface:
interface Props {
    profile: Profile | null
    isOwnProfile: boolean
    currentUserId?: string  // add this
}


export default function ProfileHeader({ profile, isOwnProfile, currentUserId }: Props) {
    const { setProfile } = useAuthStore()
    const avatarInputRef = useRef<HTMLInputElement>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [uploadingBanner, setUploadingBanner] = useState(false)

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !profile) return
        setUploadingAvatar(true)
        const url = await uploadAvatar(profile.id, file)
        if (url) {
            const supabase = createClient()
            const { data } = await supabase
                .from('profiles')
                .update({ avatar_url: url })
                .eq('id', profile.id)
                .select()
                .single()
            if (data) setProfile(data)
            toast.success('Profile photo updated')
        } else {
            toast.error('Failed to upload photo')
        }
        setUploadingAvatar(false)
    }

    const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !profile) return
        setUploadingBanner(true)
        const url = await uploadBanner(profile.id, file)
        if (url) {
            const supabase = createClient()
            const { data } = await supabase
                .from('profiles')
                .update({ banner_url: url })
                .eq('id', profile.id)
                .select()
                .single()
            if (data) setProfile(data)
            toast.success('Cover photo updated')
        } else {
            toast.error('Failed to upload cover photo')
        }
        setUploadingBanner(false)
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {/* Banner */}
            <div className="relative h-36 sm:h-44 bg-gradient-to-r from-[#0a66c2] to-[#378fe9] group">
                {profile?.banner_url && (
                    <img
                        src={profile.banner_url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                )}
                {isOwnProfile && (
                    <>
                        <button
                            onClick={() => bannerInputRef.current?.click()}
                            disabled={uploadingBanner}
                            className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                            <CameraIcon className="w-4 h-4 text-slate-700" />
                        </button>
                        <input
                            ref={bannerInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleBannerChange}
                        />
                    </>
                )}
            </div>

            {/* Profile info */}
            <div className="px-4 sm:px-5 pb-4">
                {/* Avatar row */}
                <div className="flex items-end justify-between -mt-10 sm:-mt-14 mb-3">
                    <div className="relative group">
                        <Avatar className="w-20 h-20 sm:w-28 sm:h-28 border-4 border-white ring-1 ring-slate-200 bg-white">
                            <AvatarImage src={profile?.avatar_url ?? undefined} />
                            <AvatarFallback className="text-2xl font-bold bg-slate-200 text-slate-700">
                                {getInitials(profile?.full_name ?? 'U')}
                            </AvatarFallback>
                        </Avatar>
                        {isOwnProfile && (
                            <>
                                <button
                                    onClick={() => avatarInputRef.current?.click()}
                                    disabled={uploadingAvatar}
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <CameraIcon className="w-5 h-5 text-white" />
                                </button>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </>
                        )}
                    </div>

                    {isOwnProfile && (
                        <Link href="/profile/edit">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50 font-semibold"
                            >
                                <PencilIcon className="w-3.5 h-3.5 mr-1.5" />
                                Edit profile
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Name & headline */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                            {profile?.full_name ?? 'Your Name'}
                        </h1>
                        {profile?.is_open_to_work && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-medium">
                                #OpenToWork
                            </Badge>
                        )}
                    </div>

                    {profile?.headline && (
                        <p className="text-slate-600 text-sm leading-snug">{profile.headline}</p>
                    )}

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-1">
                        {profile?.location && (
                            <span className="flex items-center gap-1">
                                <MapPinIcon className="w-3.5 h-3.5" />
                                {profile.location}
                            </span>
                        )}
                        {profile?.website && (

                            href={profile.website }
                target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#0a66c2] hover:underline"
              >
                        <GlobeIcon className="w-3.5 h-3.5" />
                        Website
                    </a>
            )}
                    {profile?.github_url && (

                        href={ profile.github_url }
                target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#0a66c2] hover:underline"
              >
                    <GithubIcon className="w-3.5 h-3.5" />
                    GitHub
                </a>
            )}
                {profile?.twitter_url && (

                    href={ profile.twitter_url }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#0a66c2] hover:underline"
              >
                <TwitterIcon className="w-3.5 h-3.5" />
                Twitter
            </a>
            )}
            {profile?.phone && (
                <span className="flex items-center gap-1">
                    <PhoneIcon className="w-3.5 h-3.5" />
                    {profile.phone}
                </span>
            )}
        </div>

          {/* Resume */ }
    {
        profile?.resume_url && (

            href={ profile.resume_url }
              target = "_blank"
        rel = "noopener noreferrer"
        className = "inline-flex items-center gap-1.5 text-xs text-[#0a66c2] hover:underline font-medium mt-1"
            >
            <FileTextIcon className="w-3.5 h-3.5" />
              View Resume
            </a >
          )
    }

    {/* Connection actions for others */ }
    {
        !isOwnProfile && profile && currentUserId && (
            <div className="flex items-center gap-2 pt-2 flex-wrap">
                <ConnectButton
                    currentUserId={currentUserId}
                    targetUserId={profile.id}
                    size="sm"
                    variant="default"
                />
            </div>
        )
    }
    {/* 
      Import ConnectButton and pass the IDs.
      We need currentUserId — so ProfileHeader needs it as a prop.
      See note below.
    */}
                <Button
                    size="sm"
                    className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold"
                >
                    Connect
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50 font-semibold"
                >
                    Follow
                </Button>
            </div >
        )
}
        </div >
      </div >
    </div >
  )
}
