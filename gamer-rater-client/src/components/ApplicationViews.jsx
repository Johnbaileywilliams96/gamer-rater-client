import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Authorized } from "./Authorized"
import { Login } from "../pages/Login.jsx"
import { Register } from "../pages/Register.jsx"
import Home from "../pages/Home"
import { NavBar } from "./NavBar"

export const ApplicationViews = () => {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<Authorized />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/allgames" element={<div className="p-4"><h1 className="text-2xl mb-4">All Games</h1><p>This is where you'll see all available games.</p></div>} />
                    <Route path="/create" element={<div className="p-4"><h1 className="text-2xl mb-4">Create Review</h1><p>This is where you'll create a new game review.</p></div>} />
                    <Route path="/mine" element={<div className="p-4"><h1 className="text-2xl mb-4">My Game Reviews</h1><p>This is where you'll see all your game reviews.</p></div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}