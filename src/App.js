import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TableTypeList from './components/TableTypeList';
import DisplayAnswers from './components/displayanswers';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={ <TableTypeList/> } />
        <Route exact path="/answers/:studentNumber" element={ <DisplayAnswers/> } />

      </Routes>
    </Router>
  );
}

export default App;
