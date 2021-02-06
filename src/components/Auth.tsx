import React, { useState } from "react";
import {
  Grid,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { User } from "../interfaces/user.interface";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AuthResponse } from "../services/mirage/Routes/user";
import http from "../services/api";
import { useAppDispatch } from "../redux/store";
import { saveToken, setAuthState } from "../redux/reducers/authSlice";
import { setUser } from "../redux/reducers/userSlice";

const initialValues: User = {
  email: "",
  username: "",
  password: "",
};

const validationSchema = Yup.object({
  username: Yup.string()
    .required("What? No username?")
    .max(16, "Username must be less than 16 characters"),
  email: Yup.string().email("Please provide a valid email address"),
  password: Yup.string().required('Without a password, "None shall pass"'),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const submitHandler = async (values: User) => {
    setLoading(true);
    try {
      const path = isLogin ? "/auth/login" : "/auth/signup";

      const res = await http.post<User, AuthResponse>(path, values);
      const { user, token } = res;
      dispatch(saveToken(token));
      dispatch(setUser(user));
      dispatch(setAuthState(true));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  return (
    <>
      <Container>
        <Grid container style={{ margin: "50px 0px" }} justify="center">
          <Grid item xs={12} sm={8} md={6}>
            <Paper>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submitHandler}
              >
                {(formik) => {
                  return (
                    <Form>
                      <Container>
                        <Grid container spacing={3} justify="center">
                          <Grid>
                            <Typography
                              variant="h4"
                              style={{ marginTop: 20 }}
                              gutterBottom
                            >
                              {isLogin ? "Login" : "Signup"} Form
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Field
                              name="username"
                              as={TextField}
                              label="Username"
                              variant="outlined"
                              error={
                                !!formik.touched.username &&
                                !!formik.errors.username
                              }
                              helperText={
                                <ErrorMessage
                                  name="username"
                                  component={() => (
                                    <Typography variant="caption">
                                      {formik.errors.username}
                                    </Typography>
                                  )}
                                />
                              }
                              fullWidth
                            />
                          </Grid>
                          {!isLogin ? (
                            <Grid item xs={12}>
                              <Field
                                name="email"
                                as={TextField}
                                label="Email"
                                variant="outlined"
                                error={
                                  !!formik.errors.email &&
                                  !!formik.touched.email
                                }
                                helperText={
                                  <ErrorMessage
                                    name="email"
                                    component={() => (
                                      <Typography variant="caption">
                                        {formik.errors.email}
                                      </Typography>
                                    )}
                                  />
                                }
                                fullWidth
                              />
                            </Grid>
                          ) : null}
                          <Grid item xs={12}>
                            <Field
                              name="password"
                              as={TextField}
                              label="Password"
                              variant="outlined"
                              error={
                                !!formik.touched.password &&
                                !!formik.errors.password
                              }
                              helperText={
                                <ErrorMessage
                                  name="password"
                                  component={() => (
                                    <Typography variant="caption">
                                      {formik.errors.password}
                                    </Typography>
                                  )}
                                />
                              }
                              fullWidth
                            />
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              type="submit"
                              disabled={loading}
                              startIcon={
                                loading ? (
                                  <CircularProgress
                                    size={20}
                                    color="secondary"
                                  />
                                ) : null
                              }
                            >
                              {isLogin ? "Login" : "Create Account"}
                            </Button>
                            <Typography
                              variant="button"
                              display="inline"
                              style={{ padding: "0px 10px", cursor: "pointer" }}
                              onClick={() => setIsLogin(!isLogin)}
                            >
                              {isLogin
                                ? "No account? Create one"
                                : "Already have an account?"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Container>
                    </Form>
                  );
                }}
              </Formik>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Auth;
