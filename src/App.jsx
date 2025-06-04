import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginForm from './Components/LoginForm'
import AdminDashboard from './Components/AdminDashboard'
import TestList from './Components/TestList'
import CreateTest from './Components/CreateTest'
import CreateQuestion from './Components/CreateQuestion'
import BulkUpload from './Components/BulkUpload'
import { Toaster } from 'sonner'

function App() {

  return (
    <>
    <BrowserRouter>
       <Toaster richColors position="top-right" />
    <Routes>
      <Route path='/' element={<LoginForm/>}/>
      <Route>
      <Route path='/dashboard' element={<AdminDashboard/>}/>
      <Route path='/testlist' element={<TestList/>}/>
      <Route path='/Createtest' element={<CreateTest/>}/>
      <Route path='/CreateQuestiion' element={<CreateQuestion/>}/>
      <Route path='/bulkupload' element={<BulkUpload/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
