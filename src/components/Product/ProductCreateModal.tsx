import React, { ChangeEvent, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import Service from '../../services/product';

interface Product {
    _id?: string;
    name: string;
    images: string | File;
    discription: string;
    price: number;
}

interface CreateModalProps {
    handleCloseCreateModal: () => void;
    showCreateModal: boolean;
    refatchData: () => void;
}


const ProductCreateModal: React.FC<CreateModalProps> = ({ handleCloseCreateModal, showCreateModal, refatchData }) => {
    const [data, setData] = useState<Product>({
        name: '',
        images: '',
        discription: '',
        price: 0
    });
    const adminAuthToken = localStorage.getItem('adminAuthToken');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setData((prev) => ({ ...prev, images: file }));
        }
    };

    const submitBtn = async () => {
        if (!data.name || !data.images || !data.discription || !data.price) {
            toast.error('Please fill all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('images', data.images instanceof File ? data.images : '');
        formData.append('discription', data.discription);
        formData.append('price', data.price.toString());

        if (adminAuthToken) {
            Service.createProduct(formData, adminAuthToken)
                .then((response: any) => {
                    handleCloseCreateModal();
                    toast.success("Product created successfully");
                    refatchData();
                })
                .catch((e: Error) => {
                    console.log("Error product update:", e);
                    toast.error("Something went wrong.");
                })
        }
    };

    return (
        <Modal show={showCreateModal} onHide={handleCloseCreateModal} backdrop="static" keyboard={false}>
            <div className="sub-manu-wrap" style={{ position: "absolute", width: "500px" }}>
                <div className="sub-manu" style={{ background: "#f5f6f7", padding: "20px", borderRadius: "3%" }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formProductImage" className="mb-3">
                                <Form.Label>Product Image</Form.Label>
                                <Form.Control name='images' type="file" onChange={handleFileChange} />
                            </Form.Group>

                            <Form.Group controlId="formProductName" className="mb-3">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter product name"
                                    name='name'
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
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formProductPrice" className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter price"
                                    name='price'
                                    onChange={handleChange}
                                />
                            </Form.Group>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ backgroundColor: "white", color: "black" }} onClick={handleCloseCreateModal}>
                            Cancel
                        </Button>
                        <Button style={{ backgroundColor: "black" }} onClick={submitBtn}>
                            Create
                        </Button>
                    </Modal.Footer>
                </div>
            </div>
        </Modal>
    );
};

export default ProductCreateModal;
