import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from "axios";
import { useHistory } from "react-router-dom";

function Registration() {

    let history = useHistory();

    const initialValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(10).required(),
        password: Yup.string().min(4).max(20).required(),
    });

    const onSubmit = (data) => {
        axios.post("http://localhost:3001/auth", data).then((response) => {
            history.push("/login");
        })
    }


    return (
        <div className='Registration'>

        <h1 align="center">Register</h1>

            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>

                <Form className='formContainer'>

                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field
                        id="inputRegistration"
                        name="username"
                        placeholder="username"
                    />

                    <label>Password: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field
                        type="password"
                        id="inputRegistration"
                        name="password"
                        placeholder="password"
                    />

                    <button type='submit'>Register</button>

                </Form>

            </Formik>

        </div>
    )
}

export default Registration;
