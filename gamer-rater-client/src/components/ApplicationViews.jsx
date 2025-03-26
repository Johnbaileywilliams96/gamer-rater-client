import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Authorized } from "./Authorized"
import { Login } from "../pages/Login.jsx"
import { Register } from "../pages/Register.jsx"
import Home from "../pages/Home"
import { GameList } from "./GamerList.jsx"
import { GameDetails } from "./GamerDetails.jsx"
import { GameForm } from "./GamerForm.jsx"
import { useState } from "react"
import { GameReviews } from "./GameReviews.jsx"
import { ReviewForm } from "./Review.jsx"



// import { NavBar } from "./NavBar"

export const ApplicationViews = () => {
    const [gamesState, setGamesState] = useState([])

    const fetchGamesFromAPI = async () => {
        const response = await fetch("http://localhost:8000/games",
            {
                headers: {
                    Authorization: `Token ${JSON.parse(localStorage.getItem("gamer_token")).token}`
                }
            })
        const games = await response.json()
        setGamesState(games)
    }


    return (
        <BrowserRouter>
            {/* <NavBar /> */}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<Authorized />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/allgames" element={<GameList games={gamesState} fetchGames={fetchGamesFromAPI} />} />
                    <Route path="/gameDetails/:gameId" element={<GameDetails />} />
                    <Route path="/game/:gameId" element={<ReviewForm />} />
                    <Route path="/create" element={<GameForm fetchGames={fetchGamesFromAPI}/>} />
                    <Route path="/mine" element={<GameReviews games={gamesState} fetchGames={fetchGamesFromAPI} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}