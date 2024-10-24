import Cuopon from "../models/coupon.model.js"

export const getCoupon = async (req, res) => {
  try {
    const cuopon = await Cuopon.findOne({ userId: req.user._id, isActive: true })
    res.json(cuopon || null)
  } catch (error) {
    console.log("Error in getCoupon controller", error.message)
    res.status(500).json({ message: error.message })
  }
}


export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body
    const coupon = await Cuopon.findOne({ code:code, userId:req.user._id , isActive: true })

    if(!coupon) {
      return res.status(404).json({message: "Coupon not found"})
    }

    if(coupon.expirationDate < new Date()) {
      coupon.isActive = false ;
      await coupon.save()
      return res.json({message: "Coupon expired"})
    }

    res.json({
      message: "coupon is valid",
      code : coupon.code,
      discountPrecentage: coupon.discountPrecentage
    })

  } catch (error) {
    console.error("Error in validateCoupon controller", error.message)
    res.status(500).json({ message: error.message })
  }
}