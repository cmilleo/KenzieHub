import React, { useEffect, useState } from "react";

import { Container } from "./styles";
import { IoMdClose } from "react-icons/io";
import { ButtonPrimary, ButtonSecondary, Input } from "../../styles/Global";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

import api from "../../Services/api";
import { toast } from "react-toastify";

const ModalEditSkill = ({ setModalEditSkill, tech }) => {
  const [showModules, setShowModules] = useState(false);
  const [currentModule, setCurrentModule] = useState("Iniciante");

  useEffect(() => {
    setCurrentModule(tech.status);
  }, []);

  function handleShowModules() {
    setShowModules(!showModules);
  }

  function handleSelectModule(e) {
    setCurrentModule(e.target.innerText);
    setShowModules(false);
  }

  function handleCloseModal() {
    setModalEditSkill(false);
  }

  const onSubmit = (data) => {
    data.preventDefault();
    const status = { status: currentModule };

    api
      .put(`/users/techs/${tech.id}`, status, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        toast.success("Tecnologia atualizada com sucesso");
        setShowModules(false);
      })
      .catch((error) => {
        toast.error("Erro ao alterar tecnologia");
      });

    setTimeout(() => {
      setModalEditSkill(false);
    }, 500);
  };

  function handleDelete() {
    api
      .delete(`/users/techs/${tech.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        toast.success("Tecnologia removira com sucesso");
        setShowModules(false);
      })
      .catch((error) => {
        toast.error("Erro ao apagar tecnologia");
      });

    setTimeout(() => {
      setModalEditSkill(false);
    }, 500);
  }

  return (
    <Container>
      <section>
        <div className="newTech">
          <h2>Tecnologia Detalhes</h2>

          <button onClick={handleCloseModal}>
            <IoMdClose />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <label>
            Nome
            <Input value={tech.title} readOnly />
          </label>
          <label>
            Selecionar Status
            <ul>
              <li className="selectLevel">
                {currentModule}
                {showModules ? (
                  <FaAngleUp onClick={handleShowModules} />
                ) : (
                  <FaAngleDown onClick={handleShowModules} />
                )}
              </li>
              {showModules && (
                <div className="level">
                  <li onClick={handleSelectModule}>Iniciante</li>
                  <li onClick={handleSelectModule}>Intermediário</li>
                  <li onClick={handleSelectModule}>Avançado</li>
                </div>
              )}
            </ul>
          </label>
          <div className="containerButton">
            <ButtonPrimary className="btnEdit" type="submit">
              Salvar alterações
            </ButtonPrimary>
            <ButtonSecondary
              type="button"
              className="btnDelete"
              onClick={handleDelete}
            >
              Excluir
            </ButtonSecondary>
          </div>
        </form>
      </section>
    </Container>
  );
};

export default ModalEditSkill;
