const interactionMatrix = new Map()

interactionMatrix.set('look_grass', "It's so green...")
interactionMatrix.set('look_player', "It's you! Aren't you handsome.")
interactionMatrix.set('look_dirt', "It's so brown...")
interactionMatrix.set('look_water', 'Bit more than a puddle.')
interactionMatrix.set('look_space', 'Ah... the final frontier!')

interactionMatrix.set('walk_grass', 'Off you go.')
interactionMatrix.set('walk_water', "Don't want to get your boots wet.")
interactionMatrix.set('walk_space', 'Whoa now, rocket man!')

const getInteractionMessage = (cursor, interactionPoint) => {
  const message = interactionMatrix.get(`${cursor}_${interactionPoint}`)
  if (message) return message

  if (cursor === 'walk') return "Unlike some boots, that's not made for walking."
  if (cursor === 'look') return 'Stop looking at that!'
}

export const handleQuipInteraction = (cursor, interactionPoint) => {
  console.log(interactionPoint)
  document.getElementById('hud-messages').innerHTML = getInteractionMessage(cursor, interactionPoint)
}
