import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Pagination } from 'react-bootstrap';

export interface Order {
    _id?: string;
    address?: string;
    createdAt?: string;
    isOrderCancle?: boolean;
    products?: { _id: string; productId: string; count: number }[];
}

const Order: React.FC = () => {
    const [orderData, setOrderData] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const adminAuthToken = localStorage.getItem('adminAuthToken');

    const fetchOrderData = async (page: number, limit: number) => {
        try {
            const response = await axios.get('https://server-blpu.onrender.com/admin/get-order', {
                headers: {
                    Authorization: `Bearer ${adminAuthToken}`,
                    'Content-type': 'application/json',
                },
                params: { page, limit },
            });

            if (response.data?.data?.records) {
                setOrderData(response.data.data.records);
            }
        } catch (error) {
            console.error('Error fetching order data:', error);
        }
    };

    useEffect(() => {
        fetchOrderData(currentPage, 5);
    }, [currentPage]);

    return (
        <div>
            <h2 style={{ marginTop: '20px' }}>Order Details</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Products</th>
                        <th scope="col">Total Count</th>
                        <th scope="col">Address</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Order Canceled</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {orderData.map((order) => (
                        <tr key={order._id}>
                            <td>
                                {order.products?.map((product) => (
                                    <div key={product._id}>
                                        <span>Product ID: {product.productId}</span>
                                    </div>
                                )) || 'No Products'}
                            </td>
                            <td>{order.products?.reduce((acc, p) => acc + p.count, 0) || 0}</td>
                            <td>{order.address || 'N/A'}</td>
                            <td>{new Date(order.createdAt || '').toLocaleString()}</td>
                            <td>{order.isOrderCancle ? 'Yes' : 'No'}</td>
                            <td>
                                <Button variant="secondary">Edit</Button>
                            </td>
                            <td>
                                <Button variant="danger">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <Pagination style={{ marginLeft: '825px', marginTop: '30px', gap: 8 }}>
                    <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} />
                    <Pagination.Next onClick={() => setCurrentPage((prev) => prev + 1)} style={{ marginLeft: '20px' }} />
                </Pagination>
            </div>
        </div>
    );
};

export default Order;
