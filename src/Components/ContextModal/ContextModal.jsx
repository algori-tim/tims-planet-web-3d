import React from 'react'
import useStore from '../../Stores/store'
import './contextModal.css'
import TimsPlanetSign from './ModalContent/TimsPlanetSign'
import ProfessionalObservatory from './ModalContent/ProfessionalObservatory'
import FascinationFactory from './ModalContent/FascinationFactory'
import WellOfKnowledge from './ModalContent/WellOfKnowledge'

export default function ContextModal() {
  const overlayType = useStore((store) => store.overlayType)
  console.log(overlayType)
  const handleClose = (e) => {
    e.preventDefault()
    document.getElementById('overlay').style.display = 'none'
  }

  return (
    <div id='overlay'>
      <main>
        {overlayType === 'sign' && <TimsPlanetSign />}
        {overlayType === 'observatory' && <ProfessionalObservatory />}
        {overlayType === 'factory' && <FascinationFactory />}
        {overlayType === 'well' && <WellOfKnowledge />}
      </main>
      <button onClick={handleClose}>
        <img className='modal-close' src='/icons/close_circle.svg' alt='' />
      </button>
    </div>
  )
}
