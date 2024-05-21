const interactionMatrix = new Map<string, string[]>()

interactionMatrix.set('look_grass', [
  "It's so green...",
  'Ahh... The smell of fresh cut grass!',
  'The grass is always greener... especially in a game.',
  'This grass has seen better days, just like the graphics.',
  "Remember, don't step on the grass... oh wait, it's just pixels.",
  'Is it just me, or does this grass feel a bit too... graphic?',
])
interactionMatrix.set('look_player', [
  "It's you! Aren't you handsome.",
  "Mirror, mirror, in the game, who's the fairest of them all?",
  "You're looking sharp! Must be all those pixels.",
  'Looking good! If only we had a high-res mode...',
  "You've got that classic adventure game hero look.",
])
interactionMatrix.set('look_dirt', [
  "It's dirt. What more did you expect?",
  'Just your average, garden-variety dirt.',
  'Dirt: the building block of adventure game environments.',
  "It's just dirt, but in a game, even dirt can be exciting.",
  'Pixelated dirt: surprisingly less messy.',
])
interactionMatrix.set('look_water', [
  'Bit more than a puddle.',
  "Looks wet. Looks cold. Looks like I'm staying out.",
  'Remember, no swimming in the pixel pond.',
  "Water you looking at? It's just a bit of H2-Oh!",
  'In the digital world, even water is dry.',
])
interactionMatrix.set('look_space', [
  'Ah... the final frontier!',
  "The stars are out, but can they compete with your screen's brightness?",
  'Space: where no gamer has gone before... in this game, at least.',
  'Staring into the abyss of pixels and possibilities.',
  'If you listen closely, you can hear the cosmic background radiation... or is that just static?',
])
interactionMatrix.set('look_tree', [
  'The more you look at it, the more it grows on you.',
  'I wood not mess with that tree if I were you.',
  "Leaf it alone, it's just a tree.",
  "Trees in video games don't need water, just electricity.",
  'Ever wonder if the tree makes a sound when it falls in a game?',
])
interactionMatrix.set('look_rock', [
  'This 3d experience must really be ROCKing your world.',
  'Hard as a rock, but only in the virtual sense.',
  'This rock has been sitting here for ages, pixelating.',
  "Rocks in games don't roll, they just sit there... pixelly.",
  'In the grand scheme of things, this rock is just a pebble.',
])

interactionMatrix.set('walk_grass', [
  'Off you go.',
  'Tiptoe through the pixels, eh?',
  "Walking on grass: the closest you'll get to nature in here.",
  'Just strolling through the green, digital meadow.',
  "Feel that? Neither do I. It's virtual grass!",
])
interactionMatrix.set('walk_water', [
  "Don't want to get your boots wet.",
  'Hope you brought your virtual waders.',
  "Splish, splash, you're taking a digital bath.",
  "Into the drink! Just kidding, you'll stay dry.",
  'Walking on water? Not in this game!',
])
interactionMatrix.set('walk_space', [
  'Whoa now, rocket man!',
  'One small step for man, one giant leap for pixelkind.',
  'You might need a space suit for that.',
  "Where we're going, we don't need roads, but maybe a spaceship.",
  'Heading to the final frontier, are we? Watch out for asteroids!',
])

const getInteractionMessage = (cursor: string, interactionPoint: string) => {
  const messages = interactionMatrix.get(`${cursor}_${interactionPoint}`)

  if (messages) {
    if (messages.length === 1) return messages[0]

    const randomQuipIndex = Math.floor(Math.random() * messages.length)
    console.log(randomQuipIndex)
    if (messages) return messages[randomQuipIndex]
  }

  if (cursor === 'walk') return "Unlike some boots, that's not made for walking."
  return 'Whoah...'
}

const handleIfKnownMultples = (interactionPoint: string) => {
  console.log('interactionPoint', interactionPoint)
  if (interactionPoint.startsWith('og_tree')) return 'tree'
  if (interactionPoint.startsWith('rock')) return 'rock'

  return interactionPoint
}

export const handleQuipInteraction = (cursor: string, interactionPoint: string) => {
  if (interactionPoint.startsWith('well')) return

  const hudMessages = document.getElementById('hud-messages') as HTMLElement
  hudMessages.innerHTML = getInteractionMessage(cursor, handleIfKnownMultples(interactionPoint))
}
