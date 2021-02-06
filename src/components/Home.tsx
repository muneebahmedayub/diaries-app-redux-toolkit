import React from "react";
import DiariesComponent from "./DiariesComponent";
import EntriesComponent from './EntriesComponent'
import { Routes, Route } from 'react-router-dom'
import EditorComponent from "./EditorComponent";
import EntryDetails from "./EntryDetails";

const Home = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<DiariesComponent />} />
      <Route path='/entries/:diaryId' element={<EntriesComponent />} />
      <Route path='/editor/:diaryId/:entryId' element={<EditorComponent />} />
      <Route path='/entry-details/:diaryId/:entryId' element={<EntryDetails />} />
    </Routes>
      
    </>
  );
};

export default Home;
