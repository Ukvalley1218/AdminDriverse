import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDb } from "../../lib/db";
import Admin from "../../lib/AdminModal";

export async function POST(req) {
  // Ensure the database connection is awaited
  await connectToDb();

  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: "email is required." },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { message: "Password is required." },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await Admin.findOne({ email });

    if (user) {
 
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      console.log(user._id)
      if (isPasswordCorrect) {
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        return NextResponse.json(
          {
            message: "Admin logged in successfully.",
            userId: user._id.toString(),
            accessToken,
            refreshToken,
            redirectUrl: "/admin"
          },
          {
            status: 200,
            headers: {
              'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Strict`
            }
          }
        );
      } else {
        return NextResponse.json(
          { message: "Incorrect password. Please check your credentials." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "No account found with this email." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
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