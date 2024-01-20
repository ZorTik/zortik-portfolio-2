import AdminLayout from "@/components/layout/admin";
import AdminCard from "@/components/admin/card";
import {StatisticCard} from "@/components/statistic_card";
import {faEllipsis, faGear, faPlus, faUser, faXmark} from "@fortawesome/free-solid-svg-icons";
import Hr from "@/components/hr";
import useSWR from "swr";
import {useApiSWR} from "@/hooks/api";
import {Table, TableBody, TableBodyRow, TableHead} from "@/components/table";
import {User} from "@/security/user.types";
import {useState} from "react";
import Image from "next/image";
import Dropdown, {DropdownButton, DropdownIcon} from "@/components/dropdown";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button, {TransparentButton} from "@/components/button";
import {Modal, ModalBody, ModalFooter} from "@/components/modal";
import Badge from "@/components/badge";
import {BarLoader, CircleLoader, SkewLoader} from "react-spinners";
import {fetchRestrictedApiUrl} from "@/util/api";
import {useNotifications} from "@/hooks/notifications";
import {useUser} from "@/hooks/user";
import {scopes} from "@/security/scope";

function RegisteredUsersStatisticCard() {
    const {data, isLoading} = useApiSWR<{ count: number }>('/api/users/statistics?type=count', {}, { refreshInterval: 10000 });
    return <StatisticCard faIcon={faUser} title={"Registered Users"} value={data ? `${data.count}` : (isLoading ? "Loading..." : "Error!")} />
}

function UsersTable() {
    const [page, setPage] = useState<number>(0);
    const [moreInfoModalsShown, setMoreInfoModalsShown] = useState<{ [id: string]: boolean }>({});
    const [pending, setPending] = useState<boolean>(false);
    const [frozen, setFrozen] = useState<boolean>(false);
    const {pushNotification} = useNotifications();
    const userProps = useUser();
    const {data, isLoading} = useApiSWR<{ users: User[] }>('/api/users', {
        method: "POST",
        body: JSON.stringify({ per_page: 10, page: page, }),
    }, { refreshInterval: 3000 }, (data) => {
        if (pending) {
            setPending(false);
            setFrozen(false);
        }
    });
    return (
        <Table>
            <TableHead>
                <tr>
                    <th className="px-2 py-2">Username</th>
                    <th className="px-2 py-2">ID</th>
                    <th className="px-2 py-2">Scopes</th>
                </tr>
            </TableHead>
            <TableBody>
                {data ? data.users.map((user, i) => (
                    <>
                        <TableBodyRow key={i}>
                            <td className="px-2 py-2 flex items-center">
                                {user.avatar_url ? (
                                    <Image className="mr-4" src={user.avatar_url ?? ""} alt={user.username} width={20} height={20} />
                                ) : <FontAwesomeIcon icon={faUser} className="mr-4 w-[20px] text-neutral-600" />}
                                <p className="text-white">{user.username}</p>
                            </td>
                            <td className="px-2 py-2 text-neutral-300">{user.userId}</td>
                            <td className="px-2 py-2 text-neutral-300 flex flex-wrap space-x-2">{user.scopes.map((scope, key) => (
                                <Badge key={key}>{scopes.find(s => s.type === scope)?.name ?? scope} <TransparentButton onClick={() => {
                                    if (frozen) return;
                                    fetchRestrictedApiUrl(`/api/user/${user.userId}`)
                                        .then(res => res.json())
                                        .then(res => {
                                            if (userProps.user?.userId === res.userId) {
                                                pushNotification(`You can't remove your own scopes!`);
                                                return;
                                            }
                                            const newScopes = res.scopes.filter((s: string) => s !== scope);
                                            setFrozen(true);
                                            fetchRestrictedApiUrl(`/api/user/${user.userId}`, {
                                                method: 'PATCH',
                                                body: JSON.stringify({ scopes: newScopes })
                                            })
                                                .then(() => pushNotification(`Scope ${scope} removed from user ${user.userId}!`))
                                                .finally(() => setPending(true));
                                        })
                                }} className="ml-1 w-2.5 h-2.5 -translate-y-[1px]"><FontAwesomeIcon icon={faXmark} /></TransparentButton></Badge>
                            ))} {(
                                <Dropdown
                                    button={<p>Add Scope</p>}
                                    label={"Select Scope"}
                                    className="text-neutral-600 hover:text-neutral-400"
                                    arrowClassName="text-neutral-600 hover:text-neutral-400"
                                >
                                    {scopes.map((scope, key) => (
                                        <DropdownButton onClick={() => {
                                            if (frozen) return;
                                            fetchRestrictedApiUrl(`/api/user/${user.userId}`)
                                                .then(res => res.json())
                                                .then(res => {
                                                    if (userProps.user?.userId === res.userId) {
                                                        pushNotification(`You can't add scopes to your own account!`);
                                                        return;
                                                    } else if (res.scopes.includes(scope.type)) {
                                                        pushNotification(`User ${user.userId} already has scope ${scope.type}!`);
                                                        return;
                                                    }
                                                    const newScopes = [...res.scopes, scope.type];
                                                    setFrozen(true);
                                                    fetchRestrictedApiUrl(`/api/user/${user.userId}`, {
                                                        method: 'PATCH',
                                                        body: JSON.stringify({ scopes: newScopes })
                                                    })
                                                        .then(() => pushNotification(`Scope ${scope.type} added to user ${user.userId}!`))
                                                        .finally(() => setPending(true));
                                                });
                                        }} key={key}>{scope.name}</DropdownButton>
                                    ))}
                                </Dropdown>
                            )}</td>
                            <td className="px-2 py-2">
                                <div className="w-fit">
                                    {!frozen ? (
                                        <Dropdown button={<DropdownIcon icon={faGear} />} label={"User Actions"}>
                                            <DropdownButton onClick={() => setMoreInfoModalsShown({ ...moreInfoModalsShown, [user.userId]: true })}>More Info</DropdownButton>
                                            <DropdownButton onClick={() => {
                                                if (frozen) return;
                                                setFrozen(true);
                                                fetchRestrictedApiUrl(`/api/user/${user.userId}`, { method: 'DELETE' })
                                                    .then(() => pushNotification(`User ${user.userId} deleted!`))
                                                    .finally(() => setPending(true));
                                            }}>Delete User</DropdownButton>
                                        </Dropdown>
                                    ) : <BarLoader color="white" width="50px" />}
                                </div>
                            </td>
                        </TableBodyRow>
                        <Modal title={`User ${user.username}`} shown={moreInfoModalsShown[user.userId] ?? false}>
                            <ModalBody>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td className="px-2 py-2">Username:</td>
                                        <td className="px-2 py-2">{user.username}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-2">Local User ID:</td>
                                        <td className="px-2 py-2">{user.userId}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-2">Avatar URL:</td>
                                        <td className="px-2 py-2">{user.avatar_url ?? "<Not Set>"}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-2">Auth Scopes:</td>
                                        <td className="px-2 py-2">{user.scopes.length > 0 ? user.scopes.join(", ") : "<None>"}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </ModalBody>
                            <ModalFooter>
                                <TransparentButton onClick={() => setMoreInfoModalsShown({ ...moreInfoModalsShown, [user.userId]: false })}>Close</TransparentButton>
                            </ModalFooter>
                        </Modal>
                    </>
                )) : null}
            </TableBody>
        </Table>
    )
}

export default function Users() {
    return (
        <AdminLayout title={"Users"} path={"/users"}>
            <AdminCard title="Users" subtitle="Users listing" className="w-full" solidBackground>
                <RegisteredUsersStatisticCard />
                <Hr />
                <div>
                    <Button variant="success" href="/users/create">Add User</Button>
                </div>
                <UsersTable />
            </AdminCard>
        </AdminLayout>
    )
}
