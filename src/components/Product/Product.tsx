import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Pagination } from 'react-bootstrap';
import ProductDeleteModal from './ProductDeleteModal';
import ProductEditModal from './ProductEditModal';
import ProductCreateModal from './ProductCreateModal';

interface Product {
    _id: string;
    name: string;
    images: string;
    discription: string;
    price: number;
}

const Products: React.FC = () => {
    const [productData, setProductData] = useState<Product[]>([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const adminAuthToken = localStorage.getItem('adminAuthToken');

    const fatchProductData = async (page: number, limit: number) => {
        try {
            const response = await axios({
                method: "get",
                url: `https://server-blpu.onrender.com/admin/get-product`,
                headers: {
                    'Authorization': `Bearer ${adminAuthToken}`,
                    "Content-type": "application/json"
                },
                params: {
                    page: page,
                    limit: limit,
                }
            });
            if (response.data && response.data.data.records) {
                setProductData(response.data.data.records);
            }
        } catch (error) {
            console.error("Error fetching slot data:", error);

        }
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleOpenEditModal = (product: Product) => {
        setProductToEdit(product)
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => setShowEditModal(false);

    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => setShowCreateModal(false);

    const handleOpenDeleteModal = (slotId: string) => {
        if (slotId) {
            setSelectedProductId(slotId);
            setShowDeleteModal(true);
        }
    };

    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const refatchData = () => {
        fatchProductData(currentPage, 5);
    }

    useEffect(() => {
        fatchProductData(currentPage, 5);
    }, [currentPage]);

    return (
        <div>
            <h2 style={{ marginTop: "20px" }}>Products</h2>
            <Button
                style={{ backgroundColor: "gray", marginBottom: '25px', borderRadius: "5px", marginLeft: "800px", marginTop: "-50px" }}
                onClick={() => handleOpenCreateModal()}
            >
                + Create Product
            </Button>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Discription</th>
                        <th scope="col">Price</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody style={{ marginTop: '10px' }}>
                    {productData.map((product) => (
                        <tr>
                            <td scope="col"><img src={`http://localhost:4000${product.images}`} height={70} width={70} alt={product.name} /></td>
                            <td scope="col">{product.name}</td>
                            <td scope="col">{product.discription}</td>
                            <td scope="col">{product.price}</td>
                            <td scope="col"><td><Button onClick={() => handleOpenEditModal(product)} variant="secondary">Edit</Button></td></td>
                            <td scope="col"><Button onClick={() => product?._id && handleOpenDeleteModal(product._id)} variant="danger">Delete</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <Pagination style={{ marginLeft: "825px", marginTop: "30px", gap: 8 }}>
                    <Pagination.Prev onClick={handlePreviousPage} />
                    <Pagination.Next onClick={handleNextPage} style={{ marginLeft: "20px" }} />
                </Pagination>
            </div>
            <ProductEditModal
                showEditModal={showEditModal}
                handleCloseEditModal={handleCloseEditModal}
                productToEdit={productToEdit}
                refatchData={refatchData}
            />
            <ProductCreateModal
                handleCloseCreateModal={handleCloseCreateModal}
                showCreateModal={showCreateModal}
                refatchData={refatchData}
            />
            <ProductDeleteModal
                showDeleteModal={showDeleteModal}
                handleCloseDeleteModal={handleCloseDeleteModal}
                selectedProductId={selectedProductId as string}
                refatchData={refatchData}
            />
        </div>
    );
};

export default Products;
