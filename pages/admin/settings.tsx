import AdminLayout from "@/components/layout/admin";
import {Table, TableBody, TableBodyRow, TableHead} from "@/components/table";
import AdminCard from "@/components/admin/card";
import {useApiSWR} from "@/hooks/api";
import Form, {FormClientSideSubmitHandler, FormInput, FormLabel} from "@/components/form";
import {useState} from "react";
import {EventTypes, webhookEndpointPattern} from "@/lib/eventbus/eventbus.types";
import Badge from "@/components/badge";
import {useNotifications} from "@/hooks/notifications";
import {fetchApi} from "@/util/api";
import {BarLoader} from "react-spinners";
import {TransparentButton} from "@/components/button";

function AddWebhookForm({refreshWebhooks}: { refreshWebhooks: () => void }) {
    const {pushNotification} = useNotifications();
    const [name, setName] = useState<string>("");
    const [endpoint, setEndpoint] = useState<string>("");
    const [events, setEvents] = useState<string[]>([]);

    const handleSubmit: FormClientSideSubmitHandler = (e, finishProcess) => {
        e.preventDefault();
        if (name.length == 0 || endpoint.length == 0) {
            pushNotification("Please fill out all fields.");
            finishProcess();
            return;
        } else if (events.length == 0) {
            pushNotification("Please select at least one event.");
            finishProcess();
            return;
        } else if (!webhookEndpointPattern.test(endpoint)) {
            pushNotification("Please enter a valid endpoint.");
            finishProcess();
            return;
        }
        fetchApi("/api/webhook", {
            method: "POST",
            body: JSON.stringify({name, endpoint, types: events}),
        }).then((value) => {
            pushNotification(value.ok ? "Webhook added successfully." : "Failed to add webhook.");
            if (value.ok) {
                setName("");
                setEndpoint("");
                setEvents([]);
            }
        }).finally(() => {
            finishProcess();
            refreshWebhooks();
        });
    }

    return (
        <Form
            clientSideSubmit={handleSubmit}
            clientSideSubmitButtonName="Add Webhook"
            clientSideSubmitButtonCss="w-fit"
        >
            <FormLabel htmlFor="name">Name</FormLabel>
            <FormInput name="name" onChange={(e) => setName(e.currentTarget.value)} />
            <FormLabel htmlFor="endpoint">Endpoint</FormLabel>
            <FormInput name="endpoint" onChange={(e) => setEndpoint(e.currentTarget.value)} />
            <FormLabel>Events</FormLabel>
            {Object.values(EventTypes).map((evtType, i) => (
                <Badge active={events.includes(evtType)} role="button" key={i} onClick={(e) => {
                    e.preventDefault();
                    if (events.includes(evtType)) {
                        setEvents(events.filter(evt => evt !== evtType));
                    } else {
                        setEvents([...events, evtType]);
                    }
                }}>
                    {evtType}
                </Badge>
            ))}
        </Form>
    )
}

export default function Settings() {
    const {pushNotification} = useNotifications();
    const {data, isLoading, mutate} = useApiSWR<{ id: number, name: string, endpoint: string, types: string[] }[]>(
        "/api/webhooks", {}, { refreshInterval: 4000 }
    );
    const [disabled, setDisabled] = useState<boolean>(false);

    const handleWebhookRemove = async (webhook: number) => {
        if (disabled) {
            return;
        }
        setDisabled(true);
        await fetchApi(`/api/webhook?id=${webhook}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (res.ok) {
                    pushNotification("Webhook removed successfully");
                } else {
                    pushNotification("Failed to remove webhook (" + res.status + ")");
                }
            })
            .catch((reason) => pushNotification(`Failed: ${reason}`))
            .finally(() => setDisabled(false));
    }

    return (
        <AdminLayout title={"Settings"} path={"/settings"}>
            <AdminCard title={"Webhook Options"} className="w-full" solidBackground>
                <AddWebhookForm refreshWebhooks={mutate} />
                <Table>
                    <TableHead>
                        <tr>
                            <th>Webhook Name</th>
                            <th>Endpoint</th>
                            <th>Events</th>
                            <th>Options</th>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {isLoading ? <BarLoader color="white" width="50%" /> : data?.map((webhook, i) => (
                            <TableBodyRow key={i}>
                                <td>{webhook.name}</td>
                                <td>{webhook.endpoint}</td>
                                <td>{webhook.types.map((whType, i1) => <Badge key={i1}>{whType}</Badge>)}</td>
                                <td>{disabled ? <BarLoader width="50px" color="white" /> : (
                                    <TransparentButton onClick={async (e) => {
                                        e.preventDefault();
                                        await handleWebhookRemove(webhook.id)
                                    }}>Remove</TransparentButton>
                                )}</td>
                            </TableBodyRow>
                        ))}
                    </TableBody>
                </Table>
            </AdminCard>
        </AdminLayout>
    )
}
