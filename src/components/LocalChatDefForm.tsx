import React from "react";

const LocalChatFormDef: React.FC = () => {
  return (
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
          <input className="input" placeholder="NR" />
          <input className="input" placeholder="IN" />
          <input className="input" placeholder="OUT" />
        </div>

        <p className="text-center text-sm italic mt-2">
          ABOVE THIS LINE FOR SIGNAL USE ONLY
        </p>
      </section>

      {/* ================= DTO DETAILS ================= */}
      <section className="grid grid-cols-2 gap-4 mt-6">
        <input className="input" placeholder="DTO FROM" />
        <input className="input" placeholder="DEMAND NO" />
        <input className="input" placeholder="TO" />
        <input className="input" placeholder="INDICATOR" />
        <input className="input" placeholder="INFO" />
        <input className="input" placeholder="GR" />
      </section>

      {/* ================= (A) TARGET DESCRIPTION ================= */}
      <section className="mt-6">
        <h3 className="font-semibold mb-2">
          (A) P/L – Target Description & Grid Reference
        </h3>

        <textarea
          className="textarea"
          placeholder="Target Description (Plain Language)"
        />

        <div className="grid grid-cols-2 gap-4 mt-2">
          <input className="input" placeholder="Grid Reference" />
          <input className="input" placeholder="Code" />
        </div>
      </section>

      {/* ================= (B) TIME OVER TARGET ================= */}
      <section className="mt-6">
        <h3 className="font-semibold mb-2">(B) P/L – Time Over Target</h3>

        <div className="grid grid-cols-2 gap-4">
          <input className="input" placeholder="Time Over Target" />
          <input className="input" placeholder="Code" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <input className="input" placeholder="Last Time Over Target" />
          <input className="input" placeholder="Code" />
        </div>
      </section>

      {/* ================= (C) OWN FORWARD TROOPS ================= */}
      <section className="mt-6">
        <h3 className="font-semibold mb-2">
          (C) P/L – Position of Own Forward Troops (FLOT)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Position of Own Forward Troops (Plain Language)"
          />
          <input className="input" placeholder="Code" />
        </div>
      </section>

      {/* ================= (D) ACT & SMOKE ================= */}
      <section className="mt-6">
        <h3 className="font-semibold mb-2">
          (D) P/L – ACT Callsign, Position & Smoke Availability
        </h3>

        <textarea
          className="textarea"
          placeholder="ACT Callsign, Position & Smoke Availability (Plain Language)"
        />

        <input className="input mt-2" placeholder="Code" />
      </section>

      {/* ================= COMMAND & CONTROL ================= */}
      <section className="mt-6">
        <h3 className="font-semibold mb-2">Command & Control Timings</h3>

        <div className="grid grid-cols-3 gap-4">
          <input className="input" placeholder="THI" />
          <input className="input" placeholder="TOE" />
          <input className="input" placeholder="THI at JOC" />

          <input className="input" placeholder="TOR" />
          <input className="input" placeholder="TAIC / TOR" />
          <input className="input" placeholder="Accepted / Rejected" />

          <input className="input" placeholder="WING TOD" />
          <input className="input" placeholder="TOC / TOR JOC" />
          <input className="input" placeholder="OR Rejected" />

          <input className="input" placeholder="TOR GL NET" />
          <input className="input col-span-2" placeholder="TOC GL NET" />
        </div>
      </section>

      {/* ================= SIGNATURE SECTION ================= */}
      <section className="mt-8">
        <div className="grid grid-cols-2 gap-4">
          <input className="input" placeholder="Officer’s Signature" />
          <input className="input" placeholder="Time" />

          <input className="input" placeholder="Releasing Signature" />
          <input className="input" placeholder="Time of Release" />

          <input className="input" placeholder="IN" />
          <input className="input" placeholder="OUT" />
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
          <input className="input" placeholder="NR" />
          <input className="input" placeholder="IN" />
          <input className="input" placeholder="OUT" />
        </div>

        <p className="text-center text-sm italic mt-2">
          (THIS LINE FOR SIGNAL USE ONLY)
        </p>

        {/* FROM / DATE TIME / TO / MSN */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="FROM" />
          <input className="input" placeholder="DATE & TIME OF ORG" />
          <input className="input" placeholder="TO" />
          <input className="input" placeholder="MSN NO" />
        </div>

        {/* INFO / DIV */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="INFO" />
          <input className="input" placeholder="DIV" />
        </div>

        {/* BDE / REF DEMAND NO */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="BDE" />
          <input className="input" placeholder="REF DEMAND NO (XA)" />
        </div>

        {/* ACCEPT ETOT */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <input className="input" placeholder="ACCEPT ETOT / ETOT FOLLOW" />
          <input className="input" placeholder="P/L CODE" />
          <input className="input" placeholder="P/L CODE (XB)" />
        </div>

        {/* AIRCRAFT & ARMAMENT */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <input className="input" placeholder="TYPE OF AIRCRAFT" />
          <input className="input" placeholder="ARMAMENT" />
          <input className="input" placeholder="P/L CODE (XC)" />
        </div>

        {/* CONTACT POINT */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="CONTACT POINT" />
          <input className="input" placeholder="P/L CODE (XD)" />
        </div>

        {/* NUMBER OF AIRCRAFT */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <input className="input" placeholder="NUMBER OF AIRCRAFT" />
          <input className="input" placeholder="P/L CODE" />
          <input className="input" placeholder="P/L CODE" />
        </div>

        {/* REFUSAL */}
        <p className="font-semibold mt-4">OR</p>
        <textarea className="textarea mt-2" placeholder="REASONS FOR REFUSAL" />

        {/* OPERATOR & GLO */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="IN TIME – CCT OPERATOR" />
          <input className="input" placeholder="OUT – GLO" />
        </div>

        {/* FMN / JOC / HQ */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <input className="input" placeholder="FMN" />
          <input className="input" placeholder="JOC" />
          <input className="input" placeholder="HQ" />
        </div>

        {/* TOC / TOE & SIGNATURE */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="TOC / TOE" />
          <input className="input" placeholder="Officer's Signature" />
        </div>
      </section>

      {/* ================= COMPOSITION EXECUTION 2 ================= */}
      <section>
        <h2 className="text-2xl font-bold text-center underline mb-4">
          COMPOSITION EXECUTION FORM
        </h2>

        {/* NR / IN / OUT */}
        <div className="grid grid-cols-3 gap-4">
          <input className="input" placeholder="NR" />
          <input className="input" placeholder="IN" />
          <input className="input" placeholder="OUT" />
        </div>

        <p className="text-center text-sm italic mt-2">
          (THIS LINE FOR SIGNAL USE ONLY)
        </p>

        {/* FROM / DATE TIME / TO / MSN */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="FROM" />
          <input className="input" placeholder="DATE & TIME OF ORG" />
          <input className="input" placeholder="TO" />
          <input className="input" placeholder="MSN NO" />
        </div>

        {/* INFO / DIV */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="INFO" />
          <input className="input" placeholder="DIV" />
        </div>

        {/* BDE / REF DEMAND NO */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="BDE" />
          <input className="input" placeholder="REF DEMAND NO (XA)" />
        </div>

        {/* ACCEPT ETOT */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <input className="input" placeholder="ACCEPT ETOT / ETOT FOLLOW" />
          <input className="input" placeholder="P/L CODE" />
          <input className="input" placeholder="P/L CODE (XB)" />
        </div>

        {/* AIRCRAFT & ARMAMENT */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <input className="input" placeholder="TYPE OF AIRCRAFT" />
          <input className="input" placeholder="ARMAMENT" />
          <input className="input" placeholder="P/L CODE (XC)" />
        </div>

        {/* CONTACT POINT */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="CONTACT POINT" />
          <input className="input" placeholder="P/L CODE (XD)" />
        </div>

        {/* NUMBER OF AIRCRAFT */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <input className="input" placeholder="NUMBER OF AIRCRAFT" />
          <input className="input" placeholder="P/L CODE" />
          <input className="input" placeholder="P/L CODE" />
        </div>

        {/* REFUSAL */}
        <p className="font-semibold mt-4">OR</p>
        <textarea className="textarea mt-2" placeholder="REASONS FOR REFUSAL" />

        {/* OPERATOR & GLO */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="IN TIME – CCT OPERATOR" />
          <input className="input" placeholder="OUT – GLO" />
        </div>

        {/* FMN / JOC / HQ */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <input className="input" placeholder="FMN" />
          <input className="input" placeholder="JOC" />
          <input className="input" placeholder="HQ" />
        </div>

        {/* TOC / TOE & SIGNATURE */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="TOC / TOE" />
          <input className="input" placeholder="Officer's Signature" />
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
          <input className="input" placeholder="1. Mission No" />
          <input
            className="input"
            placeholder="2. Squadron, Number & Type of Aircraft and Armament"
          />
          <input
            className="input col-span-2"
            placeholder="3. Name of Pilots (If changed from briefing)"
          />
        </div>

        {/* 4 CONTACT POINT */}
        <textarea
          className="textarea mt-4"
          placeholder={`4. Contact Point
(at what stage was RT contact established with the FAC?
What was the RT strength?)`}
        />

        {/* 5 FORWARD AIR CONTROLLER */}
        <textarea
          className="textarea mt-4"
          placeholder={`5. Forward Air Controller
(was target direction and briefing by FAC adequate?
If not, suggest improvements)`}
        />

        {/* 6 TARGET */}
        <textarea
          className="textarea mt-4"
          placeholder={`6. Target
(was target sighted immediately?
If not, how many orbits were made?
Any navigation problem enroute?)`}
        />

        {/* 7 RESULTS */}
        <textarea
          className="textarea mt-4"
          placeholder="7. Results of Attack / Mission"
        />

        {/* 8 TACTICAL PROBLEMS */}
        <textarea
          className="textarea mt-4"
          placeholder={`8. Tactical Problems
(during attack or photographing, as applicable)`}
        />

        {/* 9 ENEMY INTELLIGENCE */}
        <textarea
          className="textarea mt-4"
          placeholder={`9. Enemy Intelligence
(estimated strength, numbers, movement & direction)`}
        />

        {/* 10 OTHER TARGETS */}
        <textarea
          className="textarea mt-4"
          placeholder="10. Any Other Worthwhile Targets Observed (type & location)"
        />

        {/* 11 HAZARDS */}
        <textarea
          className="textarea mt-4"
          placeholder={`11. Hazards
(any air opposition enroute / over target / return?
Details of action taken with results & casualties)`}
        />

        {/* 12 AIR ACTIVITY / ACCIDENT */}
        <textarea
          className="textarea mt-4"
          placeholder={`12. Air Activity
(any other aircraft seen during sortie?)
Any accident to own aircraft? If so, give details.`}
        />

        {/* 13 GROUND FIRE */}
        <textarea
          className="textarea mt-4"
          placeholder={`13. Ground Fire
(intensity, location and type encountered, if any)`}
        />

        {/* 14 SAFETY POINTS */}
        <textarea
          className="textarea mt-4"
          placeholder="14. Any Special Points for Safety of Other Pilots"
        />

        {/* 15 WEATHER */}
        <textarea
          className="textarea mt-4"
          placeholder="15. Weather and Visibility (enroute and over target)"
        />

        {/* 16 CHECK BACK */}
        <textarea
          className="textarea mt-4"
          placeholder="16. Check Back on Intelligence"
        />

        {/* 17 OTHER INFORMATION */}
        <textarea
          className="textarea mt-4"
          placeholder="17. Any Other Information"
        />

        {/* 18 TIMINGS */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <input className="input" placeholder="18(a). Take Off Time" />
          <input className="input" placeholder="18(b). Over Target Time" />
          <input className="input" placeholder="18(c). Landing Time" />
        </div>

        {/* 19 DEBRIEF COMPLETION */}
        <input
          className="input mt-4"
          placeholder="19. Debriefing Completed At"
        />

        {/* SIGNATURE BLOCK */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <input className="input" placeholder="Airfield" />
          <input className="input" placeholder="DTG" />
          <input className="input" placeholder="GLO" />
          <input className="input" placeholder="Duty Pilot" />
          <input
            className="input col-span-2"
            placeholder="Intelligence Officer"
          />
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
          <input className="input" placeholder="1. Mission No" />
          <input
            className="input"
            placeholder="2. Squadron, Number & Type of Aircraft and Armament"
          />
          <input
            className="input col-span-2"
            placeholder="3. Names of Pilots"
          />
        </div>

        {/* 4 TARGETS */}
        <h3 className="font-semibold mt-4">4. Targets</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <input className="input" placeholder="4(a). Type & Strength" />
          <input
            className="input"
            placeholder="4(b). Location (Map Reference)"
          />
        </div>

        {/* 5 ALTERNATE TARGET */}
        <h3 className="font-semibold mt-4">5. Alternate Target (if any)</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <input className="input" placeholder="5(a). Type & Strength" />
          <input className="input" placeholder="5(b). Location" />
        </div>

        {/* 6 OTHER TARGET INT */}
        <textarea
          className="textarea mt-4"
          placeholder="6. Any Other Target Intelligence"
        />

        {/* 7–8 FLOT & TOT */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            className="input"
            placeholder="7. Forward Line Own Troops (FLOT)"
          />
          <input className="input" placeholder="8. Time on Target" />
        </div>

        {/* 9 FAC */}
        <h3 className="font-semibold mt-4">9. Forward Air Controller</h3>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <input className="input" placeholder="9(a). Call Sign" />
          <input className="input" placeholder="9(b). Channel" />
          <input className="input" placeholder="9(c). Location" />
        </div>

        {/* 10–16 SITUATION */}
        <textarea
          className="textarea mt-4"
          placeholder="10. Target Indication Facilities (if any)"
        />
        <input className="input mt-4" placeholder="11. Contact Point" />
        <input
          className="input mt-4"
          placeholder="12. AD Artillery Fire Area Classification"
        />
        <input
          className="input mt-4"
          placeholder="13. Enemy Ack-Ack in the Area"
        />
        <input className="input mt-4" placeholder="14. Bomb Line" />
        <textarea
          className="textarea mt-4"
          placeholder="15. Ground Situation"
        />
        <textarea className="textarea mt-4" placeholder="16. Air Situation" />

        {/* 17 EMERGENCIES */}
        <h3 className="font-semibold mt-4">17. Emergencies</h3>
        <textarea className="textarea mt-2" placeholder="17(a). RT Failure" />
        <textarea
          className="textarea mt-2"
          placeholder="17(b). One Way Contact with ACT"
        />
        <textarea
          className="textarea mt-2"
          placeholder="17(c). Standard Panel Messages"
        />

        {/* 18–22 SAFETY */}
        <textarea
          className="textarea mt-4"
          placeholder="18. Escape and Evasion Routes"
        />
        <textarea
          className="textarea mt-4"
          placeholder="19. Destruction of Incriminating Documents on Person of Pilots"
        />
        <textarea
          className="textarea mt-4"
          placeholder="20. Geneva Convention (as applicable)"
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <input className="input" placeholder="21. Synchronise Watches" />
          <input className="input" placeholder="22. Empty Pockets" />
        </div>

        {/* 23 CHECK BACK */}
        <h3 className="font-semibold mt-4">23. Check Back</h3>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <input className="input" placeholder="23(a). Task" />
          <input className="input" placeholder="23(b). FLOT" />
          <input className="input" placeholder="23(c). ADAFAs" />
        </div>

        {/* 24 ASK PILOTS */}
        <textarea
          className="textarea mt-4"
          placeholder={`24. Ask the Pilots:
(a) To get maximum information
(b) If they have any questions`}
        />

        {/* ================= PART II ================= */}
        <h2 className="text-lg font-bold underline mt-8 mb-3 text-center">
          PART II – (For Reference of GLO Only)
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="25. Received in Plain Language At"
          />
          <input className="input" placeholder="26. Briefing Completed At" />
        </div>

        {/* SIGNATURE BLOCK */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <input className="input" placeholder="Airfield" />
          <input className="input" placeholder="DTG" />
          <input className="input" placeholder="GLO" />
          <input className="input" placeholder="Duty Pilot" />
          <input
            className="input col-span-2"
            placeholder="Intelligence Officer"
          />
        </div>

        <p className="text-sm italic mt-4">
          Pilots may be reminded that their first duty is to escape and avoid
          capture by the enemy, should they have to force land or eject over
          enemy territory.
        </p>
      </section>

      {/* =================STANDARD PILOT BRIEFING FORM (PHOTO RECONNAISSANCE SORTIES)================= */}

      <section>
        <h2 className="text-xl font-bold underline mb-4 text-center">
          STANDARD PILOT BRIEFING FORM (PHOTO RECONNAISSANCE SORTIES)
        </h2>

        {/* BASIC DETAILS */}
        <div className="grid grid-cols-2 gap-4">
          <input className="input" placeholder="Mission No" />
          <input
            className="input"
            placeholder="Squadron, Number & Type of Aircraft and Armament"
          />
          <input className="input col-span-2" placeholder="Name of Pilots" />
          <input
            className="input"
            placeholder="Type of Photo (Vertical / Oblique)"
          />
          <input className="input" placeholder="Time on Target" />
        </div>

        {/* TARGET & TROOPS */}
        <textarea
          className="textarea mt-3"
          placeholder="Area of Target Description and Limits of Recce"
        />
        <input className="input mt-3" placeholder="Forward Line Own Troops" />

        {/* FORWARD AIR CONTROLLER */}
        <h3 className="font-semibold mt-4">Forward Air Controller</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <input className="input" placeholder="Call Sign" />
          <input className="input" placeholder="Channel" />
          <input className="input" placeholder="Alternate Channel" />
          <input className="input" placeholder="Location" />
          <input className="input col-span-2" placeholder="Flash Report" />
        </div>

        {/* OPERATIONAL DETAILS */}
        <input className="input mt-3" placeholder="Contact Point" />
        <textarea
          className="textarea mt-3"
          placeholder="ADA Fire Areas with Classification"
        />
        <textarea
          className="textarea mt-3"
          placeholder="Enemy Ack Ack in the Area"
        />
        <input className="input mt-3" placeholder="Bomb Line" />

        <textarea className="textarea mt-3" placeholder="Ground Situation" />
        <textarea className="textarea mt-3" placeholder="Air Situation" />
        <textarea
          className="textarea mt-3"
          placeholder="Special Instructions"
        />

        {/* EMERGENCIES */}
        <h3 className="font-semibold mt-4">Emergencies</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <input className="input" placeholder="RT Failure" />
          <input className="input" placeholder="Standard Panel Messages" />
        </div>

        {/* SAFETY & INTELLIGENCE */}
        <textarea
          className="textarea mt-3"
          placeholder="Escape and Evasion Routes"
        />
        <textarea
          className="textarea mt-3"
          placeholder="Destruction of Aircraft Camera / Film"
        />
        <textarea
          className="textarea mt-3"
          placeholder="Destruction of Incriminating Documents on Pilots"
        />

        <input
          className="input mt-3"
          placeholder="Geneva Convention (as applicable)"
        />
        <input className="input mt-3" placeholder="Synchronise Watches" />
        <input className="input mt-3" placeholder="Empty Pockets" />

        {/* CHECK BACK */}
        <h3 className="font-semibold mt-4">Check Back</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <input className="input" placeholder="Task" />
          <input className="input" placeholder="FLOT" />
          <input className="input" placeholder="AD Deployment" />
          <input className="input" placeholder="ADAFAs" />
        </div>

        {/* PILOT CONFIRMATION */}
        <textarea
          className="textarea mt-3"
          placeholder="Pilot Confirmation: Maximum Information & Questions"
        />

        {/* PART II */}
        <h3 className="font-semibold mt-6 underline text-center">
          PART II (For Reference of GLO Only)
        </h3>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <input className="input" placeholder="Number of Prints Required" />
          <input
            className="input"
            placeholder="Earliest & Latest Time of Photo Delivery"
          />
          <input
            className="input col-span-2"
            placeholder="Method of Delivery (If Airdrop, Map Reference of DZ)"
          />
          <input
            className="input"
            placeholder="Received in Plain Language At"
          />
          <input className="input" placeholder="Briefing Completed At" />
        </div>

        {/* SIGNATURES */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <input className="input" placeholder="Airfield" />
          <input className="input" placeholder="DTG" />
          <input className="input" placeholder="Duty Pilot" />
          <input
            className="input col-span-3"
            placeholder="Intelligence Officer"
          />
        </div>
      </section>

      {/* ================= SUBMIT ================= */}
      <button
        type="submit"
        className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded font-bold cursor-pointer"
      >
        SUBMIT COMPLETE AIR OPERATIONS FORM
      </button>
    </form>
  );
};

export default LocalChatFormDef;
