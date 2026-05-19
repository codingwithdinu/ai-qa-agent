import { useState } from 'react'

import { ActionButton } from '../../components/ui/ActionButton'
import { useToast } from '../../context/ToastContext'
import { AuthCard } from './AuthCard'
import api from "../../api/client"

export function ForgotPasswordPage() {
  const { pushToast } = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const onSubmit = async (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!email.includes('@')) {
      setError('Enter the email tied to your workspace.')
      return
    }

    setError('')


    try {

      setLoading(true);

      const response =
        await api.post(
          "/auth/forgot-password",
          {
            email,
          }
        )

      const result =
        response.data;

      if (!result.success){

        setError(
          result.error ||
          "Reset failed"
        );

        return;
      }

      pushToast({

        title:
          "Reset link sent",

        description:
          "Check your email inbox.",

        tone:
          "success",
      });

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
      title="Reset password"
      description="Recover workspace access with secure, audited reset instructions."
      footerPrompt="Remembered your password?"
      footerAction="Back to sign in"
      footerTo="/login"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Work email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="security@company.com"
            className="input-shell"
          />
        </label>
        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
        <ActionButton disabled={loading} type="submit" className="w-full justify-center">
          {
            loading
              ? "Sending..."
              : "Send reset instructions"
          }        </ActionButton>
      </form>
    </AuthCard>
  )
}