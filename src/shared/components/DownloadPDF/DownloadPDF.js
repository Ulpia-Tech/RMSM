import { Typography } from '@mui/material';
import pdfFile from '../../../utils/MSM_Documentation.pdf';

const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfFile;
    link.download = 'MSM_Documentation.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const DownloadPDF = () => {
    return (
        <>
            <Typography onClick={handleDownload} sx={{ cursor: "pointer", float: 'right', marginLeft: 'auto' }}>HELP</Typography>
        </>
    )
}

export default DownloadPDF
