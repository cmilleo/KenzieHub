import React, { useEffect, useState } from "react";

import { Container } from "./styles";
import * as yup from "yup";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ButtonPrimary, Input } from "../../styles/Global";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import api from "../../Services/api";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentModule, setCurrentModule] = useState("Primeiro módulo");
  const [showModules, setShowModules] = useState(false);
  const [buttonTogle, setButtonTogle] = useState(true);

  const history = useHistory();

  useEffect(() => {
    if (showModules) {
      const modules = document.querySelector(".modules");
      modules.classList.add("modules-Open");
    }
  }, [showModules]);

  function handleShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleShowModules() {
    if (showModules) {
      const modules = document.querySelector(".modules");
      modules.classList.remove("modules-Open");
      modules.classList.add("modules-Close");

      setTimeout(() => setShowModules(!showModules), 600);
    } else {
      setShowModules(!showModules);
    }
  }
  function handleSelectModule(e) {
    setCurrentModule(e.target.innerText);
    const modules = document.querySelector(".modules");
    modules.classList.remove("modules-Open");
    modules.classList.add("modules-Close");
    setTimeout(() => setShowModules(false), 600);
  }
  const schema = yup.object().shape({
    name: yup.string().required("Insira seu nome").min(3, "Nome muito curto"),
    email: yup
      .string()
      .email("Insira um email valido")
      .required("Insira seu email"),
    password: yup
      .string()
      .required("Insira sua senha")
      .min(6, "A senha contem no minimo 6 caracteres")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{6,}$/,
        "A senha deve conter pelo menos um caracter maiusculo, um caracter minusculo, um caracter numeral e um caracter especial"
      ),
    confirmPassword: yup
      .string()
      .required("Repita a sua senha")
      .oneOf([yup.ref("password")], "As senhas não conferem"),
    bio: yup.string("Insira sua biografia").min(10, "Biografia muito curta"),
    contact: yup.string().required("Insira seu contato"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ resolver: yupResolver(schema) });

  const signUp = (data) => {
    data.course_module = currentModule;
    api
      .post("/users", data)
      .then((response) => {
        toast.success("Usuario cadastrado com sucesso");
        setTimeout(() => {
          history.push("/");
        });
      })
      .catch((error) => {
        toast.error("Verifique todos os campos");
      });
  };

  function handleChange() {
    const { name, email, password, confirmPassword, bio, contact } =
      getValues();
    if (name && email && password && confirmPassword && bio && contact) {
      setButtonTogle(false);
    } else {
      setButtonTogle(true);
    }
  }
  return (
    <Container>
      <div className="headerRegister">
        <h1>Kenzie Hub</h1>
        <button className="btnBack" onClick={() => history.goBack()}>
          Voltar
        </button>
      </div>
      <div className="containerRegister">
        <div className="topRegister">
          <h2>Crie sua Conta</h2>
          <p>Rapido e grátis, vamos nessa</p>
        </div>
        <form onSubmit={handleSubmit(signUp)} onChange={handleChange}>
          <label>
            Nome
            <Input
              {...register("name")}
              type="text"
              placeholder="Digite aqui seu nome"
            />
            <span>{errors.name?.message}</span>
          </label>
          <label>
            Email
            <Input
              {...register("email")}
              type="email"
              placeholder="Digite aqui seu email"
            />
            <span>{errors.email?.message}</span>
          </label>
          <label>
            Senha
            <div className="inputPassword">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Digite aqui sua senha"
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="svgPassword"
                  onClick={handleShowPassword}
                />
              ) : (
                <AiFillEye
                  className="svgPassword"
                  onClick={handleShowPassword}
                />
              )}
            </div>
            <span>{errors.password?.message}</span>
          </label>
          <label>
            Confirmar Senha
            <Input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirme a sua senha"
            />
            <span>{errors.confirmPassword?.message}</span>
          </label>
          <label>
            Bio
            <Input
              {...register("bio")}
              type="text"
              placeholder="Fale sobre você"
            />
            <span>{errors.bio?.message}</span>
          </label>
          <label>
            Contato
            <Input
              {...register("contact")}
              type="text"
              placeholder="Opção de contato"
            />
            <span>{errors.contact?.message}</span>
          </label>
          <label>
            Selecionar módulo
            <ul>
              <li className="selectModule">
                {currentModule}
                {showModules ? (
                  <FaAngleUp onClick={handleShowModules} />
                ) : (
                  <FaAngleDown onClick={handleShowModules} />
                )}
              </li>
              {showModules && (
                <div className="modules">
                  <li onClick={handleSelectModule}>Primeiro módulo</li>
                  <li onClick={handleSelectModule}>Segundo módulo</li>
                  <li onClick={handleSelectModule}>Terceiro módulo</li>
                  <li onClick={handleSelectModule}>Quarto módulo</li>
                  <li onClick={handleSelectModule}>Quinto módulo</li>
                  <li onClick={handleSelectModule}>Sexto módulo</li>
                </div>
              )}
            </ul>
          </label>
          <ButtonPrimary type="submit" disabled={buttonTogle}>
            Registrar
          </ButtonPrimary>
        </form>
      </div>
    </Container>
  );
};

export default Register;
