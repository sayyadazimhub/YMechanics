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
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const StatesPage = () => {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [stateDialogVisible, setStateDialogVisible] = useState(false);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/states');
            const result = await response.json();
            if (response.ok) {
                setStates(result.data);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch states' });
        } finally {
            setLoading(false);
        }
    };

    const onAddState = () => {
        setIsEditing(false);
        setSelectedState(null);
        setCode('');
        setName('');
        setStateDialogVisible(true);
    }

    const onEditState = (rowData) => {
        setIsEditing(true);
        setSelectedState(rowData);
        setCode(rowData.code);
        setName(rowData.name);
        setStateDialogVisible(true);
    }

    const saveState = async () => {
        const stateData = { code: code.toUpperCase(), name };

        try {
            const url = isEditing ? `/api/v1/states/${selectedState.id}` : '/api/v1/states';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stateData)
            });

            const result = await response.json();

            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                setStateDialogVisible(false);
                fetchStates();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save state' });
        }
    }

    const deleteState = async (id) => {
        try {
            const response = await fetch(`/api/v1/states/${id}`, { method: 'DELETE' });
            const result = await response.json();

            if (response.ok) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: result.message });
                fetchStates();
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: result.message });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete state' });
        }
    }

    const confirmDelete = (rowData) => {
        confirmDialog({
            message: `Are you sure you want to delete ${rowData.name}?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteState(rowData.id)
        });
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button icon="pi pi-pencil" onClick={() => onEditState(rowData)} className="p-button-rounded p-button-info p-button-sm" />
                <Button icon="pi pi-trash" onClick={() => confirmDelete(rowData)} className="p-button-rounded p-button-danger p-button-sm" />
            </div>
        );
    }

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />

            <Toolbar className="mb-4" start={<div className="text-2xl font-bold"><h1>States</h1></div>} end={<Button label='Add State' onClick={onAddState} icon="pi pi-plus" />} />

            <Card className="p-fluid m-4">
                <DataTable value={states} loading={loading} dataKey="id" paginator rows={10}
                    tableStyle={{ minWidth: '50rem' }}
                    emptyMessage="No states found.">
                    <Column field="code" header="Code" sortable style={{ width: '20%' }} />
                    <Column field="name" header="Name" sortable style={{ width: '60%' }} />
                    <Column header="Actions" body={actionBodyTemplate} style={{ width: '20%' }} />
                </DataTable>
            </Card>

            <Sidebar visible={stateDialogVisible} style={{ width: '450px' }} position='right' onHide={() => setStateDialogVisible(false)} className="p-sidebar-md">
                <div className="flex flex-col h-full">
                    <div className="text-xl font-bold mb-4">{isEditing ? 'Edit State' : 'Add New State'}</div>
                    <div className="border-t border-gray-200 dark:border-gray-700 mb-6"></div>

                    <div className="flex-1 overflow-auto">
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="stateCode" className="font-semibold text-gray-700 dark:text-gray-300">
                                    State Code <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    id="stateCode"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="e.g., CA"
                                    className="w-full"
                                    maxLength={2}
                                    style={{ textTransform: 'uppercase' }}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="stateName" className="font-semibold text-gray-700 dark:text-gray-300">
                                    State Name <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    id="stateName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., California"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                        <div className="flex gap-3 justify-end">
                            <Button label="Cancel" icon="pi pi-times" className="p-button-text p-button-secondary" onClick={() => setStateDialogVisible(false)} />
                            <Button label={isEditing ? "Update State" : "Save State"} icon="pi pi-check" className="p-button-primary" onClick={saveState} disabled={!code || !name} />
                        </div>
                    </div>
                </div>
            </Sidebar>
        </div>
    );
}

export default StatesPage;
