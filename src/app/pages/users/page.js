'use client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { SelectButton } from 'primereact/selectbutton';
import { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';

import { useState } from 'react';

function UsersPage() {
    const [userData, setUserData] = useState({ name: '', username: '', password: '', role: 'ADMIN', is_active: true });
    const [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState('Active');
    const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const toast = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/v1/users?skip=0&take=10');
            const data = await response.json();
            console.log('Fetched users data:', data);
            setUsers(data.data.map(user => ({
                ...user,
                status: user.is_active ? 'Active' : 'Inactive'
            })));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    const onAddUser = () => {
        setVisible(true);
        setIsPasswordUpdate(false);
        setUserData({ name: '', username: '', password: '' });
    }

    const onEditUser = (rowData) => {
        setVisible(true);
        setIsPasswordUpdate(false);
        setUserData({ id: rowData.id, name: rowData.name, username: rowData.username });
        setStatus(rowData.status);
    }
    
    const startContent = <h2 className="text-2xl font-bold">Users</h2>;
    const endContent = (
        <Button label="Add User" onClick={onAddUser} icon="pi pi-plus" className="p-button-success" />
    );
    
    
    const saveUser = () => {
        if (userData.id) {
            // Update existing user
            fetch(`/api/v1/users?id=${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: userData.name,
                    is_active: status === 'Active' ? true : false
                })
            }).then(response => response.json())
            .then(data => {
                if (data.statusCode === "200") {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: data.message });
                    fetchUsers();
                    setVisible(false);
                }
                    if (data.statusCode === "404") {
                        toast.current.show({ severity: 'warn', summary: 'Warning', detail: data.message });
                    }
                }).catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update user' });
                    console.error('Error updating user:', error);
                }
                );
            return;
        } else {
            fetch('/api/v1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: userData.name,
                    username: userData.username,
                    password: userData.password,
                    role: 'ADMIN',
                    is_active: status === 'Active' ? true : false
                })
            }).then(response => response.json())
                .then(data => {
                    if (data.statusCode === "201") {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: data.message });
                        fetchUsers();
                        setVisible(false);
                    }
                    if (data.statusCode === "202" || data.statusCode === "203") {
                        toast.current.show({ severity: 'warn', summary: 'Warning', detail: data.message });
                    }
                }).catch(error => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save user' });
                    console.error('Error saving user:', error);
                }
            );
        }
    };
    
    const onUpdatePassword = (rowData) => {
        setVisible(true);
        setIsPasswordUpdate(true);
        setUserData({ id: rowData.id, name: rowData.name, username: rowData.username });
        setPasswordData({ newPassword: '', confirmPassword: '' });
    }
    const updatePassword = () => {
        // Validate passwords
        if (!passwordData.newPassword || !passwordData.confirmPassword) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please fill in all password fields' });
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Passwords do not match' });
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Password must be at least 6 characters' });
            return;
        }

        // Send update request
        fetch(`/api/v1/users/password?id=${userData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newPassword: passwordData.newPassword
            })
        }).then(response => response.json())
            .then(data => {
                if (data.statusCode === "200") {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: data.message });
                    setVisible(false);
                    setPasswordData({ newPassword: '', confirmPassword: '' });
                } else {
                    toast.current.show({ severity: 'warn', summary: 'Warning', detail: data.message });
                }
            }).catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update password' });
                console.error('Error updating password:', error);
            });
    };


    return (

        <div className="p-8">
            <Toolbar start={startContent} end={endContent} />
            <Toast ref={toast} />
            <DataTable value={users} tableStyle={{ minWidth: '50rem' }}>
                <Column field="id" header="ID"></Column>
                <Column field="username" header="Username"></Column>
                <Column field="role" header="Role"></Column>
                <Column field="status" header="Status"></Column>
                <Column header="Actions" body={(rowData) => (
                    <Button onClick={() => onEditUser(rowData)} icon="pi pi-pencil" className="p-button-rounded p-button-info" />
                )}></Column>
                <Column header="Update Password" body={(rowData) => (
                    <Button onClick={() => onUpdatePassword(rowData)} icon="pi pi-lock" className="p-button-rounded p-button-info" />
                )}></Column>
            </DataTable>
            <Sidebar visible={visible} style={{ width: '30%' }} position='right' onHide={() => setVisible(false)}>
                <h2>{isPasswordUpdate ? `Update Password: ${userData.name}` : (userData.name && userData.id ? `Edit User: ${userData.name}` : 'Add User')}</h2>
                {/* Add User Form Elements Here */}
                {!isPasswordUpdate && (
                    <>
                        <div>
                            <label className="block mb-2">Name</label>
                            <InputText className="w-full mb-4" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block mb-2">Username</label>
                            <InputText className="w-full mb-4" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
                        </div>
                        {userData.id ? '' : (
                            <div>
                                <label className="block mb-2">Password</label>
                                <Password className="w-full mb-4" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
                            </div>
                        )}
                        {userData.id ? (
                            <div>
                                <label className="block mb-2">Status</label>
                                <SelectButton value={status} onChange={(e) => setStatus(e.value)} className="w-full mb-4" options={['Active', 'Inactive']} />
                            </div>
                        ) : ''}
                        <Button label="Save" icon="pi pi-check" className="p-button-primary" onClick={saveUser} />
                    </>
                )}
                {isPasswordUpdate && (
                    <>
                        <div>
                            <label className="block mb-2">New Password</label>
                            <Password className="w-full mb-4" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} feedback={false} toggleMask />
                        </div>
                        <div>
                            <label className="block mb-2">Confirm Password</label>
                            <Password className="w-full mb-4" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} feedback={false} toggleMask />
                        </div>
                        <Button label="Update Password" icon="pi pi-check" className="p-button-primary" onClick={updatePassword} />
                    </>
                )}

            </Sidebar>
        </div>

    );
}

export default UsersPage;