import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Pagination } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface User {
    _id?: string;
    mobile?: number;
    username?: string;
    autoMethod?: string;
    isActive?: boolean;
}

const Users: React.FC = () => {
    const [data, setData] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
    const adminAuthToken = localStorage.getItem('adminAuthToken');

    const handleDeleteConfirmationClose = () => setShowDeleteConfirmation(false);
    const handleDeleteConfirmationShow = (userId: string) => {
        setUserIdToDelete(userId);
        setShowDeleteConfirmation(true);
    };

    const fetchUserData = async (page: number, limit: number, search: string) => {
        try {
            const response = await axios({
                method: "get",
                url: `https://server-blpu.onrender.com/admin/get-user`,
                headers: {
                    'Authorization': `Bearer ${adminAuthToken}`,
                    "Content-type": "application/json"
                },
                params: {
                    page: page,
                    limit: limit,
                    search: search
                }
            });
            if (response.data && response.data.data.records) {
                setData(response.data.data.records);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const toggleUserActiveStatus = async (userId: string, currentStatus: boolean) => {
        try {
            if (adminAuthToken) {
                const response = await axios({
                    method: "put",
                    url: `https://server-blpu.onrender.com/admin/update-user-status/${userId}`,
                    headers: {
                        'Authorization': `Bearer ${adminAuthToken}`,
                        "Content-type": "application/json"
                    },
                    data: {
                        isActive: !currentStatus
                    }
                });
                if (response.data && response.data.message === "User status updated successfully.") {
                    toast.success("User status updated successfully!");
                    fetchUserData(currentPage, 5, search);
                }
            } else {
                console.error("Auth token is null. Please log in.");
            }
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

    const removeUser = async (noteId: string) => {
        if (adminAuthToken) {
            const response = await axios({
                method: "delete",
                url: `https://server-blpu.onrender.com/admin/remove-user/${noteId}`,
                headers: {
                    'Authorization': `Bearer ${adminAuthToken}`,
                    "Content-type": "application/json"
                }
            });
            if (response.data && response.data.message === "Operation is successfully executed.") {
                toast.success("User removed successfully!");
            }
            fetchUserData(currentPage, 5, search)
        } else {
            console.error("Auth token is null. Please log in.");
        }
    };

    const deleteUser = async (noteId: string) => {
        if (adminAuthToken) {
            const response = await axios({
                method: "delete",
                url: `https://server-blpu.onrender.com/admin/delete-user/${noteId}`,
                headers: {
                    'Authorization': `Bearer ${adminAuthToken}`,
                    "Content-type": "application/json"
                }
            });
            if (response.data && response.data.message === "Operation is successfully executed.") {
                toast.success("User permanently deleted successfully!");
            }
            fetchUserData(currentPage, 5, search)
            handleDeleteConfirmationClose();
        } else {
            console.error("Auth token is null. Please log in.");
        }
    };

    useEffect(() => {
        fetchUserData(currentPage, 5, search);
    }, [currentPage, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    return (
        <div>
            <h2 style={{ marginTop: "20px" }}>User Details</h2>
            <Form style={{ marginBottom: '10px', marginTop: "10px" }}>
                <Form.Control
                    type="text"
                    placeholder="Search by username or email"
                    value={search}
                    onChange={handleSearchChange}
                />
            </Form>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Active</th>
                        <th scope="col">Remove</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody style={{ marginTop: '10px' }}>
                    {data.map((user) => (
                        <tr>
                            <td>{user.username}</td>
                            <td>{user.mobile}</td>
                            <td>
                                <Form.Check
                                    type="switch"
                                    id={`custom-switch-${user._id}`}
                                    checked={user.isActive || false}
                                    onClick={() => user._id && toggleUserActiveStatus(user._id, user.isActive || false)}
                                />
                            </td>
                            <td><Button onClick={() => user._id && removeUser(user._id)} variant="secondary">Remove</Button></td>
                            <td><Button onClick={() => user._id && handleDeleteConfirmationShow(user._id)} variant="danger">Delete</Button></td>
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
            <Modal show={showDeleteConfirmation} onHide={handleDeleteConfirmationClose} backdrop="static" keyboard={false}>
                <div className="sub-manu-wrap" style={{ position: "absolute", top: "40%", right: "16%", width: "350px" }}>
                    <div className="sub-manu" style={{ background: "#f5f6f7", padding: "20px", borderRadius: "5%" }}>
                        <Modal.Header>
                            <div className="add-note" style={{ display: "flex", alignItems: "center" }}>
                                <h5 style={{ fontWeight: "500" }}>Delete</h5>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you want to delete this user?</p>
                            <Button
                                style={{ backgroundColor: "white", borderBlockColor: "black", color: "black" }}
                                onClick={handleDeleteConfirmationClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => userIdToDelete && deleteUser(userIdToDelete)}
                                variant="danger"
                                style={{ position: "absolute", right: "15px", }}
                            >
                                Delete
                            </Button>
                        </Modal.Body>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Users;
