import React from 'react'
import './modalContent.css'

export default function HelpPage() {
  return (
    <div className='modal-content'>
      <h2 className='modal-header'>Your Guide to Exploring Tim's Planet!</h2>
      <div className='modal-body'>
        <p>
          Hello there, fellow space traveler! 🚀 Welcome to Tim's Planet, a little corner of the internet I've created
          just for you. As you embark on this virtual journey, you'll not only get to know me, Tim Johnson, a bit
          better, but you'll also see some of the nifty web development work I've been up to. Let's get you acquainted
          with how things work around here!
        </p>
        <h2>🚶‍♂️ Walking Around</h2>
        <p>Exploring my planet is super easy and, dare I say, fun! To start wandering around:</p>
        <ol>
          <li>
            <strong>Look for the Walk Icon:</strong>
            <p>
              This little gem is on your Heads-Up Display (HUD). It looks like a pair of walking feet - you can't miss
              it!
            </p>
          </li>
          <li>
            <strong>Click to Move:</strong>
            <p>
              Once you've selected the walk icon, simply click on any spot in this world where you'd like to go. And
              voilà, you'll be on your way!
            </p>
          </li>
        </ol>

        <h2>🔍 Inspecting Objects</h2>
        <p>Curious about what's scattered around Tim's Planet? I thought you might be!</p>
        <ol>
          <li>
            <strong>Select the Magnifying Glass Icon:</strong>
            <p>This is your gateway to discovery. You'll find it hanging out on your HUD.</p>
          </li>
          <li>
            <strong>Click on Items:</strong>
            <p>
              See something interesting? Click on it while you've got your magnifying glass selected. You'll get to know
              more about the item, and maybe a little about me too!
            </p>
          </li>
        </ol>

        <h2>🌌 The Purpose of Tim's Planet</h2>
        <p>
          Now, you might be wondering, "What's all this for?" Well, my friend, Tim's Planet is my way of showing you who
          I am and what I do. As a web developer, I love creating experiences that are out of this world. This planet is
          a mix of my professional work and personal interests – from the coding behind the scenes to the hobbies I
          sprinkle throughout the landscape. Think of it as a portfolio, but more interactive and, hopefully, more fun!
        </p>
        <p>
          Feel free to roam, explore, and interact as much as you like. Every corner of Tim's Planet has a story, a
          project, or a little piece of me. Enjoy your journey, and don't hesitate to reach out if you want to chat
          about the planet, web development, or anything else!
        </p>
        <p>Safe travels, space explorer! 🌠</p>
      </div>
    </div>
  )
}
