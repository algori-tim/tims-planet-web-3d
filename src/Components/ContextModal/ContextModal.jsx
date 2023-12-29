import React, { useEffect } from 'react'
import useStore from '../../Stores/store'
import './contextModal.css'
import TimsPlanetSign from './ModalContent/TimsPlanetSign'
import ProfessionalObservatory from './ModalContent/ProfessionalObservatory'
import FascinationFactory from './ModalContent/FascinationFactory'
import WellOfKnowledge from './ModalContent/WellOfKnowledge'
import HelpPage from './ModalContent/HelpPage'

export default function ContextModal() {
  const overlayType = useStore((store) => store.overlayType)
  const setOverlayType = useStore((store) => store.setOverlayType)
  console.log(overlayType)

  useEffect(() => {
    if (overlayType === 'hidden') {
      document.getElementById('overlay').style.display = 'none'
    } else {
      document.getElementById('overlay').style.display = 'flex'
    }
  }, [overlayType])

  const handleClose = (e) => {
    e.preventDefault()
    setOverlayType('hidden')
  }

  return (
    <div id='overlay'>
      <main>
        {overlayType === 'sign' && <TimsPlanetSign />}
        {overlayType === 'observatory' && <ProfessionalObservatory />}
        {overlayType === 'factory' && <FascinationFactory />}
        {overlayType === 'well' && <WellOfKnowledge />}
        {overlayType === 'help' && <HelpPage />}
      </main>
      <button onClick={handleClose}>
        <img className='modal-close' src='/icons/close_circle.svg' alt='' />
      </button>
    </div>
  )
}
