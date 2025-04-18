import React from 'react';
import TableCitasNoAuthDoctor from '../components/TableCitasNoAuthDoctor';
import Header from '../components/Header';
import Footer from '../components/footer';
import TokenService from '../services/tokenService';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CitasNoAuthDoctor = () => {
    const navigate = useNavigate();
    const userRole = TokenService.getRole();

    useEffect(() => {
        if (userRole !== 'DOCTOR') {
            navigate('/');
        }
    }, [userRole, navigate]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <TableCitasNoAuthDoctor />
            </main>
            <Footer />
        </div>
    );
};

export default CitasNoAuthDoctor; 