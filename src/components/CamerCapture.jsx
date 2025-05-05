import React, { useEffect, useRef, useState } from "react";

const CameraCapture = ({ onCapture, required }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);

  useEffect(() => {
    if (cameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setCameraActive(false);
          alert("Camera access denied or unavailable.");
        });
    }

    return () => stopCamera();
  }, [cameraActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const capture = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 320, 240);
    const dataUrl = canvasRef.current.toDataURL("image/png");

    stopCamera(); // stop stream
    setImage(dataUrl);
    setCameraActive(false);
    onCapture(dataUrl);
  };

  const handleRetake = () => {
    setImage(null);
    setCameraActive(true); // restart stream
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <label className="text-sm font-medium">
        {required && <span className="text-red-500">*</span>} Capture Your Selfie
      </label>

      {image ? (
        <>
          <img
            src={image}
            alt="Captured"
            className="rounded w-40 h-40 object-cover border-2 border-[var(--color-primary)]"
          />
          <button
            type="button"
            onClick={handleRetake}
            className="text-sm text-[var(--color-primary)] hover:underline"
          >
            Retake
          </button>
        </>
      ) : cameraActive ? (
        <>
          <video ref={videoRef} autoPlay playsInline className="w-64 h-48 rounded border border-zinc-700" />
          <canvas ref={canvasRef} width="320" height="240" className="hidden" />
          <button
            type="button"
            onClick={capture}
            className="bg-[var(--color-primary)] text-black py-1.5 px-4 rounded font-semibold hover:opacity-90"
          >
            Take Picture
          </button>
        </>
      ) : (
        <p className="text-sm text-red-500">Camera not available.</p>
      )}
    </div>
  );
};

export default CameraCapture;
