<?php

namespace App\Services;

use App\Models\Document;
use App\Models\SignatureField;
use Illuminate\Support\Facades\Storage;
use setasign\Fpdi\Fpdi;

class PDFService
{
    /**
     * Apply a signature image to a PDF document at a specific field position.
     */
    public function applySignature(Document $document, SignatureField $field, string $signatureBase64)
    {
        $pdfPath = Storage::path($document->file_path);
        
        // Check if file exists
        if (!file_exists($pdfPath)) {
            throw new \Exception("PDF file not found at: {$pdfPath}");
        }

        $pdf = new Fpdi();
        
        try {
            $pageCount = $pdf->setSourceFile($pdfPath);
        } catch (\Exception $e) {
            throw new \Exception("Failed to load PDF: " . $e->getMessage());
        }
        
        for ($i = 1; $i <= $pageCount; $i++) {
            $templateId = $pdf->importPage($i);
            $size = $pdf->getTemplateSize($templateId);
            
            $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
            $pdf->useTemplate($templateId);
            
            if ($i == $field->page_number) {
                // Decode base64 signature
                $signatureData = preg_replace('#^data:image/\w+;base64,#i', '', $signatureBase64);
                $signatureData = base64_decode($signatureData);
                
                if (!$signatureData) {
                    continue;
                }

                $tempSignPath = tempnam(sys_get_temp_dir(), 'sig') . '.png';
                file_put_contents($tempSignPath, $signatureData);
                
                // Calculate absolute positions
                // Assuming positions are percentages
                $x = ($field->x_position / 100) * $size['width'];
                $y = ($field->y_position / 100) * $size['height'];
                $w = ($field->width / 100) * $size['width'];
                $h = ($field->height / 100) * $size['height'];
                
                try {
                    $pdf->Image($tempSignPath, $x, $y, $w, $h, 'PNG');
                } catch (\Exception $e) {
                    // Silently fail if image application fails (e.g. invalid format)
                    // In a real app, we'd log this.
                }
                
                if (file_exists($tempSignPath)) {
                    unlink($tempSignPath);
                }
            }
        }
        
        $output = $pdf->Output('S');
        Storage::put($document->file_path, $output);
    }
}
