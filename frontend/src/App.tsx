import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'styles/global.css';
import 'styles/loader.css';

import BaseSingleLayout from 'layouts/single';

import {
  About,
  HomePage,
  Project,
  ScrapBook,
  History,
  MapViewer,
  CardList,
  CardDetail
} from "pages";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="" element={<BaseSingleLayout withCardsHeader />}>
            <Route path="" element={<HomePage />}></Route>
            <Route path="about" element={<About />}></Route>
            <Route path="history" element={<History />}></Route>
            <Route path="project" element={<Project />}></Route>
            <Route path="flipbook" element={<ScrapBook />}></Route>
            <Route path="themes" element={<p>Themes</p>}></Route>
            <Route path="ethics-of-representation" element={<p>Ethics of representation</p>}></Route>
          </Route>
          <Route path="" element={<BaseSingleLayout withCardsHeader={false} />}>
            <Route path="map" element={<MapViewer />}></Route>
            <Route path="cards" element={<CardList />}></Route>
            <Route path="cards/:cardType/:cardId" element={<CardDetail />}></Route>
          </Route>
          <Route path="*" element={<p>What's up?</p>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
