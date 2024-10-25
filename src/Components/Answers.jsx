import React from "react";

function Answers(props) {
  return (
    <div className={"answers-container"}>
      <div>
        <h2>Name</h2>
        <h2 className="name" title={props.name}>
          {" "}
          {props.name}
        </h2>
      </div>
      <div>
        <h2>Email</h2>
        <h2 className="name" title={props.email}>
          {props.email}
        </h2>
      </div>
    </div>
  );
}

export default Answers;
