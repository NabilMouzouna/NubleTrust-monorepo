'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { AppsConsumer } from '@/components/dashboard/apps-provider'
import { AppDetails } from '@/components/dashboard/app-details'

export default function ApplicationOverviewPage() {
  const params = useParams()
  const { apps } = AppsConsumer()
  const appId = useMemo(() => (params?.id as string) || '', [params])
  const app = useMemo(() => apps.find((a) => a.id === appId), [apps, appId])

  return app ? <AppDetails app={app} /> : null
}