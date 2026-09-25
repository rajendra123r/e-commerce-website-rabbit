import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails, updateProduct } from "../../redux/features/products/productsThunk"

const EditProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { selectedProduct, loading, error } = useSelector((state) => state.products)
    const [productData, setProductData] = useState({
        name: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        description: "",
        images: [],
});
const [uploading, setUploading] = useState([]); // Image uploading state

useEffect(() => {
    if(id){
        dispatch(fetchProductDetails(id))
    }
}, [dispatch, id]);

// Set fetched product data
useEffect(() => {
    if(selectedProduct){
        setProductData(selectedProduct)
    }
}, [selectedProduct]);

// Normal input change
const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name] : value}))
}

// Image select
const handleImageUpload = async (e) => {
   const files = Array.from(e.target.files);
     setUploading((prevFiles) => [
        ...prevFiles,
        ...files
    ]);

     // same file ko dobara select karne ki problem avoid karne ke liye
    e.target.value = "";
    
}


const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("countInStock", productData.countInStock);
    formData.append("sku", productData.sku);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);
    formData.append("collections", productData.collections);
    formData.append("material", productData.material);
    formData.append("gender", productData.gender);

    productData.sizes.forEach((size) => {
        formData.append("sizes", size);
    });

    productData.colors.forEach((color) => {
        formData.append("colors", color);
    });

    uploading.forEach((file) => {
        formData.append("images", file);
    });

    await dispatch(
        updateProduct({
            id,
            productData: formData,
        })
    ).unwrap();

    navigate("/admin/products");
};

if(loading) return <p>Loading...</p>
if(error) return <p>Error: {error}</p>

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
        <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
        <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-6">
                <label className="block font-semibold mb-2">Product Name</label>
                <input
                type="text"
                name="name"
                value={productData. name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
                
                />
            </div>

            {/* Description */}
            <div className="mb-6">
                <label className="block font-semibold mb-2">Description</label>
                <textarea 
                name="description"
                value={productData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                rows={4}
                required
                />
            </div>

            {/* Price */}
            <div className="mb-6">
                <label className="block font-semibold mb-2">Price</label>
                <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                />
            </div>

            {/* Count In stock */}
            <div className="mb-6">
                <label className="block font-semibold mb-2">Count in Stock</label>
                <input
                type="number"
                name="countInStock"
                value={productData.countInStock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                />
            </div>
            {/* SKU */}
            <div className="mb-6">
                <label className="block font-semibold mb-2">SKU</label>
                <input
                type="text"
                name="sku"
                value={productData.sku}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                />
            </div>

            {/* Sizes */}
            <div className="mb-6">
                <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
                <input
                type="text"
                name="sizes"
                value={productData.sizes.join(", ")}
                onChange={(e) => 
                    setProductData({
                        ...productData,
                        sizes: e.target.value.split(",").map((size) => size.trim()),
                    })
                }
                className="w-full border border-gray-300 rounded-md p-2"
                />
            </div>

            {/* Colors */}
             <div className="mb-6">
                <label className="block font-semibold mb-2">Colors (comma-separated)</label>
                <input
                type="text"
                name="colors"
                value={productData.colors.join(", ")}
                onChange={(e) => 
                    setProductData({
                        ...productData,
                        colors: e.target.value.split(",").map((color) => color.trim()),
                    })
                }
                className="w-full border border-gray-300 rounded-md p-2"
                />
            </div>

            {/* Image Uplaod */}
            <div className="mb-6">
                <label className=" block font-semibold mb-2">Upload Image</label>
                <input 
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                 />
                {/* Existing Images */}
                {productData?.images?.length > 0 && (
                    
                  <div className="mt-4">
            <p className="font-semibold mb-2">
                Existing Images
            </p>

            <div className="flex gap-4 flex-wrap">
                {productData.images.map((image, index) => (
                    <div key={index}>
                        <img
                            src={image.url}
                            alt={image.altText || "Product Image"}
                            className="w-24 h-24 object-cover rounded-md shadow-md"
                        />
                    </div>
                ))}
            </div>
        </div>
                )}

                {/* Newly Selected Images */}
                {uploading.length > 0 && (
                    <div className="mt-4">
                        <p className="font-semibold mb-2">
                            New Images
                        </p>
                    <div className="flex gap-4 flex-wrap">
                        {uploading.map((file, index) => (
                    <div key={index}>
                        <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-24 h-24 object-cover rounded-md shadow-md"
                        />
                        <p className="text-xs mt-1">
                            {file.name}
                        </p>
                    </div>
                ))}
            </div>
            </div>
            )}
            </div>
            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
                Update Product

            </button>
        </form>
    </div>  
  )
}

export default EditProductPage