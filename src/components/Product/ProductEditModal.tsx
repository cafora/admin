import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import Service from '../../services/product';

interface Product {
    _id: string;
    name: string;
    images: string;
    discription: string;
    price: number;
}

interface EditModalProps {
    handleCloseEditModal: () => void;
    showEditModal: boolean;
    productToEdit: Product | null;
    refatchData: () => void;
}

const ProductEditModal: React.FC<EditModalProps> = ({ handleCloseEditModal, showEditModal, productToEdit, refatchData }) => {
    const [data, setData] = useState<Product | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const adminAuthToken = localStorage.getItem('adminAuthToken');

    useEffect(() => {
        if (productToEdit) {
            setData({ ...productToEdit });
        }
    }, [productToEdit]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!data) return;

        const { name, value } = e.target;
        setData((prev) => prev ? { ...prev, [name]: value } : null);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const submitBtn = async () => {
        if (!data) {
            console.error('Something went wrong.');
            return;
        }

        const formData = new FormData();
        formData.append("name", String(data.name));
        formData.append("discription", String(data.discription));
        formData.append("price", data.price.toString());

        if (selectedFile) {
            formData.append("images", selectedFile);
        }

        if (adminAuthToken) {
            Service.updateProduct(productToEdit, formData, adminAuthToken)
                .then((response: any) => {
                    handleCloseEditModal();
                    toast.success("Product updated successfully");
                    refatchData();
                })
                .catch((e: Error) => {
                    console.log("Error product update:", e);
                    toast.error("Something went wrong.");
                })
        }
    };

    return (
        <Modal show={showEditModal} onHide={handleCloseEditModal} backdrop="static" keyboard={false}>
            <div className="sub-manu-wrap" style={{ position: "absolute", width: "500px" }}>
                <div className="sub-manu" style={{ background: "#f5f6f7", padding: "20px", borderRadius: "3%" }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formProductImage" className="mb-3">
                                <Form.Label>Product Image</Form.Label>
                                <Form.Control name='images' type="file" onChange={handleFileChange} />
                                <img
                                    src={`http://localhost:4000${productToEdit?.images}`}
                                    alt="Product"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "5px",
                                        marginTop: "10px",
                                        display: "block",
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductName" className="mb-3">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter product name"
                                    name='name'
                                    defaultValue={productToEdit?.name}
                                    value={data?.name || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductDescription" className="mb-3">
                                <Form.Label>Product Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter product description"
                                    name='discription'
                                    defaultValue={productToEdit?.discription}
                                    value={data?.discription || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductPrice" className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter price"
                                    name='price'
                                    defaultValue={productToEdit?.price}
                                    value={data?.price || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ backgroundColor: "white", color: "black" }} onClick={handleCloseEditModal}>
                            Cancel
                        </Button>
                        <Button style={{ backgroundColor: "black" }} onClick={submitBtn}>
                            Save
                        </Button>
                    </Modal.Footer>
                </div>
            </div>
        </Modal>
    );
};

export default ProductEditModal;
