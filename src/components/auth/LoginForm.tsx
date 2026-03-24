'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Loader2Icon, EyeIcon, EyeOffIcon } from 'lucide-react'

const loginSchema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (values: LoginValues) => {
        setIsLoading(true)
        const supabase = createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        })

        if (error) {
            setIsLoading(false)
            toast.error(error.message)
            return
        }

        router.push('/feed')
        router.refresh()
    }

    return (
        <Card className="w-full max-w-md shadow-sm border-slate-100">
            <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">
                    Welcome back
                </CardTitle>
                <CardDescription className="text-slate-500">
                    Sign in to your account to continue
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Email */}
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

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                Password
                            </Label>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-[#0a66c2] hover:text-[#004182] font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className="h-10 border-slate-200 focus-visible:ring-blue-500 pr-10"
                                {...register('password')}
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
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full h-10 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold rounded-full mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                Signing in…
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </Button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-1">
                        <div className="h-px bg-slate-200 flex-1" />
                        <span className="text-xs text-slate-400">or</span>
                        <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-slate-600">
                        New to LinkedIn?{' '}
                        <Link
                            href="/signup"
                            className="text-[#0a66c2] hover:text-[#004182] font-semibold"
                        >
                            Join now
                        </Link>
                    </p>

                </form>
            </CardContent>
        </Card>
    )
}
