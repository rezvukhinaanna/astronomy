import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { saveProductAsync } from "../../../../actions";
import styles from "./createProduct.module.css";
import book2 from "./book3.jpg";

export const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    imageUrl: "",
    category: "books",
    name: "",
    author: "",
    price: "",
    discount: "",
    material: "",
    year: "",
    pages: "",
    stars: "",
    reviews: "",
    details: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case "price":
        return !isNaN(value) && Number(value) > 0;
      case "year":
        return !value || !isNaN(value);
      case "pages":
        return !value || !isNaN(value);
      case "imageUrl":
        return value ? /^https?:\/\/.+\..+/.test(value) : false;
      case "name":
        return value.trim().length > 0;
      default:
        return true;
    }
  };

  const getFieldError = (name, value) => {
    if (!touched[name]) return null;

    if (!validateField(name, value)) {
      switch (name) {
        case "price":
          return "Please enter a valid positive number";
        case "imageUrl":
          return "Please enter a valid URL starting with http:// or https://";
        case "name":
          return "Product name is required";
        default:
          return "Invalid value";
      }
    }
    return null;
  };

  const isFormValid = () => {
    return (
      validateField("name", formData.name) &&
      validateField("price", formData.price) &&
      validateField("imageUrl", formData.imageUrl)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError("Please fill all required fields correctly");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Подготавливаем данные для бэкенда
      const productToSend = {
        image_url: formData.imageUrl,
        category: formData.category,
        name: formData.name,
        author: formData.author,
        price: Number(formData.price),
        discount: formData.discount ? Number(formData.discount) : undefined,
        material: formData.material,
        year: formData.year ? Number(formData.year) : undefined,
        pages: formData.pages ? Number(formData.pages) : undefined,
        stars: formData.stars ? Number(formData.stars) : undefined,
        reviews: formData.reviews ? Number(formData.reviews) : undefined,
        details: formData.details, // Оставляем как строку
        description: formData.description,
      };

      // Удаляем undefined поля
      const cleanedProduct = Object.fromEntries(
        Object.entries(productToSend).filter(([_, v]) => v !== undefined)
      );

      console.log("Sending product:", cleanedProduct);

      const result = await dispatch(saveProductAsync(null, cleanedProduct));

      if (result?.id) {
        navigate(`/product/${result.id}`);
      } else {
        throw new Error("Failed to create product");
      }
    } catch (err) {
      console.error("Error creating product:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to create product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(formData).some((val) => val !== "")) {
      if (
        window.confirm(
          "Are you sure you want to cancel? All changes will be lost."
        )
      ) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={styles.newproduct}>
      <h1>Create New Product</h1>

      {error && (
        <div className={styles.error}>
          <i className="fa fa-exclamation-circle" /> {error}
        </div>
      )}
      <div className={styles.error}>*All fields are required to be filled in</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.imagePreview}>
              <img
                src={formData.imageUrl || book2}
                alt="preview"
                className={styles.image}
                onError={(e) => {
                  e.target.src = book2;
                }}
              />
              {getFieldError("imageUrl", formData.imageUrl) && (
                <span className={styles.fieldError}>
                  {getFieldError("imageUrl", formData.imageUrl)}
                </span>
              )}
            </div>

            <label>Image URL</label>
            <input
              className={`${styles.insideInput} ${
                getFieldError("imageUrl", formData.imageUrl)
                  ? styles.errorInput
                  : ""
              }`}
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />

            <label>Category</label>
            <select
              className={styles.insideInput}
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="telescopes">Telescopes</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>

            <label>Product Name</label>
            <input
              className={`${styles.insideInput} ${
                getFieldError("name", formData.name) ? styles.errorInput : ""
              }`}
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product title"
              required
            />
            {getFieldError("name", formData.name) && (
              <span className={styles.fieldError}>
                {getFieldError("name", formData.name)}
              </span>
            )}

            <label>Author</label>
            <input
              className={styles.insideInput}
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
            />

            <label>Price</label>
            <input
              className={`${styles.insideInput} ${
                getFieldError("price", formData.price) ? styles.errorInput : ""
              }`}
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
            {getFieldError("price", formData.price) && (
              <span className={styles.fieldError}>
                {getFieldError("price", formData.price)}
              </span>
            )}

            <label>Discount Price</label>
            <input
              className={styles.insideInput}
              name="discount"
              type="number"
              min="0"
              step="0.01"
              value={formData.discount}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className={styles.right}>
            <label>Material</label>
            <input
              className={styles.insideInput}
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="e.g. Hardcover, Paperback"
            />

            <label>Publication Year</label>
            <input
              className={styles.insideInput}
              name="year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.year}
              onChange={handleChange}
              placeholder="YYYY"
            />

            <label>Number of Pages</label>
            <input
              className={styles.insideInput}
              name="pages"
              type="number"
              min="1"
              value={formData.pages}
              onChange={handleChange}
              placeholder="0"
            />

            <label>Star Rating (1-5)</label>
            <input
              className={styles.insideInput}
              name="stars"
              type="number"
              min="1"
              max="5"
              value={formData.stars}
              onChange={handleChange}
              placeholder="0"
            />

            <label>Number of Reviews</label>
            <input
              className={styles.insideInput}
              name="reviews"
              type="number"
              min="0"
              value={formData.reviews}
              onChange={handleChange}
              placeholder="0"
            />

            <label>Details</label>
            <input
              className={styles.insideInput}
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Feature 1, Feature 2, ..."
            />

            <label>Description</label>
            <textarea
              className={styles.descriptionInput}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed description..."
              rows="5"
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <button
            type="submit"
            className={styles.save}
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <>
                <i className="fa fa-spinner fa-spin" /> Saving...
              </>
            ) : (
              "Save Product"
            )}
          </button>
          <button
            type="button"
            className={styles.cancel}
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
