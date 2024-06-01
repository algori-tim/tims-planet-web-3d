import { useRef, useState } from 'react'
import './hud.css'
import useAudioStore from '../../Stores/audioStore'
import useUIStore from '../../Stores/uiStore'

export default function Hud() {
  const { musicOn, soundsOn, toggleSounds, toggleMusic } = useAudioStore()
  const { setOverlayType, setCursor, cursorType } = useUIStore()
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const musicRef = useRef<HTMLAudioElement>(null!)
  const { handleButtonSound, handleShimmerUpSound } = useAudioStore()

  const handleWalkLookClick = (cursor: string) => {
    handleButtonSound()
    const root = document.getElementById('root') as HTMLElement
    root.setAttribute('data-cursor', cursor)
    setCursor(cursor)
  }

  const handleQuestion = () => {
    handleShimmerUpSound()
    setOverlayType('help')
  }

  const handleGetInTouch = () => {
    handleShimmerUpSound()
    setOverlayType('get_in_touch')
  }

  const handleFastTravel = () => {
    handleShimmerUpSound()
    setOverlayType('fast_travel')
  }

  const handleMusicToggle = () => {
    handleButtonSound()
    toggleMusic()
  }

  const handleSoundToggle = () => {
    handleButtonSound(true)
    toggleSounds()
  }

  const handleMenuClick = () => {
    handleButtonSound()
    setMenuOpen((current) => !current)
  }

  return (
    <>
      <audio id='music-element' ref={musicRef} src='/audio/music/chillout.mp3' autoPlay={false} loop></audio>
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
            <img className='icon' src={soundsOn ? '/icons/sound_off.svg' : '/icons/sound_on.svg'} alt='talk'></img>
            <p className='menu-item-text'>turn sound {soundsOn ? 'off' : 'on'}</p>
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
          <button
            id='look-button'
            onClick={() => handleWalkLookClick('look')}
            className={cursorType === 'look' ? 'circle menu-item-select' : 'circle'}
          >
            <img className='icon' src='/icons/look.svg' alt='look'></img>
          </button>
          <button
            id='walk-button'
            onClick={() => handleWalkLookClick('walk')}
            className={cursorType === 'walk' ? 'circle menu-item-select' : 'circle'}
          >
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
