const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler (req, res, next)).
    catch((error) => next(error));
  };
};
// this is a higher-order function that takes an async function as an argument and returns a new function that wraps the original function in a try-catch block. This allows for easier error handling in asynchronous code.

export { asyncHandler}


// const asyncHnadler = () => {}
// const ayncHandler = () => { () => {}}
// const asyncHnadler = () => async () =>{}    

// const asyncHnadler =  (fn) => async (req, res, next) => {
//     try{
//         await fn(req, res, next)

//     }catch(error){
//         res.status(error.status || 500).json({
//             success: false,
//             message: error.message || "Server Error"
//         })
//     }

// }