import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'midnight' | 'outline' | 'outline-light' | 'light'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-clay text-paper hover:bg-clay-deep',
  midnight: 'bg-midnight text-ivory hover:bg-midnight-deep',
  outline: 'bg-transparent text-ink ring-1 ring-ink/30 hover:bg-ink/5',
  'outline-light': 'bg-transparent text-ivory ring-1 ring-ivory/50 hover:bg-ivory/10',
  light: 'bg-ivory text-midnight hover:bg-paper',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-[12px]',
  md: 'h-12 px-7 text-[13px]',
  lg: 'h-14 px-8 text-[13px]',
}

const baseClass =
  'inline-flex items-center justify-center gap-2.5 rounded-full font-medium uppercase tracking-[0.16em] transition-[background-color,color,transform,box-shadow] duration-300 ease-out active:translate-y-px motion-reduce:transition-none'

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type LinkProps = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }
type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type NativeProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>

/**
 * Bouton unique : lien interne (`to`), lien externe (`href`) ou bouton natif.
 */
export function Button(props: LinkProps | AnchorProps | NativeProps) {
  const { variant = 'primary', size = 'md', className = '', children } = props
  const classes = `${baseClass} ${variants[variant]} ${sizes[size]} ${className}`

  if ('to' in props) {
    const { variant: _v, size: _s, className: _c, children: _ch, to, ...rest } = props
    void _v; void _s; void _c; void _ch
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  if ('href' in props && props.href) {
    const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props
    void _v; void _s; void _c; void _ch
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    )
  }
  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as NativeProps
  void _v; void _s; void _c; void _ch
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
