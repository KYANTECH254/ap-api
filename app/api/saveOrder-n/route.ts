// pages/api/saveOrder.ts

import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // important for formidable
  },
};

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), 'public', 'uploads'),
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
    const imageUrl = imageFile ? `/uploads/${path.basename(imageFile.filepath)}` : '';

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
  });
}
