'use client'

import { useState } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')

    // Replace with your preferred form submission (Formspree, Resend, etc.)
    try {
      await new Promise((res) => setTimeout(res, 1200))
      setState('success')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="py-16 text-center">
        <div className="w-12 h-12 rounded-full border border-accent-orange/40 flex items-center justify-center mx-auto mb-6">
          <svg className="w-5 h-5 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-medium text-text-primary mb-2">Message Sent</h3>
        <p className="text-text-secondary text-sm">I'll be in touch within 24 hours.</p>
      </div>
    )
  }

  const inputClass =
    'w-full bg-bg-secondary border border-glass rounded-sm px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-orange/40 transition-colors duration-200'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-widest text-text-secondary mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-widest text-text-secondary mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="projectType" className="block text-xs uppercase tracking-widest text-text-secondary mb-2">
          Project Type
        </label>
        <select
          id="projectType"
          name="projectType"
          value={form.projectType}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select a project type</option>
          <option value="commercial">Commercial</option>
          <option value="documentary">Documentary</option>
          <option value="music-video">Music Video</option>
          <option value="brand-film">Brand Film</option>
          <option value="short-film">Short Film</option>
          <option value="wedding">Wedding</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs uppercase tracking-widest text-text-secondary mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about your project..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {state === 'error' && (
        <p className="text-xs text-red-400">Something went wrong. Please try again or email directly.</p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="w-full py-3.5 bg-accent-orange text-bg font-medium text-sm rounded-full hover:bg-accent-gold transition-all duration-300 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed glow-orange"
      >
        {state === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
