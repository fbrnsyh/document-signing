import { useRef, useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Eraser } from 'lucide-react';

export default function SignatureCanvas({ onSave, onCancel }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // Use a color that works well in both light and dark modes, or stick to black/primary
        ctx.strokeStyle = '#000'; 
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    const startDrawing = (e) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsEmpty(false);
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
    };

    const handleSave = () => {
        if (isEmpty) return;
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="border-2 border-dashed border-border rounded-xl bg-background flex items-center justify-center relative overflow-hidden h-64">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={250}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    className="cursor-crosshair touch-none bg-white"
                />
                <button 
                    onClick={clear}
                    className="absolute top-2 right-2 p-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-destructive transition-colors shadow-sm"
                    title="Clear"
                >
                    <Eraser className="h-4 w-4" />
                </button>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
                <PrimaryButton 
                    onClick={handleSave}
                    disabled={isEmpty}
                >
                    Apply Signature
                </PrimaryButton>
            </div>
        </div>
    );
}
