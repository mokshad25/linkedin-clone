'use client'

import { useState } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Loader2Icon, CheckCircle2Icon, ArrowLeftIcon, MailIcon } from 'lucide-react'

const schema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false)
    const [submittedEmail, setSubmittedEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        const supabase = createClient()

        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        setIsLoading(false)

        if (error) {
            toast.error(error.message)
            return
        }

        setSubmittedEmail(values.email)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <Card className="w-full max-w-md shadow-sm border-slate-100">
                <CardContent className="pt-10 pb-8 flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                        <CheckCircle2Icon className="w-7 h-7 text-green-500" />
                    </div>
                    <div className="space-y-1.5">
                        <h2 className="text-xl font-bold text-slate-900">Check your inbox</h2>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                            We sent a password reset link to{' '}
                            <span className="font-medium text-slate-700">{submittedEmail}</span>.
                            It may take a minute to arrive.
                        </p>
                    </div>
                    <div className="w-full pt-2 space-y-2">
                        <Button
                            variant="outline"
                            className="w-full h-10 border-slate-200 text-slate-700"
                            onClick={() => setSubmitted(false)}
                        >
                            Try a different email
                        </Button>
                        <Link href="/login" className="block">
                            <Button
                                variant="ghost"
                                className="w-full h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                Back to sign in
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md shadow-sm border-slate-100">
            <CardHeader className="space-y-1 pb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                    <MailIcon className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                    Forgot your password?
                </CardTitle>
                <CardDescription className="text-slate-500">
                    No worries — enter your email and we&apos;ll send you a reset link.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            autoFocus
                            className="h-10 border-slate-200 focus-visible:ring-blue-500"
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                Sending reset link…
                            </>
                        ) : (
                            'Send reset link'
                        )}
                    </Button>

                    <div className="text-center pt-1">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <ArrowLeftIcon className="w-3.5 h-3.5" />
                            Back to sign in
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}