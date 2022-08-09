import React, { useState } from "react";

import { Container } from "./styles";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../../store/modules/user/actions";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import ContainerSkills from "../../components/ContainerSkills";
import ModalAddSkill from "../../components/ModalAddSkill";
import api from "../../Services/api";

const Home = () => {
  const [modalTech, setModalTech] = useState(false);
  const [techs, setTechs] = useState([]);
  const [isLogged, setIsLogged] = useState(true);

  const user = useSelector(({ user }) => user.user);

  const dispatch = useDispatch();

  const history = useHistory();

  const userLoggedIn = localStorage.getItem("user");

  useEffect(() => {
    if (isLogged && !localStorage.getItem("token")) {
      toast.error("Você não está logado");
      setTimeout(() => history.push("/"), 2500);
    }
    if (isLogged) {
      api.get(`/users/${JSON.parse(userLoggedIn).id}`).then((response) => {
        dispatch(setUser(response.data));
        setTechs(response.data.techs);
        localStorage.setItem("user", JSON.stringify(response.data));
      });
    }

    if (!user) {
      dispatch(setUser(JSON.parse(userLoggedIn)));
    }
  }, [user]);

  function handleAddSkill() {
    setModalTech(!modalTech);
  }

  function handleLogout() {
    toast.success("Logout realizado com sucesso");
    setIsLogged(false);
    setTimeout(() => {
      history.push("/");
      localStorage.clear();
      dispatch(logout());
    }, 2500);
  }

  return (
    <Container>
      {user ? (
        <>
          {modalTech && <ModalAddSkill setModalTech={setModalTech} />}
          <header className="headerHome">
            <div>
              <h1>Kenzie Hub</h1>
              <button className="btnLogout" onClick={handleLogout}>
                Sair
              </button>
            </div>
          </header>
          <section className="containerUser">
            <div>
              <h2>Olá, {user.name}</h2>
              <p>{user.course_module}</p>
            </div>
          </section>
          <main>
            <header>
              <h3>Tecnologias</h3>
              <button className="btnAdd" onClick={handleAddSkill}>
                <GoPlus />
              </button>
            </header>
            <ContainerSkills techs={techs} setTechs={setTechs} />
          </main>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </Container>
  );
};

export default Home;
