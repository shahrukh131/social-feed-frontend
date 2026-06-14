'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Header } from '@/components/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            {[
              {
                title: 'Profile Settings',
                description: 'Manage your profile information and preferences.',
              },
              {
                title: 'Privacy & Security',
                description:
                  'Control who can see your posts and manage your security settings.',
              },
              {
                title: 'Notifications',
                description: 'Customize your notification preferences.',
              },
              {
                title: 'Account',
                description: 'Manage your account and data.',
              },
            ].map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Manage</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
