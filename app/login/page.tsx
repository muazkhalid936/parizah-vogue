"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    location: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login"
      const payload = isSignup ? formData : { email: formData.email, password: formData.password }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Authentication failed")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      if (data.user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/orders")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">{isSignup ? "Create Account" : "Welcome Back"}</h1>

        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium mb-2">Location (Optional)</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded font-medium hover:bg-accent transition disabled:opacity-50"
          >
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="mb-2">{isSignup ? "Already have an account?" : "Don't have an account?"}</p>
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary hover:text-accent transition font-medium"
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  )
}
