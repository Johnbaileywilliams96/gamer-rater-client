"use client"

import { useState, useEffect } from "react";

export default function GearSpot() {
  const [posts, setPosts] = useState([])
  const [count, setCount] = useState(0)
  let [backgroundColor, setBackgroundColor] = useState('')

  
  useEffect(() => {
    if (count > 0) {

      fetch('http://localhost:8000/posts')
        .then(response => response.json())
        .then(data => setPosts(data))
        .catch(error => console.error('Error fetching posts:', error))
    }
  }, [count])



  const handleClick = () => {
    setCount(count + 1)
  }






  return (
    <>
      <h2>
        {posts.map((p, index) => {
          return (
            <div key={index}>
              {p.title}
            </div>
          )
        })}
      </h2>
      <button 
        onClick={handleClick}
        style={{
          color: "white"
        }}
      >
        Click Me
      </button>
    </>
  )
}