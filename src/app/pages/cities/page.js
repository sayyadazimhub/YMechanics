'use client';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useState, useEffect, useRef } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const CitiesPage = () => {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [cityDialogVisible, setCityDialogVisible] = useState(false);
    const [name, setName] = useState('');
    const [selectedStateId, setSelectedStateId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchCities();
        fetchStates();
    }, []);

    const fetchCities = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/cities');
            const result = await response.json();
            if (response.ok) {
                setCities(result.data);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch cities' });
        } finally {
            setLoading(false);
        }
    };

    const fetchStates = async () => {
        try {
            const response = await fetch('/api/v1/states');
            const result = await response.json();
            if (response.ok) {
                setStates(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch states', error);
        }
    };

    const onAddCity = () => {
        setIsEditing(false);
        setSelectedCity(null);
        setName('');
        setSelectedStateId(null);
        setCityDialogVisible(true);
    }

    const onEditCity = (rowData) => {
        setIsEditing(true);
        setSelectedCity(rowData);
        setName(rowData.name);
        setSelectedStateId(rowData.state_id);
        setCityDialogVisible(true);
    }

    const saveCity = async () => {
        const cityData = { name, state_id: selectedStateId };

        try {
            const url = isEditing ? `/api/v1/cities/${selectedCity.id}` : '/api/v1/cities';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cityData)
            });

            const result = await response.json();

            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                setCityDialogVisible(false);
                fetchCities();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save city' });
        }
    }

    const deleteCity = async (id) => {
        try {
            const response = await fetch(`/api/v1/cities/${id}`, { method: 'DELETE' });
            const result = await response.json();

            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                fetchCities();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete city' });
        }
    }

    const confirmDelete = (rowData) => {
        confirmDialog({
            message: `Are you sure you want to delete ${rowData.name}?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteCity(rowData.id)
        });
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" onClick={() => onEditCity(rowData)} className="p-button-rounded p-button-info p-button-sm" />
                <Button icon="pi pi-trash" onClick={() => confirmDelete(rowData)} className="p-button-rounded p-button-danger p-button-sm" />
            </div>
        );
    }

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />

            <Toolbar className="mb-4" start={<div className="text-2xl font-bold"><h1>Cities</h1></div>} end={<Button label='Add City' onClick={onAddCity} icon="pi pi-plus" />} />

            <Card className="p-fluid m-4">
                <DataTable value={cities} loading={loading} dataKey="id" paginator rows={10}
                    tableStyle={{ minWidth: '50rem' }}
                    emptyMessage="No cities found.">
                    <Column field="name" header="City Name" sortable style={{ width: '40%' }} />
                    <Column field="state.name" header="State" sortable style={{ width: '40%' }} />
                    <Column header="Actions" body={actionBodyTemplate} style={{ width: '20%' }} />
                </DataTable>
            </Card>

            <Sidebar visible={cityDialogVisible} style={{ width: '450px' }} position='right' onHide={() => setCityDialogVisible(false)} className="p-sidebar-md">
                <div className="flex flex-col h-full">
                    <div className="text-xl font-bold mb-4">{isEditing ? 'Edit City' : 'Add New City'}</div>
                    <div className="border-t border-gray-200 dark:border-gray-700 mb-6"></div>

                    <div className="flex-1 overflow-auto">
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="cityName" className="font-semibold text-gray-700 dark:text-gray-300">
                                    City Name <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    id="cityName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Los Angeles"
                                    className="w-full"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="state" className="font-semibold text-gray-700 dark:text-gray-300">
                                    State <span className="text-red-500">*</span>
                                </label>
                                <Dropdown
                                    id="state"
                                    value={selectedStateId}
                                    options={states}
                                    onChange={(e) => setSelectedStateId(e.value)}
                                    optionLabel="name"
                                    optionValue="id"
                                    placeholder="Select a State"
                                    filter
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                        <div className="flex gap-3 justify-end">
                            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-secondary" onClick={() => setCityDialogVisible(false)} />
                            <Button label={isEditing ? "Update City" : "Save City"} icon="pi pi-check" className="p-button-primary" onClick={saveCity} disabled={!name || !selectedStateId} />
                        </div>
                    </div>
                </div>
            </Sidebar>
        </div>
    );
}

export default CitiesPage;