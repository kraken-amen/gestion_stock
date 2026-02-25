import { Link, Outlet } from "react-router-dom"

const DashboardLayout = () => {
  return (
    <div>
      <nav>
        <Link to="/dashboard">Dashboard</Link> |
        <Link to="/users">Users</Link> |
        <Link to="/roles">Roles</Link>
      </nav>
      <Outlet />
    </div>
  )
}

export default DashboardLayout