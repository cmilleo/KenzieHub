import React from "react";

import { Container } from "./styles";
import Skills from "../../components/Skills";

const ContainerSkills = ({ techs, setTechs }) => {
  return (
    <Container>
      {techs.length > 0 ? (
        techs.map((tech) => (
          <Skills key={tech.id} tech={tech} setTechs={setTechs} />
        ))
      ) : (
        <div className="containerNoTechs">
          <h2>Não há nada por aqui</h2>
          <p>adicione alguma tecnologia</p>
        </div>
      )}
    </Container>
  );
};

export default ContainerSkills;
