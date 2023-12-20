import projects from "./projects";
import "./Home.css";
function Project(props) {
  return (
    <div className="project-info" id={props.id}>
      <img src={props.img} alt="img" width="300px" />
      <h3 className="project-name">{props.name}</h3>
      <a href={props.link}>Link to Webpage</a>
    </div>
  );
}

export default function Home() {
  return (
    <div className="home">
      <div className="head">
        <div className="briefPersonal">
          <h1>Welcome to Flashcard Application</h1>
          <h3>I am Asim Askarov</h3>
          <p>4th year Computer Science Student</p>
        </div>
      </div>
      <div className="mainContent">
        <h1>List of Projects:</h1>
        <div className="proj-container">
          {projects.map((proj) => {
            return (
              <Project
                id={proj.id}
                key={proj.id}
                name={proj.name}
                img={proj.img}
                link={proj.link}
              ></Project>
            );
          })}
        </div>
      </div>
    </div>
  );
}
