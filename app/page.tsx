import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="text-center">
        <Image
          src="/logo-gestaup.jpeg"
          alt="GestaUp"
          width={240}
          height={64}
          className="mx-auto h-16 w-auto"
          priority
        />
        <p className="mt-4 text-lg text-gray-600">Encurtador de links para relatórios do Power BI</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/admin/dashboard"
            className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Acessar painel
          </Link>
        </div>
      </div>
    </main>
  )
}
