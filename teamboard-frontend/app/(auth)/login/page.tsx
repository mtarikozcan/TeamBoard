'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/lib/api'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>()

  async function onSubmit(data: LoginForm) {
    setServerError(null)
    try {
      const res = await authApi.login(data)
      const { token, user } = res.data

      localStorage.setItem('teamboard_token', token)
      localStorage.setItem('teamboard_user_id', user.id)
      localStorage.setItem('teamboard_name', user.name)
      localStorage.setItem('teamboard_email', user.email)

      router.push('/dashboard')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        ?? 'Giriş yapılamadı. Lütfen tekrar deneyin.'
      setServerError(message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-base">
      <div className="bg-surface border border-border rounded-lg p-8 w-full max-w-sm">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-tx-primary">TeamBoard</h1>
          <p className="text-sm text-tx-secondary mt-1">Hesabına giriş yap</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="E-posta"
            type="email"
            placeholder="ornek@email.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'E-posta zorunludur.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Geçerli bir e-posta adresi giriniz.',
              },
            })}
          />

          <Input
            label="Şifre"
            type="password"
            placeholder="••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Şifre zorunludur.',
              minLength: { value: 6, message: 'Şifre en az 6 karakter olmalıdır.' },
            })}
          />

          {serverError && (
            <div className="bg-red-900/20 border border-red-800 rounded px-3 py-2 text-sm text-red-400">
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full justify-center"
          >
            {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>

        <p className="text-sm text-tx-secondary mt-5 text-center">
          Hesabın yok mu?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  )
}
