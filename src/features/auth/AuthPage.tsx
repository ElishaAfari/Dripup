import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wand2,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

type AuthMode = 'signin' | 'signup' | 'forgot' | 'phone'
type AuthStatus = 'idle' | 'sending' | 'sent' | 'error'
type VendorRole = 'customer' | 'artisan' | 'designer' | 'mua' | 'seller'

type InputFieldProps = {
  icon: LucideIcon
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  type?: string
  placeholder?: string
  rightAction?: React.ReactNode
}

const roleOptions: { value: VendorRole; label: string }[] = [
  { value: 'customer', label: 'Fashion lover' },
  { value: 'artisan', label: 'Maker' },
  { value: 'designer', label: 'Designer' },
  { value: 'mua', label: 'MUA' },
  { value: 'seller', label: 'Seller' },
]

const heroMetrics = [
  ['37 tables', 'RLS-ready social commerce'],
  ['10 studios', 'AI, escrow, auctions, passports'],
  ['Ghana-first', 'Paystack, MoMo, Stripe rails'],
] as const

function getModeFromPath(pathname: string): AuthMode {
  if (pathname.includes('signup')) {
    return 'signup'
  }
  if (pathname.includes('forgot')) {
    return 'forgot'
  }
  if (pathname.includes('phone')) {
    return 'phone'
  }
  return 'signin'
}

export function AuthPage() {
  const location = useLocation()
  const [mode, setMode] = useState<AuthMode>(getModeFromPath(location.pathname))
  const [email, setEmail] = useState('nadia@atelier.local')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [role, setRole] = useState<VendorRole>('customer')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<AuthStatus>('idle')
  const [message, setMessage] = useState('Welcome back. Your studio, style feed, orders, and wardrobe are waiting.')

  const passwordChecks = useMemo(
    () => [
      { label: '8+ characters', passed: password.length >= 8 },
      { label: 'Uppercase letter', passed: /[A-Z]/.test(password) },
      { label: 'Lowercase letter', passed: /[a-z]/.test(password) },
      { label: 'Number', passed: /\d/.test(password) },
      { label: 'Symbol', passed: /[^A-Za-z0-9]/.test(password) },
    ],
    [password],
  )
  const passwordScore = passwordChecks.filter((check) => check.passed).length
  const passwordIsStrong = passwordScore >= 4
  const passwordStrengthLabel = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][passwordScore]

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode)
    setStatus('idle')
    setMessage(nextMode === 'signin' ? 'Welcome back. Your studio, style feed, orders, and wardrobe are waiting.' : 'Create your Atelier identity in a few seconds.')
  }

  async function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mode === 'signin') {
      await signInWithPassword()
    }
    if (mode === 'signup') {
      await signUpWithPassword()
    }
    if (mode === 'forgot') {
      await sendPasswordReset()
    }
    if (mode === 'phone') {
      if (otp) {
        await verifyPhoneOtp()
      } else {
        await sendPhoneOtp()
      }
    }
  }

  async function signInWithPassword() {
    if (!isValidEmail(email) || !password) {
      showError('Enter a valid email and password.')
      return
    }
    setStatus('sending')

    if (!isSupabaseConfigured()) {
      showSuccess('Demo mode: password sign-in simulated. Add Supabase env vars for live auth.')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    finish(error?.message ?? 'Signed in successfully. Redirecting to your feed.', Boolean(error))
  }

  async function signUpWithPassword() {
    if (!fullName.trim()) {
      showError('Add your full name or studio name.')
      return
    }
    if (!isValidEmail(email)) {
      showError('Enter a valid email address.')
      return
    }
    if (!passwordIsStrong) {
      showError('Choose a stronger password before creating the account.')
      return
    }
    if (password !== confirmPassword) {
      showError('Passwords do not match.')
      return
    }
    if (!acceptedTerms) {
      showError('Accept the platform terms to continue.')
      return
    }

    setStatus('sending')
    if (!isSupabaseConfigured()) {
      showSuccess('Demo mode: account created with role metadata ready for Supabase Auth.')
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          display_name: fullName,
          phone,
          roles: role === 'customer' ? ['customer'] : ['customer', role],
        },
      },
    })
    finish(error?.message ?? 'Account created. Check your email to confirm and enter Atelier.', Boolean(error))
  }

  async function sendMagicLink() {
    if (!isValidEmail(email)) {
      showError('Enter a valid email to receive a magic link.')
      return
    }
    setStatus('sending')

    if (!isSupabaseConfigured()) {
      showSuccess('Demo mode: magic link simulated. Configure Supabase email for live delivery.')
      return
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    finish(error?.message ?? 'Magic link sent. Check your inbox.', Boolean(error))
  }

  async function sendPasswordReset() {
    if (!isValidEmail(email)) {
      showError('Enter the email on your Atelier account.')
      return
    }
    setStatus('sending')

    if (!isSupabaseConfigured()) {
      showSuccess('Demo mode: password reset email simulated.')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    })
    finish(error?.message ?? 'Reset link sent. Check your inbox.', Boolean(error))
  }

  async function sendPhoneOtp() {
    if (!isValidPhone(phone)) {
      showError('Enter a phone number with country code, for example +233...')
      return
    }
    setStatus('sending')

    if (!isSupabaseConfigured()) {
      showSuccess('Demo mode: phone code simulated. Enter any 6 digits to continue.')
      return
    }

    const { error } = await supabase.auth.signInWithOtp({ phone })
    finish(error?.message ?? 'Phone code sent.', Boolean(error))
  }

  async function verifyPhoneOtp() {
    if (!isValidPhone(phone) || otp.length < 6) {
      showError('Enter your phone number and 6-digit code.')
      return
    }
    setStatus('sending')

    if (!isSupabaseConfigured()) {
      showSuccess('Demo mode: phone sign-in verified.')
      return
    }

    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' })
    finish(error?.message ?? 'Phone verified. Redirecting to your feed.', Boolean(error))
  }

  async function signInWithGoogle() {
    setStatus('sending')

    if (!isSupabaseConfigured()) {
      showSuccess('Demo mode: Google OAuth simulated. Add Google credentials in Supabase for production.')
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    finish(error?.message ?? 'Redirecting to Google...', Boolean(error))
  }

  function finish(nextMessage: string, failed: boolean) {
    setStatus(failed ? 'error' : 'sent')
    setMessage(nextMessage)
  }

  function showError(nextMessage: string) {
    setStatus('error')
    setMessage(nextMessage)
  }

  function showSuccess(nextMessage: string) {
    setStatus('sent')
    setMessage(nextMessage)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-atelier-black text-atelier-white">
      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85"
            alt="Editorial fashion studio"
            className="h-full w-full object-cover opacity-42"
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,#050806_0%,rgba(5,8,6,0.94)_37%,rgba(6,58,143,0.58)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,184,107,0.18),transparent_42%,rgba(18,103,255,0.18))]" />
        </div>

        <div className="relative mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-center lg:py-10">
          <HeroPanel />

          <motion.section
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 170, damping: 22 }}
            className="mx-auto w-full max-w-[470px] rounded-[1.75rem] border border-white/14 bg-white/[0.96] p-4 text-ink shadow-[0_32px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-6 dark:bg-atelier-black/88 dark:text-atelier-white"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <Link to="/" className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-atelier-black font-display text-xl font-black text-atelier-green dark:bg-atelier-green dark:text-atelier-black">
                  A
                </span>
                <span>
                  <span className="block font-display text-2xl font-black">Atelier</span>
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] text-ink-muted dark:text-white/55">by Dripup</span>
                </span>
              </Link>
              <Link to="/" className="rounded-full border border-atelier-mist px-3 py-2 text-xs font-bold text-ink-muted transition hover:border-atelier-blue hover:text-atelier-blue dark:border-white/10 dark:text-white/65">
                Explore
              </Link>
            </div>

            <AuthTabs mode={mode} onChange={switchMode} />

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="mt-5 space-y-4"
                onSubmit={(event) => void submitAuth(event)}
              >
                {mode === 'signup' ? (
                  <InputField
                    icon={UserRound}
                    label="Full name or studio name"
                    value={fullName}
                    onChange={setFullName}
                    autoComplete="name"
                    placeholder="Nadia Boateng"
                  />
                ) : null}

                {mode === 'phone' ? (
                  <>
                    <InputField
                      icon={Phone}
                      label="Phone number"
                      value={phone}
                      onChange={setPhone}
                      autoComplete="tel"
                      type="tel"
                      placeholder="+233..."
                    />
                    <InputField
                      icon={ShieldCheck}
                      label="Verification code"
                      value={otp}
                      onChange={setOtp}
                      autoComplete="one-time-code"
                      type="text"
                      placeholder="000000"
                    />
                  </>
                ) : (
                  <InputField
                    icon={Mail}
                    label="Email address"
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                    type="email"
                    placeholder="you@atelier.app"
                  />
                )}

                {mode === 'signup' ? (
                  <InputField
                    icon={Phone}
                    label="Phone number"
                    value={phone}
                    onChange={setPhone}
                    autoComplete="tel"
                    type="tel"
                    placeholder="+233..."
                  />
                ) : null}

                {mode === 'signin' || mode === 'signup' ? (
                  <InputField
                    icon={Lock}
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    rightAction={
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition hover:bg-atelier-mist dark:text-white/60 dark:hover:bg-white/10"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    }
                  />
                ) : null}

                {mode === 'signup' ? (
                  <>
                    <InputField
                      icon={Lock}
                      label="Confirm password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      autoComplete="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repeat password"
                    />
                    <PasswordStrength checks={passwordChecks} score={passwordScore} label={passwordStrengthLabel} />
                    <RolePicker value={role} onChange={setRole} />
                    <label className="flex items-start gap-3 rounded-2xl border border-atelier-mist bg-atelier-mist/35 p-3 text-sm font-semibold dark:border-white/10 dark:bg-white/8">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(event) => setAcceptedTerms(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-atelier-green"
                      />
                      <span className="text-ink-muted dark:text-white/65">
                        I agree to Atelier terms, marketplace safety, and payment policies.
                      </span>
                    </label>
                  </>
                ) : null}

                {mode === 'signin' ? (
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold">
                    <label className="flex items-center gap-2 text-ink-muted dark:text-white/60">
                      <input type="checkbox" className="h-4 w-4 accent-atelier-green" />
                      Keep me signed in
                    </label>
                    <button type="button" className="text-atelier-blue" onClick={() => switchMode('forgot')}>
                      Forgot password?
                    </button>
                  </div>
                ) : null}

                <Button className="w-full bg-atelier-blue text-white hover:bg-atelier-indigo dark:bg-atelier-green dark:text-atelier-black" size="lg" disabled={status === 'sending'}>
                  {status === 'sending' ? <RefreshCw className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                  {getSubmitLabel(mode, otp)}
                </Button>
              </motion.form>
            </AnimatePresence>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-atelier-mist dark:bg-white/10" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted dark:text-white/45">or</span>
              <span className="h-px flex-1 bg-atelier-mist dark:bg-white/10" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="secondary" className="w-full" onClick={() => void signInWithGoogle()} disabled={status === 'sending'}>
                <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-white font-black text-atelier-blue ring-1 ring-atelier-mist">G</span>
                Google
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => void sendMagicLink()} disabled={status === 'sending' || mode === 'phone'}>
                <Sparkles size={17} />
                Magic link
              </Button>
            </div>

            <StatusMessage status={status} message={message} />

            <p className="mt-5 text-center text-sm font-semibold text-ink-muted dark:text-white/60">
              {mode === 'signup' ? 'Already have an account?' : 'New to Atelier?'}{' '}
              <button type="button" className="text-atelier-blue dark:text-atelier-green" onClick={() => switchMode(mode === 'signup' ? 'signin' : 'signup')}>
                {mode === 'signup' ? 'Sign in' : 'Create account'}
              </button>
            </p>
          </motion.section>
        </div>
      </section>
    </main>
  )
}

function HeroPanel() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 24 }}
      className="flex min-h-[42vh] flex-col justify-between py-4 lg:min-h-[82vh]"
    >
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur">
          <Wand2 size={17} className="text-atelier-green" />
          Social fashion, AI studio, commerce, live culture
        </div>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-black leading-[0.95] text-white md:text-7xl">
          Your next fashion world starts at the door.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 md:text-lg">
          Meet makers, build moodboards, commission looks, sell craft, go live, bid by fit, and carry every garment with a digital passport.
        </p>
      </div>

      <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
        {heroMetrics.map(([value, label], index) => (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + index * 0.08 }}
            className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur"
          >
            <p className="font-display text-2xl font-black text-atelier-green">{value}</p>
            <p className="mt-1 text-sm font-semibold text-white/68">{label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

function AuthTabs({ mode, onChange }: { mode: AuthMode; onChange: (mode: AuthMode) => void }) {
  const tabs: { label: string; value: AuthMode }[] = [
    { label: 'Sign in', value: 'signin' },
    { label: 'Sign up', value: 'signup' },
    { label: 'Phone', value: 'phone' },
    { label: 'Reset', value: 'forgot' },
  ]

  return (
    <div className="grid grid-cols-4 gap-1 rounded-2xl border border-atelier-mist bg-atelier-mist/45 p-1 dark:border-white/10 dark:bg-white/8">
      {tabs.map((tab) => {
        const active = tab.value === mode
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative min-h-11 rounded-xl text-xs font-black text-ink-muted transition sm:text-sm dark:text-white/55',
              active && 'text-atelier-black dark:text-white',
            )}
          >
            {active ? (
              <motion.span
                layoutId="auth-active-tab"
                className="absolute inset-0 rounded-xl bg-white shadow-soft dark:bg-white/12"
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />
            ) : null}
            <span className="relative">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function InputField({ icon: Icon, label, value, onChange, autoComplete, type = 'text', placeholder, rightAction }: InputFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-ink dark:text-white">{label}</span>
      <span className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-atelier-mist bg-white px-4 transition focus-within:border-atelier-blue focus-within:ring-4 focus-within:ring-atelier-blue/10 dark:border-white/10 dark:bg-white/8 dark:focus-within:border-atelier-green">
        <Icon size={18} className="shrink-0 text-atelier-blue dark:text-atelier-green" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="min-h-[52px] min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-ink-muted/65 dark:placeholder:text-white/35"
        />
        {rightAction}
      </span>
    </label>
  )
}

function PasswordStrength({ checks, score, label }: { checks: { label: string; passed: boolean }[]; score: number; label: string }) {
  return (
    <div className="rounded-2xl border border-atelier-mist bg-atelier-mist/35 p-3 dark:border-white/10 dark:bg-white/8">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-black">Password strength</p>
        <p className="text-xs font-black text-atelier-blue dark:text-atelier-green">{label}</p>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {checks.map((check, index) => (
          <motion.span
            key={check.label}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: index < score ? 1 : 0.6, opacity: index < score ? 1 : 0.34 }}
            className={cn('h-2 origin-left rounded-full', index < score ? 'bg-atelier-green' : 'bg-atelier-mist dark:bg-white/20')}
          />
        ))}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {checks.map((check) => (
          <span key={check.label} className={cn('flex items-center gap-2 text-xs font-bold', check.passed ? 'text-atelier-fern dark:text-atelier-green' : 'text-ink-muted dark:text-white/45')}>
            <Check size={13} />
            {check.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function RolePicker({ value, onChange }: { value: VendorRole; onChange: (role: VendorRole) => void }) {
  return (
    <div>
      <p className="mb-2 text-sm font-black">Account type</p>
      <div className="flex flex-wrap gap-2">
        {roleOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full border px-3 py-2 text-xs font-black transition',
              value === option.value
                ? 'border-atelier-blue bg-atelier-blue text-white dark:border-atelier-green dark:bg-atelier-green dark:text-atelier-black'
                : 'border-atelier-mist bg-white text-ink-muted hover:border-atelier-blue dark:border-white/10 dark:bg-white/8 dark:text-white/60',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function StatusMessage({ status, message }: { status: AuthStatus; message: string }) {
  return (
    <motion.div
      key={`${status}-${message}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'mt-4 rounded-2xl border p-3 text-sm font-semibold',
        status === 'error' && 'border-red-200 bg-red-50 text-red-800 dark:border-red-400/25 dark:bg-red-400/10 dark:text-red-100',
        status === 'sent' && 'border-atelier-green/25 bg-atelier-green/10 text-atelier-fern dark:text-atelier-green',
        (status === 'idle' || status === 'sending') && 'border-atelier-mist bg-atelier-mist/35 text-ink-muted dark:border-white/10 dark:bg-white/8 dark:text-white/60',
      )}
    >
      {message}
    </motion.div>
  )
}

function getSubmitLabel(mode: AuthMode, otp: string) {
  if (mode === 'signup') {
    return 'Create account'
  }
  if (mode === 'forgot') {
    return 'Send reset link'
  }
  if (mode === 'phone') {
    return otp ? 'Verify code' : 'Send phone code'
  }
  return 'Sign in'
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value: string) {
  return /^\+[1-9]\d{7,14}$/.test(value.replace(/\s/g, ''))
}
