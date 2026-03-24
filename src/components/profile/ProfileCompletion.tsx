import Link from 'next/link'
import { Progress } from '@/components/ui/progress'

export default function ProfileCompletion({ score }: { score: number }) {
    if (score >= 100) return null

    const getMessage = () => {
        if (score < 40) return 'Your profile is just getting started.'
        if (score < 70) return 'You\'re making progress — keep going!'
        return 'Almost there! A few more details to go.'
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <p className="text-sm font-semibold text-slate-900">Profile strength</p>
                    <p className="text-xs text-slate-500">{getMessage()}</p>
                </div>
                <span className="text-2xl font-bold text-[#0a66c2]">{score}%</span>
            </div>
            <Progress value={score} className="h-2 bg-slate-100" />
            <Link
                href="/profile/edit"
                className="block mt-3 text-xs text-[#0a66c2] font-semibold hover:underline"
            >
                Complete your profile →
            </Link>
        </div>
    )
}