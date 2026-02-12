'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { SelectButton } from 'primereact/selectbutton';
import { Toast } from 'primereact/toast';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

function UsersPage() {

    const router = useRouter();
    const toast = useRef(null);

    // ================= STATES =================

    const [userData, setUserData] = useState({
        name: '',
        username: '',
        password: '',
        role: 'ADMIN',
        is_active: true
    });

    const [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState('Active');

    const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });


    // ================= TOKEN =================

    const getToken = () => {
        return localStorage.getItem('token');
    };


    const logout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };


    // ================= AUTH CHECK =================

    useEffect(() => {

        if (!getToken()) {
            router.push('/');
            return;
        }

        fetchUsers();

    }, []);


    // ================= FETCH USERS =================

    const fetchUsers = async () => {

        try {

            const res = await fetch('/api/v1/users?skip=0&take=10', {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            if (res.status === 401) {
                logout();
                return;
            }

            const data = await res.json();

            setUsers(
                (data.data || []).map(user => ({
                    ...user,
                    status: user.is_active ? 'Active' : 'Inactive'
                }))
            );

        } catch (error) {

            console.error(error);

            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load users'
            });
        }
    };


    // ================= ADD =================

    const onAddUser = () => {

        setVisible(true);
        setIsPasswordUpdate(false);

        setUserData({
            name: '',
            username: '',
            password: '',
            role: 'ADMIN',
            is_active: true
        });

        setStatus('Active');
    };


    // ================= EDIT =================

    const onEditUser = (rowData) => {

        setVisible(true);
        setIsPasswordUpdate(false);

        setUserData({
            id: rowData.id,
            name: rowData.name,
            username: rowData.username,
            role: rowData.role,
            is_active: rowData.is_active
        });

        setStatus(rowData.status);
    };


    // ================= TOOLBAR =================

    const startContent = (
        <h2 className="text-2xl font-bold"><span style={{ color: "#1E8496" }}>Users</span></h2>
    );

    const endContent = (
        <Button
            label="Add User"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={onAddUser}
        />
    );


    // ================= SAVE USER =================

    const saveUser = async () => {

        try {

            let url = '/api/v1/users';
            let method = 'POST';
            let payload = {};

            // UPDATE
            if (userData.id) {

                url += `?id=${userData.id}`;
                method = 'PUT';

                payload = {
                    name: userData.name,
                    is_active: status === 'Active'
                };

            }

            // CREATE
            else {

                payload = {
                    name: userData.name,
                    username: userData.username,
                    password: userData.password,
                    role: 'ADMIN',
                    is_active: status === 'Active'
                };
            }


            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(payload)
            });


            if (res.status === 401) {
                logout();
                return;
            }

            const data = await res.json();


            if (res.ok) {

                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: data.message
                });

                fetchUsers();
                setVisible(false);

            } else {

                toast.current.show({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: data.message
                });
            }

        } catch (error) {

            console.error(error);

            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Save failed'
            });
        }
    };


    // ================= PASSWORD =================

    const onUpdatePassword = (rowData) => {

        setVisible(true);
        setIsPasswordUpdate(true);

        setUserData({
            id: rowData.id,
            name: rowData.name,
            username: rowData.username
        });

        setPasswordData({
            newPassword: '',
            confirmPassword: ''
        });
    };


    const updatePassword = async () => {

        if (!passwordData.newPassword || !passwordData.confirmPassword) {
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Fill all fields'
            });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Passwords do not match'
            });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Min 6 characters'
            });
            return;
        }


        try {

            const res = await fetch(`/api/v1/users/password?id=${userData.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    newPassword: passwordData.newPassword
                })
            });


            if (res.status === 401) {
                logout();
                return;
            }

            const data = await res.json();


            if (res.ok) {

                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: data.message
                });

                setVisible(false);

            } else {

                toast.current.show({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: data.message
                });
            }

        } catch (error) {

            console.error(error);

            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Password update failed'
            });
        }
    };


    // ================= UI =================

    return (
        <>
            <Toolbar start={startContent} end={endContent} />
            <div className="p-4">

                <Toast ref={toast} />

                {/* TABLE */}

                <DataTable value={users} tableStyle={{ minWidth: '60rem' }}>

                    <Column field="name" header="Name" />

                    <Column field="username" header="Username" />

                    <Column field="role" header="Role" />

                    <Column field="status" header="Status" />

                    <Column
                        header="Edit"
                        body={(row) => (
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-info"
                                onClick={() => onEditUser(row)}
                            />
                        )}
                    />

                    <Column
                        header="Password"
                        body={(row) => (
                            <Button
                                icon="pi pi-lock"
                                className="p-button-rounded p-button-warning"
                                onClick={() => onUpdatePassword(row)}
                            />
                        )}
                    />

                </DataTable>


                {/* SIDEBAR */}

                <Sidebar
                    visible={visible}
                    position="right"
                    style={{ width: '30%' }}
                    onHide={() => setVisible(false)}
                >

                    <h2 className="mb-4 text-xl font-bold">

                        {isPasswordUpdate
                            ? `Update Password: ${userData.name}`
                            : userData.id
                                ? `Edit User: ${userData.name}`
                                : 'Add User'
                        }

                    </h2>


                    {/* USER FORM */}

                    {!isPasswordUpdate && (

                        <>

                            <label>Name</label>
                            <InputText
                                className="w-full mb-3"
                                value={userData.name}
                                onChange={(e) =>
                                    setUserData({ ...userData, name: e.target.value })
                                }
                            />


                            <label>Username</label>
                            <InputText
                                className="w-full mb-3"
                                value={userData.username}
                                disabled={!!userData.id}
                                onChange={(e) =>
                                    setUserData({ ...userData, username: e.target.value })
                                }
                            />


                            {!userData.id && (

                                <>
                                    <label>Password</label>

                                    <Password
                                        className="w-full mb-3"
                                        value={userData.password}
                                        onChange={(e) =>
                                            setUserData({ ...userData, password: e.target.value })
                                        }
                                        feedback={false}
                                        toggleMask
                                    />
                                </>
                            )}


                            {userData.id && (

                                <>
                                    <label>Status</label>

                                    <SelectButton
                                        className="w-full mb-4"
                                        value={status}
                                        options={['Active', 'Inactive']}
                                        onChange={(e) => setStatus(e.value)}
                                    />
                                </>
                            )}


                            <Button
                                label="Save"
                                icon="pi pi-check"
                                className="p-button-primary"
                                onClick={saveUser}
                            />

                        </>
                    )}


                    {/* PASSWORD FORM */}

                    {isPasswordUpdate && (

                        <>

                            <label>New Password</label>

                            <Password
                                className="w-full mb-3"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        newPassword: e.target.value
                                    })
                                }
                                feedback={false}
                                toggleMask
                            />


                            <label>Confirm Password</label>

                            <Password
                                className="w-full mb-4"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        confirmPassword: e.target.value
                                    })
                                }
                                feedback={false}
                                toggleMask
                            />


                            <Button
                                label="Update Password"
                                icon="pi pi-check"
                                className="p-button-primary"
                                onClick={updatePassword}
                            />

                        </>
                    )}

                </Sidebar>

            </div>
        </>
    );
}

export default UsersPage;
