import { GlobalVars } from "../../../utils/globals";
import PermissionIcon from "../PermissionIcon/PermissionIcon";

const PermissionChoice = ({ handleClick }) => {

    return (
        <span style={{ width: 100, height: '100%', cursor: 'pointer' }}>
            <span style={{ marginRight: 8 }}
                onClick={handleClick}
                data-permission='grant' dataset='grant' id="grant">
                <PermissionIcon relativePath={'/images/tick-green.svg'} height={15} type={GlobalVars.Table_Values.Grant} />
            </span>
            <span>
                <img src="/images/vertical-line.svg" alt="vertical line" />
            </span>
            <span style={{ marginLeft: 8, marginBottom: 5, height: 100 }}
                onClick={handleClick}
                data-permission='deny' id="deny">
                <PermissionIcon relativePath={'/images/cross-red.svg'} height={15} type={GlobalVars.Table_Values.Deny} />
            </span>

        </span>
    )
}

export default PermissionChoice