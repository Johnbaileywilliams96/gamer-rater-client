import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const GameReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = () => {
    setLoading(true);

    fetch("http://localhost:8000/reviews", {
      headers: {
        Authorization: `Token ${
          JSON.parse(localStorage.getItem("gamer_token")).token
        }`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGames();
  }, []);

  console.log(reviews);

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-6">All Game reviews</h1>

      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={`review-${review.id}`}
              className="border p-5 border-solid hover:bg-fuchsia-500 hover:text-violet-50 rounded-md border-violet-900 bg-slate-50"
            >
              <Link to={`/gameDetails/${review.game}`}>
                <h2 className="text-xl font-bold mb-2">
                  {review.game_details?.title || `Game #${review.game}`}
                </h2>
              </Link>
              <p>{review.review_text}</p>
              <h2 className="text-xl font-bold mb-2">
                  {review.user_details?.first_name || `Game #${review.game}`}
                </h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
