import { NextRequest } from 'next/server';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

type ShimmedIncomingMessage = Readable & {
  headers: Record<string, string | string[] | undefined>;
  method?: string;
  url?: string;
};

async function convertNextRequestToIncomingMessage(req: NextRequest): Promise<ShimmedIncomingMessage> {
  const body = Buffer.from(await req.arrayBuffer());
  const stream = new Readable() as ShimmedIncomingMessage;

  stream._read = () => {
    stream.push(body);
    stream.push(null);
  };

  stream.headers = Object.fromEntries(req.headers.entries());
  stream.method = req.method;
  stream.url = req.url ?? '';

  return stream;
}

export async function POST(req: NextRequest) {
  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), 'public', 'uploads'),
    keepExtensions: true,
    multiples: true,
  });

  const incomingReq = await convertNextRequestToIncomingMessage(req);

  return new Promise<Response>((resolve, reject) => {
    // @ts-expect-error – Formidable is okay with our shimmed request
    form.parse(incomingReq, async (err, fields, files) => {
      if (err) {
        return resolve(
          new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 })
        );
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

      const filePath = path.join(process.cwd(), 'data', 'web-info.json');
      let orders = [];

      if (fs.existsSync(filePath)) {
        orders = JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]');
      }

      const index = orders.findIndex((o: any) => o.order_number === orderData.order_number);
      if (index !== -1) {
        orders[index] = orderData;
      } else {
        orders.push(orderData);
      }

      fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

      return resolve(
        new Response(JSON.stringify({ success: true, message: 'Order saved', order: orderData }), {
          status: 200,
        })
      );
    });
  });
}
