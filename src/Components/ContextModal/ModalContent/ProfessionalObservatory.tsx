import './modalContent.css'

export default function ProfessionalObservatory() {
  return (
    <div className='modal-content'>
      <h2 className='modal-header'>Professional Observatory: My Software Development Journey</h2>
      <div className='modal-body'>
        <p>
          Welcome to the Professional Observatory, where the stars of my career shine brightly. I'm a software
          developer, a lover of technology, and a believer in creative expression. Whether working solo or with a team,
          I thrive on delivering solutions, tackling complex tasks, and squashing those pesky bugs. Join me as we orbit
          through my professional experiences!
        </p>

        <h3>Subvrsive</h3>
        <p>
          Currently, I'm working at a pretty cool place called Subvrsive. Here, I wear many hats. Often swapping between
          them multiple times a day! Depending on when you look, I can be found leading a project to build or upgrade
          webapps that are deployed globally. Or maybe later I'm updating our AWS or Azure cloud infrastructure using
          custom built Terraform templates. Perhaps I'm wrestling with a CI\CD pipeline because a version of Node or
          Lunux just went out of support or designing and building a custom API to manage data securely in a cloud
          database?
        </p>
        <p>
          No matter the task, I'm always looking for opportunities to build more flexible, resiliant, and beautiful web
          applications.
        </p>

        <h3>Tech9</h3>
        <p>
          Before joining Subvrsive, I spent some time at Tech9, where I had my first foreys into developing full-stack
          solutions. While there, I crafted a custom C#.NET/Typescript/React cloud application for streamlining QA
          processes and boosting developer productivity. My role involved learning a variety of new technologies and
          staying ahead of the curve to deliver reliable and efficient applications with a focus on high quality and
          extensive test coverage.
        </p>

        <h3>American National Insurance</h3>
        <p>
          Prior to that, I cut my teeth at American National, starting as an eager intern and quickly rising to lead
          roles. While there I helped develop pivotal C# ASP.NET APIs that became central to the company's operations.
          My journey there included implementing custom content management solutions and driving best practices in unit
          testing and API design. Later, while leading and mentoring teams, I guided architectural decisions and ensured
          seamless project delivery. It was here that I truly honed my skills in building scalable, secure, and
          high-performing web applications while fostering a collaborative and innovative work environment.
        </p>
        <hr
          style={{
            color: 'white',
            width: '25%',
            marginTop: '25px',
            marginBottom: '25px',
          }}
        />
        <p>
          Each role I've held has been a stepping stone, a new star in my professional galaxy. From leading backend
          development to innovating in automation, I've aimed to make a difference through technology. Thanks for
          stopping by the Observatory - I hope my journey inspires yours!
        </p>
      </div>
    </div>
  )
}
