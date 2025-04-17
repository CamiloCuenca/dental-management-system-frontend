import React from 'react';
import TableCitasNoAuth from '../components/TableCitasNoAuth';
import Header from '../components/Header';
import Footer from '../components/footer';

const CitasNoAuth = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <TableCitasNoAuth />
            </main>
            <Footer />
        </div>
    );
};

export default CitasNoAuth; 