"use client"
import { X } from "lucide-react"
import { createApp } from "@/lib/helpers"
import { useState } from "react"

type CreateAppModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function CreateAppModal({ isOpen, onClose }: CreateAppModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      await createApp(formData)
      onClose()
      window.location.reload() // Simple refresh to show new app
    } catch (error) {
      console.error("Failed to create app:", error)
      alert("Failed to create app. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${isOpen ? "" : "hidden"}`}
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Create New Application
        </h2>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="appName" className="block text-sm font-medium mb-2 text-gray-300">
              App Name *
            </label>
            <input
              id="appName"
              name="name"
              type="text"
              required
              disabled={isLoading}
              className="w-full bg-[#121212] border border-gray-700 rounded-md px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="My Awesome App"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              disabled={isLoading}
              className="w-full bg-[#121212] border border-gray-700 rounded-md px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
              placeholder="Brief description of your application"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-md transition-colors"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
