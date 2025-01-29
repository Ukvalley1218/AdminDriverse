import jwt from 'jsonwebtoken';
import AdminModel from '@/app/lib/AdminModal';

export async function POST(req) {
  try {


    // Debug: Check request headers
    const contentType = req.headers.get('content-type');


    let body;

    if (contentType === 'application/json') {
      body = await req.json();

    } else if (contentType === 'text/plain') {
      body = await req.text();

    } else {

      return new Response(
        JSON.stringify({ isValid: false, message: `Unsupported content type: ${contentType}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Debug: Check body structure
    if (!body || typeof body !== 'object') {

    }

    const { token } = body;


    if (!token) {

      return new Response(
        JSON.stringify({ isValid: false, message: 'Token is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;


    if (!secret) {

      return new Response(
        JSON.stringify({ isValid: false, message: 'Server error: Missing secret key' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Debug: Decoding token

    const decodedToken = jwt.verify(token, secret);


    // Debug: Fetching user

    const user = await AdminModel.findById(decodedToken._id).select('-password -refreshToken');


    if (!user) {

      return new Response(
        JSON.stringify({ isValid: false, message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }



    return new Response(
      JSON.stringify({ isValid: true, user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[CLS] Error caught in catch block:', error);

    let status = 500;
    let message = 'Server error: Unable to verify token';

    if (error.name === 'JsonWebTokenError') {

      status = 401;
      message = 'Invalid token';
    } else if (error.name === 'TokenExpiredError') {

      status = 401;
      message = 'Token expired';
    } else {

    }

    return new Response(
      JSON.stringify({ isValid: false, message }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
