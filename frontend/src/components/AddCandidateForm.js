import React, { useState } from 'react';
 
import FileUploader from './FileUploader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddCandidateForm = () => {
    const [candidate, setCandidate] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        educations: [],
        workExperiences: [],
        cv: null
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e, index, section) => {
        const updatedSection = [...candidate[section]];
        if (updatedSection[index]) {
            updatedSection[index][e.target.name] = e.target.value;
            setCandidate({ ...candidate, [section]: updatedSection });
        }
    };

    const handleDateChange = (date, index, section, field) => {
        const updatedSection = [...candidate[section]];
        if (updatedSection[index]) {
            updatedSection[index][field] = date;
            setCandidate({ ...candidate, [section]: updatedSection });
        }
    };

    const handleAddSection = (section) => {
        const newSection = section === 'educations' ? { institution: '', title: '', startDate: '', endDate: '' } : { company: '', position: '', description: '', startDate: '', endDate: '' };
        setCandidate({ ...candidate, [section]: [...candidate[section], newSection] });
    };

    const handleRemoveSection = (index, section) => {
        const updatedSection = [...candidate[section]];
        updatedSection.splice(index, 1);
        setCandidate({ ...candidate, [section]: updatedSection });
    };

    const handleCVUpload = (fileData) => {
        setCandidate({ ...candidate, cv: fileData });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const candidateData = {
                ...candidate,
                cv: candidate.cv ? {
                    filePath: candidate.cv.filePath,
                    fileType: candidate.cv.fileType
                } : null
            };

            // Format date fields to YYYY-MM-DD before sending to the endpoint
            candidateData.educations = candidateData.educations.map(education => ({
                ...education,
                startDate: education.startDate ? education.startDate.toISOString().slice(0, 10) : '',
                endDate: education.endDate ? education.endDate.toISOString().slice(0, 10) : ''
            }));
            candidateData.workExperiences = candidateData.workExperiences.map(experience => ({
                ...experience,
                startDate: experience.startDate ? experience.startDate.toISOString().slice(0, 10) : '',
                endDate: experience.endDate ? experience.endDate.toISOString().slice(0, 10) : ''
            }));

            const res = await fetch('http://localhost:3010/candidates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(candidateData)
            });

            if (res.status === 201) {
                setSuccessMessage('Candidato añadido con éxito');
                setError('');
            } else if (res.status === 400) {
                const errorData = await res.json();
                throw new Error('Datos inválidos: ' + errorData.message);
            } else if (res.status === 500) {
                throw new Error('Error interno del servidor');
            } else {
                throw new Error('Error al enviar datos del candidato');
            }
        } catch (error) {
            setError('Error al añadir candidato: ' + error.message);
            setSuccessMessage('');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 mt-12">
            <h1 className="mb-4 text-2xl font-semibold">Agregar Candidato</h1>
            <div className="shadow rounded border border-gray-200 p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Nombre</label>
                            <input type="text" name="firstName" required onChange={(e) => setCandidate({ ...candidate, firstName: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary mb-3" />

                            <label className="block text-sm text-gray-700 mb-1">Apellido</label>
                            <input type="text" name="lastName" required onChange={(e) => setCandidate({ ...candidate, lastName: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary mb-3" />

                            <label className="block text-sm text-gray-700 mb-1">Correo Electrónico</label>
                            <input type="email" name="email" required onChange={(e) => setCandidate({ ...candidate, email: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary mb-3" />

                            <label className="block text-sm text-gray-700 mb-1">Teléfono</label>
                            <input type="tel" name="phone" onChange={(e) => setCandidate({ ...candidate, phone: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary mb-3" />

                            <label className="block text-sm text-gray-700 mb-1">Dirección</label>
                            <input type="text" name="address" onChange={(e) => setCandidate({ ...candidate, address: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">CV</label>
                            <FileUploader onChange={handleCVUpload} onUpload={handleCVUpload} />

                            <div className="mt-4">
                                <button type="button" onClick={() => handleAddSection('educations')} className="inline-flex items-center px-3 py-2 rounded bg-primary text-white hover:bg-primary-dark text-sm">Añadir Educación</button>
                            </div>
                            {candidate.educations.map((education, index) => (
                                <div key={index} className="mb-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                                        <input placeholder="Institución" name="institution" value={education.institution} onChange={(e) => handleInputChange(e, index, 'educations')} className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                                        <input placeholder="Título" name="title" value={education.title} onChange={(e) => handleInputChange(e, index, 'educations')} className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                                        <DatePicker selected={education.startDate} onChange={(date) => handleDateChange(date, index, 'educations', 'startDate')} dateFormat="yyyy-MM-dd" placeholderText="Fecha de Inicio" className="rounded border border-gray-300 px-3 py-2" />
                                        <DatePicker selected={education.endDate} onChange={(date) => handleDateChange(date, index, 'educations', 'endDate')} dateFormat="yyyy-MM-dd" placeholderText="Fecha de Fin" className="rounded border border-gray-300 px-3 py-2" />
                                    </div>
                                    <button type="button" onClick={() => handleRemoveSection(index, 'educations')} className="mt-2 inline-flex items-center px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 text-sm">Eliminar</button>
                                </div>
                            ))}

                            <div className="mt-4">
                                <button type="button" onClick={() => handleAddSection('workExperiences')} className="inline-flex items-center px-3 py-2 rounded bg-primary text-white hover:bg-primary-dark text-sm">Añadir Experiencia Laboral</button>
                            </div>
                            {candidate.workExperiences.map((experience, index) => (
                                <div key={index} className="mb-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                                        <input placeholder="Empresa" name="company" value={experience.company} onChange={(e) => handleInputChange(e, index, 'workExperiences')} className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                                        <input placeholder="Puesto" name="position" value={experience.position} onChange={(e) => handleInputChange(e, index, 'workExperiences')} className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                                        <DatePicker selected={experience.startDate} onChange={(date) => handleDateChange(date, index, 'workExperiences', 'startDate')} dateFormat="yyyy-MM-dd" placeholderText="Fecha de Inicio" className="rounded border border-gray-300 px-3 py-2" />
                                        <DatePicker selected={experience.endDate} onChange={(date) => handleDateChange(date, index, 'workExperiences', 'endDate')} dateFormat="yyyy-MM-dd" placeholderText="Fecha de Fin" className="rounded border border-gray-300 px-3 py-2" />
                                    </div>
                                    <button type="button" onClick={() => handleRemoveSection(index, 'workExperiences')} className="mt-2 inline-flex items-center px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 text-sm">Eliminar</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="mt-5 inline-flex w-full justify-center items-center px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark">Enviar</button>
                    {error && <div className="mt-3 rounded border border-red-300 bg-red-50 text-red-800 p-3 text-sm">{error}</div>}
                    {successMessage && <div className="mt-3 rounded border border-green-300 bg-green-50 text-green-800 p-3 text-sm">{successMessage}</div>}
                </form>
            </div>
        </div>
    );
};

export default AddCandidateForm;