import { useEffect, useState } from 'react'

/**
 * BrandLogo — renders the correct logo variant based on the current theme.
 * - Light mode: logo-dark.svg  (black paths on transparent)
 * - Dark mode:  logo-white.svg (white paths on transparent)
 *
 * Props:
 *   onDark   – when true, always shows the white variant (e.g. on gradient hero)
 *   iconOnly – when true, shows only the shield icon (35×36) instead of full logo
 *   className – forwarded to the <img>
 */
type BrandLogoProps = {
  onDark?: boolean
  iconOnly?: boolean
  className?: string
  alt?: string
}

export default function BrandLogo({
  onDark = false,
  iconOnly = false,
  className = 'h-8 w-auto',
  alt = 'HealthShield',
}: BrandLogoProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const variant = onDark || isDark ? 'white' : 'dark'
  const type = iconOnly ? 'icon' : 'logo'
  const src = `/logos/${type}-${variant}.svg`

  return <img src={src} alt={alt} className={className} />
}
