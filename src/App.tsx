import logo from './logo.svg';
import './App.css';
import { observer } from "mobx-react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useParams,Navigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Main from './main';
import 'bootstrap/dist/css/bootstrap.min.css';

function App()
{ 
  useEffect ( () => { 
    document.title="Minipelit";
    }, []); 

  return (
    <Router>
    <div className="center"><h2>Minipelit</h2></div>
    <div className="center">
      <div className="Page">
        <Routes>
          <Route path='/' element={<Main/>}  ></Route>
      </Routes> 
      </div>
    </div>
   </Router>
  )
}
export default App;
