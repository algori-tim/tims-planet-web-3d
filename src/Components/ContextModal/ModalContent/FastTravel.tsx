import React from 'react'
import './modalContent.css'
import useStore from '../../../Stores/store'
import { Vector3 } from 'yuka'

export default function FastTravel() {
  const { fastTravel, setOverlayType } = useStore()
  const handleFastTravel = (destination) => {
    const hud = document.getElementById('hud') as HTMLElement
    hud.classList.add('vr-overlay')
    fastTravel(destination)
    setOverlayType('hidden')
  }
  const imageHeight = '200px'
  return (
    <div className='modal-content'>
      <h2 className='modal-header'>Fast Travel: Navigate Tim's Planet with Ease</h2>
      <div className='modal-body'>
        <p>
          Ready to jump to a specific spot on Tim's Planet? Whether you're looking to revisit a favorite location or
          explore something new, our Fast Travel feature makes it a breeze. Choose your destination kick it into high
          gear!
        </p>

        <div className='fast-travel-list'>
          <button
            onClick={() => handleFastTravel(new Vector3(23.42, 1.67, -12.4))}
            className='fast-travel-link tooltip'
          >
            <img src='/images/observatory.png' height={imageHeight} />
            <span className='tooltiptext'>Professional Obsevatory</span>
          </button>
          <button onClick={() => handleFastTravel(new Vector3(21.9, 9.0, 9.8))} className='fastt-tavel-link tooltip'>
            <img src='/images/guitar.png' height={imageHeight} />
            <span className='tooltiptext'>My life in Music</span>
          </button>
          <button
            onClick={() => handleFastTravel(new Vector3(-3.03, -5.34, 24.84))}
            className='fastt-tavel-link tooltip'
          >
            <img src='/images/well.png' height={imageHeight} />
            <span className='tooltiptext'>The Well of Knowledge</span>
          </button>
          <button
            onClick={() => handleFastTravel(new Vector3(8.16, -20.74, 11.87))}
            className='fastt-tavel-link tooltip'
          >
            <img src='/images/camper.png' height={imageHeight} />
            <span className='tooltiptext'>The Camper</span>
          </button>
          <button
            onClick={() => handleFastTravel(new Vector3(-9.03, -8.39, -23.33))}
            className='fastt-tavel-link tooltip'
          >
            <img src='/images/factory.png' height={imageHeight} />
            <span className='tooltiptext'>Fascination Factory</span>
          </button>
          <button onClick={() => handleFastTravel(new Vector3(0, 26.1, 0))} className='fastt-tavel-link tooltip'>
            <img src='/images/welcome_sign.png' height={imageHeight} />
            <span className='tooltiptext'>Welcome Sign</span>
          </button>
        </div>
      </div>
    </div>
  )
}
