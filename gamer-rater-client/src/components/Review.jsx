// Review.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ReviewForm = () => {
  const [reviews, setReviews] = useState([]);
  const [game, setGame] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { gameId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:8000/reviews", {
          method: "GET",
          headers: {
            "Authorization": `Token ${JSON.parse(localStorage.getItem("gamer_token")).token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews. Please try again later.");
      }
    };

    const fetchGameDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/games/${gameId}`, {
          headers: {
            Authorization: `Token ${JSON.parse(localStorage.getItem("gamer_token")).token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setGame(data);
        } else {
          throw new Error('Failed to fetch game details');
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
        setError("Failed to load game details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
    fetchGameDetails();
  }, [gameId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!reviewText.trim()) {
      setError("Please enter your review text");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${JSON.parse(localStorage.getItem("gamer_token")).token}`
        },
        body: JSON.stringify({
          game: parseInt(gameId),
          review_text: reviewText
        })
      });

      if (response.ok) {
        // Navigate back to game details after successful submission
        navigate(`/gameDetails/${gameId}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Write a Review</h1>
      
      <div className="bg-violet-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-violet-800">
          You are reviewing: {game.title}
        </h2>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="reviewText" className="block text-gray-700 font-semibold mb-2">
            Your Review
          </label>
          <textarea
            id="reviewText"
            className="w-full p-3 border border-gray-300 rounded-lg min-h-[150px]"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this game..."
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(`/gameDetails/${gameId}`)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Submit Review
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Previous Reviews</h2>
        {reviews.filter(review => review.user === JSON.parse(localStorage.getItem("gamer_token")).user_id).length > 0 ? (
          <div className="space-y-4">
            {reviews
              .filter(review => review.user === JSON.parse(localStorage.getItem("gamer_token")).user_id)
              .map(review => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-violet-500">
                  <h3 className="font-semibold text-lg">
                    {review.game_details?.title || "Game"}
                  </h3>
                  <p className="text-gray-700 mt-2">{review.review_text}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            }
          </div>
        ) : (
          <p className="text-gray-600">You haven't written any reviews yet.</p>
        )}
      </div>
    </div>
  );
};