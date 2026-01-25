import { useState } from "react";

export default function UploadForm() {
  const [preview, setPreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);

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

    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("object_name", e.target.object_name.value);
    formData.append("width", e.target.width.value);
    formData.append("height", e.target.height.value);
    formData.append("length", e.target.length.value);

    formData.append("model", e.target.model.files[0]);

    for (let img of e.target.images.files) {
      formData.append("images", img);
    }

    await fetch("http://localhost:3001/admin/upload", {
      method: "POST",
      body: formData,
    });

    alert("Sent!");
  };

  return (
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Your name" required />
        <input name="object_name" placeholder="Object name" required />

        <input name="width" type="number" placeholder="Width" />
        <input name="height" type="number" placeholder="Height" />
        <input name="length" type="number" placeholder="Length" />

        <input type="file" name="model" accept=".glb" onChange={handleModel} required />
        <input type="file" name="images" accept="image/*" multiple onChange={handleImages} />

        {preview && <p>GLB selected</p>}

        {imagesPreview.map((src, i) => (
            <img key={i} src={src} width={100} />
        ))}

        <button>Send</button>
      </form>
  );
}
