import { useState } from "react";
import { actions } from "@/data/action";
import Modal from "../modal/registerModal";
import Register from "../Register";

export default function QuickActions() {
  const [openModal, setOpenModal] = useState<null | string>(null);
  const [user, setUser] = useState<any>(null);

  const handleAction = (action: string) => {
    switch (action) {
      case "ADD_USER":
        setOpenModal("REGISTER");
        break;
      case "EXPORT":
        console.log("Export logic");
        break;
      case "ALERT":
        console.log("Alert logic");
        break;
      case "SYNC":
        console.log("Sync logic");
        break;
    }
  };

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {actions.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => handleAction(item.action)}
            className="
              bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center cursor-pointer 
              transition-transform duration-300 ease-in-out transform hover:scale-105
              hover:border-[#4b6f44]
            "
          >
            <div className="flex justify-center mb-4">
              <div
                className="
                  h-14 w-14 rounded-full bg-[#4b6f44] flex items-center justify-center 
                  transition-transform duration-300 ease-in-out transform hover:-translate-y-2  
                "
              >
                <item.icon className="h-6 w-6 text-white" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-[#0f172a]">
              {item.title}
            </h3>

            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              {item.description}
            </p>
          </button>
        ))}
      </section>

      {openModal === "REGISTER" && (
        <Modal onClose={() => setOpenModal(null)}>
          <Register setUser={setUser} />
        </Modal>
      )}
    </>
  );
}
