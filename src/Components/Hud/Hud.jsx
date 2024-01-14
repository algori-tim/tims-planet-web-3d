import React, { useEffect, useRef, useState } from 'react'
import './hud.css'
import useStore from '../../Stores/store'

export default function Hud() {
  const setCursor = useStore((store) => store.setCursor)
  const setOverlayType = useStore((store) => store.setOverlayType)
  const [soundOn, setSoundOn] = useState(true)
  const [musicOn, setMusicOn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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

  const handleGetInTouch = () => {
    handleButtonSound()
    setOverlayType('get_in_touch')
  }

  const handleFastTravel = () => {
    handleButtonSound()
    setOverlayType('fast_travel')
  }

  const handleMusicToggle = () => {
    handleButtonSound()
    setMusicOn((current) => !current)
  }

  const handleSoundToggle = () => {
    handleButtonSound()
    setSoundOn((current) => !current)
  }

  const handleMenuClick = () => {
    handleButtonSound()
    setMenuOpen((current) => !current)
  }
  //TO DO:
  //add contact and map for fast travel
  //Sync sounds with zustand store
  return (
    <>
      <audio ref={buttonFxRef} src='/audio/sound_fx/button.mp3' autoPlay={false}></audio>
      <audio ref={musicRef} src='/audio/music/chillout.mp3' autoPlay={false} loop></audio>
      <div id='hud' className='menu'>
        <button onClick={() => handleMenuClick()} className='circle '>
          <img
            className='icon'
            id='menu-icon'
            src={`${menuOpen ? '/icons/close.svg' : '/icons/menu.svg'}`}
            alt='look'
          ></img>
        </button>
        <div className={`menu-items ${menuOpen ? 'open' : ''}`}>
          <button onClick={handleMusicToggle} className='menu-item'>
            <img
              className='icon menu-icon'
              src={musicOn ? '/icons/music_off.svg' : '/icons/music_on.svg'}
              alt='talk'
            ></img>
            <p className='menu-item-text'>turn music {musicOn ? 'off' : 'on'}</p>
          </button>
          <button onClick={handleSoundToggle} className='menu-item'>
            <img className='icon' src={soundOn ? '/icons/sound_off.svg' : '/icons/sound_on.svg'} alt='talk'></img>
            <p className='menu-item-text'>turn sound {soundOn ? 'off' : 'on'}</p>
          </button>
          <button onClick={handleGetInTouch} className='menu-item'>
            <img className='icon' src='/icons/contact.svg' alt='grab'></img>
            <p className='menu-item-text'>Get in Touch</p>
          </button>
          <button onClick={handleQuestion} className='menu-item'>
            <img className='icon' src='/icons/question_mark.svg' alt='grab'></img>
            <p className='menu-item-text'>What is this?</p>
          </button>
        </div>
      </div>

      <div className='hud-messages-container hud'>
        <img className='' src='/icons/speech.svg' alt='speech'></img>
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
          <button onClick={handleFastTravel} className='circle'>
            <img className='icon' src='/icons/map.svg' alt='look'></img>
          </button>
        </div>
      </div>
    </>
  )
}
