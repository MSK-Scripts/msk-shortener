'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface NavLink {
  label: string
  href: string
  external?: boolean
}

interface MobileNavProps {
  links: NavLink[]
  /** Übersetztes Label für den Hamburger-Button (a11y) */
  menuLabel: string
}

/**
 * Hamburger-Menü für die Navi-Links – nur sichtbar unterhalb des `md`-Breakpoints.
 * Die Desktop-Navi im Header ist parallel dazu `hidden md:flex`.
 */
export function MobileNav({ links, menuLabel }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Außerhalb klicken → schließen (analog LanguageSwitcher)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', onClick)
      return () => document.removeEventListener('mousedown', onClick)
    }
  }, [isOpen])

  return (
    <div ref={wrapRef} className="relative md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-md text-msk-muted hover:text-msk-text hover:bg-msk-surface transition-colors"
        aria-label={menuLabel}
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <nav className="absolute right-0 mt-2 w-48 bg-msk-surface border border-msk-border rounded-lg shadow-xl overflow-hidden animate-fade-in z-50">
          <ul>
            {links.map((link) =>
              link.external ? (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-sm text-msk-text hover:bg-msk-surface2 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-sm text-msk-text hover:bg-msk-surface2 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      )}
    </div>
  )
}
