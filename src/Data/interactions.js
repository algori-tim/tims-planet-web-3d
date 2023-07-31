const interactionMatrix = new Map();

interactionMatrix.set('look_ground', "It's so green...");
interactionMatrix.set('look_player', "It's you! Aren't you handsome.");
interactionMatrix.set('look_sub_ground', "It's so brown...");
interactionMatrix.set('look_space', 'Ah... the final frontier!');
interactionMatrix.set('walk_ground', 'Off you go.');

export const getInteractionMessage = (cursor, interactionPoint) => {
	console.log(`${cursor}_${interactionPoint}`);
	const message = interactionMatrix.get(`${cursor}_${interactionPoint}`);
	if (message) return message;

	if (cursor === 'walk') return "Unlike some boots, that's not made for walking.";
	if (cursor === 'talk') return 'It responds with utter silence.';
	if (cursor === 'look') return 'Stop looking at that!';
};
