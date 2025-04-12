import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

interface DeleteModalProps {
    handleCloseDeleteModal: () => void;
    showDeleteModal: boolean;
    selectedProductId: string;
    refatchData: () => void;
}

const ProductDeleteModal: React.FC<DeleteModalProps> = ({ handleCloseDeleteModal, showDeleteModal, selectedProductId, refatchData }) => {
    const adminAuthToken = localStorage.getItem('adminAuthToken');

    const deleteNote = async (selectedNote: string) => {
        if (adminAuthToken) {
            const response = await axios.delete(
                `http://localhost:4000/admin/delete-product/${selectedNote}`,
                {
                    headers: {
                        'Authorization': `Bearer ${adminAuthToken}`,
                        "Content-type": "application/json"
                    }
                }
            );
            if (response.status === 200) {
                handleCloseDeleteModal();
                toast.success("Product delete successfully");
                refatchData();
            }
        } else {
            console.error("Auth token is null. Please log in.");
        }
    };

    return (
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} backdrop="static" keyboard={false}>
            <div className="sub-manu-wrap" style={{ position: "absolute", top: "40%", right: "16%", width: "350px" }}>
                <div className="sub-manu" style={{ background: "#f5f6f7", padding: "20px", borderRadius: "5%" }}>
                    <Modal.Header>
                        <div className="add-note" style={{ display: "flex", alignItems: "center" }}>
                            <h5 style={{ fontWeight: "500" }}>Delete</h5>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this item?</p>
                        <Button
                            style={{ backgroundColor: "white", borderBlockColor: "black", color: "black" }}
                            onClick={handleCloseDeleteModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => deleteNote(selectedProductId)}
                            variant="danger"
                            style={{ position: "absolute", right: "15px", }}
                        >
                            Delete
                        </Button>
                    </Modal.Body>
                </div>
            </div>
        </Modal>
    );
};

export default ProductDeleteModal;
