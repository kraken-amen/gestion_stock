import { useEffect, useState } from "react"
import { getRoles } from "../services/rolesService"
import type { Role } from "../types"

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    getRoles().then(setRoles)
  }, [])

  return (
    <div>
      <h2>Roles</h2>
      {roles.map((r) => (
        <div key={r._id}>{r.name}</div>
      ))}
    </div>
  )
}

export default Roles