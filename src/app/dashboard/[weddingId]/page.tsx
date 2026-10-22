import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function WeddingDashboardPage({ params }: { params: Promise<{ weddingId: string }> }) {
  const { weddingId } = await params;

  // TEMPORARY: dev bypass allowed in production too until real Google OAuth is wired up.
  const session = await auth()
  const userEmail = session?.user?.email || "dev@local.test"
  
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  })

  if (!user) {
    redirect("/login")
  }

  const wedding = await prisma.wedding.findUnique({
    where: { 
      id: weddingId,
      userId: user.id
    },
    include: {
      events: true,
      rsvps: true,
      mediaUploads: true,
      galleryPhotos: true
    }
  })

  if (!wedding) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold mb-4 font-serif">Wedding not found</h1>
        <p className="text-neutral-500 mb-8">This wedding doesn't exist or you don't have access to it.</p>
        <Link href="/dashboard" className="text-[#b8860b] hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    )
  }

  const coupleNames = wedding.coupleNames as any;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <Link href="/dashboard" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white mb-6 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold font-serif text-black dark:text-white">
            {coupleNames?.partnerA} & {coupleNames?.partnerB}
          </h1>
          <p className="text-neutral-500 mt-2 text-lg">
            {new Date(wedding.weddingDate).toLocaleDateString(undefined, {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
        <div className="flex gap-4">
          <a 
            href={`/sites/${wedding.subdomainSlug}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#b8860b] hover:bg-[#9a7009] text-white px-5 py-2.5 rounded-md font-medium transition-colors"
          >
            View Live Site
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-neutral-500 font-medium mb-2 text-xs uppercase tracking-wider">RSVPs</h3>
          <p className="text-4xl font-serif text-black dark:text-white">{wedding.rsvps.length}</p>
        </div>
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-neutral-500 font-medium mb-2 text-xs uppercase tracking-wider">Events</h3>
          <p className="text-4xl font-serif text-black dark:text-white">{wedding.events.length}</p>
        </div>
        <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-neutral-500 font-medium mb-2 text-xs uppercase tracking-wider">Guest Uploads</h3>
          <p className="text-4xl font-serif text-black dark:text-white">{wedding.mediaUploads.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-neutral-50 dark:bg-zinc-900 rounded-xl p-8 border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-2xl font-serif font-bold mb-3 text-black dark:text-white">Media Hub</h2>
          <p className="text-neutral-500 mb-8">
            Manage photos and videos uploaded by your guests. Approve items to show on the public gallery.
          </p>
          <Link 
            href={`/dashboard/${wedding.id}/media`}
            className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Open Media Hub
          </Link>
        </div>

        <div className="bg-neutral-50 dark:bg-zinc-900 rounded-xl p-8 border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-2xl font-serif font-bold mb-3 text-black dark:text-white">Settings</h2>
          <div className="text-neutral-500 mb-8 space-y-2">
            <p>
              Status: <span className="capitalize font-medium text-black dark:text-white">{wedding.status}</span>
            </p>
            <p>
              Subdomain: <span className="font-medium text-black dark:text-white">{wedding.subdomainSlug}</span>
            </p>
            <p>
              Payment: <span className="capitalize font-medium text-black dark:text-white">{wedding.paymentStatus}</span>
            </p>
          </div>
          <Link 
            href={`/dashboard/${wedding.id}/edit`}
            className="inline-block text-center bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            Edit Details
          </Link>
        </div>
      </div>
    </div>
  )
}
