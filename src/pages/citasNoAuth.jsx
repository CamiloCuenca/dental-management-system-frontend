import React from 'react';
import TableCitasNoAuthAdmin from '../components/TableCitasNoAuthAdmin';
import TableCitasNoAuthDoctor from '../components/TableCitasNoAuthDoctor';
import TokenService from '../services/tokenService';
import Header from '../components/Header';
import Footer from '../components/footer';

const CitasNoAuth = () => {
    const userRole = TokenService.getRole();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                {userRole === 'ADMIN' ? (
                    <TableCitasNoAuthAdmin />
                ) : userRole === 'DOCTOR' ? (
                    <TableCitasNoAuthDoctor />
                ) : (
                    <div>No tienes permisos para ver esta página</div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CitasNoAuth; 