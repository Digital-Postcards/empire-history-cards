import { BrowserRouter, Route, Routes } from "react-router-dom";

import "styles/global.css";
import "styles/loader.css";

import BaseSingleLayout from "layouts/single";

import { About, HomePage, ScrapBook, History, MapViewer, CardDetail, Cards, Themes, Ethics } from "pages";
import { ApplicationContextProvider } from "contexts/ApplicationContext";
import AdminPortal from "pages/admin";
import UnauthorizedAccess from "pages/admin/unauthorized-access";
import Bibliography from "pages/bibliography";

function App() {
    return (
        <ApplicationContextProvider>
            <BrowserRouter>
                <div className="App">
                    <Routes>
                        <Route path="" element={<BaseSingleLayout withCardsHeader />}>
                            <Route path="" element={<HomePage />}></Route>
                            <Route path="about" element={<About />}></Route>
                            <Route path="history" element={<History />}></Route>
                            <Route path="flipbook" element={<ScrapBook />}></Route>
                            <Route path="ethics-of-representation" element={<Ethics />}></Route>
                            <Route path="bibliography" element={<Bibliography />}></Route>
                        </Route>
                        <Route path="" element={<BaseSingleLayout withCardsHeader={false} />}>
                            <Route path="themes" element={<Themes />}></Route>
                            <Route path="map" element={<MapViewer />}></Route>
                            <Route path="cards" element={<Cards />}></Route>
                            <Route path="cards/:cardType/:cardId" element={<CardDetail />}></Route>
                        </Route>
                        <Route path="admin/*" element={<AdminPortal />} />
                        <Route path="unauthorized" element={<UnauthorizedAccess />} />
                        <Route path="*" element={<p>What&apos;s up?</p>}></Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </ApplicationContextProvider>
    );
}

export default App;
