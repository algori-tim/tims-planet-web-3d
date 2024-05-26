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
import GetInTouch from './ModalContent/GetInTouch'
import FastTravel from './ModalContent/FastTravel'
import useAudioStore from '../../Stores/audioStore'

export default function ContextModal() {
  const { handleShimmerDownSound } = useAudioStore()
  const overlayType = useStore((store) => store.overlayType)
  const setOverlayType = useStore((store) => store.setOverlayType)
  console.log(overlayType)

  useEffect(() => {
    const overlay = document.getElementById('overlay') as HTMLElement
    if (overlayType === 'hidden') {
      overlay.style.display = 'none'
    } else {
      overlay.style.display = 'flex'
    }
  }, [overlayType])

  const handleClose = (e) => {
    handleShimmerDownSound()
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
        {overlayType === 'get_in_touch' && <GetInTouch />}
        {overlayType === 'fast_travel' && <FastTravel />}
        <div className='modal-footer'>
          <button onClick={handleClose}>
            <img className='modal-close' src='/icons/circle_check.svg' alt='' />
          </button>
        </div>
      </main>
    </div>
  )
}
