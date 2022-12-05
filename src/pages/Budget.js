import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { decodeToken } from "react-jwt";
import {Navbar, Container, Button, Form, Card, Modal} from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid';



export default function Budget() {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const[email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [allowance, setAllowance] = useState('')

    const[invalid, setInvalid] = useState(false)

    const[budgets, setBudgets] = useState([])


    const [uName, setUName] = useState('')
    const [uAllowance, setUAllowance] = useState('')
    const [uId, setUId] = useState('')
    const [show, setShow] = useState(false);
    function handleShow(name, allowance, id) {
        setShow(true);
        setUName(name);
        setUAllowance(allowance);
        setUId(id)

    }
    const handleClose = () => {
        setShow(false);
    }


    async function populateBudget() {
        const req = await fetch('http://localhost:5000/api/getBudget', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
            setBudgets(data.budgets)
		} else {
			alert(data.error)
		}
        return;
    }

    async function addBudget(event) {
        event.preventDefault();
        const id = uuidv4();
        const response = await fetch('http://localhost:5000/api/addBudget', {
            method:'POST',
            headers: {
				'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
                
			},
            body: JSON.stringify({
                name: name,
                allowance: allowance,
                id: id
            }),
        })
        const data = await response.json()

        if(data.status === 'error') {
            console.log('reached')
            setInvalid(true)
        }
        else {
            console.log('tes')
            setInvalid(false)
            let newBudget = {name: name, allowance: allowance, email: email, id:id};
            if(budgets === undefined) {
                setBudgets([newBudget])
            }
            else {
                setBudgets(prevState => [...prevState, newBudget]);
            }
            
            alert('Budget added')
        }

    }

    async function deleteBudget(id) {
        const response = await fetch('http://localhost:5000/api/deleteBudget', {
            method:'POST',
            headers: {
				'Content-Type': 'application/json',
                
			},
            body: JSON.stringify({
                id: id
            }),
        })
        const data = await response.json()
        
        if(data.status === 'error'){
            alert('delete unsucessful')
        }
        else{
            const newBudgets = budgets.filter(item => item.id !== id);
            setBudgets(newBudgets);
            alert('deleted succesfully');
        }

    }

    async function updateBudget(id) {
        const response = await fetch('http://localhost:5000/api/updateBudget', {
            method:'POST',
            headers: {
				'Content-Type': 'application/json',
                
			},
            body: JSON.stringify({
                id: id,
                name: uName,
                allowance: uAllowance
            }),
        })
        const data = await response.json()
        
        if(data.status === 'error'){
            alert('update unsucessful')
        }
        else{
            const newBudgets = [...budgets];
            const toUpdate = newBudgets.find(
              a => a.id === id
            );
            toUpdate.name = uName;
            toUpdate.allowance = uAllowance;
            setBudgets(newBudgets);
            alert('Update Succesful')
            setShow(false);
        }
    }


    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token) {
            const user = decodeToken(token);
            setFirstname(user.firstname)
            setLastname(user.lastname)
            setEmail(user.email)
            if (!user) {
                localStorage.removeItem('token')
                navigate('/')
            }
            else {
                populateBudget();
            }
        }
        else{
            navigate('/')
        }
    }, [])

    function logOff(){
        localStorage.removeItem('token')
        navigate('/')
    }

  return (
    <div>
        <Navbar bg="primary" expand="lg">
            <Container className="justify-content-center">
                <Navbar.Brand className='text-white'>Welcome {firstname} {lastname}!</Navbar.Brand>
            </Container>
            <Button variant="danger" onClick={logOff}>Log Off</Button>
        
        </Navbar>
        <Form onSubmit={addBudget}>
            <Form.Group className="mb-3">
                <Form.Label>Budget Name</Form.Label>
                <Form.Control className="position-relative" type="text" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} isInvalid={invalid} required/>
                <Form.Control.Feedback type="invalid"> Budget already exists </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Total Budget</Form.Label>
                <Form.Control className="position-relative" type="number" placeholder="Enter Budget Allowance" onChange={(e) => setAllowance(e.target.value)} required/>
            </Form.Group>
            <Button variant="primary" type="submit" className="mb-3">
            Add Budget
            </Button>
  
        </Form>
        {budgets.map(d => (
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                <Card.Title>{d.name}</Card.Title>
                <Card.Text className="me-3">
                ${d.allowance} 
                 </Card.Text>


                <Button onClick={() => handleShow(d.name, d.allowance, d.id)} className="me-3">
                    Update
                </Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Exercise</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form onSubmit={addBudget}>
                            <Form.Group className="mb-3">
                                <Form.Label>Budget Name</Form.Label>
                                <Form.Control className="position-relative" value={uName} type="text" placeholder="Enter Name" onChange={(e) => setUName(e.target.value)} required/>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Total Budget</Form.Label>
                                <Form.Control className="position-relative" value={uAllowance} type="number" placeholder="Enter Budget Allowance" onChange={(e) => setUAllowance(e.target.value)} required/>
                            </Form.Group>
  
                        </Form>
                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => updateBudget(d.id)}>
                        Update
                    </Button>
                    </Modal.Footer>
                </Modal>


                <Button onClick={() => deleteBudget(d.id)} variant="danger" className="me-3">
                    Delete
                </Button>
                </Card.Body>
            </Card>
        ))}


    </div>
    
  )
}
