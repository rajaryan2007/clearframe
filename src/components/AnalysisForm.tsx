'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createWorker } from 'tesseract.js';
import { ImagePlus, ScanSearch, Loader2 } from 'lucide-react';

interface AnalysisFormProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

export default function AnalysisForm({ onAnalyze, isLoading }: AnalysisFormProps) {
  const [text, setText] = useState('');
  const [isOcrLoading, setIsOcrLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrLoading(true);
    try {
      const worker = await createWorker('eng');
      const { data: { text: extractedText } } = await worker.recognize(file);
      await worker.terminate();
      setText((prev) => prev + (prev ? '\n' : '') + extractedText);
    } catch (error) {
      console.error('OCR Error:', error);
    } finally {
      setIsOcrLoading(false);
    }
  };

  return (
    <Card className="w-full bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl font-heading text-primary">Analyze Text</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste news article, tweet, or speech here..."
          className="min-h-[200px] bg-black border-zinc-800 text-zinc-300 focus-visible:ring-primary"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <input
              type="file"
              id="image-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isOcrLoading || isLoading}
            />
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-800 hover:bg-zinc-800 text-zinc-400"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={isOcrLoading || isLoading}
            >
              {isOcrLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ImagePlus className="w-4 h-4 mr-2" />
              )}
              {isOcrLoading ? 'Extracting...' : 'Upload Image (OCR)'}
            </Button>
          </div>

          <Button 
            onClick={() => onAnalyze(text)} 
            disabled={!text.trim() || isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Analyze with ClearFrame
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
