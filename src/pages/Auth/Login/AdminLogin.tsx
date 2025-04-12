import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { Button, Form, FormControl, FormLabel, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLoginPage: React.FC = () => {
    const initialLoginState = {
        email: '',
        password: '',
    };
    const [data, setData] = useState(initialLoginState);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const submitBtn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!data.email || !data.password) {
            setErrorMessage("Email and password are required.");
            return;
        }

        setErrorMessage("");

        const response = await axios({
            method: "post",
            url: `http://localhost:4000/admin/login`,
            data: data,
            headers: {
                "Content-type": "application/json"
            }
        });

        if (response) {
            const token = response.data.data.token.token;
            if (token) {
                localStorage.setItem('adminAuthToken', token);
                navigate('/');
                setData(initialLoginState);
                toast.success("Admin login successfully.");
            }
        }
    };

    return (
        <div className="sub-manu-wrap" style={{ position: "absolute", top: "20%", right: "35%", width: "400px" }}>
            <div className="sub-manu" style={{ background: "#f5f6f7", padding: "20px", borderRadius: "5%" }}>
                <Modal.Header>
                    <div className="signup" style={{ display: "flex", alignItems: "center", paddingLeft: "120px" }}>
                        <h5 style={{ fontWeight: "500" }}>Admin Login</h5>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitBtn}>
                        <FormLabel>Email</FormLabel>
                        <FormControl
                            type="email"
                            name="email"
                            onChange={handleInputChange}
                        />
                        <FormLabel style={{ marginTop: "10px" }}>Password</FormLabel>
                        <FormControl
                            type="password"
                            name="password"
                            onChange={handleInputChange}
                        />
                        {errorMessage && <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
                        <Button type="submit" style={{ width: "100%", marginTop: "20px", backgroundColor: "black" }}>
                            Login
                        </Button>
                    </Form>
                </Modal.Body>
            </div>
        </div>
    );
};

export default AdminLoginPage;