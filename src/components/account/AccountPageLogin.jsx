// react
import React, { useState } from "react";
// third-party
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { connect } from "react-redux";
// application
import PageHeader from "../shared/PageHeader";
import { Check9x7Svg } from "../../svg";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchCartData, addLocalCartToDB } from "../../store/cart";

function AccountPageLogin(props) {
	const { fetchCartData, addLocalCartToDB } = props;
	const breadcrumb = [
		{ title: "الرئيسية", url: `/` },
		{ title: "حسابي", url: "" },
	];
	const token = localStorage.getItem("token");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [EmailError, setrEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [disabledLogin, setDisabledLogin] = useState(false);
	let history = useHistory();

	const Login = () => {
		setDisabledLogin(true);
		setrEmailError("");
		setPasswordError("");
		const data = {
			user_name: email,
			password: password,
		};
		axios.post("https://backend.atlbha.sa/api/loginapi", data).then((res) => {
			if (res?.data?.success === true && res?.data?.data?.status === 200) {
				toast.success(res?.data?.message?.ar, { theme: "colored" });
				localStorage.setItem("token", res?.data?.data?.token);
				history.push("/");
				addLocalCartToDB();
				fetchCartData();
				setDisabledLogin(false);
			} else {
				setrEmailError(res?.data?.message?.en?.user_name?.[0]);
				setPasswordError(res?.data?.message?.en?.password?.[0]);
				setDisabledLogin(false);
			}
		});
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			Login();
		}
	};

	if (token) {
		history.push("/");
	}

	return (
		<React.Fragment>
			<Helmet>
				<title>{`تسجيل الدخول — ${localStorage.getItem("store-name")}`}</title>
			</Helmet>

			<PageHeader header='حسابي' breadcrumb={breadcrumb} />

			<div className='block'>
				<div className='container'>
					<div className='row'>
						<div className='col-md-6 d-flex'>
							<div className='card flex-grow-1 mb-md-0'>
								<div className='card-body'>
									<h3 className='card-title'>تسجيل الدخول</h3>
									<form>
										<div className='form-group'>
											<label htmlFor='login-email'>البريد الالكتروني</label>
											<input
												id='login-email'
												type='email'
												className='form-control'
												placeholder='البريد الالكتروني'
												name='email'
												value={email}
												onKeyDown={handleKeyDown}
												onChange={(e) => {
													setEmail(e.target.value);
												}}
											/>
											<span className='text-danger'>
												{EmailError && EmailError}
											</span>
										</div>
										<div className='form-group'>
											<label htmlFor='login-password'>كلمة المرور</label>
											<input
												id='login-password'
												type='password'
												className='form-control'
												placeholder='كلمة المرور'
												name='password'
												value={password}
												onKeyDown={handleKeyDown}
												onChange={(e) => {
													setPassword(e.target.value);
												}}
											/>
											<span className='text-danger'>
												{passwordError && passwordError}
											</span>
											<small className='form-text text-muted'>
												<Link to='/'>نسيت كلمة المرور</Link>
											</small>
										</div>
										<div className='form-group'>
											<div className='form-check'>
												<span className='form-check-input input-check'>
													<span className='input-check__body'>
														<input
															id='login-remember'
															type='checkbox'
															className='input-check__input'
														/>
														<span className='input-check__box' />
														<Check9x7Svg className='input-check__icon' />
													</span>
												</span>
												<label
													className='form-check-label'
													htmlFor='login-remember'>
													تذكرني
												</label>
											</div>
										</div>
										<button
											type='button'
											disabled={disabledLogin}
											onClick={Login}
											className='btn btn-primary mt-2 mt-md-3 mt-lg-4'>
											تسجيل الدخول
										</button>
									</form>
								</div>
							</div>
						</div>
						<div className='col-md-6 d-flex mt-4 mt-md-0'>
							<div className='card flex-grow-1 mb-0'>
								<div className='card-body'>
									<h3 className='card-title'>الاشتراك</h3>
									<form>
										<div className='form-group'>
											<label htmlFor='register-email'>البريد الالكتروني</label>
											<input
												id='register-email'
												type='email'
												className='form-control'
												placeholder='البريد الالكتروني'
											/>
										</div>
										<div className='form-group'>
											<label htmlFor='register-password'>كلمة المرور</label>
											<input
												id='register-password'
												type='password'
												className='form-control'
												placeholder='كلمة المرور'
											/>
										</div>
										<div className='form-group'>
											<label htmlFor='register-confirm'>
												اعادة كلمة المرور
											</label>
											<input
												id='register-confirm'
												type='password'
												className='form-control'
												placeholder='اعادة كلمة المرور'
											/>
										</div>
										<button
											type='submit'
											className='btn btn-primary mt-2 mt-md-3 mt-lg-4'>
											الاشتراك
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}
const mapStateToProps = (state) => ({
	cart: state.cart,
});

const mapDispatchToProps = {
	fetchCartData,
	addLocalCartToDB,
};
export default connect(mapStateToProps, mapDispatchToProps)(AccountPageLogin);
