"use client";

import { motion } from "framer-motion";
import SubscribeButton from "../dashboard/SubscribeButton";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function FlyerPage() {
    const flyerRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownloadPDF = async () => {
        if (!flyerRef.current) return;

        try {
            setIsGenerating(true);

            // Wait a moment for any animations/images to settle
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(flyerRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#000000",
                logging: true,
                onclone: (clonedDoc) => {
                    const element = clonedDoc.querySelector('[data-flyer-root]') as HTMLElement;
                    if (element) {
                        element.style.transform = 'none';
                    }
                }
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [500, 500],
            });

            pdf.addImage(imgData, "PNG", 0, 0, 500, 500);
            pdf.save("family-car-wash-flyer.pdf");
        } catch (error: any) {
            console.error("PDF generation failed:", error);
            alert(`Failed to generate PDF: ${error.message || error}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#171717] flex flex-col items-center justify-center p-4 gap-8">
            {/* Flyer Container - 500px x 500px */}
            <div
                ref={flyerRef}
                data-flyer-root
                className="relative w-[500px] h-[500px] bg-black overflow-hidden shadow-2xl flex flex-col items-center justify-between p-8 text-center group"
                style={{ borderColor: 'rgba(255,255,255,0.1)', borderWidth: '1px', borderStyle: 'solid' }}
            >

                {/* Background Effects - Using explicit RGBA to avoid oklab */}
                <div
                    className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(circle at center, rgba(255,153,28,0.2), transparent, transparent)' }}
                />
                <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ background: 'linear-gradient(90deg, transparent, #FF991C, transparent)' }}
                />
                <div
                    className="absolute bottom-0 left-0 w-full h-1"
                    style={{ background: 'linear-gradient(90deg, transparent, #FF991C, transparent)' }}
                />

                {/* Header */}
                <div className="relative z-10 mt-4">
                    <h3 className="text-[rgba(255,255,255,0.6)] text-xs tracking-[0.3em] uppercase mb-2">Premium Doorstep Service</h3>
                    <h1 className="text-2xl font-bold text-white tracking-wider uppercase">
                        Family <span className="text-[#FF991C]">Car Wash</span>
                    </h1>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center justify-center flex-1">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="text-[120px] font-black text-white leading-none tracking-tighter" style={{ textShadow: "0 0 40px rgba(255,153,28,0.3)" }}>
                            60
                        </div>
                        <div
                            className="absolute -top-4 -right-8 rotate-12 bg-[#FF991C] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                            style={{ borderColor: 'rgba(255,255,255,0.2)', borderWidth: '1px', borderStyle: 'solid' }}
                        >
                            LIMITED
                        </div>
                    </motion.div>

                    <h2 className="text-3xl font-bold text-white uppercase tracking-widest mt-2 mb-1">
                        Slots <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #ffffff, rgba(255,255,255,0.5))' }}>Only</span>
                    </h2>

                    <div className="w-12 h-1 bg-[#FF991C] rounded-full my-6" />

                    <p className="text-[#9ca3af] text-sm max-w-[80%] leading-relaxed">
                        Join our exclusive bi-weekly detailing route.
                        Once they're gone, they're gone.
                    </p>
                </div>

                {/* QR Code - Bottom Left */}
                <div className="absolute bottom-6 left-6 z-20 bg-white p-1.5 rounded-md shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                    <img
                        src="/images/qr.png"
                        alt="Scan"
                        className="w-14 h-14 object-contain"
                    />
                </div>

                {/* Footer / CTA */}
                <div className="relative z-10 w-full mb-4 flex flex-col items-center gap-4">
                    <div className="w-full max-w-[280px]">
                        <SubscribeButton />
                        <p className="text-[rgba(255,255,255,0.4)] text-[10px] tracking-wider mt-2 uppercase">
                            Click to Secure
                        </p>
                    </div>
                </div>

                {/* Decorative Corners */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                {/* Removed bottom-left decorative corner to avoid clash with QR */}
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* Download Button */}
            <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {isGenerating ? (
                    <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Generating PDF...
                    </>
                ) : (
                    <>
                        Download PDF
                    </>
                )}
            </button>
        </div>
    );
}
