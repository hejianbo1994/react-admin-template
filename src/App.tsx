import React, { FC } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import Container from '@/pages/container'
import Login from '@/pages/login'

const App: FC = (props) => (
  <Router basename="/admin">
    <Route exact path="/login" component={Login} />
    <Route path="/" key="container" render={() => <Container {...props} />} />
  </Router>
)

export default App
