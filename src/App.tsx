import React, { FC } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Container from '@/pages/container'
import Login from '@/pages/login'

const App: FC = (props) => (
  <HashRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Container {...props} />} />
    </Routes>
  </HashRouter>
)

export default App
