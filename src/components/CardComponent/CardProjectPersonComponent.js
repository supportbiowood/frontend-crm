import React from 'react'

export default function CardProjectPersonComponent(props) {

  return (
    <button className="card-contact">
      <div className="container">
        <div className="left-side">
          <div className="image-preview">
            <img className="image-user" src={props.image} alt="" srcSet="" />
          </div>
        </div>
        <div className="right-side">
          <div className="topic">
            <h4>{props.role}</h4>
          </div>
          <h4>{props.name}</h4>
          <h4>{props.tel}</h4>
        </div>
      </div>
    </button>
  )
}
