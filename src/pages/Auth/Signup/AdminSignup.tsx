
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { Button, Form, FormControl, FormLabel, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminSignupPage: React.FC = () => {

    const initialSignupState = {
        email: '',
        password: '',
    };
    const [data, setData] = useState(initialSignupState);
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
            url: `https://server-blpu.onrender.com/admin/signup`,
            data: data,
            headers: {
                "Content-type": "application/json"
            }
        });
        if (response) {
            navigate('/admin/login');
            setData(initialSignupState);
            toast.success("Admin signup successfully.");
        }
    };

    return (
        <div className="sub-manu-wrap" style={{ position: "absolute", top: "20%", right: "35%", width: "400px" }}>
            <div className="sub-manu" style={{ background: "#f5f6f7", padding: "20px", borderRadius: "5%" }}>
                <Modal.Header>
                    <div className="signup" style={{ display: "flex", alignItems: "center", paddingLeft: "120px" }}>
                        <h5 style={{ fontWeight: "500" }}>Admin Signup</h5>
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
                            Signup
                        </Button>
                    </Form>
                </Modal.Body>
            </div>
        </div>
    );
};

export default AdminSignupPage;
