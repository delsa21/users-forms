import React, { useState } from 'react'

const Login = () => {
    const [form,setForm] = useState({
        firstName: '',
    });
    const handleChange = (e) => {
        console.log(e.target.value);
        console.log(e.target.name);
        const { name, value } = e.target;
        const newForm = {
            ...form,
            [name]:value
        }
    };

  return (
    <>
    <div>Login</div>
    <label>
        first name:
        <input
            type="text"
            name="firstName"
            value={form.name}
            onChange={handleChange}/>
        
      
    </label>
    </>
    
  )
}

export default Login