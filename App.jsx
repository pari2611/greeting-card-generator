import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Sparkles, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function GreetingCardGenerator() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [message, setMessage] = useState('Welcome');
  const [fontSize, setFontSize] = useState(48);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (PNG, JPG, GIF)');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be smaller than 10MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
      setSuccess(false);

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect({ target: { files } });
    }
  };

  const handleProcessImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('message', message);
      formData.append('fontSize', fontSize);

      // Update this with your actual backend URL
  const API_URL =
  import.meta.env.VITE_API_URL || '/api/process-image';
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

    if (!response.ok) {
  let errorMessage = `Server error: ${response.status}`;

  try {
    const data = await response.json();
    errorMessage = data.error || errorMessage;
  } catch (e) {
    // no json body, keep default message
  }

  throw new Error(errorMessage);
}
      const data = await response.json();
      setProcessedImage(data.imageUrl);
      setSuccess(true);
    } catch (err) {
      setError(`Processing failed: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!processedImage) return;

    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `greeting-card-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Download failed. Please try again.');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setProcessedImage(null);
    setMessage('Welcome');
    setFontSize(48);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;600;700&family=Satoshi:wght@300;400;500;700&display=swap');

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        * {
          font-family: 'Satoshi', sans-serif;
        }

        h1, h2, h3 {
          font-family: 'Clash Display', sans-serif;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .gradient-text {
          background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-glow {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
        }

        .btn-glow:hover {
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }

        .upload-area:hover {
          border-color: rgba(168, 85, 247, 0.8);
        }

        .upload-area.drag-active {
          border-color: rgba(168, 85, 247, 0.8);
          background: rgba(168, 85, 247, 0.1);
        }
      `}</style>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-3 mb-6 p-4 glass-effect rounded-2xl">
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
              <h1 className="text-6xl md:text-7xl font-bold gradient-text tracking-tighter">
                Card Craft
              </h1>
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>
            <p className="text-xl text-purple-200/80 font-light tracking-wide">
              Transform photos into stunning greeting cards with AI-powered watermarks
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Upload Section */}
            <div className="glass-effect rounded-3xl p-8 md:p-10 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Upload Image</h2>
              </div>

              {/* File Input */}
              <div
                className="border-2 border-dashed border-purple-400/50 rounded-2xl p-12 text-center cursor-pointer upload-area transition-all duration-300 hover:bg-purple-500/10"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="space-y-3">
                  <div className="text-5xl">📸</div>
                  <p className="text-white font-semibold text-lg">Click to upload or drag and drop</p>
                  <p className="text-purple-300/70 text-sm">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Preview */}
              {preview && (
                <div className="mt-8 space-y-4">
                  <p className="text-purple-300 text-sm font-semibold uppercase tracking-wide">Preview</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full rounded-2xl shadow-2xl object-cover max-h-72 border border-purple-400/30"
                  />
                </div>
              )}

              {/* Customization Options */}
              {selectedFile && (
                <div className="mt-8 space-y-6 p-6 bg-white/5 rounded-2xl border border-purple-400/20">
                  <div>
                    <label className="block text-purple-200 text-sm font-bold mb-3 uppercase tracking-wide">
                      Custom Message
                    </label>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, 100))}
                      placeholder="Enter your greeting..."
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-purple-400/40 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                    />
                    <p className="text-xs text-purple-300/60 mt-2">{message.length}/100 characters</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-purple-200 text-sm font-bold uppercase tracking-wide">
                        Font Size
                      </label>
                      <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        {fontSize}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="24"
                      max="96"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-purple-400/30 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-purple-300/60 mt-2">
                      <span>Small</span>
                      <span>Large</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleProcessImage}
                  disabled={!selectedFile || loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 btn-glow"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Card
                    </>
                  )}
                </button>
                {selectedFile && (
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300 border border-white/20 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Result Section */}
            <div className="glass-effect rounded-3xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Your Card</h2>
              </div>

              {processedImage ? (
                <div className="space-y-6">
                  <div className="relative group">
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="w-full rounded-2xl shadow-2xl border border-purple-400/30 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <p className="text-white text-sm font-semibold">Click download to save</p>
                    </div>
                  </div>

                  {success && (
                    <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-sm flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>Perfect! Ready to download.</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={handleDownload}
                      className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 btn-glow"
                    >
                      <Download className="w-5 h-5" />
                      Download Card
                    </button>
                    <button
                      onClick={handleReset}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Create Another
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-purple-300/60 space-y-4">
                  <div className="text-6xl opacity-20">🎨</div>
                  <p className="text-center">
                    {selectedFile
                      ? 'Click "Generate Card" to create your masterpiece'
                      : 'Upload an image to get started'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-purple-300/60 text-sm">
              ✨ Created with creativity • Powered by serverless cloud computing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
