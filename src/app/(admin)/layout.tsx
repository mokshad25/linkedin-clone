import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AuthProvider from '@/components/auth/AuthProvider'
import Navbar from '@/components/layout/Navbar'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
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

  if (roleData?.role !== 'admin') redirect('/feed')

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#f3f2ef]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-16">
          <div className="flex gap-4 items-start py-4">
            <aside className="hidden lg:block w-56 shrink-0 sticky top-20">
              <AdminSidebar />
            </aside>
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}