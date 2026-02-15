import { useState, useEffect } from "react";
import "../styles/CRUDModal.css";

function CRUDModal({ isOpen, onClose, mode, type, data, onSave }) {
  // Catatan: prop 'type' di atas adalah tipe modal (user/course), jangan bingung dengan kolom database 'type'

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    role: "client",
    status: "active",
    title: "",
    description: "",
    price: "",
    image: null,
    type: "", // <--- Ganti category jadi type
  });

  useEffect(() => {
    if (data && (mode === "edit" || mode === "delete")) {
      setFormData({
        ...data,
        image: null,
        type: data.type || data.category || "", // Handle jika data lama masih pakai nama key category
      });
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        role: "client",
        status: "active",
        title: "",
        description: "",
        price: "",
        image: null,
        type: "", // Reset type
      });
    }
  }, [data, mode, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  // ... (Bagian Header & Delete logic sama seperti sebelumnya) ...

  return (
    <div className="crud-modal-overlay" onClick={onClose}>
      <div className="crud-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="crud-modal-header">
          <h2>
            {mode === "create" ? "Add" : mode === "edit" ? "Edit" : "Delete"}{" "}
            {type === "user" ? "User" : "Course"}
          </h2>
          <button className="crud-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {mode === "delete" ? (
          <div className="crud-modal-body">
            <p>Are you sure you want to delete?</p>
            <div className="delete-actions">
              <button className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn-delete"
                onClick={() => {
                  onSave(data);
                  onClose();
                }}>
                Delete
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="crud-modal-body">
              {type === "user" ? (
                <div>{/* Form User Tetap */}</div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Course Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="4"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      onChange={(e) => {
                        const value = e.target.value;

                        // hanya izinkan angka
                        if (/^\d*$/.test(value)) {
                          handleChange(e);
                        }
                      }}
                      onKeyDown={(e) => {
                        // cegah karakter selain angka
                        if (
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+" ||
                          e.key === "-" ||
                          e.key === "." ||
                          e.key === ","
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  {/* --- INPUT TYPE (DULU CATEGORY) --- */}
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required>
                      <option value="" disabled>
                        Select Type
                      </option>
                      <option value="ar-vr">AR/VR</option>
                      <option value="animation">Animation</option>
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Course Image (Upload)</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      className="file-input"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="crud-modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CRUDModal;
