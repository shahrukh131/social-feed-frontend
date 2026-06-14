'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Header } from '@/components/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your activity overview.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Posts', value: '0', color: 'blue' },
              { label: 'Total Likes', value: '0', color: 'green' },
              { label: 'Comments', value: '0', color: 'purple' },
              { label: 'Followers', value: '0', color: 'orange' },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className={`text-4xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                    <p className="mt-2 text-gray-600">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Start building your social presence</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Create and share posts with your network</li>
                <li>✓ Engage with posts through likes and comments</li>
                <li>✓ View and manage your feed</li>
                <li>✓ Update your profile information</li>
                <li>✓ Connect with other users</li>
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
