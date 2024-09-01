import React, { useContext, useEffect, useState } from 'react'
import RazaModal from '../templates/RazaModal.jsx';
import AccionesModal from '../organismos/ModalAcciones.jsx';
import Swal from 'sweetalert2';
import axiosClient from '../axiosClient.js';
import RazasContext from '../../context/RazasContext.jsx';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Dropdown,
    Pagination,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { PlusIcon } from "./../nextUI/PlusIcon.jsx";
import { SearchIcon } from "./../nextUI/SearchIcon.jsx";
import { EditIcon } from "../nextUI/EditIcon";
import { DeleteIcon } from "../nextUI/DeleteIcon";


function Razas() {

    function EjemploRaza() {
        const [filterValue, setFilterValue] = useState("");
        const [selectedKeys, setSelectedKeys] = useState(new Set([]));
        const [rowsPerPage, setRowsPerPage] = useState(5);

        const [sortDescriptor, setSortDescriptor] = useState({
            column: "fecha",
            direction: "ascending",
        });

        const [page, setPage] = useState(1);
        const hasSearchFilter = Boolean(filterValue);

        const filteredItems = React.useMemo(() => {
            let filteredrazas = razas;
            if (hasSearchFilter) {
                filteredrazas = filteredrazas.filter(raza =>
                    String(raza.nombre_raza).toLowerCase().includes(filterValue.toLowerCase()) ||
                    raza.nombre_categoria.toLowerCase().includes(filterValue.toLowerCase())
                );
            }

            return filteredrazas;
        }, [razas, filterValue]);

        const pages = Math.ceil(filteredItems.length / rowsPerPage);

        const items = React.useMemo(() => {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            return filteredItems.slice(start, end);
        }, [page, filteredItems, rowsPerPage]);

        const sortedItems = React.useMemo(() => {
            return [...items].sort((a, b) => {
                const first = a[sortDescriptor.column];
                const second = b[sortDescriptor.column];
                const cmp = first < second ? -1 : first > second ? 1 : 0;
                return sortDescriptor.direction === "descending" ? -cmp : cmp;
            });
        }, [sortDescriptor, items]);

        const renderCell = React.useCallback((raza, columnKey) => {
            const cellValue = raza[columnKey];


            switch (columnKey) {
                case "actions":
                    return (
                        <div className="relative flex justify-start items-center gap-2">
                            <Dropdown>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                        <EditIcon onClick={() => handleToggle('update', setRazaId(raza))} />
                                    </span>
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                        <DeleteIcon
                                            onClick={() => peticionDesactivar(raza.id_raza)}
                                        />
                                    </span>
                                </div>
                            </Dropdown>
                        </div>
                    );

                default:
                    return cellValue;
            }
        }, []);

        const onNextPage = React.useCallback(() => {
            if (page < pages) {
                setPage(page + 1);
            }
        }, [page, pages]);

        const onPreviousPage = React.useCallback(() => {
            if (page > 1) {
                setPage(page - 1);
            }
        }, [page]);

        const onRowsPerPageChange = React.useCallback((e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
        }, []);

        const onSearchChange = React.useCallback((value) => {
            if (value) {
                setFilterValue(value);
                setPage(1);
            } else {
                setFilterValue("");
            }
        }, []);

        const onClear = React.useCallback(() => {
            setFilterValue("");
            setPage(1);
        }, []);

        const topContent = React.useMemo(() => {
            return (
                <>
                    <div className="flex flex-col  mt-3">
                        <div className="flex justify-between gap-3 items-end">
                            <Input
                                isClearable
                                className="w-full sm:max-w-[44%] bg-[#f4f4f5] rounded"
                                placeholder="Buscar..."
                                startContent={<SearchIcon />}
                                value={filterValue}
                                onClear={() => onClear()}
                                onValueChange={onSearchChange}
                            />
                            <div className="flex gap-3">
                                <Button color="warning" className="mr-30 text-white" style={{ position: 'relative' }} endContent={<PlusIcon />} onClick={() => handleToggle('create')}>
                                    Registrar
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center z-10 mr-30 mt-2">
                            <span className="text-default-400 text-small">Total {razas.length} Resultados</span>
                            <label className="flex items-center text-default-400 mr-30 text-small">
                                Columnas por página:
                                <select
                                    className="bg-transparent outline-none text-default-400 text-small"
                                    onChange={onRowsPerPageChange}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </>
            );
        }, [
            filterValue,
            onRowsPerPageChange,
            onSearchChange,
            onClear,
            hasSearchFilter,
        ]);

        const bottomContent = React.useMemo(() => {
            return (
                <div className="py-2 px-2 flex justify-between items-center m-3">
                    <Pagination
                        showControls
                        initialPage={1}
                        color="warning"
                        page={page}
                        total={pages}
                        onChange={setPage}
                    />
                    <div className="hidden sm:flex w-[40%] justify-end gap-2">
                        <Button isDisabled={pages === 1} size="md" variant="shadow" className="text-black" onPress={onPreviousPage}>
                            Anterior
                        </Button>
                        <Button isDisabled={pages === 1} size="md" className="text-black mr-58" variant="shadow" onPress={onNextPage}>
                            Siguiente
                        </Button>
                    </div>
                </div>
            );
        }, [items.length, page, pages, hasSearchFilter]);

        return (
            <div className="flex flex-col items-center justify-center p-4 w-full">
                <div className="w-full  sm:w-12/12  lg:w-8/12 xl:w-10/12">
                    <Table
                        aria-label="Tabla"
                        isHeaderSticky
                        bottomContent={bottomContent}
                        bottomContentPlacement="outside"
                        classNames={{
                            wrapper: "max-h-[100%] max-w-[100%]",
                        }}
                        className="flex mr-16"
                        sortDescriptor={sortDescriptor}
                        topContent={topContent}
                        topContentPlacement="outside"
                        onSelectionChange={setSelectedKeys}
                        onSortChange={setSortDescriptor}
                    >
                        <TableHeader columns={data}>
                            {(column) => (
                                <TableColumn
                                    key={column.uid}
                                    align={column.uid === "actions" ? "center" : "start"}
                                    allowsSorting={column.sortable}
                                >
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody emptyContent={"No hay resultados registrados"} items={sortedItems}>
                            {(item) => (
                                <TableRow key={item.id_raza}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAcciones, setModalAcciones] = useState(false);
    const [mode, setMode] = useState('create');
    const [initialData, setInitialData] = useState(null);
    const [mensaje, setMensaje] = useState('')
    const [razas, setRazas] = useState([]);
    const { idRaza, setRazaId } = useContext(RazasContext)

    useEffect(() => {
        peticionGet()
    }, []);

    const peticionGet = async () => {
        try {
            await axiosClient.get('/razas/listar').then((response) => {
                setRazas(response.data)
            })
        } catch (error) {
            console.log('Error en el servidor ' + error)
        }
    };


    const data = [
        {
            uid: 'id_raza',
            name: 'Id',
            sortable: true
        },
        {
            uid: 'nombre_raza',
            name: 'Raza',
            sortable: true
        },
        {
            uid: 'nombre_categoria',
            name: 'Categoría',
            sortable: true
        },
        {
            uid: 'actions',
            name: "Acciones",
            sortable: true
        }
    ];
    const peticionDesactivar = async (id_raza) => {
        try {
            // Mostrar la alerta de confirmación primero
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "¡Esto podría afectar a tus razas!",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "orange",
                cancelButtonColor: "#d33",
                confirmButtonText: "¡Sí, estoy seguro!"
            });

            // Si el usuario confirma, se procede con la eliminación
            if (result.isConfirmed) {
                const response = await axiosClient.delete(`/razas/eliminar/${id_raza}`);

                if (response.status === 200) {
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "Raza eliminada correctamente.",
                        icon: "success"
                    });

                    // Actualizar la lista de razas
                    peticionGet();
                } else {
                    alert('Error al eliminar la raza');
                }
            }
        } catch (error) {
            alert('Error del servidor: ' + error);
        }
    };


    const handleSubmit = async (formData, e) => {
        e.preventDefault()

        try {

            if (mode === 'create') {

                await axiosClient.post('/razas/registrar', formData).then((response) => {
                    if (response.status == 200) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Raza registrada con éxito",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        peticionGet()
                    } else {
                        alert('Error en el registro')
                    }
                })
            } else if (mode === 'update') {
                await axiosClient.put(`/razas/actualizar/${idRaza.id_raza}`, formData).then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Se actualizó con éxito la raza",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        peticionGet()
                    } else {
                        alert('Error al actualizar')
                    }
                })
            }
            setModalOpen(false)

        } catch (error) {
            alert('Error en el servidor')
        }
    }

    const handleToggle = (mode, initialData) => {
        setInitialData(initialData)
        setModalOpen(true)
        setMode(mode)
    }
    return (

        <>
            <div className='w-full max-w-[90%] items-center p-10'>
                <AccionesModal
                    isOpen={modalAcciones}
                    onClose={() => setModalAcciones(false)}
                    label={mensaje}
                />
                <RazaModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={mode === 'create' ? 'Registrar raza' : 'Actualizar raza'}
                    actionLabel={mode === 'create' ? 'Registrar' : 'Actualizar'}
                    initialData={initialData}
                    handleSubmit={handleSubmit}
                    mode={mode}
                />
                <EjemploRaza
                    data={data}
                    razas={razas}
                />
            </div>
        </>
    )
}
export default Razas