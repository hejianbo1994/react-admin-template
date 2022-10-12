import React, { FC } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Container from '@/pages/container'
import Login from '@/pages/login'

const App: FC = (props) => (
  <BrowserRouter basename="admin">
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Container {...props} />} />
    </Routes>
  </BrowserRouter>
)

export default App
