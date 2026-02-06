import './App.css';
import { useState, useEffect } from "react";

export default function UploadForm() {
    const [preview, setPreview] = useState(null);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [objects, setObjects] = useState([]);
    const [filterCategory, setFilterCategory] = useState("all");

    useEffect(() => {
        setCategories([
            "Диван", "Стілець", "Мікрохвильовка", "Телевізор", "Крісло",
            "Ліжко", "Тумбочка", "Холодильник", "Стіл", "Лампа", "Килим",
            "Шафа", "Письмовий стіл", "Полиця", "Тумба"
        ]);
    }, []);

    useEffect(() => {
        fetch("http://localhost:3001/admin")
            .then(res => res.json())
            .then(data => setObjects(data))
            .catch(err => console.error("Ошибка загрузки:", err));
    }, []);

    const handleModel = (e) => {
        const file = e.target.files[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setImagesPreview(files.map(f => URL.createObjectURL(f)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCategory) return alert("Оберіть категорію");

        const formData = new FormData();
        formData.append("name", e.target.name.value);
        formData.append("object_name", e.target.object_name.value);
        formData.append("width", e.target.width.value);
        formData.append("height", e.target.height.value);
        formData.append("length", e.target.length.value);
        formData.append("category", selectedCategory);
        formData.append("model", e.target.model.files[0]);

        for (let img of e.target.images.files) {
            formData.append("images", img);
        }

        const response = await fetch("http://localhost:3001/admin/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const newObject = await response.json();
            setObjects(prev => [...prev, newObject]);

            e.target.reset();
            setPreview(null);
            setImagesPreview([]);
            setSelectedCategory("");
            setDropdownOpen(false);
        } else {
            alert("Помилка при відправці");
        }
    };

    const filteredObjects =
        filterCategory === "all"
            ? objects
            : objects.filter(obj => obj.category === filterCategory);

    return (
        <div>
            <form className="upload-form" onSubmit={handleSubmit}>
                <h2>Завантажити 3D Об'єкт</h2>

                <input name="name" placeholder="Ім'я" required />
                <input name="object_name" placeholder="Назва об'єкта" required />

                <div className="row">
                    <input name="width" type="number" placeholder="Ширина" />
                    <input name="height" type="number" placeholder="Висота" />
                    <input name="length" type="number" placeholder="Довжина" />
                </div>

                <div className="custom-select" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <div className="selected">
                        {selectedCategory || "Оберіть категорію"}
                    </div>
                    {dropdownOpen && (
                        <div className="options">
                            {categories.map((cat, i) => (
                                <div
                                    key={i}
                                    className="option"
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <p>Файл формату .glb</p>
                <input type="file" name="model" accept=".glb" onChange={handleModel} required />

                <p>Фото</p>
                <input type="file" name="images" accept="image/*" multiple onChange={handleImages} />

                {preview && <p className="preview-text">✔ GLB вибрано</p>}

                <div className="image-preview">
                    {imagesPreview.map((src, i) => (
                        <img key={i} src={src} alt="" />
                    ))}
                </div>

                <button>Відправити</button>
            </form>

            {objects.length > 0 && (
                <div className="filter">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="all">Всі категорії</option>
                        {categories.map((cat, i) => (
                            <option key={i} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            )}

            {filteredObjects.length > 0 && (
                <div className="objects-table">
                    <h3>Завантажені об'єкти</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Ім'я</th>
                            <th>Об'єкт</th>
                            <th>Розміри</th>
                            <th>Категорія</th>
                            <th>GLB</th>
                            <th>Фото</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredObjects.map((obj, i) => (
                            <tr key={i}>
                                <td>{obj.name}</td>
                                <td>{obj.object_name}</td>
                                <td>{obj.width}×{obj.height}×{obj.length}</td>
                                <td>{obj.category}</td>
                                <td>{obj.glb_path ? "✔" : ""}</td>
                                <td>
                                    {obj.images?.map((img, j) => (
                                        <img
                                            key={j}
                                            src={`http://localhost:3001/${img}`}
                                            style={{ width: 40, marginRight: 4 }}
                                        />
                                    ))}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
