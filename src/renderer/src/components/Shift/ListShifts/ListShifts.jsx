import ShiftCard from "../ShiftCard";

const ListShifts = ({ shifts, setSelectedShift }) => {
  return (
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns:
          window.innerWidth > 640
            ? "repeat(auto-fill, minmax(350px, 1fr))"
            : "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {shifts?.map((shift) => (
        <ShiftCard
          key={shift.id}
          shift={shift}
          setSelectedShift={setSelectedShift}
        />
      ))}
    </div>
  );
};

export default ListShifts;
