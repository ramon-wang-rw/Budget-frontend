import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const[eInvalid, setEInvalid] = useState(false)
    const[pInvalid, setPInvalid] = useState(false)


    async function loginUser(event) {
        event.preventDefault()
        const response = await fetch('https://budget-api-utu0.onrender.com/api/login', {
            method:'POST',
            headers: {
				'Content-Type': 'application/json',
                
			},
            body: JSON.stringify({
                email,
                password
            }),
        })
        const data = await response.json()

        //checks if email is inputted incorrectly
        if(data.error === 'email') {
            setEInvalid(true);
            setPInvalid(false);
        }

        //logs in if both email and pass matches
        else if(data.user) {
            setEInvalid(false)
            setPInvalid(false)
            localStorage.setItem('token',data.user)
            alert('Login Successful')
            window.location.href = '/Budget'

        }

        //checks if password is inputted incorrectly
        else{
            setEInvalid(false)
            setPInvalid(true)
        }

    }

  return (

    <Container id="main-container" className="d-grid h-100">
        <Form onSubmit={loginUser} className="d-grid h-100 w-50">
            <h1 className="mb-3 fs-3 fw-normal text-center">Login</h1>

            <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control className="position-relative" type="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} isInvalid={eInvalid} required/>
                <Form.Control.Feedback type="invalid"> User does not exist </Form.Control.Feedback>
            </Form.Group>

            <br />

            <Form.Group className="mb-3" >
                <Form.Label>Password</Form.Label>
                <Form.Control className="position-relative" type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} isInvalid={pInvalid} required/>
                <Form.Control.Feedback type="invalid"> Wrong Password </Form.Control.Feedback>
            </Form.Group>

            <br />
            <Button variant="primary" type="submit" className="mb-3">
            Login
            </Button>
            <Button  href="register" variant="danger" className="mb-3">
            Register
            </Button>
        </Form>

    </Container>



  )
}
