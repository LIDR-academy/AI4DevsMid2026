import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import PositionsPage from './components/PositionsPage';
import PositionBoard from './components/PositionBoard';
import AddCandidate from './components/AddCandidateForm';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/positions" element={<PositionsPage />} />
          <Route path="/positions/:id" element={<PositionBoard />} />
          <Route path="/add-candidate" element={<AddCandidate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
