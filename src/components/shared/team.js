import React from "react";
import team from "../../assets/team-zoomer.png";
import '../../App.css';

export default class Team extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div><img className="team" src={team} alt={"Team Zoomer"}/></div>
    );
  }
}
