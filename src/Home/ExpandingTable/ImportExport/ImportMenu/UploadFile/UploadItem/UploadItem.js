import { Box, Button, Link, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useUploadedFiles } from "../../../../../../Context/UploadedFilesContext/UploadedFilesContextProvider";
import { PermissionsFormatChecker } from "../../../../../../utils/permissions-format-checker";

const UploadItem = ({ heading, id, onReceiveSelectedFile, onDeleteSelectedFile, disabled = false }) => {
    const theme = useTheme();

    const uploadedFiles = useUploadedFiles();

    let startFile = null;
    if (id === 'PERMISSION_FILE') {
        startFile = uploadedFiles.configurationFile;
    } else if (id === 'L3_FILE') {
        startFile = uploadedFiles.L3File;
    } else if (id === 'CUSTOM_ROLES_FILE') {
        startFile = uploadedFiles.customRolesFile;
    }

    const [selectedFile, setSelectedFile] = useState(startFile);
    const [fileFormatError, setFileFormatError] = useState(false);

    const processFile = (file) => {
        const reader = new FileReader();
        try {
            reader.readAsText(file, "UTF-8");
        } catch (err) {
            return;
        }

        reader.onload = function (evt) {
            let parsedFile;
            try {
                parsedFile = JSON.parse(evt.target.result);
            } catch (ignored) {
                setFileFormatError(true);
                setSelectedFile(null);
                return;
            }

            if (id === "PERMISSION_FILE") {
                const isFormatCorrect = PermissionsFormatChecker.validateFile(parsedFile);
                if (!isFormatCorrect) {
                    setFileFormatError(true);
                    setSelectedFile(null);
                    return;
                }
            }
            onReceiveSelectedFile(JSON.parse(evt.target.result), id);
        }
    }

    const loadFile = (file) => {
        if (file && file.type !== "application/json") {
            setFileFormatError(true);
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setFileFormatError(false);
        processFile(file);
        if (id === 'PERMISSION_FILE') {
            uploadedFiles.setConfigurationFile(file);
        }
        if (id === 'L3_FILE') {
            uploadedFiles.setL3File(file);
        }
        if (id === 'CUSTOM_ROLES_FILE') {
            uploadedFiles.setCustomRolesFile(file);
        }
    }

    useEffect(() => {
        if (startFile) {
            loadFile(startFile);
        }
    }, []);

    const handleCapture = ({ target }) => {
        if (disabled) { return; }
        const currentFile = target.files[0];

        loadFile(currentFile);
    };

    const handleClick = ({ target }) => {
        target.value = '';
    }

    const handleDelete = () => {
        onDeleteSelectedFile(id);
        setSelectedFile(null);
        setFileFormatError(false);
        if (id === 'PERMISSION_FILE') {
            uploadedFiles.setConfigurationFile(null);
        }
        if (id === 'L3_FILE') {
            uploadedFiles.setL3File(null);
        }
        if (id === 'CUSTOM_ROLES_FILE') {
            uploadedFiles.setCustomRolesFile(null);
        }
    }

    return (
        <>
            <Box border={'1px solid  #DEDEDE'} p={2} mt={4} display={'flex'} bgcolor={theme.palette.gray.light}>
                <Box flexGrow={1} display={'flex'} alignItems={'center'} color={theme.palette.gray.main} fontWeight={500}>
                    {
                        !fileFormatError
                            ?
                            <>
                                <img style={{ marginRight: 10 }} src="/images/file-gray.svg" alt="file"></img>
                                {
                                    selectedFile
                                        ?
                                        selectedFile.name
                                        :
                                        heading
                                }

                            </>
                            :
                            <>
                                <Box display={'flex'}>
                                    <img width={30} src="/images/cross-red.svg" alt="red cross"></img>
                                    <span style={{ marginLeft: 8, color: '#F62407', fontWeight: 500 }}>
                                        Incorect file format
                                    </span>
                                </Box>
                            </>
                    }
                </Box>
                <Box>
                    {
                        !disabled
                            ?
                            <input
                                style={{ display: 'none' }}
                                accept=".json"
                                id={id}
                                type="file"
                                onChange={handleCapture}
                                onClick={handleClick}
                            />
                            :
                            null
                    }
                    {
                        selectedFile
                            ?
                            <Link
                                onClick={handleDelete}
                                component="button"
                                variant="body1"
                            >Delete</Link>
                            :
                            <label htmlFor={id}>
                                <Button data-testid={id} type='submit' component="span" variant="outlined" disabled={disabled}>Choose file</Button>
                            </label>
                    }
                </Box>
            </Box>
        </>
    )
}

export default UploadItem