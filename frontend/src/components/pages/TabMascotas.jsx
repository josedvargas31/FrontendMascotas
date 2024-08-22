import React from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Municipios from './Municipios.jsx';
import Departamentos from './Departamentos.jsx';
import Mascotas from './Mascota.jsx';
import Razas from './Razas.jsx';
import Header from '../moleculas/Header.jsx';

const TabMascotas = () => {
    return (
        <div className='bg-[#EAEDF6] min-h-screen h-full'>
            <Header />
            <div className='bg-[#EAEDF6] flex flex-col items-center'>
                <div className='w-full max-w-[95%] p-6 flex-grow'>
                    <div className="flex flex-col gap-6 w-full h-full bg-[#EAEDF6]">
                        <Tabs aria-label="Options" variant="bordered">
                            <Tab key="departamentos" title="Departamentos">
                                <Card className="h-full">
                                    <CardBody>
                                        <Departamentos />
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="municipios" title="Municipios">
                                <Card className="h-full">
                                    <CardBody>
                                        <Municipios />
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="mascotas" title="Mascotas">
                                <Card className="h-full">
                                    <CardBody>
                                        <Mascotas />
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="razas" title="Razas">
                                <Card className="h-full">
                                    <CardBody>
                                        <Razas />
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default TabMascotas