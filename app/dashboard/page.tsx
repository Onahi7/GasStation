import { redirect } from "next/navigation"
import { getUserRole } from "@/app/actions/auth"

export default async function DashboardPage() {
  const user = await getUserRole()

  if (!user) {
    redirect("/login")
  }

  // Redirect to the appropriate dashboard based on role
  redirect(`/${user.role}`)
}

