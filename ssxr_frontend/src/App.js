import './App.css';
import { useState, useEffect } from "react";

export default function UploadForm() {
    const [preview, setPreview] = useState(null);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [objects, setObjects] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        setCategories([
            "Диван", "Стілець", "Мікрохвильовка", "Телевізор", "Крісло",
            "Ліжко", "Тумбочка", "Холодильник", "Стіл", "Лампа", "Килим",
            "Шафа", "Письмовий стіл", "Полиця", "Тумба"
        ]);
    }, []);

    const fetchObjects = async () => {
        const res = await fetch("http://localhost:3001/admin");
        const data = await res.json();
        setObjects(data);
    };

    useEffect(() => {
        fetchObjects();
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

        if (!selectedCategory) {
            alert("Оберіть категорію");
            return;
        }

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
            e.target.reset();
            setPreview(null);
            setImagesPreview([]);
            setSelectedCategory("");
            setDropdownOpen(false);
            await fetchObjects();
        } else {
            alert("Помилка при відправці");
        }
    };

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

                <div className="custom-select">
                    <div
                        className="selected"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
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

                <p>Фото для превʼю</p>
                <input type="file" name="images" accept="image/*" multiple onChange={handleImages} />

                {preview && <p className="preview-text">✔ GLB вибрано</p>}

                <div className="image-preview">
                    {imagesPreview.map((src, i) => (
                        <img key={i} src={src} alt={`preview-${i}`} />
                    ))}
                </div>

                <button>Відправити</button>
            </form>

            {objects.length > 0 && (
                <div className="objects-table">
                    <h3>Завантажені об'єкти</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Ім'я</th>
                            <th>Об'єкт</th>
                            <th>Розміри</th>
                            <th>Категорія</th>
                            <th>Модель</th>
                            <th>Фото</th>
                        </tr>
                        </thead>
                        <tbody>
                        {objects.map((obj) => (
                            <tr key={obj.id}>
                                <td>{obj.name}</td>
                                <td>{obj.object_name}</td>
                                <td>{obj.width} x {obj.height} x {obj.length}</td>
                                <td>{obj.category}</td>
                                <td>✔</td>
                                <td>
                                    {obj.images?.map((img, i) => (
                                        <img
                                            key={i}
                                            src={`http://localhost:3001/${img}`}
                                            alt=""
                                            style={{ width: 50, marginRight: 5 }}
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
