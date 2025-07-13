import styles from "./authorisation.module.css";
import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { setUser } from "../../actions";
import { request } from "../../utils/request";
import { Navigate } from "react-router";
import { toast } from "react-toastify";
import { Loader } from "../../components";

const authFormSchema = yup.object().shape({
  email: yup
    .string()
    .required("Please enter your email address")
    .email("Enter the correct email address"),
  password: yup
    .string()
    .required("Fill in the password")
    .matches(
      /^[\w#%]+$/,
      "The password can contain only letters, numbers, and # and characters. %"
    )
    .min(6, "Minimum of 6 characters")
    .max(30, "Maximum of 30 characters"),
});

export const Authorisation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(authFormSchema),
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const [serverError, setServerError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const onSubmit = ({email, password }) => {
    setIsLoading(true); 
    request("/login", "POST", { email, password }).then(({ error, user }) => {
      setIsLoading(false);
      
      if (error) {
        setServerError(`Ошибка: ${error}`);
        return;
      }

      dispatch(setUser(user));
      sessionStorage.setItem("userData", JSON.stringify(user));
      toast.success("You have successfully logged in!", {
        position: "top-right",
        autoClose: 5000,
        style: {
          minWidth: "300px",
          fontSize: "20px",
        },
      });
      setIsLoggedIn(true);
    });
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.authorisation}>
      {isLoading && <Loader />}
      
      <h1 className={styles.title}>Log In</h1>

      {(serverError || errors.email || errors.password) && (
        <div className={styles.error}>
          {errors.email?.message ||
            errors.password?.message ||
            serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label className={styles.label} htmlFor="email">
          Email address
        </label>
        <input
          type="email"
          placeholder="Email..."
          autoComplete="email"
          {...register("email", {
            onChange: () => setServerError(null),
          })}
          className={styles.input}
        />

        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Пароль..."
            autoComplete="current-password"
            {...register("password", {
              onChange: () => setServerError(null),
            })}
            className={styles.input}
          />
          <button
            type="button"
            className={styles.showInside}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          className={styles.loginBtn}
          disabled={!isValid || isLoading}
        >
          {isLoading ? "Processing..." : "Log in"}
        </button>

        {/* <a href="/register" className={styles.forgot}>
          Not registered yet? Sign up
        </a> */}
      </form>
    </div>
  );
};