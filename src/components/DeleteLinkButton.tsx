'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { DeleteForm } from './DeleteForm'

/**
 * Kleiner Button + Modal zum Löschen eines Links per Token.
 */
export function DeleteLinkButton() {
  const t = useTranslations('home')
  const [isOpen, setIsOpen] = useState(false)

  // ESC zum Schließen
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  // Body-Scroll sperren bei offenem Modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-xs text-msk-muted hover:text-msk-danger transition-colors inline-flex items-center gap-1.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
        </svg>
        {t('deleteLink')}
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Dialog */}
          <div
            className="relative w-full max-w-md bg-msk-surface border border-msk-border rounded-2xl p-6 shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <DeleteForm onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
