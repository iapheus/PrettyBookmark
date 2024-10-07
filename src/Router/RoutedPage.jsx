import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '../Views/App';
import Home from '../Views/Home';
import Login from '../Views/mobile/Login';
import Register from '../Views/mobile/Register';
import NotFound from '../Views/NotFound';
import Published from '../Views/Published';
import All from '../Views/All';
import Collection from '../Views/Collection';
import NewBookmark from '../Views/NewBookmark';
import ImportBookmark from '../Views/ImportBookmark';
import CollectionAll from '../Views/CollectionAll';

function RoutedPage() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />}>
          <Route path="published" element={<Published />} />
          <Route path="all" element={<All />} />
          <Route path="collection/:collectionId" element={<Collection/>} /> 
          <Route path="collection/new" element={<NewBookmark/>} /> 
          <Route path="collection/import" element={<ImportBookmark/>} /> 
          <Route path="collection/all" element={<CollectionAll />} /> 
        </Route>
        <Route path="/mobile/login" element={<Login />} />
        <Route path="/mobile/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default RoutedPage;
