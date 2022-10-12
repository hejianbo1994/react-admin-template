import React, { FC } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Container from '@/pages/container'
import Login from '@/pages/login'

const App: FC = (props) => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Container {...props} />} />
    </Routes>
  </Router>
)

export default App
