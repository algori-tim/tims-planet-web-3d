import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface UIState {
  overlayType: string
  cursorType: string | null
  setCursor(cursor: string): void
  setOverlayType(overlay: string): void
}

const useUIStore = create<UIState>()(
  subscribeWithSelector((set) => ({
    overlayType: 'help',
    cursorType: document.getElementById('root')?.getAttribute('data-cursor') || null,
    setCursor(cursor: string) {
      set({ cursorType: cursor })
    },
    setOverlayType(overlay: string) {
      set({ overlayType: overlay })
    },
  }))
)

export default useUIStore
