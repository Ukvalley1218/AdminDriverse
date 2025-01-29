import { connectToDb } from "../../lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import Admin from "@/app/lib/AdminModal";

connectToDb();
export async function POST(req){
  try {
    const body = await req.json();
    console.log(body)
    const { FirstName, LastName, email, password } = body;
    if (!FirstName || !LastName || !email || !password ) {
      // If email or password is missing, respond with a validation error
      return NextResponse.json(
        { error: 'All Fields are required fields.' },
        { status: 400 }
      );
    }
    const userCredentials = {
        FirstName,
        LastName,
        email,
        password,
      };
      const salt = bcrypt.genSaltSync(10);
      userCredentials.password = bcrypt.hashSync(userCredentials.password, salt);
      await Admin.create(userCredentials)
    return NextResponse.json({status:200, message:'User Created Succesfully'},{status:200, })
    
  } catch (error) {
    console.log(error)

  }
}


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await Admin.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Generate tokens with explicit expiration
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token 
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generateAccessAndRefreshTokens:", error);
    throw new Error("Error while generating tokens");
  }
};