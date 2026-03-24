'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2Icon, EyeIcon, EyeOffIcon } from 'lucide-react'

const schema = z.object({
    password: z
        .string()
        .min(8, 'At least 8 characters')
        .regex(/[A-Z]/, 'Must contain an uppercase letter')
        .regex(/[0-9]/, 'Must contain a number'),
    confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
})

type FormValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
    const router = useRouter()
    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        const supabase = createClient()

        const { error } = await supabase.auth.updateUser({ password: values.password })

        setIsLoading(false)

        if (error) {
            toast.error(error.message)
            return
        }

        toast.success('Password updated successfully!')
        router.push('/feed')
    }

    return (
        <Card className="w-full max-w-md shadow-sm border-slate-100">
            <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">Set new password</CardTitle>
                <CardDescription className="text-slate-500">
                    Choose a strong password for your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                            New password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={show ? 'text' : 'password'}
                                placeholder="Min. 8 characters"
                                className="h-10 border-slate-200 focus-visible:ring-blue-500 pr-10"
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShow(!show)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {show ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="confirm" className="text-sm font-medium text-slate-700">
                            Confirm password
                        </Label>
                        <Input
                            id="confirm"
                            type={show ? 'text' : 'password'}
                            placeholder="Repeat password"
                            className="h-10 border-slate-200 focus-visible:ring-blue-500"
                            {...register('confirm')}
                        />
                        {errors.confirm && <p className="text-xs text-red-500">{errors.confirm.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" />Updating…</>
                        ) : (
                            'Update password'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}