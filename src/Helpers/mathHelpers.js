export const getDistance = (start, end) => {
	return Math.sqrt(
		Math.pow(Math.abs(start.x - end.x), 2) +
			Math.pow(Math.abs(start.y - end.y), 2) +
			Math.pow(Math.abs(start.z - end.z), 2)
	);
};
