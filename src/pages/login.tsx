/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState } from 'react'
import type { ReactElement } from 'react'
import Head from 'next/head'
import Button from '../components/Button'
import CardBox from '../components/CardBox'
import SectionFullScreen from '../components/Section/FullScreen'
import LayoutGuest from '../layouts/Guest'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import FormField from '../components/Form/Field'
import FormCheckRadio from '../components/Form/CheckRadio'
import Divider from '../components/Divider'
import Buttons from '../components/Buttons'
import { useRouter } from 'next/router'
import { getPageTitle } from '../config'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import ReCAPTCHA  from 'react-google-recaptcha'

type LoginForm = {
  username: string
  password: string
  remember: boolean
}

const LoginPage = () => {
  const router = useRouter()
  const [cookies, setCookie] = useCookies(['token'])
  const [errorMessage, setErrorMessage] = useState('') // Add state for error message
  const [captcha,setCaptcha] = useState(null)

  const initialValues: LoginForm = {
    username: '',
    password: '',
    remember: true,
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  })


  
  const handleSubmit = async (formValues: LoginForm) => {
    try {
    
      const response = await axios.post('http://localhost:5000/admin-login', {
        username: formValues.username,
        password: formValues.password,

      })
      console.log('Response from API:', response)

      if (response.data.accessToken) {
        setCookie('token', response.data.accessToken, {
          path: '/',
          secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
          sameSite: 'strict', 
        })
        console.log('Token saved, navigating to dashboard')
        router.push('/dashboard')
      } else {
        console.error('No token received')
        setErrorMessage('Login failed: Incorrect username or password') 
      }
    } catch (error) {
      console.error('Login failed:', error)
      setErrorMessage('Login failed: Incorrect username or password') 
    }
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Login')}</title>


      </Head>

      <SectionFullScreen bg="purplePink">
        <CardBox className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <FormField label="Username" help="Please enter your username">
                  <Field name="username" />
                  {errors.username && touched.username ? (
                    <div className="text-red-500">{errors.username}</div>
                  ) : null}
                </FormField>

                <FormField label="Password" help="Please enter your password">
                  <Field name="password" type="password" />
                  {errors.password && touched.password ? (
                    <div className="text-red-500">{errors.password}</div>
                  ) : null}
                </FormField>

                <FormCheckRadio type="checkbox" label="Remember">
                  <Field type="checkbox" name="remember" />
                </FormCheckRadio>

                {errorMessage && ( // Conditionally render error message
                  <div className="text-red-500">{errorMessage}</div>
                )}

                <Divider />

                <Buttons>
                  <Button type="submit" label="Login" color="info" disabled={!captcha} />
                  <ReCAPTCHA sitekey="6LfH23EqAAAAAEnXpixyqnRce_GhEvFwbHeTAqpu" onChange ={(val:any) => setCaptcha(val)} />
                </Buttons>
              </Form>
            )}
          </Formik>
        </CardBox>
      </SectionFullScreen>
    </>
  )
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>
}

export default LoginPage
