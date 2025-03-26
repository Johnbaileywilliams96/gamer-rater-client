import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const GameDetails = () => {
  const [game, setGame] = useState(null);
  const [rating, setRating] = useState(null)
  const [loading, setLoading] = useState(true);
  const { gameId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/games/${gameId}`, {
          headers: {
            Authorization: `Token ${
              JSON.parse(localStorage.getItem("gamer_token")).token
            }`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setGame(data);
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);


  useEffect(() => {
    const fetchGameRating = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/gameratings/${gameId}`, {
          headers: {
            Authorization: `Token ${
              JSON.parse(localStorage.getItem("gamer_token")).token
            }`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRating(data);
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false);
      }
    };


    
    fetchGameRating();
    }, [gameId]);

    console.log(rating)
    
  if (loading) {
    return <div>Loading game details...</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <>
      <h1>Game Details</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 border border-violet-200">
        <h2 className="text-3xl font-bold mb-4 text-violet-800">
          {game.title}
        </h2>

        <div className="mb-6">
          <p className="text-gray-700 text-lg mb-4">{game.description}</p>
        </div>
        <div className="mb-6">
          <p className="text-gray-700 text-lg mb-4">{game.designer}</p>
        </div>
        <p>{game.categories.map((category) => category.name).join(", ")}</p>
      </div>
        <p>{rating.rating}</p>
        <p>{rating.user?.first_name}</p>

      <Link to={`/game/${game.id}`}>
        <h1>Review Game</h1>
        {console.log("Game ID:", game.id)}
      </Link>
    </>
  );
};
