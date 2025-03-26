import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const GameForm = ({ fetchGames }) => {
    // Fixed initialGameState with proper structure
    const initialGameState = {
        title: "",
        description: "",
        designer: "",
        created_at: new Date().toISOString()
    }
    
    const [game, updateGameProps] = useState(initialGameState)
    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:8000/categories", {
                    method: "GET",
                    headers: {
                        "Authorization": `Token ${JSON.parse(localStorage.getItem("gamer_token")).token}`
                    }
                })
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                setCategories(data)
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        }

        fetchCategories()
    }, [])

    const handleCategoryChange = (e) => {
        const categoryId = parseInt(e.target.value)
        if (categoryId === 0) return 
        debugger
        
        if (!selectedCategories.includes(categoryId)) {
            setSelectedCategories([...selectedCategories, categoryId])
        }
    }



    const collectGame = async (evt) => {
        evt.preventDefault()
        
        try {
            // First create the game
            const gameResponse = await fetch("http://localhost:8000/games", {
                method: "POST",
                headers: {
                    "Authorization": `Token ${JSON.parse(localStorage.getItem("gamer_token")).token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(game)
            })
            
            if (!gameResponse.ok) throw new Error('Failed to create game');
            const createdGame = await gameResponse.json();

         
            
            // Then create the game-category relationships
            const token = JSON.parse(localStorage.getItem("gamer_token")).token;
            
            // Create a game category for each selected category
            const categoryPromises = selectedCategories.map(categoryId => {
                return fetch("http://localhost:8000/gamecategories", {
                    method: "POST",
                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        game: createdGame.id,
                        category: categoryId,
                        created_at: new Date().toISOString()
                    })
                });
            });
            
            await Promise.all(categoryPromises);
            
            // Fetch updated games and navigate
            if (fetchGames) await fetchGames();
            navigate("/allgames");
            
        } catch (error) {
            console.error("Error creating game:", error);
        }
    }

    return (
        <main className="container--login">
            <section>
                <form className="form--login" onSubmit={collectGame}>
                    <h1 className="text-3xl">Create a Game</h1>
                    <fieldset className="mt-4">
                        <label htmlFor="title">Title:</label>
                        <input 
                            id="title" 
                            type="text"
                            required
                            onChange={e => {
                                const copy = { ...game }
                                copy.title = e.target.value
                                updateGameProps(copy)
                            }}
                            value={game.title} 
                            className="form-control" 
                        />
                    </fieldset>
                    
                    <fieldset className="mt-4">
                        <label htmlFor="description">Description:</label>
                        <textarea 
                            id="description" 
                            required
                            value={game.description}
                            onChange={e => {
                                const copy = { ...game }
                                copy.description = e.target.value
                                updateGameProps(copy)
                            }}
                        ></textarea>
                    </fieldset>
                    
                    <fieldset className="mt-4">
                        <label htmlFor="designer">Designer:</label>
                        <input 
                            id="designer" 
                            type="text"
                            required
                            onChange={e => {
                                const copy = { ...game }
                                copy.designer = e.target.value
                                updateGameProps(copy)
                            }}
                            value={game.designer} 
                            className="form-control" 
                        />
                    </fieldset>
                    
                    <fieldset className="mt-4">
                        <label htmlFor="category">Category:</label>
                        <br />
                        <select 
                            id="category" 
                            className="form-control"
                            onChange={handleCategoryChange}
                        >
                            <option value={0}>- Select a category -</option>
                            {categories.map(category => (
                                <option
                                    key={`cat-${category.id}`}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    
                    {/* Display selected categories */}
                    {selectedCategories.length > 0 && (
                        <fieldset className="mt-4">
                            <label>Selected Categories:</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedCategories.map(categoryId => {
                                    const category = categories.find(c => c.id === categoryId);
                                    return category ? (
                                        <span 
                                            key={`selected-${category.id}`}
                                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                        >
                                            {category.name}
                                            <button 
                                                className="ml-2 text-red-500" 
                                                onClick={() => {
                                                    setSelectedCategories(
                                                        selectedCategories.filter(id => id !== categoryId)
                                                    );
                                                }}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </fieldset>
                    )}

                    <fieldset>
                        <button 
                            type="submit"
                            className="button rounded-md bg-blue-700 text-blue-100 p-3 mt-4"
                        >
                            Submit Game
                        </button>
                    </fieldset>
                </form>
            </section>
        </main>
    )
}