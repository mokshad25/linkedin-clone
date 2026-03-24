import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AuthProvider from '@/components/auth/AuthProvider'
import Navbar from '@/components/layout/Navbar'

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleData?.role !== 'recruiter') redirect('/feed')

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#f3f2ef]">
        <Navbar />
        <main className="pt-14">{children}</main>
      </div>
    </AuthProvider>
  )
}