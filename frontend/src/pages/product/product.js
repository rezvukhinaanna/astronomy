import { useEffect, useState } from "react";
import { useMatch, useParams } from "react-router";
import { CreateProduct, EditProduct, ContentProduct } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { selectProduct } from "../../selectors";
import { loadProductAsync } from "../../actions";
import { Loader } from "../../components"; // Импортируем Loader

export const Product = () => {
  const isCreating = !!useMatch("/product");
  const isEditing = !!useMatch("/product/:id/edit");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!isCreating); // Для создания не нужна загрузка
  const product = useSelector(selectProduct);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    if (isCreating) {
      return;
    }

    setIsLoading(true); // Показываем лоадер перед загрузкой
    dispatch(loadProductAsync(params.id))
      .then((productData) => {
        setError(productData.error);
      })
      .finally(() => {
        setIsLoading(false); // Скрываем лоадер после загрузки
      });
  }, [isCreating, params.id, dispatch]);

  if (error) {
    return <div error={error} />;
  }

  if (isLoading) {
    return <Loader />; // Показываем лоадер во время загрузки
  }

  return (
    <>
      {isCreating ? (
        <CreateProduct />
      ) : isEditing ? (
        <EditProduct product={product} />
      ) : (
        <ContentProduct product={product} />
      )}
    </>
  );
};