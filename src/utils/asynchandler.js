//PROMISES
const asyncHandler = (requestHandler) => {
  return(req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

//higer order gfunctions are those functions ,
//  in which they use functions as parameters , so basically they are varibales ,
//  and they also return the output

//TRY CATCH

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json({ success: false, message: error.message });
//   }
// };
