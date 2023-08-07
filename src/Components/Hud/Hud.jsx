import React from 'react';
import './hud.css';
import useStore from '../../Stores/store';

export default function Hud() {
	const setCursor = useStore((store) => store.setCursor);

	const handleClick = (cursor) => {
		document.getElementById('root').setAttribute('data-cursor', cursor);
		setCursor(cursor);
	};

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
					<button onClick={() => handleClick('talk')} className='circle'>
						<img className='icon' src='/icons/talk.svg' alt='talk'></img>
					</button>
					<button onClick={() => handleClick('walk')} className='circle'>
						<img className='icon' src='/icons/walk.svg' alt='walk'></img>
					</button>
					<button onClick={() => handleClick('grab')} className='circle'>
						<img className='icon' src='/icons/grab.svg' alt='grab'></img>
					</button>
				</div>
			</div>
		</>
	);
}
