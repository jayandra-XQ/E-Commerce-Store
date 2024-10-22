import {redis} from '../lib/redis.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

const generateTokens = (userId) => {
  const accessToken = jwt.sign({userId} , process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m"
  })

  const refreshToken = jwt.sign({ userId} , process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d"
  })

  return { accessToken, refreshToken }
};

const storeRefreshToken = async(userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX",7*24*60*60); //7 days
}

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, { 
    httpOnly: true,  //prevent XSS attacks
    secure:process.env.NODE_ENV === "production",
    sameSite: 'strict', //prevents csrf attack
    maxAge: 15 * 60 * 1000, //15 minutes
  });
  res.cookie('refresh-token', refreshToken, { 
    httpOnly: true, //prevent XSS attacks
    secure:process.env.NODE_ENV === "production",
    sameSite: 'strict', //prevents csrf attack 
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
  });
}

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email })
    if(userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    const user = await User.create({name, email, password});

    //authenticate user
    const  {accessToken, refreshToken} = generateTokens(user._id)
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken)


    res.status(201).json({ message: "User created successfully", user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
     
    }})

  } catch (error) {
    console.error("error in signup controller", error.message)
    res.status(500).json({ message: error.message })
  }

}

export const login = async (req, res) => {

}

export const logout = async (req, res) => {

}