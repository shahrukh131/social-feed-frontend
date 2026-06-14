import './page.css'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">Social Feed</h1>
        <p className="mb-8 text-xl text-gray-600">
          Welcome to your scalable social feed application
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </a>
          <a
            href="/register"
            className="rounded-lg border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Register
          </a>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 max-w-4xl">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">⚡ Fast</h3>
          <p className="text-gray-600">
            Built with Next.js and optimized for performance
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">🔒 Secure</h3>
          <p className="text-gray-600">
            JWT authentication and secure API communication
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">📱 Responsive</h3>
          <p className="text-gray-600">
            Fully responsive design with Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  )
}
