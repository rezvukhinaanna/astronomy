import styles from "./modal.module.css";

export const Modal = ({ text, onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <p className={styles.modalText}>{text}</p>
          <div className={styles.modalButtons}>
            <button className={styles.cancelButton} onClick={onCancel}>
              Cancel
            </button>
            <button className={styles.confirmButton} onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
