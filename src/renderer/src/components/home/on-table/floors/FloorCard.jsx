import { motion, AnimatePresence } from "framer-motion";
import EditFloor from "./EditFloor";
import TableCard from "../tables/TableCard";
import AddTable from "../tables/AddTable";

const FloorCard = ({ floors, floor }) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-xl font-bold text-black1">{floor?.name}</h4>
          <EditFloor floor={floor}/>
        </div>
        <p className="text-base">
          Còn trống:{" "}
          <span className="font-semibold text-primary">
            {floor?.emptyTableTotal}
          </span>
        </p>
      </div>
      <motion.div
        layout
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        className="grid items-center gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr) )",
        }}
      >
        <AnimatePresence>
          {floor?.tables.map((table) => {
            return (
              <TableCard
                key={table.id}
                floorId={floor.id}
                table={table}
                floors={floors}
                floorName={floor?.name}
              />
            );
          })}
          <AddTable floorId={floor.id} />
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FloorCard;
