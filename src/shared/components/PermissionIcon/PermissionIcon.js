const PermissionIcon = ({ relativePath, type, height = 18 }) => {

    return (
        <>
            <img src={relativePath} alt="access" style={{ height: height }} data-permission={type} />
        </>
    )
}

export default PermissionIcon