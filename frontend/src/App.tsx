import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'styles/global.css';
import "styles/carousel.css";

import DashboardLayout from 'layouts/dashboard';
import BaseSingleLayout from 'layouts/single';

import { About, HomePage } from 'pages/single';
import Wiki from 'pages/dashboard/wiki';
import WikiDetail from 'pages/dashboard/wiki/detail';
import WikiList from 'pages/dashboard/wiki/list';
import { Project } from 'pages/single';
import { Flipbook } from 'pages/single';
import { History } from 'pages/single';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="" element={<BaseSingleLayout />}>
            <Route path="" element={<HomePage />}></Route>
            <Route path="about" element={<About />}></Route>
            <Route path="history" element={<History />}></Route>
            <Route path="project" element={<Project />}></Route>
            <Route path="flipbook" element={<Flipbook />}></Route>
          </Route>
          <Route path="exhibit" element={<DashboardLayout />}>
            <Route path="wiki" element={<Wiki />}></Route>
            <Route path="wiki/choice" element={<Wiki />}></Route>
            <Route path="wiki/:cardId" element={<WikiDetail />} />
            <Route path="wiki/list" element={<WikiList />} />
            <Route path="wiki/*" element={<p>What's up</p>} />
            <Route path="map" element={<p>Map</p>}></Route>
            <Route path="themes" element={<p>Themes</p>}></Route>
            <Route path="*" element={<p>What's up?</p>}></Route>
          </Route>
          <Route path="*" element={<p>What's up?</p>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
