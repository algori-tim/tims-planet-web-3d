import React, { useEffect } from 'react'
import useStore from '../../Stores/store'
import './contextModal.css'
import TimsPlanetSign from './ModalContent/TimsPlanetSign'
import ProfessionalObservatory from './ModalContent/ProfessionalObservatory'
import FascinationFactory from './ModalContent/FascinationFactory'
import WellOfKnowledge from './ModalContent/WellOfKnowledge'
import HelpPage from './ModalContent/HelpPage'
import Camper from './ModalContent/Camper'
import Guitar from './ModalContent/Guitar'

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
        {overlayType === 'planet_sign' && <TimsPlanetSign />}
        {overlayType === 'planet_observatory' && <ProfessionalObservatory />}
        {overlayType === 'planet_factory' && <FascinationFactory />}
        {overlayType === 'planet_well' && <WellOfKnowledge />}
        {overlayType === 'planet_guitar' && <Guitar />}
        {overlayType === 'planet_camper' && <Camper />}
        {overlayType === 'help' && <HelpPage />}
        <div className='modal-footer'>
          <button onClick={handleClose}>
            <img className='modal-close' src='/icons/circle_check.svg' alt='' />
          </button>
        </div>
      </main>
    </div>
  )
}
