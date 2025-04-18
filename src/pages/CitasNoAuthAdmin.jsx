import React from 'react';
import TableCitasNoAuthAdmin from '../components/TableCitasNoAuthAdmin';
import Header from '../components/Header';
import Footer from '../components/footer';
import TokenService from '../services/tokenService';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CitasNoAuthAdmin = () => {
    const navigate = useNavigate();
    const userRole = TokenService.getRole();

    useEffect(() => {
        if (userRole !== 'ADMINISTRATOR') {
            navigate('/');
        }
    }, [userRole, navigate]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <TableCitasNoAuthAdmin />
            </main>
            <Footer />
        </div>
    );
};

export default CitasNoAuthAdmin; 