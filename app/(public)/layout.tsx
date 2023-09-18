import { ReactNode } from 'react'
import { getServerSession } from 'next-auth/next'
import Footer from '@/components/widgets/footer'
import Navbar from '@/components/widgets/navbar'
import options from '@/app/api/auth/[...nextauth]/options'
import UserCategorie from '@/components/widgets/user-categorie'
// import prisma from '@/lib/prisma/prisma'
import ClientProvider from '@/components/widgets/client-provider'

type SiteLayoutProps = { children: ReactNode }

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const session = await getServerSession(options)

  // if (session?.user?.email) {
  //   const user = await prisma.user.findUnique({
  //     where: {
  //       email: session.user.email,
  //     },
  //   })
  //   console.log(user)
  // }
  return (
    <div className="flex min-h-screen flex-col relative">
      <header className="fixed inset-0 top-0 z-20 border-b border-border bg-white h-16">
        <ClientProvider session={session}>
          <Navbar />
        </ClientProvider>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <UserCategorie />
      <Footer />
    </div>
  )
}