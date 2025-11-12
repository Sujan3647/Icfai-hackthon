import 'framer-motion'

declare module 'framer-motion' {
  export interface HTMLMotionProps<T> {
    className?: string
    onClick?: (e: React.MouseEvent) => void
    style?: React.CSSProperties
  }
}
