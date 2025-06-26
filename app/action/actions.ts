'use server';
import { hash } from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

export type SignUpResponse = {
  success?: boolean;
  error?: string;
};
export async function signUpCustomer(credentials: {
  countryCode: string;
  phone: string;
  password: string;
}): Promise<SignUpResponse & { customerId?: string }> {
  try {
    const sql = neon(process.env.NEXT_PUBLIC_NEON_URL!);

    // Validate phone number format
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(credentials.phone)) {
      throw new Error('Phone number must be 7-15 digits');
    }

    // Check for existing customer
    const existingCustomer = await sql`
      SELECT id FROM customer 
      WHERE phone_number = ${credentials.countryCode + credentials.phone}
    `;

    if (existingCustomer.length > 0) {
      throw new Error('This phone number is already registered');
    }

    // Hash password
    const hashedPassword = await hash(credentials.password, 12);

    // Insert into customer table and return the customer ID
    const newCustomer = await sql`
      INSERT INTO customer 
        (country_code, phone_number, password_hash)
      VALUES 
        (${credentials.countryCode}, 
         ${credentials.phone}, 
         ${hashedPassword})
      RETURNING id;
    `;

    return { success: true, customerId: newCustomer[0].id };
  } catch (error: any) {
    console.error('Signup error:', error);
    return { error: error.message || 'Registration failed. Please try again.' };
  }
}

export type DataCollectionResponse = {
  success?: boolean;
  error?: string;
};

export async function collectUserData(data: {
  customerId: string;
  username: string;
  email: string;
  imageUrl?: string;
  city?: string;
  pincode?: string;
  description?: string;
}): Promise<DataCollectionResponse> {
  try {
    const sql = neon(process.env.NEXT_PUBLIC_NEON_URL!);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Check for existing username or email
    const existingUser = await sql`
      SELECT email FROM profiles 
      WHERE email = ${data.email} OR username = ${data.username}
    `;

    if (existingUser.length > 0) {
      throw new Error('This email or username is already registered');
    }

    // Insert data into profiles table
    await sql`
      INSERT INTO profiles 
        (customer_id, username, email, image_url, city, pincode, description)
      VALUES 
        (${data.customerId}, 
         ${data.username}, 
         ${data.email}, 
         ${data.imageUrl || null}, 
         ${data.city || null}, 
         ${data.pincode || null}, 
         ${data.description || null})
    `;

    return { success: true };
  } catch (error: any) {
    console.error('Data collection error:', error);
    return { 
      error: error.message || 'Data collection failed. Please try again.', 
    };
  }
}
