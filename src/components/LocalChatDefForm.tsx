import React from "react";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const LocalChatFormDef: React.FC = () => {
 const formRef = useRef<HTMLDivElement | null>(null);
const generatePDF = async () => {
  if (!formRef.current) return;

  const canvas = await html2canvas(formRef.current, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = 210;
  const pdfHeight = 297;

  const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save("Air-Operations-Form.pdf");
};



  return (
    <>
      <div ref={formRef} className="bg-white p-6 pdf-safe">
        <form className="space-y-10 text-black">
          {/* ================= IMMEDIATE AIR REQUEST DEMAND MESSAGE FORM ================= */}
          <section>
            <h2 className="text-3xl font-extrabold text-center mb-4">
              APPENDIX ‘M’ – IMMEDIATE AIR REQUEST DEMAND MESSAGE FORM
              <br />
              IMMEDIATE AIR STRIKE
            </h2>

            {/* SIGNAL USE ONLY */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">NR</label>
                <input
                  className="input border border-gray-300"
                  placeholder="Enter NR"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">IN</label>
                <input
                  className="input border border-gray-300"
                  placeholder="Enter IN"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">OUT</label>
                <input
                  className="input border border-gray-300"
                  placeholder="Enter OUT"
                />
              </div>
            </div>

            <p className="text-center text-sm italic mt-2">
              ABOVE THIS LINE FOR SIGNAL USE ONLY
            </p>
          </section>

          {/* ================= DTO DETAILS ================= */}
          <section className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">DTO FROM</label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">DEMAND NO</label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">FROM</label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">TO</label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">INDICATOR</label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">INFO</label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col col-span-2">
              <label className="text-sm font-semibold mb-1">GR</label>
              <input className="input border border-gray-300" />
            </div>
          </section>

          {/* ================= (A) TARGET DESCRIPTION ================= */}
          <section className="mt-6">
            <h3 className="font-semibold mb-2">
              (A) P/L – Target Description & Grid Reference
            </h3>

            <div className="flex">
              <label className="">Target Description (Plain Language)</label>
              <textarea
                className="textarea border border-gray-300"
                placeholder=""
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col">
                <label className="">Grid Reference</label>
                <input
                  className="input border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col">
                <label className="">Code</label>
                <input
                  className="input border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>
          </section>

          {/* ================= (B) TIME OVER TARGET ================= */}
          <section className="mt-6">
            <h3 className="font-semibold mb-2">(B) P/L – Time Over Target</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label>Time Over Target</label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label>Code</label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col">
                <label>Last Time Over Target</label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label>Code</label>
                <input className="input border border-gray-300" />
              </div>
            </div>
          </section>

          {/* ================= (C) OWN FORWARD TROOPS ================= */}
          <section className="mt-6">
            <h3 className="font-semibold mb-2">
              (C) P/L – Position of Own Forward Troops (FLOT)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label>Position of Own Forward Troops (Plain Language)</label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label>Code</label>
                <input className="input border border-gray-300" />
              </div>
            </div>
          </section>

          {/* ================= (D) ACT & SMOKE ================= */}
          <section className="mt-6">
            <h3 className="font-semibold mb-2">
              (D) P/L – ACT Callsign, Position & Smoke Availability
            </h3>

            <div className="flex">
              <label>
                ACT Callsign, Position & Smoke Availability (Plain Language)
              </label>
              <textarea
                className="textarea border border-gray-300"
                placeholder="ACT Callsign, Position & Smoke Availability (Plain Language)"
              />
            </div>
            <div className="flex">
              <label>Code</label>
              <input
                className="input mt-2 border border-gray-300"
                placeholder=""
              />
            </div>
          </section>

          {/* ================= COMMAND & CONTROL ================= */}
          <section className="mt-6">
            <h3 className="font-semibold mb-2">Command & Control Timings</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label>THI</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col">
                <label>TOE</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col">
                <label>THI at JOC</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col">
                <label>TOR</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col">
                <label>TAIC / TOR</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col">
                <label>Accepted / Rejected</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col">
                <label>WING TOD</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col">
                <label>TOC / TOR JOC</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col">
                <label>OR Rejected</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col">
                <label>TOR GL NET</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label>TOC GL NET</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>
          </section>
          {/* ================= SIGNATURE SECTION ================= */}
          <section className="mt-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col ">
                <label>Officer’s Signature</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>Time</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>Releasing Signature</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>Time of Release</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>IN</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>OUT</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            <p className="text-sm italic mt-3">Note: P/L – Plain Language</p>
          </section>

          {/* ================= COMPOSITION EXECUTION ================= */}
          <section>
            <h2 className="text-2xl font-bold text-center underline mb-4">
              COMPOSITION EXECUTION FORM
            </h2>

            {/* NR / IN / OUT */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col ">
                <label>NR</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>IN</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>OUT</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            <p className="text-center text-sm italic mt-2">
              (THIS LINE FOR SIGNAL USE ONLY)
            </p>

            {/* FROM / DATE TIME / TO / MSN */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>FROM</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>DATE & TIME OF ORG</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>TO</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>MSN NO</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* INFO / DIV */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>INFO</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>DIV</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* BDE / REF DEMAND NO */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>BDE</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>REF DEMAND NO (XA)</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* ACCEPT ETOT */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>ACCEPT ETOT / ETOT FOLLOW</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>P/L CODE</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>P/L CODE (XB)</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* AIRCRAFT & ARMAMENT */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>TYPE OF AIRCRAFT</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>ARMAMENT</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>P/L CODE (XC)</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* CONTACT POINT */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>CONTACT POINT</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>P/L CODE (XD)</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* NUMBER OF AIRCRAFT */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>NUMBER OF AIRCRAFT</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>P/L CODE</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>P/L CODE</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* REFUSAL */}
            <p className="font-semibold mt-4">OR</p>
            <div className="flex flex-col ">
              <label>REASONS FOR REFUSAL</label>
              <textarea
                className="textarea mt-2 border border-gray-300"
                placeholder=""
              />
            </div>

            {/* OPERATOR & GLO */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>IN TIME – CCT OPERATOR</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>OUT – GLO</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* FMN / JOC / HQ */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>FMN</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>JOC</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>HQ</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* TOC / TOE & SIGNATURE */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>TOC / TOE</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>Officer's Signature</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>
          </section>

          {/* ================= COMPOSITION EXECUTION 2 ================= */}
          <section>
            <h2 className="text-2xl font-bold text-center underline mb-4">
              COMPOSITION EXECUTION FORM
            </h2>

            {/* NR / IN / OUT */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col ">
                <label>NR</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>IN</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>OUT</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            <p className="text-center text-sm italic mt-2">
              (THIS LINE FOR SIGNAL USE ONLY)
            </p>

            {/* FROM / DATE TIME / TO / MSN */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>FROM</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>DATE & TIME OF ORG</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>TO</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>MSN NO</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* INFO / DIV */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>INFO</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>DIV</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* BDE / REF DEMAND NO */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>BDE</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>REF DEMAND NO (XA)</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* ACCEPT ETOT */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>ACCEPT ETOT / ETOT FOLLOW</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>P/L CODE</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>P/L CODE (XB)</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* AIRCRAFT & ARMAMENT */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>TYPE OF AIRCRAFT</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>ARMAMENT</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>P/L CODE (XC)</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* CONTACT POINT */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>CONTACT POINT</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>P/L CODE (XD)</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* NUMBER OF AIRCRAFT */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>NUMBER OF AIRCRAFT</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>P/L CODE</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>P/L CODE</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* REFUSAL */}
            <p className="font-semibold mt-4">OR</p>
            <div className="flex">
              <label>REASONS FOR REFUSAL</label>
              <textarea
                className="textarea mt-2 border border-gray-300"
                placeholder=""
              />
            </div>

            {/* OPERATOR & GLO */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>IN TIME – CCT OPERATOR</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>OUT – GLO</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* FMN / JOC / HQ */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>FMN</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>JOC</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>HQ</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* TOC / TOE & SIGNATURE */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>TOC / TOE</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>Officer's Signature</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>
          </section>

          {/* =================STANDARD PILOT DEBRIEFING FORM================= */}
          <section>
            <h2 className="text-xl font-bold underline mb-4 text-center">
              STANDARD PILOT DEBRIEFING FORM
              <span className="block text-sm font-normal text-center">
                (FOR ALL AIR SUPPORT SORTIES)
              </span>
            </h2>

            {/* 1–3 BASIC DETAILS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col ">
                <label>1. Mission No</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>
                  2. Squadron, Number & Type of Aircraft and Armament
                </label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>3. Name of Pilots (If changed from briefing)</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* 4 CONTACT POINT */}
            <div className="flex flex-col ">
              <label>
                4. Contact Point (at what stage was RT contact established with
                the FAC? What was the RT strength?)
              </label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 5 FORWARD AIR CONTROLLER */}
            <div className="flex flex-col ">
              <label>
                5. Forward Air Controller (was target direction and briefing by
                FAC adequate? If not, suggest improvements)
              </label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 6 TARGET */}
            <div className="flex flex-col ">
              <label>
                6. Target (was target sighted immediately? If not, how many
                orbits were made? Any navigation problem enroute?)
              </label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 7 RESULTS */}
            <div className="flex flex-col ">
              <label>7. Results of Attack / Mission</label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 8 TACTICAL PROBLEMS */}
            <div className="flex flex-col ">
              <label>
                8. Tactical Problems (during attack or photographing, as
                applicable)
              </label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 9 ENEMY INTELLIGENCE */}
            <div className="flex flex-col ">
              <label>
                9. Enemy Intelligence (estimated strength, numbers, movement &
                direction)
              </label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 10 OTHER TARGETS */}
            <div className="flex flex-col ">
              <label>
                10. Any Other Worthwhile Targets Observed (type & location)
              </label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 11 HAZARDS */}
            <div className="flex flex-col ">
              <label>
                11. Hazards (any air opposition enroute / over target / return?
                Details of action taken with results & casualties)
              </label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 12 AIR ACTIVITY / ACCIDENT */}
            <div className="flex flex-col ">
              <label>
                12. Air Activity (any other aircraft seen during sortie?) Any
                accident to own aircraft? If so, give details.
              </label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 13 GROUND FIRE */}
            <div className="flex flex-col ">
              <label>
                13. Ground Fire (intensity, location and type encountered, if
                any)
              </label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 14 SAFETY POINTS */}
            <div className="flex flex-col ">
              <label>14. Any Special Points for Safety of Other Pilots</label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 15 WEATHER */}
            <div className="flex flex-col ">
              <label>
                15. Weather and Visibility (enroute and over target)
              </label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 16 CHECK BACK */}
            <div className="flex flex-col ">
              <label>16. Check Back on Intelligence</label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 17 OTHER INFORMATION */}
            <div className="flex flex-col ">
              <label>17. Any Other Information</label>
              <textarea className="textarea mt-4 border border-gray-300" />
            </div>

            {/* 18 TIMINGS */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col ">
                <label>18(a). Take Off Time</label>
                <input
                  className="input border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>18(b). Over Target Time</label>
                <input
                  className="input border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>18(c). Landing Time</label>
                <input
                  className="input border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* 19 DEBRIEF COMPLETION */}
            <div className="flex flex-col ">
              <label>19. Debriefing Completed At</label>
              <input
                className="input mt-4 border border-gray-300"
                placeholder=""
              />
            </div>

            {/* SIGNATURE BLOCK */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col ">
                <label>Airfield</label>
                <input
                  className="input mt-4 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>DTG</label>
                <input
                  className="input mt-4 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>GLO</label>
                <input
                  className="input mt-4 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>Duty Pilot</label>
                <input
                  className="input mt-4 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col col-span-2 ">
                <label>Intelligence Officer</label>
                <input
                  className="input mt-4 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>
          </section>

          {/* =================STANDARD PILOT BRIEFING FORM (GROUND ATTACK )================= */}

          <section>
            <h2 className="text-xl font-bold underline mb-4 text-center">
              STANDARD PILOT BRIEFING FORM
              <span className="block text-sm font-normal text-center">
                (GROUND ATTACK / VISUAL RECONNAISSANCE SORTIES) – PART I
              </span>
            </h2>

            {/* 1–3 BASIC DETAILS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col ">
                <label>1. Mission No</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>
                  2. Squadron, Number & Type of Aircraft and Armament
                </label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>3. Names of Pilots</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* 4 TARGETS */}
            <h3 className="font-semibold mt-4">4. Targets</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col ">
                <label>4(a). Type & Strength</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col ">
                <label>4(b). Location (Map Reference)</label>
                <input
                  className="input mt-2 border border-gray-300"
                  placeholder=""
                />
              </div>
            </div>

            {/* 5 ALTERNATE TARGET */}
            {/* 5 ALTERNATE TARGET */}
            <h3 className="font-semibold mt-4">5. Alternate Target (if any)</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  5(a). Type & Strength
                </label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  5(b). Location
                </label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            {/* 6 OTHER TARGET INT */}
            <div className="flex flex-col mt-4">
              <label className="text-sm font-semibold mb-1">
                6. Any Other Target Intelligence
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            {/* 7–8 FLOT & TOT */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  7. Forward Line Own Troops (FLOT)
                </label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  8. Time on Target
                </label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            {/* 9 FAC */}
            <h3 className="font-semibold mt-4">9. Forward Air Controller</h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  9(a). Call Sign
                </label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  9(b). Channel
                </label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  9(c). Location
                </label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            {/* 10–16 SITUATION */}
            <div className="flex flex-col mt-4">
              <label className="text-sm font-semibold mb-1">
                10. Target Indication Facilities (if any)
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-sm font-semibold mb-1">
                11. Contact Point
              </label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-sm font-semibold mb-1">
                12. AD Artillery Fire Area Classification
              </label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-sm font-semibold mb-1">
                13. Enemy Ack-Ack in the Area
              </label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-sm font-semibold mb-1">
                14. Bomb Line
              </label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-sm font-semibold mb-1">
                15. Ground Situation
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-sm font-semibold mb-1">
                16. Air Situation
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            {/* 17 EMERGENCIES */}
            <h3 className="font-semibold mt-4">17. Emergencies</h3>

            <div className="flex flex-col mt-2">
              <label className="text-sm font-semibold mb-1">
                17(a). RT Failure
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-sm font-semibold mb-1">
                17(b). One Way Contact with ACT
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-2">
              <label className="text-sm font-semibold mb-1">
                17(c). Standard Panel Messages
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            {/* 18–22 SAFETY */}
            <div className="flex flex-col mt-4">
              <label className="text-sm font-semibold mb-1">
                18. Escape and Evasion Routes
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-sm font-semibold mb-1">
                19. Destruction of Incriminating Documents
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-sm font-semibold mb-1">
                20. Geneva Convention (as applicable)
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  21. Synchronise Watches
                </label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  22. Empty Pockets
                </label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            {/* 23 CHECK BACK */}
            <h3 className="font-semibold mt-4">23. Check Back</h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  23(a). Task
                </label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  23(b). FLOT
                </label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  23(c). ADAFAs
                </label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            {/* 24 ASK PILOTS */}
            <div className="flex flex-col mt-4">
              <label className="text-sm font-semibold mb-1">
                24. Ask the Pilots
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            {/* PART II */}
            <h2 className="text-lg font-bold underline mt-8 mb-3 text-center">
              PART II – (For Reference of GLO Only)
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  25. Received in Plain Language At
                </label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  26. Briefing Completed At
                </label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            {/* SIGNATURE BLOCK */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Airfield</label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">DTG</label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">GLO</label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Duty Pilot</label>
                <input className="input border border-gray-300" />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-sm font-semibold mb-1">
                  Intelligence Officer
                </label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            <p className="text-sm italic mt-4">
              Pilots may be reminded that their first duty is to escape and
              avoid capture by the enemy, should they have to force land or
              eject over enemy territory.
            </p>
          </section>

          {/* =================STANDARD PILOT BRIEFING FORM (PHOTO RECONNAISSANCE SORTIES)================= */}

          <section>
            <h2 className="text-xl font-bold underline mb-4 text-center">
              STANDARD PILOT BRIEFING FORM (PHOTO RECONNAISSANCE SORTIES)
            </h2>

            {/* BASIC DETAILS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Mission No</label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Squadron, Number & Type of Aircraft and Armament
                </label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col col-span-2">
                <label className="text-sm font-semibold mb-1">
                  Name of Pilots
                </label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Type of Photo (Vertical / Oblique)
                </label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Time on Target
                </label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            {/* TARGET & TROOPS */}
            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Area of Target Description and Limits of Recce
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Forward Line Own Troops
              </label>
              <input className="input border border-gray-300" />
            </div>

            {/* FORWARD AIR CONTROLLER */}
            <h3 className="font-semibold mt-4">Forward Air Controller</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Call Sign</label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Channel</label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Alternate Channel
                </label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Location</label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col col-span-2">
                <label className="text-sm font-semibold mb-1">
                  Flash Report
                </label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            {/* OPERATIONAL DETAILS */}
            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Contact Point
              </label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                ADA Fire Areas with Classification
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Enemy Ack Ack in the Area
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">Bomb Line</label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Ground Situation
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Air Situation
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Special Instructions
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            {/* EMERGENCIES */}
            <h3 className="font-semibold mt-4">Emergencies</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">RT Failure</label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Standard Panel Messages
                </label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            {/* SAFETY & INTELLIGENCE */}
            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Escape and Evasion Routes
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Destruction of Aircraft Camera / Film
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Destruction of Incriminating Documents on Pilots
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Geneva Convention (as applicable)
              </label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Synchronise Watches
              </label>
              <input className="input border border-gray-300" />
            </div>

            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Empty Pockets
              </label>
              <input className="input border border-gray-300" />
            </div>

            {/* CHECK BACK */}
            <h3 className="font-semibold mt-4">Check Back</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Task</label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">FLOT</label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  AD Deployment
                </label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">ADAFAs</label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            {/* PILOT CONFIRMATION */}
            <div className="flex flex-col mt-3">
              <label className="text-sm font-semibold mb-1">
                Pilot Confirmation (Maximum Information & Questions)
              </label>
              <textarea className="textarea border border-gray-300" />
            </div>

            {/* PART II */}
            <h3 className="font-semibold mt-6 underline text-center">
              PART II (For Reference of GLO Only)
            </h3>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Number of Prints Required
                </label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Earliest & Latest Time of Photo Delivery
                </label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col col-span-2">
                <label className="text-sm font-semibold mb-1">
                  Method of Delivery (If Airdrop, Map Reference of DZ)
                </label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Received in Plain Language At
                </label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Briefing Completed At
                </label>
                <input className="input border border-gray-300" />
              </div>
            </div>

            {/* SIGNATURES */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Airfield</label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">DTG</label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Duty Pilot</label>
                <input className="input border border-gray-300" />
              </div>

              <div className="flex flex-col col-span-3">
                <label className="text-sm font-semibold mb-1">
                  Intelligence Officer
                </label>
                <input className="input border border-gray-300" />
              </div>
            </div>
          </section>
        </form>
      </div>

      <button
        type="button"
        onClick={generatePDF}
        className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded font-bold cursor-pointer mt-6"
      >
        SUBMIT COMPLETE AIR OPERATIONS FORM
      </button>
    </>
  );
};

export default LocalChatFormDef;
