import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { ActionButton } from '../../components/ui/ActionButton'
import { useToast } from '../../context/ToastContext'
import { AuthCard } from './AuthCard'
import api from "../../api/client"

export function LoginPage() {
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) { navigate("/app/dashboard"); }
  }, [navigate]);


  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.includes('@')) {
      setError('Use your work email address to continue.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    try {

      setError("");

      setLoading(true);
      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        )

      const result =
        response.data

      if (!result.success) {

        setError(
          result.error ||
          "Login failed"
        );

        return;
      }

      localStorage.setItem(

        "token",

        result.token
      );

      console.log(
        "TOKEN SAVED:",
        result.token
      );

      localStorage.setItem(

        "user",

        JSON.stringify(
          result.user
        )
      );

      pushToast({

        title:
          "Signed in",

        description:
          "Welcome back to AI QA Agent.",

        tone:
          "success",
      });

      navigate(
        "/app/dashboard"
      );

    } catch {

      setError(
        "Server connection failed"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Sign in"
      description="Access resilient recording, AI healing intelligence, and enterprise release monitoring."
      footerPrompt="Need an account?"
      footerAction="Create one"
      footerTo="/signup"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Work email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="you@company.com"
            className="input-shell"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Enter your password"
            className="input-shell"
          />
        </label>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-white/5" />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-cyan-300 hover:text-cyan-200">
            Forgot password?
          </Link>
        </div>
        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
        <ActionButton disabled={loading} type="submit" className="w-full justify-center">
          {
            loading
              ? "Signing in..."
              : "Enter workspace"
          }
        </ActionButton>
      </form>
    </AuthCard>
  )
}