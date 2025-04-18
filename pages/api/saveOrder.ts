import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary';
import { PrismaClient } from '@/app/generated/prisma/client';

const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: 'dwpto82q6',
  api_key: '324758513889564',
  api_secret: 'YpO9sH8WyZG7GK9jzJVDrf_g9vM',
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: any, res: any) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const form = new IncomingForm({
    keepExtensions: true,
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    const {
      order_number,
      product,
      price,
      address,
      receipient_name,
      receipient_last_name,
      date,
    } = fields;

    // Ensure price is a valid number (default to NaN if undefined)
    const priceString = Array.isArray(price) ? price[0] : price || '';
    const priceValue = parseFloat(priceString); // Convert to number

    // Ensure date is a valid Date object (default to current date if undefined)
    const dateString = Array.isArray(date) ? date[0] : date || '';
    const dateValue = new Date(dateString); // Convert to Date object

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    let imageUrl = '';

    if (imageFile) {
      try {
        const result = await cloudinary.v2.uploader.upload(imageFile.filepath, { resource_type: 'auto' });
        imageUrl = result.secure_url;
      } catch (error) {
        return res.status(500).json({ success: false, error: error });
      }
    }

    // Ensure all fields are strings or provide defaults for them
    const orderData = {
      order_number: order_number ? String(order_number) : '', // Ensure it's a string, default to empty string if undefined
      product: Array.isArray(product) ? product[0] : product || '', // Ensure it's a string, default to empty string
      price: priceValue,
      address: Array.isArray(address) ? address[0] : address || '', // Ensure it's a string, default to empty string
      receipient_name: Array.isArray(receipient_name) ? receipient_name[0] : receipient_name || '', // Ensure it's a string
      receipient_last_name: Array.isArray(receipient_last_name) ? receipient_last_name[0] : receipient_last_name || '', // Ensure it's a string
      date: dateValue,
      image: imageUrl,
    };

    // Fetch the first existing order (since there should only be one)
    const existingOrder = await prisma.order.findFirst();

    try {
      if (!existingOrder) {
        // If no order exists, create a new one
        const newOrder = await prisma.order.create({
          data: orderData,
        });

        return res.status(200).json({
          success: true,
          message: 'New order created successfully',
          order: newOrder,
        });
      } else {
        // If an order exists, update it
        const updatedOrder = await prisma.order.update({
          where: { id: existingOrder.id }, // Use the ID of the first order found
          data: orderData, // Update the existing order with the new data
        });

        return res.status(200).json({
          success: true,
          message: 'Order updated successfully',
          order: updatedOrder,
        });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  });
}
