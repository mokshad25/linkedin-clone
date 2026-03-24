'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { companySchema, CompanyValues } from '@/lib/validations/job'
import { slugify } from '@/lib/utils'
import { INDUSTRIES, COMPANY_SIZES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2Icon, BuildingIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  userId: string
  recruiterId: string | null
  existingCompany: any
}

export default function CompanyFormClient({ userId, recruiterId, existingCompany }: Props) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: existingCompany?.name ?? '',
      description: existingCompany?.description ?? '',
      industry: existingCompany?.industry ?? '',
      size: existingCompany?.size ?? '',
      website: existingCompany?.website ?? '',
      location: existingCompany?.location ?? '',
      founded_year: existingCompany?.founded_year ?? null,
    },
  })

  const onSubmit = async (values: CompanyValues) => {
    setIsSaving(true)
    const supabase = createClient()

    if (existingCompany) {
      const { error } = await supabase
        .from('companies')
        .update(values)
        .eq('id', existingCompany.id)

      if (error) { toast.error('Failed to update company'); setIsSaving(false); return }
      toast.success('Company updated!')
    } else {
      const { data: company, error } = await supabase
        .from('companies')
        .insert({
          ...values,
          owner_id: userId,
          slug: slugify(values.name) + '-' + Date.now(),
        })
        .select()
        .single()

      if (error) { toast.error('Failed to create company'); setIsSaving(false); return }

      await supabase
        .from('recruiter_profiles')
        .update({ company_id: company.id })
        .eq('user_id', userId)

      toast.success('Company created!')
    }

    setIsSaving(false)
    router.push('/recruiter/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <BuildingIcon className="w-5 h-5 text-[#0a66c2]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {existingCompany ? 'Edit Company Profile' : 'Setup Company Profile'}
            </h1>
            <p className="text-sm text-slate-500">
              {existingCompany
                ? 'Keep your company info up to date'
                : 'Create your company profile to start posting jobs'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-sm font-medium text-slate-700">Company Name *</Label>
              <Input placeholder="e.g. Acme Technologies" className="h-10 border-slate-200" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Industry</Label>
              <select
                className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                {...register('industry')}
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Company Size</Label>
              <select
                className="w-full h-10 border border-slate-200 rounded-md px-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                {...register('size')}
              >
                <option value="">Select size</option>
                {COMPANY_SIZES.map((s) => (
                  <option key={s} value={s}>{s} employees</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Location</Label>
              <Input placeholder="e.g. Bangalore, India" className="h-10 border-slate-200" {...register('location')} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Founded Year</Label>
              <Input type="number" placeholder="e.g. 2010" className="h-10 border-slate-200" {...register('founded_year')} />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-sm font-medium text-slate-700">Website</Label>
              <Input placeholder="https://yourcompany.com" className="h-10 border-slate-200" {...register('website')} />
              {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-sm font-medium text-slate-700">About the Company</Label>
              <Textarea
                placeholder="Describe your company, culture, and mission..."
                rows={5}
                className="border-slate-200 resize-none"
                {...register('description')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => router.back()} className="text-slate-600">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold px-6">
              {isSaving ? <><Loader2Icon className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Company'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}