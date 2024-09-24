import React from 'react';
import './GrumpySpinner.module.css';

interface GrumpySpinnerProps {
    isLoading: boolean;
    altText?: string;
}

const GrumpySpinner: React.FC<GrumpySpinnerProps> = ({ isLoading, altText = "Loading image" }) => {
    console.log('isLoading: ', isLoading);
    return (
        <>
            <div className="spinner-overlay">
                <img src='./GrumpyFortunes.png' alt={altText} className="spinner" />
            </div>
        </>
    );
};

export default GrumpySpinner;
