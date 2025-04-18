"use client";
import { useState, useEffect } from 'react';

const OrderForm = () => {
  const [orderData, setOrderData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch order data when component mounts
    fetch('/api/getOrders')
      .then((response) => response.json())
      .then((data) => {
        const orders = data.orders[0];
        if (orders) {
          setOrderData(orders);
        }
      })
      .catch((error) => console.error('Error fetching order data:', error));
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Add the image file to form data if it exists
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Show loading state
    setLoading(true);
    setMessage('');

    fetch('/api/saveOrder', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setMessage('Order saved successfully!');
        } else {
          setMessage(`Error: ${data.message}`);
        }
      })
      .catch((error) => {
        setLoading(false);
        setMessage('Failed to submit order.');
        console.error('Error:', error);
      });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFile(event.target.files[0]);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full">
      <h1 className="text-2xl font-bold text-center mb-4">Enter Order Details</h1>

      <form id="orderForm" className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="order_number" className="block font-medium">Order Number:</label>
          <input
            type="text"
            id="order_number"
            name="order_number"
            required
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue={orderData.order_number || ''}
          />
        </div>

        <div>
          <label htmlFor="product" className="block font-medium">Product Name:</label>
          <input
            type="text"
            id="product"
            name="product"
            required
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue={orderData.product || ''}
          />
        </div>

        <div>
          <label htmlFor="price" className="block font-medium">Price (AUD):</label>
          <input
            type="text"
            id="price"
            name="price"
            required
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue={orderData.price || ''}
          />
        </div>

        <div>
          <label htmlFor="address" className="block font-medium">Address:</label>
          <textarea
            id="address"
            name="address"
            rows={3}
            required
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue={orderData.address || ''}
          />
        </div>

        <div>
          <label htmlFor="receipient_name" className="block font-medium">Recipient First Name:</label>
          <input
            type="text"
            id="receipient_name"
            name="receipient_name"
            required
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue={orderData.receipient_name || ''}
          />
        </div>

        <div>
          <label htmlFor="receipient_last_name" className="block font-medium">Recipient Last Name:</label>
          <input
            type="text"
            id="receipient_last_name"
            name="receipient_last_name"
            required
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue={orderData.receipient_last_name || ''}
          />
        </div>

        <div>
          <label htmlFor="date" className="block font-medium">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            required
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue={orderData.date || ''}
          />
        </div>

        <div>
          <label htmlFor="image" className="block font-medium">Upload Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={handleImageChange}
          />
        </div>

        {message && (
          <div className="text-center mt-4 rounded">
            <p>{message}</p>
          </div>
        )}

        <button
          type="submit"
          id="submitBtn"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Submitting your order...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
