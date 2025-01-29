import { useTenantRolesCollection } from "../../../../Context/TenantRolesContext/TenantRolesContextProvider"
import WarningPopup from "../../WarningPopup";
import RoleSettings from "./RoleSettings/RoleSettings"

const RoleHeader = ({ roleObject }) => {
    const { allTenantRolesCollection } = useTenantRolesCollection();
    let isInTenant = true;
    if (allTenantRolesCollection.length !== 0) {
        isInTenant = allTenantRolesCollection.some(role => role === roleObject.displayName);
    }


    return (
        <span style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <span style={{ flexGrow: 1 }}>
                {roleObject.displayName}
                {!isInTenant ?
                    <WarningPopup
                        message={'The role exist in the configuration but is not present in the tenant roles'}
                        style={{ width: '15px', marginLeft: '10px' }}
                    />
                    : null}
            </span>
            <span style={{ marginTop: 10 }}>
                <RoleSettings roleObject={roleObject} />
            </span>
        </span>
    )
}

export default RoleHeader