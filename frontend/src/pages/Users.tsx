import { useEffect, useState } from "react"
import { getUsers } from "../services/userService"
import type { User } from "../types"

const Users = () => {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        getUsers().then((res) => {
            setUsers(res.data);
        });
    }, [])

    return (
        <div>
            <h2>Users</h2>
            {users.map((u) => (
                <div key={u._id}>
                    {u.email} - {u.role}
                </div>
            ))}
        </div>
    )
}

export default Users