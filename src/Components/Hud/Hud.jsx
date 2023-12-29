import React, { useState } from 'react'
import './hud.css'
import useStore from '../../Stores/store'

export default function Hud() {
  const setCursor = useStore((store) => store.setCursor)
  const setOverlayType = useStore((store) => store.setOverlayType)
  const [soundOn, setSoundOn] = useState(false)

  const handleClick = (cursor) => {
    document.getElementById('root').setAttribute('data-cursor', cursor)
    setCursor(cursor)
  }

  const handleQuestion = () => {
    setOverlayType('help')
  }

  const handleSoundToggle = () => {
    setSoundOn((current) => !current)
  }

  return (
    <>
      <div className='hud-messages-container'>
        <p className='hud-messages' id='hud-messages'></p>
      </div>
      <div className='toggles-container'>
        <div className='toggles'>
          <button onClick={() => handleClick('look')} className='circle'>
            <img className='icon' src='/icons/look.svg' alt='look'></img>
          </button>
          <button onClick={() => handleClick('walk')} className='circle'>
            <img className='icon' src='/icons/walk.svg' alt='walk'></img>
          </button>
          <button onClick={handleSoundToggle} className='circle'>
            <img className='icon' src={soundOn ? '/icons/sound_off.svg' : '/icons/sound_on.svg'} alt='talk'></img>
          </button>
          <button onClick={handleQuestion} className='circle'>
            <img className='icon' src='/icons/question_mark.svg' alt='grab'></img>
          </button>
        </div>
      </div>
    </>
  )
}
