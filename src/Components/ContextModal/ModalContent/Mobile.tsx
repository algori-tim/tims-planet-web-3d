import './modalContent.css'

export default function Mobile() {
  return (
    <div className='modal-content'>
      <h2 className='modal-header'>On a mobile device?</h2>
      <div className='modal-body'>
        <p>Sorry! This 3d website is best experienced on a desktop device with a mouse inputs.</p>
        <p>
          Head over to{' '}
          <a href='https://timsplanet.com' target='_blank' rel='noopener noreferrer'>
            timsplanet.com
          </a>{' '}
          for my 2D mobile friendly site.
        </p>
      </div>
    </div>
  )
}
