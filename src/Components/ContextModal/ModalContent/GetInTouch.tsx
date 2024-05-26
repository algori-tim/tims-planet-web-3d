import React from 'react'
import './modalContent.css'

export default function GetInTouch() {
  return (
    <div className='modal-content'>
      <h2 className='modal-header'>Get in Touch</h2>
      <p>
        Thank you for taking the time to explore Tim's Planet! It's been a joy sharing my world with you. If you have
        any questions, want to discuss a project, or simply feel like saying hello, I'd love to hear from you. Here are
        a few ways you can get in touch:
      </p>

      <h3>📧 Email</h3>
      <p>
        For direct inquiries or if you prefer a more personal touch, feel free to email me at{' '}
        <a href='mailto:tim@timsplanet.com'>tim@timsplanet.com</a>. I'm always excited to connect and will get back to
        you as soon as possible.
      </p>

      <h3>🔗 LinkedIn</h3>
      <p>
        Connect with me on LinkedIn for a more professional interaction. Check out my profile at{' '}
        <a href='https://www.linkedin.com/in/timabbottjohnson' target='_blank' rel='noopener noreferrer'>
          /timabbottjohnson
        </a>
        . It's a great place to network and keep up to date with my professional activities.
      </p>

      <h3>🐙 GitHub</h3>
      <p>
        If you're curious about my coding projects or want to collaborate, visit my GitHub profile at{' '}
        <a href='https://github.com/algori-tim' target='_blank' rel='noopener noreferrer'>
          algori-tim
        </a>
        . Feel free to explore my repositories and don't hesitate to reach out if you have any questions or ideas.
      </p>

      <p>
        Again, thank you for visiting Tim's Planet. Your interest and time mean the world to me, and I look forward to
        potentially collaborating or just having a great conversation!
      </p>
    </div>
  )
}
