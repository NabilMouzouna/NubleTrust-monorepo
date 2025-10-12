'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

// Mock data for users
const users = [
  { id: 'usr_1', email: 'user1@example.com', status: 'active', lastSeen: '2 hours ago' },
  { id: 'usr_2', email: 'user2@example.com', status: 'active', lastSeen: '1 day ago' },
  { id: 'usr_3', email: 'user3@example.com', status: 'invited', lastSeen: 'N/A' },
]

export default function ApplicationUsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className='font-mono'>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>{user.status}</Badge>
                </TableCell>
                <TableCell>{user.lastSeen}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
