import { Svg } from '@react-three/drei';
import './hud.css';

export default function Hud() {
	return (
		<>
			<div className='hud'>
				<div className='circle'>
					<img className='icon' src='/icons/look.svg' alt='look'></img>
				</div>
				<div className='circle'>
					<img className='icon' src='/icons/talk.svg' alt='talk'></img>
				</div>
				<div className='circle'>
					<img className='icon' src='/icons/walk.svg' alt='walk'></img>
				</div>
			</div>
		</>
	);
}
