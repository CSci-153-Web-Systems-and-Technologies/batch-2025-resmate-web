'use client'
import { OTPForm } from "@/components/otp-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function OTPPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email")

  useEffect(() => {
    if (!email || email.trim() === "") {
      router.replace("/register")
    }
  }, [email, router])

  if (!email || email.trim() === "") {
    // Optionally render a lightweight fallback while redirecting
    return null
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <OTPForm />
      </div>
    </div>
  )
}
