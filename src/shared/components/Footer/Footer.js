import { Box, Link } from "@mui/material";
import "./Footer.css";
function MaskingContacts(encoded) {
    switch (encoded) {
        case 'mail':
            window.location.href = "mailto:info@ulpia.tech";
            break;
        case 'tel':
            window.location.href = "tel:+359 889 557573";
            break;
        default:
            break;
    }
}
const Footer = () => {

    return (
        <Box data-testid="footer" className="footer" fontSize={14}>
            Created by
            <Link
                href="https://ulpia.tech/"
                rel='noopener noreferrer'
                target='_blank'
                underline="none">
                <span style={{ color: 'black', fontWeight: 500, marginLeft: '5px' }}>ULPIA </span>
                <span style={{ color: '#2B98F2', fontWeight: 500, marginLeft: '5px' }}>TECH</span>
            </Link>
            <span style={{ margin: '0 10px' }}>|</span>
            <Link
                onClick={() => MaskingContacts('mail')}
                href="#"
                rel='noopener noreferrer'
                target='_blank'
                underline="none">
                <span className="reverse" data-user="ofni" data-website="hcet.aiplu"></span>
            </Link>
            <span style={{ margin: '0 10px' }}>|</span>
            <Link
                onClick={() => MaskingContacts('tel')}
                href="#"
                rel='noopener noreferrer'
                target='_blank'
                underline="none">
                <span className="reversetel" data-tel="375755 988 953"></span>
            </Link>
            <span style={{ margin: '0 10px' }}>|</span>
            <Link
                href="https://ulpia.tech"
                rel='noopener noreferrer'
                target='_blank'
                underline="none">
                www.ulpia.tech
            </Link>
        </Box >
    )
}

export default Footer