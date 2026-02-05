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
        const fetchCategories = async () => {
            const data = [
                "Диван", "Стілець", "Мікрохвильовка", "Телевізор", "Крісло",
                "Ліжко", "Тумбочка", "Холодильник", "Стіл", "Лампа", "Килим",
                "Шафа", "Письмовий стіл", "Полиця", "Тумба"
            ];
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleModel = (e) => {
        const file = e.target.files[0];
        setPreview(URL.createObjectURL(file));
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setImagesPreview(files.map(f => URL.createObjectURL(f)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCategory) return alert("Оберіть категорію");

        const formData = new FormData();
        const objectData = {
            name: e.target.name.value,
            object_name: e.target.object_name.value,
            width: e.target.width.value,
            height: e.target.height.value,
            length: e.target.length.value,
            category: selectedCategory,
            modelPreview: preview,
            imagesPreview: imagesPreview
        };

        formData.append("name", objectData.name);
        formData.append("object_name", objectData.object_name);
        formData.append("width", objectData.width);
        formData.append("height", objectData.height);
        formData.append("length", objectData.length);
        formData.append("category", objectData.category);
        formData.append("model", e.target.model.files[0]);
        for (let img of e.target.images.files) {
            formData.append("images", img);
        }

        const response = await fetch("https://friend-api.com/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Відправлено!");
            setObjects(prev => [...prev, objectData]);
            e.target.reset();
            setPreview(null);
            setImagesPreview([]);
            setSelectedCategory("");
            setDropdownOpen(false);
        } else {
            alert("Помилка при відправці");
        }
    };

    return (
        <div>
            <form className="upload-form" onSubmit={handleSubmit}>
                <h2>Завантажити 3D Об'єкт</h2>

                <input name="name" placeholder="Ім'я" required/>
                <input name="object_name" placeholder="Назва об'єкта" required/>

                <div className="row">
                    <input name="width" type="number" placeholder="Ширина"/>
                    <input name="height" type="number" placeholder="Висота"/>
                    <input name="length" type="number" placeholder="Довжина"/>
                </div>

                {/* Кастомний випадаючий список */}
                <div className="custom-select" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <div className="selected">{selectedCategory || "Оберіть категорію"}</div>
                    {dropdownOpen && (
                        <div className="options">
                            {categories.map((cat, i) => (
                                <div
                                    key={i}
                                    onClick={() => { setSelectedCategory(cat); setDropdownOpen(false); }}
                                    className="option"
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <p>Файл формату .glb</p>
                <input type="file" name="model" accept=".glb" onChange={handleModel} required/>
                <p>Фото для превʼю</p>
                <input type="file" name="images" accept="image/*" multiple onChange={handleImages}/>

                {preview && <p className="preview-text">✔ Файл GLB вибрано</p>}

                <div className="image-preview">
                    {imagesPreview.map((src, i) => (
                        <img key={i} src={src} alt={`preview-${i}`} />
                    ))}
                </div>

                <button>Відправити</button>
            </form>

            {}
            {objects.length > 0 && (
                <div className="objects-table">
                    <h3>Завантажені об'єкти</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Ім'я</th>
                            <th>Об'єкт</th>
                            <th>Розміри (ШxВxД)</th>
                            <th>Категорія</th>
                            <th>Модель</th>
                            <th>Фото</th>
                        </tr>
                        </thead>
                        <tbody>
                        {objects.map((obj, i) => (
                            <tr key={i}>
                                <td>{obj.name}</td>
                                <td>{obj.object_name}</td>
                                <td>{obj.width} x {obj.height} x {obj.length}</td>
                                <td>{obj.category}</td>
                                <td>{obj.modelPreview ? <span>✔</span> : ""}</td>
                                <td>
                                    {obj.imagesPreview.map((img, j) => (
                                        <img key={j} src={img} alt={`img-${j}`} style={{width: "50px", marginRight: "5px"}} />
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
