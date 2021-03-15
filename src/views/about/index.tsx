import React from 'react'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from 'react-router-dom'

interface IProps {}

const About = ({}: RouteComponentProps<IProps>) => {
  return (
    <>
      <Helmet>
        <title>About</title>
      </Helmet>
      <div className='about__wrapper'>
        <h1>hello</h1>
      </div>
    </>
  )
}

export default About
