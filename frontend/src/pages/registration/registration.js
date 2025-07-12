import styles from "./registration.module.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { setUser } from "../../actions";
import { request } from "../../utils/request";
import { useState } from "react";
import { Navigate } from "react-router";
import { toast } from "react-toastify";
import { Loader } from "../../components"; // Импорт компонента Loader

// Валидационная схема
const regFormSchema = yup.object().shape({
  name: yup
    .string()
    .required("Fill in the name")
    .min(3, "The name must contain at least 3 characters.")
    .max(20, "The name must contain a maximum of 20 characters."),
  email: yup
    .string()
    .required("Fill in the email")
    .email("Enter the correct email address"),
  password: yup
    .string()
    .required("Fill in the password")
    .matches(
      /^[\w#%]+$/,
      "A password can contain only letters, numbers, and signs. #, %"
    )
    .min(6, "The password must contain at least 6 characters.")
    .max(30, "The password must contain a maximum of 30 characters."),
});

export const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(regFormSchema),
    mode: "onChange",
  });

  const [serverError, setServerError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Состояние для лоадера
  const dispatch = useDispatch();

  const onSubmit = async ({ name, email, password }) => {
    setIsLoading(true); // Показываем лоадер перед отправкой
    try {
      const { error, user } = await request("/register", "POST", {
        name,
        email,
        password,
      });

      if (error) {
        if (error.includes("E11000 duplicate key error")) {
          if (error.includes("name_1")) {
            setServerError("A user with that name already exists");
          } else if (error.includes("email_1")) {
            setServerError("The user with this email already exists");
          } else {
            setServerError("A user with such data already exists");
          }
        } else {
          setServerError(`Error: ${error}`);
        }
        return;
      }

      dispatch(setUser(user));
      sessionStorage.setItem("userData", JSON.stringify(user));
      toast.success("You have successfully registered!", {
        position: "top-right",
        autoClose: 5000,
        style: {
          minWidth: "300px",
          fontSize: "20px",
        },
      });
      setIsRegistered(true);
    } catch (err) {
      setServerError("Error when submitting the form");
      toast.error("Error when submitting the form", {
        position: "top-right",
        autoClose: 5000,
        style: {
          minWidth: "300px",
          fontSize: "20px",
        },
      });
    } finally {
      setIsLoading(false); // Скрываем лоадер в любом случае
    }
  };

  if (isRegistered) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.registration}>
      {isLoading && <Loader />} {/* Отображаем лоадер при загрузке */}
      
      <h1 className={styles.title}>Sign up</h1>

      {(serverError || errors.name || errors.email || errors.password) && (
        <div className={styles.error}>
          {errors.name?.message ||
            errors.email?.message ||
            errors.password?.message ||
            serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          placeholder="Name..."
          autoComplete="username"
          {...register("name", {
            onChange: () => setServerError(null),
          })}
          className={styles.input}
        />

        <label className={styles.label}>Email</label>
        <input
          type="email"
          placeholder="Email..."
          autoComplete="email"
          {...register("email", {
            onChange: () => setServerError(null),
          })}
          className={styles.input}
        />

        <label className={styles.label}>Password</label>
        <input
          type="password"
          placeholder="Пароль..."
          autoComplete="new-password"
          {...register("password", {
            onChange: () => setServerError(null),
          })}
          className={styles.input}
        />

        <button 
          type="submit" 
          className={styles.signBtn} 
          disabled={!isValid || isLoading} // Блокируем кнопку при загрузке
        >
          {isLoading ? "Processing..." : "Sign up"} {/* Меняем текст при загрузке */}
        </button>

        <a href="/login" className={styles.forgot}>
          Do you already have an account? Log in
        </a>
      </form>
    </div>
  );
};