import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import styles from "./editProduct.module.css";
import { saveProductAsync } from "../../../../actions";

export const EditProduct = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({ ...product });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        details: Array.isArray(product.details)
          ? product.details.join(", ")
          : product.details,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "price",
      "discount",
      "year",
      "pages",
      "stars",
      "reviews",
    ];
    const newValue = numericFields.includes(name) ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Подготавливаем данные для бэкенда
      const productToSend = {
        image_url: formData.imageUrl,
        category: formData.category,
        name: formData.name,
        author: formData.author,
        price: formData.price,
        discount: formData.discount,
        material: formData.material,
        year: formData.year,
        pages: formData.pages,
        stars: formData.stars,
        reviews: formData.reviews,
        details: formData.details,
        description: formData.description,
      };

      // Удаляем undefined/пустые поля
      const cleanedProduct = Object.fromEntries(
        Object.entries(productToSend).filter(
          ([_, v]) => v !== undefined && v !== ""
        )
      );

      console.log("Sending update:", cleanedProduct);

      const result = await dispatch(saveProductAsync(id, cleanedProduct));

      if (result?.error) {
        throw new Error(result.error);
      }

      navigate(`/product/${id}`);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className={styles.newproduct}>
      <h1>Edit Product</h1>

      {error && (
        <div className={styles.error}>
          <i className="fa fa-exclamation-circle" /> {error}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.content}>
          <div className={styles.left}>
            <label>Image URL*</label>
            <input
              className={styles.insideInput}
              name="imageUrl"
              value={formData.imageUrl || ""}
              onChange={handleChange}
              placeholder="Enter image url"
              required
            />

            <label>Category</label>
            <select
              className={styles.insideInput}
              name="category"
              value={formData.category || "books"}
              onChange={handleChange}
              required
            >
              <option value="telescopes">Telescopes</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>

            <label>Product Name*</label>
            <input
              className={styles.insideInput}
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Enter product title"
              required
            />

            <label>Author</label>
            <input
              className={styles.insideInput}
              name="author"
              value={formData.author || ""}
              onChange={handleChange}
              placeholder="Enter product author"
            />

            <label>Price*</label>
            <input
              className={styles.insideInput}
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price || ""}
              onChange={handleChange}
              placeholder="Enter product price"
              required
            />

            <label>Discount Price</label>
            <input
              className={styles.insideInput}
              name="discount"
              type="number"
              min="0"
              step="0.01"
              value={formData.discount || ""}
              onChange={handleChange}
              placeholder="Enter product discount"
            />

            <label>Material</label>
            <input
              className={styles.insideInput}
              name="material"
              value={formData.material || ""}
              onChange={handleChange}
              placeholder="Enter product material"
            />
          </div>

          <div className={styles.right}>
            <label>Publication Year</label>
            <input
              className={styles.insideInput}
              name="year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.year || ""}
              onChange={handleChange}
              placeholder="Enter year of product"
            />

            <label>Number of Pages</label>
            <input
              className={styles.insideInput}
              name="pages"
              type="number"
              min="1"
              value={formData.pages || ""}
              onChange={handleChange}
              placeholder="Enter number of pages"
            />

            <label>Star Rating (1-5)</label>
            <input
              className={styles.insideInput}
              name="stars"
              type="number"
              min="1"
              max="5"
              value={formData.stars || ""}
              onChange={handleChange}
              placeholder="Enter number of stars"
            />

            <label>Number of Reviews</label>
            <input
              className={styles.insideInput}
              name="reviews"
              type="number"
              min="0"
              value={formData.reviews || ""}
              onChange={handleChange}
              placeholder="Enter number of reviews"
            />

            <label>Details (comma separated)</label>
            <input
              className={styles.insideInput}
              name="details"
              value={formData.details || ""}
              onChange={handleChange}
              placeholder="Feature 1, Feature 2, ..."
            />

            <label>Description</label>
            <textarea
              className={styles.descriptionInput}
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Enter description"
              rows="5"
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.save} disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fa fa-spinner fa-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
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
