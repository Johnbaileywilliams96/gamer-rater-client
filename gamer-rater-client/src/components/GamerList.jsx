import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export const GameList = () => {
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchGames = () => {
        setLoading(true)
        
        fetch("http://localhost:8000/games", {
            headers: {
                Authorization: `Token ${JSON.parse(localStorage.getItem("gamer_token")).token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setGames(data)
                setLoading(false)
            })
            .catch(error => {
                console.error("Error fetching games:", error)
                setLoading(false)
            })
    }

  
    useEffect(() => {
        fetchGames()
    }, [])

    console.log(games)

    return (
        <div className="p-4">
            <h1 className="text-3xl mb-6">All Games</h1>
            
            {loading ? (
                <p>Loading games...</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {games.map(game => (
                        <div 
                            key={`game-${game.id}`} 
                            className="border p-5 border-solid hover:bg-fuchsia-500 hover:text-violet-50 rounded-md border-violet-900 bg-slate-50"
                        >
                            <Link to={`/gameDetails/${game.id}`}>
                            <h2 className="text-xl font-bold mb-2">{game.title}</h2>
                            </Link>
                            <p>{game.description}</p>
                            <div className="mt-2">
                                {/* <p className="font-semibold">Categories: </p>
                                <p>
                                    {game.categories.map(category => category.name).join(", ")}
                                </p> */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}