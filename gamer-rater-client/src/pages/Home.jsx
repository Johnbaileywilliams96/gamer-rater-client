import React from "react"

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to Gamer Rater!</h1>
            <p>Your go-to place for rating and reviewing games.</p>
            <div className="home-features">
                <div className="feature">
                    <h3>Rate Games</h3>
                    <p>Share your opinion on the latest releases.</p>
                </div>
                <div className="feature">
                    <h3>Discover Games</h3>
                    <p>Find new games based on community ratings.</p>
                </div>
                <div className="feature">
                    <h3>Connect</h3>
                    <p>See what games your friends are playing.</p>
                </div>
            </div>
        </div>
    )
}

export default Home