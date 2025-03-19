import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {
    Routes,
    Route,

} from "react-router-dom";
import {ChatPage} from "./pages/ChatPage.jsx";
import {HomePage} from "./pages/Homepage.jsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </BrowserRouter>
    );
}


export default App
