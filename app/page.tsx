import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">GestaUp</h1>
        <p className="mt-4 text-lg text-gray-600">Encurtador de links para relatórios do Power BI</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/admin/dashboard"
            className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Acessar painel
          </Link>
        </div>
      </div>
    </main>
  )
}
