'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import { Profile } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  UserIcon,
  LockIcon,
  BellIcon,
  TrashIcon,
  Loader2Icon,
  EyeIcon,
  EyeOffIcon,
  ShieldIcon,
  LogOutIcon,
} from 'lucide-react'

interface Props {
  profile: Profile | null
  role: string
  email: string
  userId: string
}

const SECTIONS = [
  { id: 'account',       label: 'Account',       icon: UserIcon },
  { id: 'security',      label: 'Security',       icon: LockIcon },
  { id: 'notifications', label: 'Notifications',  icon: BellIcon },
  { id: 'privacy',       label: 'Privacy',        icon: ShieldIcon },
  { id: 'danger',        label: 'Danger Zone',    icon: TrashIcon },
]

export default function SettingsClient({ profile, role, email, userId }: Props) {
  const router = useRouter()
  const { reset } = useAuthStore()
  const [activeSection, setActiveSection] = useState('account')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [newUsername, setNewUsername] = useState(profile?.username ?? '')
  const [isSavingUsername, setIsSavingUsername] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim()) { toast.error('Username cannot be empty'); return }
    if (newUsername === profile?.username) { toast.info('No change'); return }
    if (!/^[a-z0-9_]{3,30}$/.test(newUsername)) {
      toast.error('Username must be 3–30 characters: lowercase letters, numbers, underscores only')
      return
    }
    setIsSavingUsername(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ username: newUsername })
      .eq('id', userId)

    setIsSavingUsername(false)
    if (error) {
      toast.error(error.message.includes('unique') ? 'Username already taken' : 'Failed to update username')
      return
    }
    toast.success('Username updated!')
  }

  const handlePasswordChange = async () => {
    if (!newPassword) { toast.error('Enter a new password'); return }
    if (newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }

    setIsChangingPassword(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setIsChangingPassword(false)

    if (error) { toast.error(error.message); return }
    toast.success('Password changed successfully!')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    reset()
    router.push('/login')
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Are you absolutely sure you want to delete your account?\n\nThis will permanently delete:\n• Your profile\n• All your posts\n• All your connections\n• All your applications\n\nThis action CANNOT be undone.'
    )
    if (!confirmed) return

    const doubleConfirm = prompt('Type "DELETE" to confirm account deletion:')
    if (doubleConfirm !== 'DELETE') { toast.error('Account deletion cancelled'); return }

    setIsDeletingAccount(true)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').delete().eq('id', userId)
    if (error) { toast.error('Failed to delete account. Contact support.'); setIsDeletingAccount(false); return }
    await supabase.auth.signOut()
    reset()
    router.push('/')
    toast.success('Account deleted')
  }

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4">
      <div className="flex gap-4 items-start">

        {/* Sidebar */}
        <aside className="hidden sm:block w-52 shrink-0 sticky top-16">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-900">Settings</p>
            </div>
            <nav className="py-1">
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                    activeSection === id
                      ? 'bg-[#eef3f8] text-[#0a66c2] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 font-medium'
                  } ${id === 'danger' ? 'text-red-600 hover:bg-red-50 hover:text-red-700' : ''}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile section picker */}
        <div className="sm:hidden w-full mb-2">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm bg-white"
          >
            {SECTIONS.map(({ id, label }) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Account Section */}
          {activeSection === 'account' && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Account Information</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Manage your account details
                </p>
              </div>
              <Separator />

              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Email address</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={email}
                    disabled
                    className="h-10 border-slate-200 bg-slate-50 text-slate-500"
                  />
                  <Badge className="bg-green-100 text-green-700 shrink-0">Verified</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Username</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      @
                    </span>
                    <Input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                      placeholder="username"
                      className="h-10 border-slate-200 pl-7"
                    />
                  </div>
                  <Button
                    onClick={handleUsernameUpdate}
                    disabled={isSavingUsername}
                    className="bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full shrink-0"
                    size="sm"
                  >
                    {isSavingUsername
                      ? <Loader2Icon className="w-4 h-4 animate-spin" />
                      : 'Update'
                    }
                  </Button>
                </div>
                <p className="text-xs text-slate-400">
                  3–30 characters. Lowercase letters, numbers, underscores only.
                  Your public profile URL: linkedin.com/u/{newUsername}
                </p>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Account type</Label>
                <div className="flex items-center gap-2">
                  <Badge className={
                    role === 'admin' ? 'bg-red-100 text-red-700' :
                    role === 'recruiter' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Contact support to change your account type
                  </span>
                </div>
              </div>

              <Separator />

              {/* Sign out */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Sign out</p>
                  <p className="text-xs text-slate-400">Sign out of your account on this device</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="rounded-full border-slate-300 text-slate-600 hover:border-red-400 hover:text-red-500"
                >
                  <LogOutIcon className="w-4 h-4 mr-1.5" />
                  Sign out
                </Button>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Security</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Manage your password and account security
                </p>
              </div>
              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800">Change password</h3>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">New password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="h-10 border-slate-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword
                        ? <EyeOffIcon className="w-4 h-4" />
                        : <EyeIcon className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Confirm new password</Label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="h-10 border-slate-200"
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                {/* Password strength */}
                {newPassword && (
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Password strength:</p>
                    <div className="flex gap-1">
                      {[
                        newPassword.length >= 8,
                        /[A-Z]/.test(newPassword),
                        /[0-9]/.test(newPassword),
                        /[^A-Za-z0-9]/.test(newPassword),
                      ].map((met, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            met ? 'bg-green-500' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-slate-400 space-y-0.5">
                      {[
                        [newPassword.length >= 8, 'At least 8 characters'],
                        [/[A-Z]/.test(newPassword), 'Uppercase letter'],
                        [/[0-9]/.test(newPassword), 'Number'],
                        [/[^A-Za-z0-9]/.test(newPassword), 'Special character'],
                      ].map(([met, label], i) => (
                        <p key={i} className={met ? 'text-green-600' : ''}>
                          {met ? '✓' : '○'} {label as string}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword || !newPassword || newPassword !== confirmPassword}
                  className="bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full font-semibold"
                >
                  {isChangingPassword
                    ? <><Loader2Icon className="w-4 h-4 mr-2 animate-spin" />Updating...</>
                    : 'Update password'
                  }
                </Button>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Control what notifications you receive
                </p>
              </div>
              <Separator />

              <div className="space-y-4">
                {[
                  { label: 'Connection requests', desc: 'When someone sends you a connection request', defaultOn: true },
                  { label: 'Connection accepted', desc: 'When someone accepts your request', defaultOn: true },
                  { label: 'Post likes', desc: 'When someone likes your post', defaultOn: true },
                  { label: 'Post comments', desc: 'When someone comments on your post', defaultOn: true },
                  { label: 'Application updates', desc: 'When your job application status changes', defaultOn: true },
                  { label: 'Job recommendations', desc: 'Weekly job suggestions based on your profile', defaultOn: false },
                ].map(({ label, desc, defaultOn }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        defaultChecked={defaultOn}
                        className="sr-only peer"
                        onChange={() => toast.info('Notification preferences saved')}
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0a66c2]" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Privacy Settings</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Control your profile visibility and data
                </p>
              </div>
              <Separator />

              <div className="space-y-4">
                {[
                  { label: 'Public profile', desc: 'Allow anyone to view your profile', defaultOn: true },
                  { label: 'Show in search results', desc: 'Appear when others search for people', defaultOn: true },
                  { label: 'Show connections count', desc: 'Display your connections count publicly', defaultOn: true },
                  { label: 'Open to work badge', desc: 'Show #OpenToWork frame on your profile photo', defaultOn: false },
                ].map(({ label, desc, defaultOn }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        defaultChecked={defaultOn}
                        className="sr-only peer"
                        onChange={() => toast.info('Privacy settings saved')}
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0a66c2]" />
                    </label>
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-2">Data & Privacy</h3>
                <div className="space-y-2">
                  <button className="text-sm text-[#0a66c2] hover:underline block">
                    Download your data
                  </button>
                  <button className="text-sm text-[#0a66c2] hover:underline block">
                    View privacy policy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === 'danger' && (
            <div className="bg-white rounded-lg border border-red-200 p-5 space-y-5">
              <div>
                <h2 className="text-base font-bold text-red-600 flex items-center gap-2">
                  <TrashIcon className="w-5 h-5" />
                  Danger Zone
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  These actions are permanent and cannot be undone.
                </p>
              </div>
              <Separator />

              <div className="rounded-lg border border-red-200 p-4 space-y-3 bg-red-50">
                <div>
                  <p className="text-sm font-semibold text-red-800">Delete your account</p>
                  <p className="text-xs text-red-600 mt-1 leading-relaxed">
                    Once deleted, your account and all associated data including posts,
                    connections, applications, and profile information will be permanently removed.
                    This action cannot be reversed.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="border-red-400 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-full font-semibold transition-colors"
                >
                  {isDeletingAccount
                    ? <><Loader2Icon className="w-4 h-4 mr-2 animate-spin" />Deleting...</>
                    : <><TrashIcon className="w-4 h-4 mr-2" />Delete my account</>
                  }
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}