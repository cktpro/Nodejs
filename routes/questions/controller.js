const { getQueryDateTime } = require('../../helper');
const {
  Product,
  Category,
  Supplier,
  Customer,
  Order,
} = require('../../models');
module.exports = {
  question18: async(req,res,next)=>{
    try {
      let result= await Category.aggregate().lookup({
        from:'products',
        localField:'_id',
        foreignField:'categoryId',
        as:'products',
      }).unwind(
        {
          path:'$products',
          preserveNullAndEmptyArrays: true
        }
      ).group(
        {
          _id:'$_id',
          name:{$first:'$name'},
          totalProduct:{$sum:1}

        }
      )
      .sort(
        {
          totalProduct:-1
        }
      )
      if(result.length>0){
        return res.send({
        code: 200,
        mesage: 'Thành công',
        payload: result,
        });
      }
      return res.status(400).json({
      code: 404,
      mesage: 'Không tìm thấy',
      });
      
    } catch (error) {
      return res.status(500).json({
      code: 500,
      mesage: 'Thất bại',
      error: error,
      });
    }
  },
  question19: async(req,res,next)=>{
    try {
      let result= await Supplier.aggregate().lookup({
        from:'products',
        localField:'_id',
        foreignField:'supplierId',
        as:'products',
      })
      .unwind(
        {
          path:'$products',
          preserveNullAndEmptyArrays: true
        }
      )
      .group(
        {
          _id:'$_id',
          name:{$first:'$name'},
          totalProduct:{$sum:'$products.stock'}

        }
      )
      .sort(
        {
          totalProduct:-1
        }
      )
      if(result.length>0){
        return res.send({
        code: 200,
        mesage: 'Thành công',
        payload: result,
        });
      }
      return res.status(400).json({
      code: 404,
      mesage: 'Không tìm thấy',
      });
      
    } catch (error) {
      return res.status(500).json({
      code: 500,
      mesage: 'Thất bại',
      error: error,
      });
    }
  },
  question20:async(req,res,next)=>{
try {
  const {fromDate,toDate}=req.query;
  const startDate= new Date(fromDate);
  const endDate=new Date(toDate)
  let conditionFind={$expr:{$and:[
    {$gte:['$createdDate',startDate]},
    {$lte:['$createdDate',endDate]}
  ]}}
let result = await Order.aggregate().match({...conditionFind,status:'WAITING'}).unwind('orderDetails').lookup(
  {
    from:'products',
    localField:'orderDetails.productId',
    foreignField:'_id',
    as:'orderDetails.product'
  }
)
if(result.length>0){
  return res.send({
  code: 200,
  mesage: 'Thành công',
  payload: result,
  });
}
return res.status(400).json({
code: 404,
mesage: 'Không tìm thấy',
});
} catch (error) {
  return res.status(500).json({
  code: 500,
  mesage: 'Thất bại',
  error: error,
  });
}
  }
};
