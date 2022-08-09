import React, { useState } from "react";
import { ButtonPrimary, ButtonSecondary, Input } from "../../styles/Global";
import { useForm } from "react-hook-form";
import { Container } from "./styles";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useHistory } from "react-router-dom";
import api from "../../Services/api";
import { toast } from "react-toastify";
import { setUser } from "../../store/modules/user/actions";
import { useDispatch } from "react-redux";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  if (localStorage.getItem("token")) {
    const user = JSON.parse(localStorage.getItem("user"));

    history.push(`/home/${user.name}`);
  }
  function handleShowPassword() {
    setShowPassword(!showPassword);
  }

  const schema = yup.object().shape({
    email: yup.string().email("Insira um email valido"),
    password: yup
      .string()
      .required("Insira a sua senha")
      .min(6, "A senha contem no minimo 6 caracteres"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const dispatch = useDispatch();
  const signUp = (data) => {
    if (!localStorage.getItem("token")) {
      api
        .post("/sessions", data)
        .then((response) => {
          const user = response.data.user.name
            .split(" ")
            .join("-")
            .toLowerCase();

          localStorage.setItem("token", response.data.token);

          dispatch(setUser(response.data.user));
          localStorage.setItem("user", JSON.stringify(response.data.user));

          toast.success("Login realizado com sucesso");

          setTimeout(() => history.push(`/home/${user}`), 2500);
        })
        .catch((error) => {
          toast.error("Email ou senha incorretos");
        });
    } else {
      toast.info("Você já está logado");
    }
  };

  function handleClickRegister() {
    history.push("/register");
  }

  return (
    <Container>
      <h1>Kenzie Hub</h1>
      <div className="containerLogin">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(signUp)}>
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
                <AiFillEyeInvisible onClick={handleShowPassword} />
              ) : (
                <AiFillEye onClick={handleShowPassword} />
              )}
            </div>
            <span>{errors.password?.message}</span>
          </label>
          <ButtonPrimary type="submit">Entrar</ButtonPrimary>
        </form>

        <p>Ainda não possui uma conta?</p>
        <ButtonSecondary width="90%" onClick={handleClickRegister}>
          Cadastre-se
        </ButtonSecondary>
      </div>
    </Container>
  );
};

export default Login;
