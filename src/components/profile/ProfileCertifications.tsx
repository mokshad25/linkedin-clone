import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Certification } from '@/types/database'
import { AwardIcon, ExternalLinkIcon, PencilIcon } from 'lucide-react'

interface Props {
  items: Certification[]
  isOwnProfile: boolean
}

export default function ProfileCertifications({ items, isOwnProfile }: Props) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Licenses &amp; Certifications
        </h2>
        {isOwnProfile && (
          <Link href="/profile/edit#certifications">
            <PencilIcon className="w-4 h-4 text-slate-500 hover:text-slate-800 cursor-pointer" />
          </Link>
        )}
      </div>

      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            {/* Icon */}
            <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
              <AwardIcon className="w-5 h-5 text-slate-500" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.name}
                </h3>
                {item.credential_url && (
                  <a
                    href={item.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0a66c2] hover:text-[#004182]"
                  >
                    <ExternalLinkIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <p className="text-sm text-slate-700">{item.issuer}</p>

              {item.issue_date && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Issued {formatDate(item.issue_date)}
                  {item.expiry_date
                    ? ` · Expires ${formatDate(item.expiry_date)}`
                    : ' · No expiration'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}