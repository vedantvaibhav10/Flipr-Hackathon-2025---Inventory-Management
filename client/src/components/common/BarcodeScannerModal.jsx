import { useState } from 'react';
import Modal from './Modal';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { CameraOff } from 'lucide-react';

const BarcodeScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
    const [error, setError] = useState('');

    const handleUpdate = (err, result) => {
        if (result) {
            onScanSuccess(result.text);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Scan Product Barcode">
            <div className="bg-black rounded-lg overflow-hidden relative w-full aspect-video">
                {isOpen && (
                    <BarcodeScannerComponent
                        onUpdate={handleUpdate}
                        onError={(err) => setError("Could not access camera. Please grant permission and try again.")}
                        facingMode="environment"
                        torch={false}
                    />
                )}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
                        <CameraOff size={48} className="mb-4 text-danger" />
                        <p className="text-center">{error}</p>
                    </div>
                )}
            </div>
            <p className="text-center text-text-secondary mt-4 text-sm">
                Point your camera at a product's barcode.
            </p>
        </Modal>
    );
};

export default BarcodeScannerModal;
