import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from 'react-router-dom'

interface IProps {
  name?: string
}

const About = (_props: RouteComponentProps<IProps>): ReactElement => {
  return (
    <>
      <Helmet>
        <title>About {_props.match.path}</title>
      </Helmet>
      <div className='about__wrapper'>
        <h1>hello</h1>
      </div>
    </>
  )
}

export default About
