import Link from 'next/link'
import { BuildingIcon, MapPinIcon, UsersIcon } from 'lucide-react'

interface Props {
  companies: any[]
  showHeader: boolean
}

export default function SearchCompaniesTab({ companies, showHeader }: Props) {
  return (
    <div className={showHeader ? 'mt-4 pt-4 border-t border-slate-100' : ''}>
      {showHeader && (
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Companies ({companies.length})
        </h3>
      )}

      <div className="space-y-2">
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <BuildingIcon className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {company.name}
              </p>
              {company.industry && (
                <p className="text-xs text-slate-500">{company.industry}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-3 mt-0.5">
                {company.location && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPinIcon className="w-3 h-3" />
                    {company.location}
                  </span>
                )}
                {company.size && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <UsersIcon className="w-3 h-3" />
                    {company.size} employees
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}