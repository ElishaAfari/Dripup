import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { markPreviewAuthenticated } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

type AuthMode = 'signin' | 'signup' | 'forgot'
type AuthMethod = 'email' | 'phone'
type AuthStatus = 'idle' | 'sending' | 'sent' | 'error'
type VendorRole = 'customer' | 'artisan' | 'designer' | 'mua' | 'seller'

type TextFieldProps = {
  icon: LucideIcon
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  type?: string
  action?: ReactNode
}

const roleOptions: { value: VendorRole; label: string }[] = [
  { value: 'customer', label: 'Customer' },
  { value: 'artisan', label: 'Maker' },
  { value: 'designer', label: 'Designer' },
  { value: 'mua', label: 'MUA' },
  { value: 'seller', label: 'Seller' },
]

const proofPoints = [
  'Commission custom looks with protected milestones',
  'Discover makers through social video, live rooms, and style search',
  'Build AI drafts, moodboards, wardrobes, auctions, and garment passports',
] as const

function initialMode(pathname: string): AuthMode {
  if (pathname.includes('signup')) {
    return 'signup'
  }
  if (pathname.includes('forgot')) {
    return 'forgot'
  }
  return 'signin'
}

function initialMethod(pathname: string): AuthMethod {
  return pathname.includes('phone') ? 'phone' : 'email'
}

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<AuthMode>(initialMode(location.pathname))
  const [method, setMethod] = useState<AuthMethod>(initialMethod(location.pathname))
  const [status, setStatus] = useState<AuthStatus>('idle')
  const [message, setMessage] = useState('Secure access for clients, makers, sellers, stylists, and fashion teams.')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<VendorRole>('customer')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const passwordChecks = useMemo(
    () => [
      { label: '8 characters', passed: password.length >= 8 },
      { label: 'Uppercase', passed: /[A-Z]/.test(password) },
      { label: 'Lowercase', passed: /[a-z]/.test(password) },
      { label: 'Number', passed: /\d/.test(password) },
      { label: 'Symbol', passed: /[^A-Za-z0-9]/.test(password) },
    ],
    [password],
  )
  const passwordScore = passwordChecks.filter((item) => item.passed).length
  const strongPassword = passwordScore >= 4

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setStatus('idle')
    setMessage(nextMode === 'forgot' ? 'Recover access with the email attached to your account.' : 'Secure access for clients, makers, sellers, stylists, and fashion teams.')
  }

  function changeMethod(nextMethod: AuthMethod) {
    setMethod(nextMethod)
    setStatus('idle')
    setMessage(nextMethod === 'phone' ? 'Use phone verification for fast mobile-first access.' : 'Use email and password for secure account access.')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (mode === 'forgot') {
      await resetPassword()
      return
    }

    if (method === 'phone') {
      if (otp.trim()) {
        await verifyPhone()
      } else {
        await sendPhoneCode()
      }
      return
    }

    if (mode === 'signin') {
      await signInWithEmail()
    } else {
      await signUpWithEmail()
    }
  }

  async function signInWithEmail() {
    if (!isValidEmail(email) || !password) {
      fail('Enter your email and password.')
      return
    }

    setStatus('sending')
    if (!isSupabaseConfigured()) {
      succeedAndEnter('Local preview sign-in completed.')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      fail(error.message)
      return
    }
    succeedAndEnter('Welcome back.')
  }

  async function signUpWithEmail() {
    if (!name.trim()) {
      fail('Add your full name or studio name.')
      return
    }
    if (!isValidEmail(email)) {
      fail('Enter a valid email address.')
      return
    }
    if (!strongPassword) {
      fail('Choose a stronger password.')
      return
    }
    if (password !== confirmPassword) {
      fail('The passwords do not match.')
      return
    }
    if (!acceptedTerms) {
      fail('Accept the platform terms to create an account.')
      return
    }

    setStatus('sending')
    if (!isSupabaseConfigured()) {
      succeedAndEnter('Local preview account created.')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        data: {
          display_name: name,
          phone,
          roles: role === 'customer' ? ['customer'] : ['customer', role],
        },
      },
    })

    if (error) {
      fail(error.message)
      return
    }

    if (data.session) {
      succeedAndEnter('Account created.')
    } else {
      setStatus('sent')
      setMessage('Account created. Confirm your email to enter Atelier.')
    }
  }

  async function sendPhoneCode() {
    if (!isValidPhone(phone)) {
      fail('Enter a phone number with country code.')
      return
    }

    setStatus('sending')
    if (!isSupabaseConfigured()) {
      setStatus('sent')
      setMessage('Local preview code sent. Enter any 6 digits.')
      return
    }

    const { error } = await supabase.auth.signInWithOtp({ phone })
    if (error) {
      fail(error.message)
      return
    }
    setStatus('sent')
    setMessage('Verification code sent.')
  }

  async function verifyPhone() {
    if (!isValidPhone(phone) || otp.trim().length < 6) {
      fail('Enter the phone number and 6-digit code.')
      return
    }

    setStatus('sending')
    if (!isSupabaseConfigured()) {
      succeedAndEnter('Local preview phone verification completed.')
      return
    }

    const { error } = await supabase.auth.verifyOtp({ phone, token: otp.trim(), type: 'sms' })
    if (error) {
      fail(error.message)
      return
    }
    succeedAndEnter('Phone verified.')
  }

  async function resetPassword() {
    if (!isValidEmail(email)) {
      fail('Enter the email on your account.')
      return
    }

    setStatus('sending')
    if (!isSupabaseConfigured()) {
      setStatus('sent')
      setMessage('Local preview reset link sent.')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    })
    if (error) {
      fail(error.message)
      return
    }
    setStatus('sent')
    setMessage('Reset link sent.')
  }

  async function continueWithGoogle() {
    setStatus('sending')
    if (!isSupabaseConfigured()) {
      succeedAndEnter('Local preview Google sign-in completed.')
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app` },
    })
    if (error) {
      fail(error.message)
      return
    }
    setStatus('sent')
    setMessage('Redirecting to Google.')
  }

  function fail(nextMessage: string) {
    setStatus('error')
    setMessage(nextMessage)
  }

  function succeedAndEnter(nextMessage: string) {
    if (!isSupabaseConfigured()) {
      markPreviewAuthenticated()
    }
    setStatus('sent')
    setMessage(nextMessage)
    window.setTimeout(() => navigate('/app'), 420)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-atelier-black text-white">
      <section className="relative min-h-screen">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=88"
          alt="Fashion creators in an editorial studio"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.38]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#050806_0%,rgba(5,8,6,0.98)_36%,rgba(6,58,143,0.72)_68%,rgba(0,138,90,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,184,107,0.28),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(18,103,255,0.28),transparent_30%)]" />

        <div className="relative mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_500px] lg:items-center lg:px-10">
          <BrandStage />

          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 24 }}
            className="order-1 mx-auto w-full max-w-[500px] border border-white/[0.14] bg-white/[0.98] p-4 text-atelier-black shadow-[0_34px_130px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-6 md:p-7 lg:order-2"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <BrandMark dark />
              <div className="rounded-full border border-black/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-atelier-fern">
                Invite-ready
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 bg-atelier-black p-1">
              {(['signin', 'signup'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => changeMode(item)}
                  className={cn('relative min-h-[48px] text-sm font-black transition', mode === item ? 'text-atelier-black' : 'text-white/[0.62]')}
                >
                  {mode === item ? (
                    <motion.span
                      layoutId="auth-mode-pill"
                      className="absolute inset-0 bg-white"
                      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{item === 'signin' ? 'Sign in' : 'Create account'}</span>
                </button>
              ))}
            </div>

            {mode !== 'forgot' ? (
              <div className="mb-5 grid grid-cols-2 gap-2">
                <MethodButton active={method === 'email'} icon={Mail} label="Email" onClick={() => changeMethod('email')} />
                <MethodButton active={method === 'phone'} icon={Phone} label="Phone" onClick={() => changeMethod('phone')} />
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              <motion.form
                key={`${mode}-${method}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
                onSubmit={(event) => void handleSubmit(event)}
              >
                {mode === 'signup' ? (
                  <TextField icon={UserRound} label="Name or studio" value={name} onChange={setName} autoComplete="name" />
                ) : null}

                {method === 'phone' && mode !== 'forgot' ? (
                  <>
                    <TextField icon={Phone} label="Phone number" value={phone} onChange={setPhone} autoComplete="tel" type="tel" />
                    <TextField icon={KeyRound} label="Verification code" value={otp} onChange={setOtp} autoComplete="one-time-code" />
                  </>
                ) : (
                  <TextField icon={Mail} label="Email address" value={email} onChange={setEmail} autoComplete="email" type="email" />
                )}

                {mode === 'signup' && method === 'email' ? (
                  <TextField icon={Phone} label="Phone number" value={phone} onChange={setPhone} autoComplete="tel" type="tel" />
                ) : null}

                {method === 'email' && mode !== 'forgot' ? (
                  <TextField
                    icon={Lock}
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    type={showPassword ? 'text' : 'password'}
                    action={
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((current) => !current)}
                        className="grid h-10 w-10 place-items-center rounded-full text-atelier-black/[0.56] transition hover:bg-black/5"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />
                ) : null}

                {mode === 'signup' && method === 'email' ? (
                  <>
                    <TextField
                      icon={Lock}
                      label="Confirm password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      autoComplete="new-password"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <PasswordMeter checks={passwordChecks} score={passwordScore} />
                    <RoleSelector value={role} onChange={setRole} />
                    <label className="flex items-start gap-3 border border-black/10 bg-[#f4f8ff] p-3 text-sm font-bold text-atelier-black/[0.68]">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(event) => setAcceptedTerms(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-atelier-green"
                      />
                      <span>I accept Atelier account, marketplace, safety, and payment terms.</span>
                    </label>
                  </>
                ) : null}

                {mode === 'signin' && method === 'email' ? (
                  <div className="flex items-center justify-between gap-3 text-sm font-bold">
                    <label className="flex items-center gap-2 text-atelier-black/[0.62]">
                      <input type="checkbox" className="h-4 w-4 accent-atelier-green" />
                      Keep me signed in
                    </label>
                    <button type="button" className="text-atelier-blue" onClick={() => changeMode('forgot')}>
                      Forgot password
                    </button>
                  </div>
                ) : null}

                <Button className="w-full rounded-none bg-atelier-blue text-white shadow-[0_18px_44px_rgba(18,103,255,0.28)] hover:bg-atelier-indigo" size="lg" disabled={status === 'sending'}>
                  {status === 'sending' ? <RefreshCw className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                  {submitLabel(mode, method, otp)}
                </Button>
              </motion.form>
            </AnimatePresence>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-black/10" />
              <span className="text-xs font-black uppercase tracking-[0.18em] text-atelier-black/[0.45]">or</span>
              <span className="h-px flex-1 bg-black/10" />
            </div>

            <button
              type="button"
              onClick={() => void continueWithGoogle()}
              disabled={status === 'sending'}
              className="flex min-h-[52px] w-full items-center justify-center gap-3 border border-black/10 bg-white text-sm font-black text-atelier-black shadow-[0_12px_34px_rgba(5,8,6,0.08)] transition hover:border-atelier-blue/[0.45] hover:text-atelier-blue disabled:opacity-50"
            >
              <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full border border-black/10 bg-white text-base font-black text-atelier-blue">
                G
              </span>
              Continue with Google
            </button>

            <StatusMessage status={status} message={message} />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-atelier-black/[0.62]">
              {mode === 'forgot' ? (
                <button type="button" className="text-atelier-blue" onClick={() => changeMode('signin')}>
                  Back to sign in
                </button>
              ) : (
                <button type="button" className="text-atelier-blue" onClick={() => changeMode(mode === 'signup' ? 'signin' : 'signup')}>
                  {mode === 'signup' ? 'I already have an account' : 'Create a new account'}
                </button>
              )}
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={16} className="text-atelier-green" />
                Protected by Supabase Auth
              </span>
            </div>
          </motion.section>
        </div>
      </section>
    </main>
  )
}

function BrandStage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 24 }}
      className="order-2 flex min-h-[46vh] flex-col justify-between py-4 lg:order-1 lg:min-h-[84vh]"
    >
      <BrandMark />

      <div className="max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 border border-white/[0.14] bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur">
          <Sparkles size={18} className="text-atelier-green" />
          Fashion social network, AI studio, marketplace, and wardrobe OS
        </div>
        <h1 className="max-w-4xl font-display text-5xl font-black leading-[0.92] text-white sm:text-6xl lg:text-7xl">
          Enter the fashion world built for people who make culture wearable.
        </h1>
        <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/[0.72] md:text-lg">
          A serious lifestyle platform for clients, tailors, designers, sellers, stylists, makeup artists, footwear makers, and fashion lovers.
        </p>
      </div>

      <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
        {proofPoints.map((point, index) => (
          <motion.div
            key={point}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + index * 0.08 }}
            className="border border-white/[0.12] bg-white/[0.09] p-4 backdrop-blur"
          >
            <BadgeCheck className="mb-3 text-atelier-green" size={22} />
            <p className="text-sm font-bold leading-6 text-white/[0.76]">{point}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

function BrandMark({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          'grid h-12 w-12 place-items-center bg-atelier-green font-display text-2xl font-black text-atelier-black shadow-[0_18px_42px_rgba(0,184,107,0.28)]',
          dark && 'bg-atelier-black text-atelier-green shadow-none',
        )}
      >
        A
      </span>
      <span>
        <span className={cn('block font-display text-3xl font-black leading-none', dark ? 'text-atelier-black' : 'text-white')}>Atelier</span>
        <span className={cn('block text-xs font-black uppercase tracking-[0.18em]', dark ? 'text-atelier-black/[0.48]' : 'text-white/[0.55]')}>by Dripup</span>
      </span>
    </div>
  )
}

function MethodButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-[52px] items-center justify-center gap-2 border text-sm font-black transition',
        active
          ? 'border-atelier-blue bg-[#eef5ff] text-atelier-blue shadow-[inset_0_0_0_1px_rgba(18,103,255,0.08)]'
          : 'border-black/10 bg-white text-atelier-black/[0.58] hover:border-atelier-green/60 hover:text-atelier-fern',
      )}
    >
      <Icon size={18} />
      {label}
    </button>
  )
}

function TextField({ icon: Icon, label, value, onChange, autoComplete, type = 'text', action }: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-atelier-black">{label}</span>
      <span className="flex min-h-[56px] items-center gap-3 border border-black/10 bg-white px-4 transition focus-within:border-atelier-blue focus-within:ring-4 focus-within:ring-atelier-blue/10">
        <Icon size={18} className="shrink-0 text-atelier-blue" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={type}
          autoComplete={autoComplete}
          className="min-h-[54px] min-w-0 flex-1 bg-transparent text-base font-bold text-atelier-black outline-none"
        />
        {action}
      </span>
    </label>
  )
}

function PasswordMeter({ checks, score }: { checks: { label: string; passed: boolean }[]; score: number }) {
  return (
    <div className="border border-black/10 bg-[#f4f8ff] p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-black text-atelier-black">Password strength</p>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-atelier-blue">{score >= 4 ? 'Strong' : 'Needs work'}</p>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {checks.map((check, index) => (
          <motion.span
            key={check.label}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: index < score ? 1 : 0.45, opacity: index < score ? 1 : 0.28 }}
            className={cn('h-2 origin-left', index < score ? 'bg-atelier-green' : 'bg-black/[0.16]')}
          />
        ))}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {checks.map((check) => (
          <span key={check.label} className={cn('flex items-center gap-2 text-xs font-black', check.passed ? 'text-atelier-fern' : 'text-atelier-black/[0.42]')}>
            <Check size={13} />
            {check.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function RoleSelector({ value, onChange }: { value: VendorRole; onChange: (value: VendorRole) => void }) {
  return (
    <div>
      <p className="mb-2 text-sm font-black text-atelier-black">Account type</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {roleOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'min-h-[42px] border px-2 text-xs font-black transition',
              value === option.value
                ? 'border-atelier-black bg-atelier-black text-white'
                : 'border-black/10 bg-white text-atelier-black/[0.55] hover:border-atelier-green hover:text-atelier-fern',
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
        'mt-4 border p-3 text-sm font-bold',
        status === 'error' && 'border-red-300 bg-red-50 text-red-800',
        status === 'sent' && 'border-atelier-green/[0.35] bg-atelier-green/10 text-atelier-fern',
        (status === 'idle' || status === 'sending') && 'border-black/10 bg-[#f4f8ff] text-atelier-black/[0.62]',
      )}
    >
      {message}
    </motion.div>
  )
}

function submitLabel(mode: AuthMode, method: AuthMethod, otp: string) {
  if (mode === 'forgot') {
    return 'Send recovery link'
  }
  if (method === 'phone') {
    return otp.trim() ? 'Verify and enter' : 'Send verification code'
  }
  return mode === 'signin' ? 'Enter Atelier' : 'Create account'
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value: string) {
  return /^\+[1-9]\d{7,14}$/.test(value.replace(/\s/g, ''))
}
