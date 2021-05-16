import React, { FunctionComponent } from "react";
import auth from '../../store/auth';
import styled from "styled-components";



import { AuthPage } from "../../pages/auth";

const Auth: FunctionComponent = () => {
  const handleUserNameSelection = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <AuthPage>
      <form onSubmit={handleUserNameSelection}>
        <input type="text" placeholder="Введите своё имя" />
        <input type="submit" value="Отправить" />
      </form>
    </AuthPage>
  );
};
export default Auth;
