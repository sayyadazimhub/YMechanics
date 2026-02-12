'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* PrimeReact */
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';

/* Google Map */
import {
    GoogleMap,
    Marker,
    useLoadScript
} from '@react-google-maps/api';


const mapStyle = {
    width: '100%',
    height: '300px'
};

export default function RegisterPage() {

    const router = useRouter();

    /* Load Map */
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    });

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        phone: '',
        address: '',
        distance: '', // ✅ ADD
        state_id: '',
        city_id: '',
        latitude: '',
        longitude: ''
    });


    /* LOCATION DATA */
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    /* UI STATE */
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /* GET CURRENT LOCATION */
    useEffect(() => {

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }));
            },
            () => console.log('Location denied')
        );

    }, []);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await fetch('/api/v1/mechanic/locations');
                const data = await res.json();
                if (data.statusCode === "200") {
                    setStates(data.data);
                }
            } catch (err) {
                console.error("Error fetching states:", err);
            }
        };
        fetchStates();
    }, []);

    useEffect(() => {
        if (formData.state_id) {
            const fetchCities = async () => {
                try {
                    const res = await fetch(`/api/v1/mechanic/locations?stateId=${formData.state_id}`);
                    const data = await res.json();
                    if (data.statusCode === "200") {
                        setCities(data.data);
                    }
                } catch (err) {
                    console.error("Error fetching cities:", err);
                }
            };
            fetchCities();
        } else {
            setCities([]);
        }
        // Always reset city_id when state_id changes to prevent mismatched data
        setFormData(prev => ({ ...prev, city_id: '' }));
    }, [formData.state_id]);


    /* HANDLE INPUT */
    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /* SUBMIT */
    const handleSubmit = async () => {

        setLoading(true);
        setError('');

        const payload = {
            ...formData,
            distance: Number(formData.distance)
        };

        const res = await fetch('/api/v1/mechanic/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || 'Registration Failed');
            setLoading(false);
            return;
        }

        router.push(`/mechanic/verify-otp?email=${formData.username}&name=${formData.name}`);
    };

    /* MAP CENTER */
    const center = {
        lat: Number(formData.latitude) || 19.0760,
        lng: Number(formData.longitude) || 72.8777
    };


    return (
        // the btn text should be black and bg is blue and with a hover effect to change the bg color to a lighter shade of blue and the text inside the inputfield should be black and the background should be white
        // change the bg of form 
        <div className="flex justify-content-center align-items-center min-h-screen surface-900" style={{ background: 'linear-gradient(to right, #4f46e5, #8b5cf6)' }}>

            <div className="surface-card p-5 shadow-3 border-round w-full max-w-4xl">
                <h2 className="text-center text-3xl font-bold mb-4 " >Mechanic Registration</h2>

                {error && (
                    <Message severity="error" text={error} className="mb-3" />
                )}

                <div className="grid">

                    {/* NAME */}
                    <div className="col-6">
                        <InputText
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={e => handleChange('name', e.target.value)}
                            className="w-full text-black bg-white"
                        />
                    </div>

                    {/* USERNAME */}
                    <div className="col-6">
                        <InputText
                            placeholder="Username"
                            value={formData.username}
                            onChange={e => handleChange('username', e.target.value)}
                            className="w-full text-black bg-white"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="col-6">
                        <Password
                            placeholder="Password"
                            toggleMask
                            feedback={false}
                            value={formData.password}
                            onChange={e => handleChange('password', e.target.value)}
                            inputClassName='w-full text-black bg-white'
                            inputStyle={{ width: '100%' }}
                        />
                    </div>

                    {/* PHONE */}
                    <div className="col-6">
                        <InputText
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={e => handleChange('phone', e.target.value)}
                            className="w-full text-black bg-white"
                        />
                    </div>

                    {/* ADDRESS */}
                    <div className="col-12">
                        <InputTextarea
                            placeholder="Address"
                            rows={3}
                            value={formData.address}
                            onChange={e => handleChange('address', e.target.value)}
                            className="w-full text-black bg-white"
                        />
                    </div>

                    {/* DISTANCE */}
                    <div className="col-6">
                        <InputText
                            placeholder="Service Distance (km)"
                            value={formData.distance}
                            onChange={e => handleChange('distance', e.target.value)}
                            className="w-full text-black bg-white"
                            type="number"
                        />
                    </div>


                    {/* STATE */}
                    <div className="col-6">
                        <Dropdown
                            value={formData.state_id}
                            options={states}
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Select State"
                            onChange={e => handleChange('state_id', e.value)}
                            className="w-full text-black bg-white"
                        />
                    </div>

                    {/* CITY */}
                    <div className="col-6">
                        <Dropdown
                            value={formData.city_id}
                            options={cities}
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Select City"
                            onChange={e => handleChange('city_id', e.value)}
                            className="w-full text-black bg-white"
                            disabled={!formData.state_id}
                        />
                    </div>

                    {/* MAP */}
                    <div className="col-12">

                        <p className="font-semibold mb-2">
                            Select Workshop Location
                        </p>

                        {!isLoaded ? (
                            <p>Loading Map...</p>
                        ) : (
                            <GoogleMap
                                mapContainerStyle={mapStyle}
                                center={center}
                                zoom={15}
                                onClick={(e) => {
                                    handleChange('latitude', e.latLng.lat());
                                    handleChange('longitude', e.latLng.lng());
                                }}
                            >

                                <Marker
                                    position={center}
                                    draggable
                                    onDragEnd={(e) => {
                                        handleChange('latitude', e.latLng.lat());
                                        handleChange('longitude', e.latLng.lng());
                                    }}
                                />

                            </GoogleMap>
                        )}

                    </div>
                    {/* Latitude and longitude take live from map */}
                    <div className="col-6">
                        <InputText
                            placeholder="Latitude"
                            value={formData.latitude}
                            onChange={e => handleChange('latitude', e.target.value)}
                            className="w-full text-black bg-white"
                            type="number"
                        />
                    </div>
                    <div className="col-6">
                        <InputText
                            placeholder="Longitude"
                            value={formData.longitude}
                            onChange={e => handleChange('longitude', e.target.value)}
                            className="w-full text-black bg-white"
                            type="number"
                        />
                    </div>

                </div>

                {/* SUBMIT */}
                <Button
                    label="Register"
                    icon="pi pi-user-plus"
                    loading={loading}
                    onClick={handleSubmit}
                    className="w-full mt-4"
                />

            </div>

        </div>
    );
}


