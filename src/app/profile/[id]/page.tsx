'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

export default function ProfilePage({ params }: { params: { id: string } }) {
  // Placeholder: In production, fetch user profile based on params.id
  const user = {
    id: params.id,
    fullName: 'User Name',
    username: 'username',
    avatar: undefined,
    bio: 'This is a user bio placeholder',
    email: 'user@example.com',
    createdAt: new Date().toISOString(),
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="mx-auto max-w-4xl px-4 py-8">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-lg font-bold">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
                  <p className="text-gray-600">@{user.username}</p>
                  {user.bio && <p className="mt-2 text-gray-600">{user.bio}</p>}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: 'Posts', value: '0' },
                  { label: 'Followers', value: '0' },
                  { label: 'Following', value: '0' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No posts yet.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
