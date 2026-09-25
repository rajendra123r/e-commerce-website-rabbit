import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";




const productAdd = asyncHandler( async (req, res) => {

  const {
         name,
         description,
         price,
         discountPrice,
         countInStock,
         category,
         brand,
         sizes,
         colors,
         collections,
         material,
         gender,
         images,
         isFeatured,
         isPublished,
         tags,
         dimensions,
         weight,
         sku,
 
     } = req.body;
 
     const createdProduct = await Product.create({
         name,
         description,
         price,
         discountPrice,
         countInStock,
         category,
         brand,
         sizes,
         colors,
         collections,
         material,
         gender,
         images,
         isFeatured,
         isPublished,
         tags,
         dimensions,
         weight,
         sku,
         user: req.user._id // reference to the admin user who created it
     });

     if(!createdProduct){
        throw new ApiError(500, "product are not created.")
     }
 
     return res
     .status(201)
     .json(
         new ApiResponse(201,
             createdProduct,
             "product create is successfully"
         )
     )

})

const productEdit = asyncHandler( async (req, res) => {
     const {
         name,
         description,
         price,
         discountPrice,
         countInStock,
         category,
         brand,
         sizes,
         colors,
         collections,
         material,
         gender,
         isFeatured,
         images,
         isPublished,
         tags,
         dimensions,
         weight,
         sku,
     } = req.body;


const product = await Product.findById(req.params.id);

if(!product){
    throw new ApiError(400, "product not found")
}

let uploadedImages = [];

if (req.files?.images) {
    for (const file of req.files.images) {

        const result = await uploadOnCloudinary(file.path);

        console.log("Cloudinary Result:", result);

        if (!result) {
            throw new ApiError(500, "Image upload failed");
        }

        uploadedImages.push({
            url: result.url,
            altText: name,
        });
    }
}



let finalImages = product.images;

if (uploadedImages.length > 0) {
    finalImages = [
        ...product.images,
        ...uploadedImages,
    ];
}
     // find producct by id

     const updateProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                name,
                description,
                price,
                discountPrice,
                countInStock,
                category,
                brand,
                sizes,
                colors,
                collections,
                material,
                gender,
                images: finalImages,
                isFeatured,
                isPublished,
                tags,
                dimensions,
                weight,
                sku 
            }
        },{ new: true }
     );


     return res
     .status(201)
     .json(
        new ApiResponse(200,
            updateProduct,
            "Product update successfully."
        )
     )
})

const productDelete = asyncHandler( async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if(!product){
        throw new ApiError(400, " Product are not found.")
    };

    await Product.findByIdAndDelete(id);

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            {},
            "product delete successfully"
        )
    )
})

const productGet = asyncHandler( async (req, res) => {
    const {collection, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit} = req.query;

    let query = {};



    // Filter logic

    if( collection && collection.toLocaleLowerCase() !== "all"){
        query.collections = collection;
    }

    if( category && category.toLocaleLowerCase() !== "all"){
        query.category = category;
    }

    if(material){
        query.material = { $in: material.split(",")};
    }
    if(brand){
        query.brand = { $in: brand.split(",")};
    }
    if(size){
        query.sizes = { $in: size.split(",")};
    }

    if(color){
        query.colors = { $in: [color]}
    }
    if(gender){
        query.gender = { $in: [gender]}
    }

    if(minPrice || maxPrice){
        query.price = {};
        if(minPrice) query.price.$gte = Number(minPrice);
        if(maxPrice) query.price.$lte = Number(maxPrice);
    }
    if(search){
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { gender: { $regex: search, $options: "i" } },
            { brand: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i"}},
        ];
    }

    // sort logic

    let sort = {};

    if(sortBy){
        switch(sortBy){
            case "priceAsc":
                sort = { price: 1};
                break;
            case "priceDesc":
                    sort = { price: -1 };
                    break;
            case "popularity":
                    sort = { rating: -1};
                    break;
                    default:
                        break;
        }
    }

    // Fetch products and apply sorting and limit

    const products = await Product.find(query).sort(sort).limit(Number(limit) || 0);


    return res
    .status(200)
    .json(
        new ApiResponse(200,
            products,
            "data send succeddfully"

        )
    )


})

const productGetId = asyncHandler( async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if(!product){
        throw new ApiError(400, "product not found it.")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            product,
            "get product details successfully."

        )
    )

})

const productSimilarGetId = asyncHandler( async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if(!product){
        throw new ApiError(400, "product not found.");
    };

    const similarProducts = await Product.find({
        _id: { $ne: id }, // Exclude the current product ID
        gender: product.gender,
        category: product.category,
    }).limit(4);

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            similarProducts,
            "similar ID data found successfully."

        )
    )



})

const productBestSeller = asyncHandler( async (req, res) => {

    const bestSeller = await Product.findOne().sort({ rating: -1 });

    if(!bestSeller){
        throw new ApiError(404, "bestSeller not found.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            bestSeller,
            "get bestSeller"

        )
    )


})

const productNewArrivals = asyncHandler( async (req, res) => {

    const newArrivals = await Product.find().sort({ createdAt: -1}).limit(8);

    if(!newArrivals){
        throw new ApiError(404, "newArrivals not found.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            newArrivals,
            "find newArrivals."
        )
    )

})

export {
    productAdd,
    productEdit,
    productDelete,
    productGet,
    productGetId,
    productSimilarGetId,
    productBestSeller,
    productNewArrivals

}