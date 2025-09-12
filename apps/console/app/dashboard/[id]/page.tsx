import { getApp } from "@/lib/actions"
import { notFound } from "next/navigation"
import AppDashboard from "@/components/AppDashboard"

export default async function AppPage({ params }: { params: { id: string } }) {
  const { id } = params
  console.log("Fetching app with id:", id)
  const app = await getApp(id)

  if (!app) {
    notFound()
  }

  return <AppDashboard app={app} />
}
