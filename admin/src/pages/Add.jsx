import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import {backendUrl} from '../App'
import { toast } from "react-toastify";

const Add = ({token}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState("");
  const [sizes, setSizes] = useState([]);

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const handleImageChange = (key, event) => {
    const file = event.target.files[0];
    if (file) {
      setImages((prev) => ({ ...prev, [key]: file }));
      event.target.value = ""; // Force reset of the input field
    }
  };

  const handleImageRemove = (key) => {
    if (images[key]) URL.revokeObjectURL(images[key]); // Free memory
    setImages((prev) => ({ ...prev, [key]: null }));
  };

  const getImageSrc = (key) =>
    images[key] ? URL.createObjectURL(images[key]) : assets.upload_area;

  const renderImageCard = ([key, value]) => {
    return (
      <div key={key} className="relative">
        {value && <RemoveButton onRemove={() => handleImageRemove(key)} />}
        <label htmlFor={key}>
          <img
            className="w-20 h-20 object-cover"
            src={getImageSrc(key)}
            alt={`Upload ${key}`}
          />
          <input
            id={key}
            type="file"
            hidden
            onChange={(e) => handleImageChange(key, e)}
          />
        </label>
      </div>
    );
  };

  const RemoveButton = ({ onRemove }) => (
    <button
      onClick={onRemove}
      className="absolute -top-2 -right-2 bg-red-500 text-white 
                 rounded-full shadow-lg"
      aria-label="Remove Image"
    >
      <img className="w-4 h-4" src={assets.delete_icon} alt="Delete icon" />
    </button>
  );

  const onSelectSizes = (value) => {
    setSizes((prev) => {
      if (prev.includes(value)) {
        const newSizes = prev.filter((item) => item !== value);
        return newSizes;
      } else {
        return [...prev, value];
      }
    });
  };

  const renderBgOnSelectedSize = (value) => {
    if (sizes.includes(value)) return "bg-pink-100 px-3 py-1 cursor-pointer";
    else return "bg-slate-200 px-3 py-1 cursor-pointer";
  };

  useEffect(() => {
    return () => {
      Object.values(images).forEach((file) => {
        if (file) URL.revokeObjectURL(file);
      });
    };
  }, [images]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      images.image1 && formData.append("image1", images.image1);
      images.image2 && formData.append("image2", images.image2);
      images.image3 && formData.append("image3", images.image3);
      images.image4 && formData.append("image4", images.image4);

      const response = await axios.post(backendUrl + "/api/product/add", formData, {headers: {token}})

      if(response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setPrice('')
        setImages({
          image1: null,
          image2: null,
          image3: null,
          image4: null,
        })
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-4">
          {/* Using Object.entries(images):
          This returns an array of [key, value] pairs from the images state. Each pair contains:
          key: The image identifier ("image1", "image2", etc.)
          value: The corresponding file object or null. */}

          {/* sort the keys inside Object.entries() to preserve the order */}
          {Object.entries(images)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(renderImageCard)}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write content here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-6">
        <div>
          <p className="mb-2">Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          <div onClick={() => onSelectSizes("S")}>
            <p className={renderBgOnSelectedSize("S")}>S</p>
          </div>
          <div onClick={() => onSelectSizes("M")}>
            <p className={renderBgOnSelectedSize("M")}>M</p>
          </div>
          <div onClick={() => onSelectSizes("L")}>
            <p className={renderBgOnSelectedSize("L")}>L</p>
          </div>
          <div onClick={() => onSelectSizes("XL")}>
            <p className={renderBgOnSelectedSize("XL")}>XL</p>
          </div>
          <div onClick={() => onSelectSizes("XXL")}>
            <p className={renderBgOnSelectedSize("XXL")}>XXL</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          {" "}
          Add to bestseller
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
