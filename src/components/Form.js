import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '../../src/App.css';

const UserForm = ({ values, errors, touched, status }) => {
	const [ users, setUsers ] = useState([]);
	useEffect(
		() => {
			if (status) {
				setUsers([ ...users, status ]);
				console.log(users);
			}
		},
		[ status ]
	);

	return (
		<div>
			<Form className="user-form">
				<label>
					Name:
					<Field type="text" name="name" />
					{touched.name && errors.name && <p className="error">{errors.name}</p>}
				</label>
				<label>
					Email:
					<Field type="email" name="email" />
					{touched.email && errors.email && <p className="error">{errors.email}</p>}
				</label>
				<label>
					Password:
					<Field type="password" name="password" />
					{touched.password && errors.password && <p className="error">{errors.password}</p>}
				</label>
				<label>
					Agree to Terms of Service:
					<Field type="checkbox" name="terms" checked={values.terms} />
					{errors.terms && <p className="error">{errors.terms}</p>}
				</label>
				<label>
					Role:
					<Field component="select" name="role">
						<option>Select a role... </option>
						<option value="Front End">Front End</option>
						<option value="Back End">Back End</option>
					</Field>
				</label>
				<button>Submit!</button>
			</Form>
			<div className="users">
				{users.map((user) => (
					<div className="user">
						<ul key={user.id}>
							<li>Name: {user.name}</li>
							<li>Email: {user.email}</li>
							<li>Password: {user.password}</li>
							<li>Role: {user.role}</li>
						</ul>
					</div>
				))}
			</div>
		</div>
	);
};

const FormikUserForm = withFormik({
	mapPropsToValues({ name, email, password, terms, role }) {
		return {
			name: name || 'Name',
			email: email || 'JohnDoe@mail.com',
			password: password || '**********',
			terms: terms || false,
			role: role || ''
		};
	},
	validationSchema: Yup.object().shape({
		name: Yup.string().required('You must put a name'),
		email: Yup.string().required('You must include an email'),
		password: Yup.string().min(7).required('You must include a password'),
		terms: Yup.boolean().oneOf([ true ], 'Must accept terms and conditions')
	}),
	handleSubmit(values, { setStatus, setErrors }) {
		if (values.email === 'waffle@syrup.com') {
			setErrors({ email: 'That email is already taken.' });
		} else {
			axios
				.post('https://reqres.in/api/users/', values)
				.then((res) => {
					setStatus(res.data);
				})
				.catch((err) => console.log(err.res));
		}
	}
})(UserForm);

export default FormikUserForm;
