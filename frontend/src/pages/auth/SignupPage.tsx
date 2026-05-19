import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ActionButton } from '../../components/ui/ActionButton'
import { useToast } from '../../context/ToastContext'
import { AuthCard } from './AuthCard'
import api from "../../api/client"

export function SignupPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '' })
  const [error, setError] = useState('')

  const onChange = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    if (
      Object.values(form).some(
        (value) => value.trim().length < 2
      )
    ) {

      setError(
        'Complete every field to create your workspace.'
      )

      return
    }

    if (
      !form.email.includes('@') ||
      form.password.length < 8
    ) {

      setError(
        'Use a valid email and a password with 8+ characters.'
      )

      return
    }

    try {

      setError("")
      setLoading(true)

      const response =
        await api.post(
          "/auth/signup",
          {
            name: form.name,
            company: form.company,
            email: form.email,
            password: form.password,
          }
        )

      const result =
        response.data

      if (!result.success) {

        setError(
          result.error ||
          "Signup failed"
        )

        return
      }

      localStorage.setItem(

        "token",

        result.token
      )

      localStorage.setItem(

        "user",

        JSON.stringify(
          result.user
        )
      )

      pushToast({

        title:
          "Workspace created",

        description:
          "Your account is ready.",

        tone:
          "success",
      })

      navigate(
        "/app/dashboard"
      )

    } catch {

      setError(
        "Server connection failed"
      )

    } finally {

      setLoading(false)
    }
  }
  return (
    <AuthCard
      title="Create workspace"
      description="Start recording tests, auto-generating Playwright specs, and monitoring release quality in minutes."
      footerPrompt="Already have an account?"
      footerAction="Sign in"
      footerTo="/login"
    >
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
        <label className="space-y-2 text-sm text-slate-300 sm:col-span-1">
          <span>Full name</span>
          <input value={form.name} onChange={(event) => onChange('name', event.target.value)} type="text" placeholder="Ava Johnson" className="input-shell" />
        </label>
        <label className="space-y-2 text-sm text-slate-300 sm:col-span-1">
          <span>Company</span>
          <input value={form.company} onChange={(event) => onChange('company', event.target.value)} type="text" placeholder="Quantum Labs" className="input-shell" />
        </label>
        <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
          <span>Work email</span>
          <input value={form.email} onChange={(event) => onChange('email', event.target.value)} type="email" placeholder="ava@quantumlabs.ai" className="input-shell" />
        </label>
        <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
          <span>Password</span>
          <input value={form.password} onChange={(event) => onChange('password', event.target.value)} type="password" placeholder="Create a secure password" className="input-shell" />
        </label>
        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 sm:col-span-2">{error}</p> : null}
        <ActionButton disabled={loading} type="submit" className="w-full justify-center sm:col-span-2">
          {
            loading
              ? "Creating workspace..."
              : "Create workspace"
          }        </ActionButton>
      </form>
    </AuthCard>
  )
}