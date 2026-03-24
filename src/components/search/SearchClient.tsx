'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import SearchPeopleTab from './SearchPeopleTab'
import SearchJobsTab from './SearchJobsTab'
import SearchCompaniesTab from './SearchCompaniesTab'
import SearchPostsTab from './SearchPostsTab'

interface Results {
  people: any[]
  jobs: any[]
  companies: any[]
  posts: any[]
}

interface Props {
  query: string
  type: string
  results: Results | null
  currentUserId: string
}

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'people', label: 'People' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'companies', label: 'Companies' },
  { key: 'posts', label: 'Posts' },
]

export default function SearchClient({ query, type, results, currentUserId }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState(query)
  const [activeTab, setActiveTab] = useState(type)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    router.push(`/search?q=${encodeURIComponent(search.trim())}&type=${activeTab}`)
  }

  const switchTab = (tab: string) => {
    setActiveTab(tab)
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}&type=${tab}`)
    }
  }

  const totalCount = results
    ? results.people.length + results.jobs.length +
      results.companies.length + results.posts.length
    : 0

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 space-y-4">

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people, jobs, companies, posts..."
            className="pl-9 h-11 bg-white border-slate-200 text-sm"
            autoFocus
          />
        </div>
        <Button
          type="submit"
          className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold rounded-md px-5"
        >
          Search
        </Button>
      </form>

      {/* No query state */}
      {!query && (
        <div className="bg-white rounded-lg border border-slate-200 py-20 flex flex-col items-center gap-3 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
            <SearchIcon className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-lg font-semibold text-slate-700">Search LinkedIn</p>
          <p className="text-sm text-slate-500 max-w-xs">
            Find people, jobs, companies, and posts across your professional network.
          </p>
        </div>
      )}

      {/* Results */}
      {query && results && (
        <>
          {/* Result summary */}
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-slate-600">
              {totalCount > 0 ? (
                <>
                  <span className="font-semibold text-slate-900">{totalCount}</span>{' '}
                  results for{' '}
                  <span className="font-semibold text-slate-900">
                    &ldquo;{query}&rdquo;
                  </span>
                </>
              ) : (
                <>
                  No results for{' '}
                  <span className="font-semibold text-slate-900">
                    &ldquo;{query}&rdquo;
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide border-b border-slate-100">
              {TABS.map(({ key, label }) => {
                const count =
                  key === 'all' ? totalCount
                  : key === 'people' ? results.people.length
                  : key === 'jobs' ? results.jobs.length
                  : key === 'companies' ? results.companies.length
                  : results.posts.length

                return (
                  <button
                    key={key}
                    onClick={() => switchTab(key)}
                    className={`shrink-0 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === key
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                    {count > 0 && (
                      <span className="ml-1.5 text-xs text-slate-400">({count})</span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="p-4">
              {(activeTab === 'all' || activeTab === 'people') && results.people.length > 0 && (
                <SearchPeopleTab
                  people={results.people}
                  currentUserId={currentUserId}
                  showHeader={activeTab === 'all'}
                  query={query}
                />
              )}
              {(activeTab === 'all' || activeTab === 'jobs') && results.jobs.length > 0 && (
                <SearchJobsTab
                  jobs={results.jobs}
                  currentUserId={currentUserId}
                  showHeader={activeTab === 'all'}
                />
              )}
              {(activeTab === 'all' || activeTab === 'companies') && results.companies.length > 0 && (
                <SearchCompaniesTab
                  companies={results.companies}
                  showHeader={activeTab === 'all'}
                />
              )}
              {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                <SearchPostsTab
                  posts={results.posts}
                  showHeader={activeTab === 'all'}
                />
              )}
              {totalCount === 0 && (
                <div className="flex flex-col items-center py-12 gap-3 text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                    <SearchIcon className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="font-semibold text-slate-700">No results found</p>
                  <p className="text-sm text-slate-500 max-w-xs">
                    Try different keywords or check your spelling.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}