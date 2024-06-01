import { useState, useEffect } from 'react'
import useUIStore from '../Stores/uiStore'

const useIsMobile = () => {
  const [isMobile, setisMobile] = useState(false)
  const { setOverlayType } = useUIStore()

  useEffect(() => {
    const checkIfMobile = () => {
      const isScreenToSmall = window.matchMedia('(max-width: 800px)').matches
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isScreenToSmall || isMobileDevice) {
        setOverlayType('mobile')
      } else {
        setOverlayType('hidden')
      }

      setisMobile(() => isScreenToSmall)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  return isMobile
}

export default useIsMobile
