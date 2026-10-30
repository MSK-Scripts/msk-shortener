'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import { Trash } from '@/components/icons'
import { Button } from '@/components/ui/Button'

import { DeleteForm } from './DeleteForm'

/**
 * A text button that opens a native modal <dialog> to delete a link with its
 * token. The browser handles focus, the backdrop and Escape; the form is
 * mounted only while the dialog is open, so it starts empty each time.
 */
export function DeleteLinkButton() {
  const t = useTranslations('home')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  function show() {
    setOpen(true)
    dialogRef.current?.showModal()
  }

  function close() {
    dialogRef.current?.close()
  }

  return (
    <>
      <Button type="button" variant="link" onClick={show} className="min-h-11 text-muted-foreground hover:text-danger">
        <Trash className="h-5 w-5" />
        {t('deleteLink')}
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="delete-dialog-title"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // A click on the backdrop lands on the dialog element itself.
          if (e.target === e.currentTarget) close()
        }}
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border border-border bg-card p-6 text-foreground shadow-[var(--shadow-card-hover)] backdrop:bg-black/60"
      >
        {open && <DeleteForm onClose={close} />}
      </dialog>
    </>
  )
}
