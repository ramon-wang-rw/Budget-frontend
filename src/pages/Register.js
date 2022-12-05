import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import './Register.css';

export default function Register() {    
    const navigate = useNavigate()

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [invalid, setInvalid] = useState(false)

    async function registerUser(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/api/register', {
            method:'POST',
            headers: {
				'Content-Type': 'application/json',
                
			},
            body: JSON.stringify({
                firstname,
                lastname,
                email,
                password
            }),
        })
        const data = await response.json()

        if(data.status === 'error') {
            setInvalid(true)
        }
        else if(data.status === 'ok'){
            setInvalid(false)
            alert('register succesful')
            navigate('/')
        }

    }

    return (
        <Container id="main-container" className="d-grid h-100">
        
            <Form onSubmit={registerUser} className="d-grid h-100 w-50">
                <h1 className="mb-3 fs-3 fw-normal text-center">Register</h1>

                
                <Form.Group className="mb-3" >
                    <Form.Label>First Name</Form.Label>
                    <Form.Control className="position-relative" type="text" placeholder="Enter First Name" onChange={(e) => setFirstname(e.target.value.replace(/\s/g,''))} required/>
                </Form.Group>

				<br />

                <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control className="position-relative" type="text" placeholder="Enter Last Name" onChange={(e) => setLastname(e.target.value.replace(/\s/g,''))} required/>
                </Form.Group>

				<br />
                <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control className="position-relative" type="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value.replace(/\s/g,''))} isInvalid={invalid} required/>
                    <Form.Control.Feedback type="invalid"> Email already exists </Form.Control.Feedback>
                </Form.Group>
				<br />
				<Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control className="position-relative" type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value.replace(/\s/g,''))} required/>
                </Form.Group>
				<br />
				<Button variant="primary" type="submit" value="Register" className="mb-3" > Submit </Button>
                <Button variant="danger" value="Register" className="mb-3" href="/"> Already Registered </Button>
			</Form>
        </Container>

    )
}
