import { useState, useEffect } from 'react'
import '../styles/CRUDModal.css'

function CRUDModal({ isOpen, onClose, mode, type, data, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'client',
        status: 'active',
        title: '',
        description: '',
        price: '',
        image: '',
        category: ''
    })

    useEffect(() => {
        if (data && mode === 'edit') {
            setFormData(data)
        } else {
            // Reset form for create mode
            setFormData({
                name: '',
                email: '',
                role: 'client',
                status: 'active',
                title: '',
                description: '',
                price: '',
                image: '',
                category: ''
            })
        }
    }, [data, mode, isOpen])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
        onClose()
    }

    if (!isOpen) return null

    const getTitle = () => {
        if (mode === 'create') {
            return type === 'user' ? 'Add New User' : 'Add New Course'
        } else if (mode === 'edit') {
            return type === 'user' ? 'Edit User' : 'Edit Course'
        } else {
            return type === 'user' ? 'Delete User' : 'Delete Course'
        }
    }

    return (
        <div className="crud-modal-overlay" onClick={onClose}>
            <div className="crud-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="crud-modal-header">
                    <h2>{getTitle()}</h2>
                    <button className="crud-close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {mode === 'delete' ? (
                    <div className="crud-modal-body">
                        <div className="delete-confirmation">
                            <i className="fas fa-exclamation-triangle"></i>
                            <h3>Are you sure?</h3>
                            <p>
                                This action cannot be undone. This will permanently delete the {type}
                                {data && (type === 'user' ? ` "${data.name}"` : ` "${data.title}"`)}
                            </p>
                            <div className="delete-actions">
                                <button className="btn-cancel" onClick={onClose}>

                                    No, Cancel
                                </button>
                                <button className="btn-delete" onClick={() => {
                                    onSave(data)
                                    onClose()
                                }}>

                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="crud-modal-body">
                            {type === 'user' ? (
                                <>
                                    <div className="form-group">
                                        <label>Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Role *</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="client">Client</option>
                                            <option value="mentor">Mentor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Status *</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label>Course Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter course title"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter course description"
                                            rows="4"
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label>Price *</label>
                                        <input
                                            type="text"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Rp 1,250,000"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="ar-vr">AR/VR</option>
                                            <option value="animation">Animation</option>
                                            <option value="programming">Programming</option>
                                            <option value="design">Design</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Image URL</label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            placeholder="/images/products/course.jpg"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="crud-modal-footer">
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                <i className="fas fa-times"></i>
                                Cancel
                            </button>
                            <button type="submit" className="btn-save">
                                <i className="fas fa-check"></i>
                                {mode === 'create' ? 'Create' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default CRUDModal
