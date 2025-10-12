'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AppsConsumer } from '@/components/dashboard/apps-provider'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ApplicationDetailsLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const { apps } = AppsConsumer()
  const [notFound, setNotFound] = useState(false)

  const appId = useMemo(() => (params?.id as string) || '', [params])
  const app = useMemo(() => apps.find((a) => a.id === appId), [apps, appId])

  useEffect(() => {
    if (!appId) return
    if (apps.length > 0 && !app) setNotFound(true)
  }, [appId, app, apps])

  const activeTab = useMemo(() => {
    if (pathname.endsWith('/users')) return 'users'
    if (pathname.endsWith('/security')) return 'security'
    if (pathname.endsWith('/settings')) return 'settings'
    return 'overview'
  }, [pathname])

  if (notFound) {
    return (
      <div className='space-y-6'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='flex items-center justify-between'
        >
          <h1 className='text-2xl font-bold text-foreground'>Application not found</h1>
          <Button variant='outline' onClick={() => router.push('/dashboard/applications')}>Back to Applications</Button>
        </motion.div>
        <p className='text-muted-foreground'>It may have been removed or you navigated here directly before loading the list.</p>
      </div>
    )
  }

  return app ? (
    <div className='space-y-6'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='flex items-center justify-between'
      >
        <h1 className='text-3xl font-bold text-foreground'>{app.name}</h1>
        <Button variant='outline' onClick={() => router.push('/dashboard/applications')}>Back</Button>
      </motion.div>

      <Tabs value={activeTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='overview' asChild>
            <Link href={`/dashboard/applications/${appId}`}>Overview</Link>
          </TabsTrigger>
          <TabsTrigger value='users' asChild>
            <Link href={`/dashboard/applications/${appId}/users`}>Users</Link>
          </TabsTrigger>
          <TabsTrigger value='security' asChild>
            <Link href={`/dashboard/applications/${appId}/security`}>Security</Link>
          </TabsTrigger>
          <TabsTrigger value='settings' asChild>
            <Link href={`/dashboard/applications/${appId}/settings`}>Settings</Link>
          </TabsTrigger>
        </TabsList>
        <div className='mt-4'>{children}</div>
      </Tabs>
    </div>
  ) : null
}
