// m-1
// export const asyncHandler = async (fn) => (async(req,res, next) => {
//     try{
//         await fn(req,res, next)
//     }
//     catch(e){
//         console.log(e.message);
//         throw e;
//     }
// })

// m-2
export const asyncHandler = (fn) => ((req,res,next) => {
    Promise.resolve(fn(req,res,next))
        .catch(err=> next(err))
})

