import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  // TEMPORARY: dev bypass allowed in production too until real Google OAuth is wired up.
  const session = await auth()
  const userEmail = session?.user?.email || "dev@local.test"
  
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      weddings: {
        orderBy: { createdAt: "desc" },
      }
    }
  })

  // Since we create user on the fly in the API in dev mode, they might not exist yet here
  const weddings = user?.weddings || []

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold font-serif text-black dark:text-white">Your Weddings</h1>
        {weddings.length > 0 && (
          <Link 
            href="/dashboard/new" 
            className="bg-[#b8860b] hover:bg-[#9a7009] text-white px-5 py-2.5 rounded-md font-medium transition-colors"
          >
            Create New
          </Link>
        )}
      </div>
      
      {weddings.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <h2 className="text-2xl font-serif font-semibold mb-3">No weddings yet</h2>
          <p className="text-neutral-500 mb-8 max-w-md mx-auto">
            Create your first wedding site to start managing events, guests, and media.
          </p>
          <Link 
            href="/dashboard/new" 
            className="bg-[#b8860b] hover:bg-[#9a7009] text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Create New Wedding
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddings.map((wedding) => {
            const coupleNames = wedding.coupleNames as any;
            return (
              <Link 
                key={wedding.id} 
                href={`/dashboard/${wedding.id}`}
                className="group block p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-[#b8860b] dark:hover:border-[#b8860b] transition-colors"
              >
                <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-[#b8860b] transition-colors text-black dark:text-white">
                  {coupleNames?.partnerA} & {coupleNames?.partnerB}
                </h3>
                <p className="text-neutral-500 mb-6 text-sm">
                  {new Date(wedding.weddingDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-900">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 capitalize">
                    {wedding.status}
                  </span>
                  <span className="text-xs text-neutral-400">
                    /{wedding.subdomainSlug}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
