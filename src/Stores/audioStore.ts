import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

type SoundType = {
  audio: HTMLAudioElement
  volume: number
}

const sounds = {
  buttonClick: {
    audio: new Audio('/audio/sound_fx/button.mp3'),
    volume: 0.4,
  },
  shimmerUp: {
    audio: new Audio('/audio/sound_fx/shimmer_up.wav'),
    volume: 0.65,
  },
  shimmerDown: {
    audio: new Audio('/audio/sound_fx/shimmer_down.wav'),
    volume: 0.65,
  },
}

export interface AudioState {
  soundsOn: boolean
  musicOn: boolean
  toggleSounds(): void
  toggleMusic(): void
  handleButtonSound(forceSound?: boolean): void
  handleShimmerUpSound(): void
  handleShimmerDownSound(): void
}

const playSound = (sound: SoundType): void => {
  console.log('playing', sound)
  sound.audio.pause()
  sound.audio.currentTime = 0
  sound.audio.volume = sound.volume
  sound.audio.play()
}

const useAudioStore = create<AudioState>()(
  subscribeWithSelector((set, get) => ({
    soundsOn: true,
    musicOn: false,
    toggleMusic() {
      set((state) => {
        const musicBeingTurnedOn = !state.musicOn
        const musicElement = document.getElementById('music-element') as HTMLAudioElement

        if (musicBeingTurnedOn) {
          musicElement.play()
          musicElement.volume = 0.35
        } else {
          musicElement.pause()
        }

        return { musicOn: musicBeingTurnedOn }
      })
    },
    toggleSounds() {
      set((state) => {
        return { soundsOn: !state.soundsOn }
      })
    },
    //add this to all buton clicks
    handleButtonSound(forceSound: boolean = false) {
      const { soundsOn } = get()
      if (forceSound || soundsOn) playSound(sounds['buttonClick'])
    },
    handleShimmerUpSound() {
      const { soundsOn } = get()
      if (soundsOn) playSound(sounds['shimmerUp'])
    },
    handleShimmerDownSound() {
      const { soundsOn } = get()
      if (soundsOn) playSound(sounds['shimmerDown'])
    },
  }))
)

export default useAudioStore
