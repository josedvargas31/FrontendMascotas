import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Import imagenes
import imagenes from '../../styles/imagenes'
import iconos from '../../styles/iconos'
import Icon from '../atomos/IconVolver'
// Import conexion con el servidor
import axiosClient from '../axiosClient'
// Import de nextUI
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from '../nextUI/EyeFilledIcon'
import { EyeSlashFilledIcon } from '../nextUI/EyeSlashFilledIcon'
import { Button } from "@nextui-org/button";
// Import alertas 
import Swal from 'sweetalert2'
import { useFormik } from 'formik';
import * as yup from 'yup';

function IniciarSesion() {

    // navegacion para poder pasar a otra vista
    const navigate = useNavigate();

    // Esquema de validación con Yup
    const validationSchema = yup.object({
        correo: yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
        password: yup.string().required('La contraseña es obligatoria')
    });

    // Configuración de Formik
    const formik = useFormik({
        initialValues: {
            correo: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axiosClient.post('/validacion', values);
                console.log('datos enviados en la validación: ', response);

                if (response.status === 200) {

                    const { token, user } = response.data;
                     // Acceso directo a los datos del usuario
                     const userInfo = user[0] || user;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(userInfo));

                    const userRol = userInfo.rol;
                    
                    if (userRol === 'usuario') {
                        navigate('/listmascotas');
                    } else if (userRol === 'administrador') {
                        navigate('/mascotas');
                    } else if (userRol === 'superusuario') {
                        navigate('/usuarios');
                    }
                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: "Bienvenido " + userRol,
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    console.log('Response', response);
                    Swal.fire({
                        position: "top-center",
                        icon: "error",
                        title: "Datos Incorrectos",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    });

    // const para ver el estado dinámico del eye del password
    const [isVisible, setIsVisible] = React.useState(false);

    // toggleVisibility alterna la visibilidad de la contraseña entre texto y puntos.
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <>
            <div className="flex items-center justify-center bg-[#EDEBDE] min-h-screen p-4 w-full">
                <div className='relative flex flex-col m-2 space-y-5 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0'>
                    <div className="flex justify-center flex-col p-5 m-4 md:p-5">
                        <Link className='mb-2' to='/' >
                            <Icon icon={iconos.iconoVolver} className='w-6 h-6' />
                        </Link>

                        <span className="m-4 text-4xl font-bold">Inicio De Sesion</span>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={imagenes.imgPrincipalPets} className='h-32 w-32 rounded-xl' alt="" />
                        </div>
                        <div className="py-2">
                            <Input
                                type='email'
                                label='Ingrese su correo'
                                color="warning"
                                variant="bordered"
                                className='w-80'
                                name='correo'
                                id='correo'
                                value={formik.values.correo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.correo && !!formik.errors.correo}
                                errorMessage={formik.errors.correo}
                            />
                        </div>

                        <div className="py-2">
                            <Input
                                label='Ingrese su contraseña'
                                color="warning"
                                variant="bordered"
                                name='password'
                                id='password'
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.password && !!formik.errors.password}
                                errorMessage={formik.errors.password}
                                endContent={
                                    <button type="button" onClick={toggleVisibility}>
                                        {isVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none mb-2" />
                                        )}
                                    </button>
                                }
                                type={isVisible ? "text" : "password"}
                                className="max-w-xs"
                            />
                        </div>
                        <a href="/ruta" className="text-gray-700 hover:text-gray-900 hover:underline flex justify-center mt-3">
                            ¿Olvidó su contraseña?
                        </a>
                        <Button color="warning" className='mt-4 w-full text-white p-2'
                            onClick={formik.handleSubmit} >
                            Ingresar
                        </Button>
                    </div>
                    <div className='relative'>
                        <img src={imagenes.imgInicioSesionPets} className='w-[500px] h-full hidden rounded-r-2xl md:block object-cover' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default IniciarSesion;