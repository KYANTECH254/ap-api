import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.v2.config({
  cloud_name: 'dwpto82q6',
  api_key: '324758513889564',
  api_secret: 'YpO9sH8WyZG7GK9jzJVDrf_g9vM',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: any, res: any) {
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

  form.parse(req, (err, fields, files) => {
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

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (imageFile) {
      cloudinary.v2.uploader
        .upload(imageFile.filepath, { resource_type: 'auto' })
        .then((result) => {
          const imageUrl = result.secure_url;

          const orderData = {
            order_number: order_number?.[0] || order_number,
            product: product?.[0] || product,
            price: price?.[0] || price,
            address: address?.[0] || address,
            receipient_name: receipient_name?.[0] || receipient_name,
            receipient_last_name: receipient_last_name?.[0] || receipient_last_name,
            date: date?.[0] || date,
            image: imageUrl,
          };

          const dataDir = path.join(process.cwd(), 'data');
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
          }

          const filePath = path.join(dataDir, 'web-info.json');
          let orders = [];

          if (fs.existsSync(filePath)) {
            const existing = fs.readFileSync(filePath, 'utf-8') || '[]';
            orders = JSON.parse(existing);
          }

          const index = orders.findIndex((o: any) => o.order_number === orderData.order_number);
          if (index !== -1) {
            orders[index] = orderData;
          } else {
            orders.push(orderData);
          }

          fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

          res.status(200).json({ success: true, message: 'Order saved', order: orderData });
        })
        .catch((error) => {
          res.status(500).json({ success: false, error: error.message });
        });
    } else {
      const orderData = {
        order_number: order_number?.[0] || order_number,
        product: product?.[0] || product,
        price: price?.[0] || price,
        address: address?.[0] || address,
        receipient_name: receipient_name?.[0] || receipient_name,
        receipient_last_name: receipient_last_name?.[0] || receipient_last_name,
        date: date?.[0] || date,
        image: '',
      };

      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }

      const filePath = path.join(dataDir, 'web-info.json');
      let orders = [];

      if (fs.existsSync(filePath)) {
        const existing = fs.readFileSync(filePath, 'utf-8') || '[]';
        orders = JSON.parse(existing);
      }

      const index = orders.findIndex((o: any) => o.order_number === orderData.order_number);
      if (index !== -1) {
        orders[index] = orderData;
      } else {
        orders.push(orderData);
      }

      fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

      res.status(200).json({ success: true, message: 'Order saved', order: orderData });
    }
  });
}
