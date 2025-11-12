declare module 'framer-motion' {
  import * as React from 'react'
  
  export interface AnimatePresenceProps {
    children?: React.ReactNode
    mode?: 'sync' | 'wait' | 'popLayout'
    initial?: boolean
    custom?: any
    onExitComplete?: () => void
    exitBeforeEnter?: boolean
    presenceAffectsLayout?: boolean
  }
  
  export const AnimatePresence: React.FC<AnimatePresenceProps>
  export const motion: any
  export * from 'framer-motion/dist/index'
}
