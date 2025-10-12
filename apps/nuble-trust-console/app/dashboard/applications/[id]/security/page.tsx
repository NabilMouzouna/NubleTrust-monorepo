'use client'
import { Card, CardContent } from '@/components/ui/card'

export default function ApplicationSecurityPage() {
    return (
        <Card>
            <CardContent className='p-6 text-sm text-muted-foreground space-y-2'>
              <div>- API Key rotation</div>
              <div>- Allowed origins management</div>
              <div>- Webhook signing & audit logs</div>
            </CardContent>
        </Card>
    )
}
