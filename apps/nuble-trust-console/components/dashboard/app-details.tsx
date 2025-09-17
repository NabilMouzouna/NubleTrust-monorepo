"use client"

import { useState } from "react"
import { registerAppReturn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Key, Calendar, Hash } from "lucide-react"
import { motion } from "framer-motion"

interface AppDetailsProps {
  app: registerAppReturn
}

export function AppDetails({ app }: AppDetailsProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Application Created Successfully
          </CardTitle>
          <CardDescription>
            Your application has been registered. Save these details securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Application ID
              </Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm border">
                {app.id}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Key
              </Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm break-all border">
                  {app.apiKey}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(app.apiKey)}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <div className="p-3 bg-muted rounded-md text-sm border">
                {app.description}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Created At
              </Label>
              <div className="p-3 bg-muted rounded-md text-sm border">
                {new Date(app.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
