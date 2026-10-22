import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MediaGrid } from "@/components/dashboard/MediaGrid";

export default async function GuestMediaPage({
  params,
}: {
  params: Promise<{ weddingId: string }>;
}) {
  const { weddingId } = await params;

  // TEMPORARY: dev bypass allowed in production too until real Google OAuth is wired up.
  const session = await auth();
  const userEmail = session?.user?.email || "dev@local.test";

  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) {
    notFound();
  }

  const wedding = await prisma.wedding.findUnique({
    where: { 
      id: weddingId,
      userId: user.id
    },
    include: { mediaUploads: { orderBy: { createdAt: "desc" } } },
  });
  if (!wedding) notFound();

  const driveConnected = !!wedding.driveFolderId;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl">Guest Media</h1>
        {driveConnected ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
            Drive connected
          </span>
        ) : (
          <a
            href={`/api/drive/connect?weddingId=${wedding.id}`}
            className="rounded bg-[#b8860b] px-4 py-2 text-sm text-white"
          >
            Connect Google Drive
          </a>
        )}
      </div>

      <MediaGrid mediaUploads={wedding.mediaUploads} />
    </main>
  );
}
