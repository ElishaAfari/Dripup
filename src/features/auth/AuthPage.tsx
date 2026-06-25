import { useState } from 'react'
import { Mail, Phone, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Page } from '@/components/ui/Page'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

type AuthStatus = 'idle' | 'sending' | 'sent' | 'error'

export function AuthPage() {
  const [email, setEmail] = useState('nadia@atelier.local')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<AuthStatus>('idle')
  const [message, setMessage] = useState('Supabase Auth supports email magic links, Google OAuth, and phone OTP.')

  async function sendEmailOtp() {
    setStatus('sending')
    if (!isSupabaseConfigured()) {
      setStatus('sent')
      setMessage('Demo mode: magic link request simulated. Configure Supabase env vars to send real auth email.')
      return
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    setStatus(error ? 'error' : 'sent')
    setMessage(error?.message ?? 'Magic link sent. Check your inbox.')
  }

  async function sendPhoneOtp() {
    setStatus('sending')
    if (!isSupabaseConfigured()) {
      setStatus('sent')
      setMessage('Demo mode: phone OTP simulated. Configure Supabase SMS settings to send real codes.')
      return
    }

    const { error } = await supabase.auth.signInWithOtp({ phone })
    setStatus(error ? 'error' : 'sent')
    setMessage(error?.message ?? 'Phone OTP sent.')
  }

  async function signInWithGoogle() {
    setStatus('sending')
    if (!isSupabaseConfigured()) {
      setStatus('sent')
      setMessage('Demo mode: Google OAuth simulated. Add Google OAuth secrets in Supabase for production.')
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    setStatus(error ? 'error' : 'sent')
    setMessage(error?.message ?? 'Redirecting to Google...')
  }

  return (
    <Page
      eyebrow="Supabase Auth"
      title="Sign in to the fashion network."
      description="Accounts can hold customer and vendor roles at the same time. Role-aware RLS reads profiles.roles to protect backend actions."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Mail className="text-atelier-saffron" size={22} />
            <h2 className="text-xl font-bold">Email magic link</h2>
          </div>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-h-12 w-full rounded-2xl border border-atelier-mist bg-white px-4 outline-none focus:border-atelier-saffron dark:border-white/10 dark:bg-white/10"
            type="email"
          />
          <Button className="mt-4 w-full" onClick={() => void sendEmailOtp()} disabled={status === 'sending'}>
            Send magic link
          </Button>
        </Card>

        <Card className="space-y-4">
          <div>
            <Phone className="mb-3 text-atelier-saffron" size={22} />
            <p className="font-bold">Phone OTP</p>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="mt-3 min-h-12 w-full rounded-2xl border border-atelier-mist bg-white px-4 outline-none focus:border-atelier-saffron dark:border-white/10 dark:bg-white/10"
              placeholder="+233..."
              type="tel"
            />
            <Button className="mt-3 w-full" variant="secondary" onClick={() => void sendPhoneOtp()} disabled={status === 'sending' || !phone}>
              Send OTP
            </Button>
          </div>
          <Button className="w-full" variant="accent" onClick={() => void signInWithGoogle()} disabled={status === 'sending'}>
            Continue with Google
          </Button>
        </Card>
      </div>

      <Card className="border-atelier-saffron/35 bg-atelier-saffron/15">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 text-atelier-saffron" size={22} />
          <p className="text-sm font-semibold">{message}</p>
        </div>
      </Card>
    </Page>
  )
}
