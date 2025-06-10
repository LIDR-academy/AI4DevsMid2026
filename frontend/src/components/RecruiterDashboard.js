import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/lti-logo.png'; // Ruta actualizada para importar desde src/assets

const RecruiterDashboard = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 mt-12">
            <div className="text-center">
                <img src={logo} alt="LTI Logo" className="w-40 inline-block" />
            </div>
            <h1 className="text-3xl font-semibold text-center mt-4 mb-8">Dashboard del Reclutador</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="shadow rounded border border-gray-200 p-6">
                    <h5 className="text-lg font-medium mb-4">Añadir Candidato</h5>
                    <Link to="/add-candidate" className="inline-flex w-full justify-center items-center px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark">
                        Añadir Nuevo Candidato
                    </Link>
                </div>
                <div className="shadow rounded border border-gray-200 p-6">
                    <h5 className="text-lg font-medium mb-4">Ver Posiciones</h5>
                    <Link to="/positions" className="inline-flex w-full justify-center items-center px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark">
                        Ir a Posiciones
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard;