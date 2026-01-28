import { useState, useRef } from "react";
import "./App.css";

export default function App() {
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [error, setError] = useState(""); // 👈 popup message

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setPreview("");
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const resizeImage = () => {
    if (!image) {
      setError("Please upload an image.");
      return;
    }

    if (width === "" && height === "") {
      setError("Width and Height are required.");
      return;
    }

    if (width === "") {
      setError("Width is required.");
      return;
    }

    if (height === "") {
      setError("Height is required.");
      return;
    }

    setError(""); // clear popup

    const img = new Image();
    img.src = image;

    img.onload = () => {
      const finalWidth = parseInt(width, 10);
      const finalHeight = parseInt(height, 10);

      const canvas = document.createElement("canvas");
      canvas.width = finalWidth;
      canvas.height = finalHeight;

      canvas
        .getContext("2d")
        .drawImage(img, 0, 0, finalWidth, finalHeight);

      setPreview(canvas.toDataURL("image/jpeg", 0.9));
    };
  };

  const resetAll = () => {
    setImage(null);
    setPreview("");
    setWidth("");
    setHeight("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>🖼️ Image Resizer</h1><br></br>
        {/* <p className="subtitle">Dark mode · Centered · No backend</p> */}

        {/* Upload box */}
        <label className="upload-box">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />

          {image ? (
            <img
              src={preview || image}
              alt="preview"
              className="upload-preview"
            />
          ) : (
            <span>Click to upload image</span>
          )}
        </label>

        {/* 🔔 Popup message */}
        {error && <div className="popup">{error}</div>}

        <div className="inputs">
          <div>
            <label>Width (px)</label>
            <input
              type="number"
              placeholder="300"
              value={width}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) setWidth(val);
              }}
            />
          </div>

          <div>
            <label>Height (px)</label>
            <input
              type="number"
              placeholder="300"
              value={height}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) setHeight(val);
              }}
            />
          </div>
        </div>

        <div className="actions">
          <button onClick={resizeImage}>
            Resize Image
          </button>

          <button
            className="reset-btn"
            onClick={resetAll}
          >
            Reset
          </button>
        </div>

        {preview && (
          <div className="preview">
            <a href={preview} download="resized-image.jpg">
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}