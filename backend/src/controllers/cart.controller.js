import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getCart = async (userId, guestId) => {
    if(userId){
        return await Cart.findOne({ user: userId });
    }else if (guestId){
        return await Cart.findOne({ guestId });
    }
    return null;  
}


const cartAdd = asyncHandler(async (req, res) => {

    const {
        productId,
        quantity,
        size,
        color,
        guestId,
        userId
    } = req.body;

    const product = await Product.findById(productId);

    if(!product){
        throw new ApiError(400, "Product not found");
    }

    const cart = await getCart(userId, guestId);

    let cartData;

    if(cart){

        const productIndex = cart.products.findIndex(
            (item) =>
                item.productId.toString() === productId &&
                item.size === size &&
                item.color === color
        );

        if(productIndex > -1){

            cart.products[productIndex].quantity += quantity;

        }else{

            cart.products.push({
                productId,
                name: product.name,
                image: product.images[0].url,
                price: product.price,
                size,
                color,
                quantity,
            });

        }

        cart.totalPrice = cart.products.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        await cart.save();

        cartData = cart;

    }else{

        cartData = await Cart.create({
            user: userId ? userId : undefined,
            guestId: guestId || `guest_${Date.now()}`,
            products: [
                {
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                }
            ],
            totalPrice: product.price * quantity,
        });

    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            cartData,
            "Cart updated successfully"
        )
    );

});

const updateProductQuantity = asyncHandler( async (req, res) => {
    const {
        productId,
        quantity,
        size,
        color,
        guestId,
        userId
    } = req.body;

    const cart = await getCart(userId, guestId);
    if(!cart){
        throw new ApiError(404, "Cart not found.");
    }

    
        const productIndex = cart.products.findIndex(
            (item) =>
                item.productId.toString() === productId &&
                item.size === size &&
                item.color === color
        );

        if(productIndex > -1){
            if(quantity > 0){
                cart.products[productIndex].quantity = quantity;
            }else{
                cart.products.splice(productIndex, 1); // Remove product if quantity is 0
            }

             cart.totalPrice = cart.products.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
            );

            await cart.save();
            return res
            .status(200)
            .json(
                new ApiResponse(200,
                    cart,
                    "update quantity of product."
                )
            )
        }

})

const deleteproductToCart = asyncHandler( async (req, res) => {
     const {
        productId,
        size,
        color,
        guestId,
        userId
    } = req.body;

    const cart = await getCart(userId, guestId);

    if(!cart){
        throw new ApiError(404, " cart not found.");
    }

    const productIndex = cart.products.findIndex(
         (item) =>
                item.productId.toString() === productId &&
                item.size === size &&
                item.color === color
    )

    if(productIndex > -1){
        cart.products.splice(productId, 1);

        cart.totalPrice = cart.products.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        await cart.save();
        return res
        .status(200)
        .json(
            new ApiResponse(200,
                cart,
                "delete product from cart."
            )
        )
    }

})

const getCartProduct = asyncHandler( async (req, res) => {
    const { userId, guestId } = req.query;

    const cart = await getCart(userId, guestId);

    if(!cart){
        throw new ApiError(404, "cart not found.");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            cart,
            "get product of cart to user login and guest user login."
        )
    )
})

const mergeProduct = asyncHandler( async (req, res) => {
    const { guestId } = req.body;
    if(!guestId){
        throw new ApiError(404, "guestId not found.")
    }

    const guestCart = await Cart.findOne({ guestId });
    if(!guestCart){
        throw new ApiError(400, "guest cart not found.")
    }

    const userCart = await Cart.findOne({ user: req.user._id });   

    if(guestCart){
        if(guestCart.products.length === 0){
        throw new ApiError(400, "Guest cart is empty");
        }

        if(userCart){
            // Merge guest cart into user cart
            guestCart.products.forEach((guestItem) => {
                const productIndex = userCart.products.findIndex(
                       (item) => 
                        item.productId.toString() === guestItem.productId.toString() &&
                        item.size === guestItem.size &&
                        item.color === guestItem.color
                    );

                if(productIndex > -1){
                // if the itmes exists in the user cart,update the quantity
                    userCart.products[productIndex].quantity += guestItem.quantity;
                }else{
                    // otherwise, add the guest itme to the cart
                    userCart.products.push(guestItem)
                }
            });
            userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await userCart.save();

            // Remove the guest cart after merging
            await Cart.findOneAndDelete({ guestId });

            return res
            .status(200)
            .json(
                new ApiResponse(200,
                userCart,
                "merga cart of products."
                )
            )
        }else{
             // If the user has no existing cart, assign the guest cart to the user
            guestCart.user = req.user._id;
            guestCart.guestId = undefined;
            await guestCart.save();

            return res
            .status(200)
            .json(
            new ApiResponse(200,
                guestCart,
                "assign the guest cart to the user."

                )
            )
        }
    }else{
        if(userCart){
            // Guest cart has already been merged, return user cart

            return res
            .status(201)
            .json(
                new ApiResponse(201,
                    userCart,
                    "user cart get successfully."
                )
            )
        }

    }


})

export {
    cartAdd,
    updateProductQuantity,
    deleteproductToCart,
    getCartProduct,
    mergeProduct

}