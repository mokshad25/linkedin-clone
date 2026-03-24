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

const signupSchema = z.object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Must contain at least one number'),
    role: z.enum(['student', 'recruiter']),
})

type SignupValues = z.infer<typeof signupSchema>

export default function SignupForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { role: 'student' },
    })

    const selectedRole = watch('role')

    const onSubmit = async (values: SignupValues) => {
        setIsLoading(true)
        const supabase = createClient()

        const { data, error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                data: {
                    full_name: values.full_name,
                    role: values.role,
                },
            },
        })

        if (error) {
            setIsLoading(false)
            toast.error(error.message)
            return
        }

        if (data.user) {
            toast.success('Account created! Welcome to ProNet.')
            router.push('/feed')
            router.refresh()
        }
    }

    return (
        <Card className="w-full max-w-md shadow-sm border-slate-100">
            <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">
                    Create your account
                </CardTitle>
                <CardDescription className="text-slate-500">
                    Join thousands of professionals on ProNet
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Role Selector */}
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-slate-700">I am a</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['student', 'recruiter'] as const).map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setValue('role', role)}
                                    className={`h-10 rounded-lg border text-sm font-medium capitalize transition-all ${selectedRole === role
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                        }`}
                                >
                                    {role === 'student' ? 'Student / Job Seeker' : 'Recruiter'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="full_name" className="text-sm font-medium text-slate-700">
                            Full name
                        </Label>
                        <Input
                            id="full_name"
                            placeholder="John Doe"
                            autoComplete="name"
                            className="h-10 border-slate-200 focus-visible:ring-blue-500"
                            {...register('full_name')}
                        />
                        {errors.full_name && (
                            <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>
                        )}
                    </div>

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
                            className="h-10 border-slate-200 focus-visible:ring-blue-500"
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 8 characters"
                                autoComplete="new-password"
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
                        className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                Creating account…
                            </>
                        ) : (
                            'Create account'
                        )}
                    </Button>

                    {/* Terms */}
                    <p className="text-center text-xs text-slate-400 pt-1">
                        By creating an account, you agree to our{' '}
                        <Link href="#" className="underline hover:text-slate-600">
                            Terms
                        </Link>{' '}
                        and{' '}
                        <Link href="#" className="underline hover:text-slate-600">
                            Privacy Policy
                        </Link>
                    </p>

                    {/* Sign in link */}
                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign in
                        </Link>
                    </p>

                </form>
            </CardContent>
        </Card>
    )
}