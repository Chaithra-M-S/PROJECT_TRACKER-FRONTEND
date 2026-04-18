import Sidebar from "../components/Sidebar";
const ManagerLayout = () => {
  return (
    <div className="layout">
      <Sidebar role="MANAGER" />
      <div className="content">
        <h2>Manager Dashboard</h2>
      </div>
    </div>
  );
};
export default ManagerLayout;