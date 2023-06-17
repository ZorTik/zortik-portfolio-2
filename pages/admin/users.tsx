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
import Dropdown, {DropdownButton} from "@/components/dropdown";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {TransparentButton} from "@/components/button";
import {Modal, ModalBody, ModalFooter} from "@/components/modal";
import Badge from "@/components/badge";

function RegisteredUsersStatisticCard() {
    const {data, isLoading} = useApiSWR<{ count: number }>('/api/users/statistics?type=count', {}, { refreshInterval: 10000 });
    return <StatisticCard faIcon={faUser} title={"Registered Users"} value={data ? `${data.count}` : (isLoading ? "Loading..." : "Error!")} />
}

function UsersTable() {
    const [page, setPage] = useState<number>(0);
    const [moreInfoModalsShown, setMoreInfoModalsShown] = useState<{ [id: string]: boolean }>({});
    const {data, isLoading} = useApiSWR<{ users: User[] }>('/api/users', {
        method: "POST",
        body: JSON.stringify({ per_page: 10, page: page, }),
    }, { refreshInterval: 10000 });
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
                                <Badge key={key}>{scope} <TransparentButton className="ml-1"><FontAwesomeIcon icon={faXmark} /></TransparentButton></Badge>
                            ))} {(
                                <Dropdown
                                    button={<p>Add</p>}
                                    label={"Select Scope"}
                                    className="text-neutral-600 hover:text-neutral-400"
                                    arrowClassName="text-neutral-600 hover:text-neutral-400"
                                >
                                    <DropdownButton>TO DO</DropdownButton>
                                </Dropdown>
                            )}</td>
                            <td className="px-2 py-2">
                                <div className="w-fit">
                                    <Dropdown button={<FontAwesomeIcon icon={faGear} />} label={"User Actions"}>
                                        <DropdownButton onClick={() => setMoreInfoModalsShown({ ...moreInfoModalsShown, [user.userId]: true })}>More Info</DropdownButton>
                                        <DropdownButton>Delete User</DropdownButton>
                                    </Dropdown>
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
            <AdminCard title="Users" subtitle="Users listing" className="w-full">
                <RegisteredUsersStatisticCard />
                <Hr />
                <UsersTable />
            </AdminCard>
        </AdminLayout>
    )
}
