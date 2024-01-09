import React, { useEffect, useRef, useState } from 'react'
import './hud.css'
import useStore from '../../Stores/store'

export default function Hud() {
  const setCursor = useStore((store) => store.setCursor)
  const setOverlayType = useStore((store) => store.setOverlayType)
  const [soundOn, setSoundOn] = useState(true)
  const [musicOn, setMusicOn] = useState(false)
  const musicRef = useRef()
  const buttonFxRef = useRef()

  useEffect(() => {
    if (musicRef.current && musicOn) {
      musicRef.current.play()
      musicRef.current.volume = 0.35
    } else {
      musicRef.current.pause()
    }
  }, [musicOn])

  const handleButtonSound = () => {
    if (soundOn && buttonFxRef.current) {
      buttonFxRef.current.pause()
      buttonFxRef.current.currentTime = 0
      buttonFxRef.current.volume = 0.65
      buttonFxRef.current.play()
    }
  }
  const handleWalkLookClick = (cursor) => {
    handleButtonSound()
    document.getElementById('root').setAttribute('data-cursor', cursor)
    setCursor(cursor)
  }

  const handleQuestion = () => {
    handleButtonSound()
    setOverlayType('help')
  }

  const handleMusicToggle = () => {
    setMusicOn((current) => !current)
  }

  const handleSoundToggle = () => {
    setSoundOn((current) => !current)
  }

  return (
    <>
      <audio ref={buttonFxRef} src='/audio/sound_fx/button.mp3' autoPlay={false}></audio>
      <audio ref={musicRef} src='/audio/music/chillout.mp3' autoPlay={false} loop></audio>
      <div className='hud-messages-container hud'>
        <p className='hud-messages' id='hud-messages'></p>
      </div>
      <div className='toggles-container hud'>
        <div className='toggles'>
          <button onClick={() => handleWalkLookClick('look')} className='circle'>
            <img className='icon' src='/icons/look.svg' alt='look'></img>
          </button>
          <button onClick={() => handleWalkLookClick('walk')} className='circle'>
            <img className='icon' src='/icons/walk.svg' alt='walk'></img>
          </button>
          <button onClick={handleMusicToggle} className='circle'>
            <img className='icon' src={musicOn ? '/icons/music_off.svg' : '/icons/music_on.svg'} alt='talk'></img>
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
