import Image from 'next/image'

interface LogoProps {
  size?: number
}

/**
 * MSK Logo – verwendet /public/logo.png
 * Wird via next/image optimiert (automatische WebP/AVIF-Konvertierung & Resizing).
 */
export function Logo({ size = 32 }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="MSK Logo"
      width={size}
      height={size}
      priority
      className="rounded-lg"
    />
  )
}
