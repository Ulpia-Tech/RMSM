export const GlobalVars = {}

GlobalVars.Table_Values = {}

GlobalVars.Table_Values.Grant = 'GRANT'
GlobalVars.Table_Values.Deny = 'DENY'
GlobalVars.Table_Values.Derive = 'DERIVED'
GlobalVars.Table_Values.Filter = 'FILTER'

GlobalVars.SELECT_TYPES = {}

GlobalVars.SELECT_TYPES.SELECT = 'SELECT';
GlobalVars.SELECT_TYPES.UNSELECT = 'UNSELECT';

GlobalVars.ACCESS_TYPES_COLLECTION = ["CREATE", "READ", "UPDATE", "DELETE", "MERGE", "UNMERGE",
    "INITIATE_CHANGE_REQUEST", "ACCEPT_CHANGE_REQUEST"]

GlobalVars.ACCESS_TYPE_PREREQUISITES = {
    CREATE: ['READ', 'UPDATE'],
    READ: [],
    UPDATE: ['READ'],
    DELETE: ['READ'],
    MERGE: ['READ', 'UPDATE'],
    UNMERGE: ['READ', 'UPDATE'],
    INITIATE_CHANGE_REQUEST: ['READ'],
    ACCEPT_CHANGE_REQUEST: [],
}

export const COLUMNS_COLLECTION = [
    { Header: 'Create' },
    { Header: 'Read' },
    { Header: 'Update' },
    { Header: 'Delete' },
    { Header: 'Merge' },
    { Header: 'Unmerge' },
    { Header: 'Initiate_DCR' },
    { Header: 'Accept_DCR' },
]


GlobalVars.ACCESS_TYPES = {
    CREATE: "Create",
    READ: "Read",
    UPDATE: "Update",
    DELETE: "Delete",
    MERGE: "Merge",
    UNMERGE: "Unmerge",
    INITIATE_CHANGE_REQUEST: "Initiate_Change_Request",
    ACCEPT_CHANGE_REQUEST: "Accept_Change_Request",
}

GlobalVars.CONFIGURATION_TYPES_URI = {
    ENTITY: 'configuration/entityTypes',
    RELATION: 'configuration/relationTypes',
}

GlobalVars.FILTER_TYPES = {
    ROLE: 'role',
    ATTRIBUTE: 'attribute',
    DERIVE: 'derive',
    RIGHT: 'right'
}

GlobalVars.TenantSystemRoles = [
    "ROLE_USER_MATCHIQ_PUBLISH_MODEL",
    "ROLE_USER_RIH_INVOKER",
    "ROLE_DNB_CONNECTOR",
    "ROLE_DVF_USER",
    "ROLE_EXPORT",
    "ROLE_INITIATE_CHANGE_REQUEST",
    "ROLE_EXTERNALMATCH_ADMIN",
    "ROLE_RDM_SUGGEST",
    "ROLE_ADMIN_SHIELD",
    "ROLE_USER_MATCHIQ_EXTERNAL_MATCH",
    "ROLE_AE4",
    "ROLE_AE3",
    "ROLE_DATALOADER_ADMIN",
    "ROLE_FREEMIUM_USER",
    "ROLE_USER",
    "ROLE_ANALYTICS",
    "ROLE_DNB_CONNECTOR_SERVICE",
    "ROLE_AE5",
    "ROLE_UI_ALL",
    "ROLE_DS",
    "ROLE_SYNC",
    "ROLE_DVF_ADMIN",
    "ROLE_USERINFO_READONLY",
    "ROLE_USER_RIH_STS",
    "ROLE_SFDC_CONNECTOR_ADMIN",
    "ROLE_ACTIVITIES",
    "ROLE_USER_MATCHIQ_SHARE_MODEL",
    "ROLE_DTSS_DEPLOYER",
    "CONFIG_SERVICE",
    "ROLE_READONLY",
    "ROLE_RDM_REVIEW",
    "ROLE_ANALYTICS_DEVELOPER",
    "ROLE_ADMIN_CUSTOMER",
    "ROLE_DTSS_ADMIN",
    "ROLE_RDM",
    "ROLE_TASKS_CONSISTENCY",
    "ROLE_WORKFLOW",
    "ROLE_UI_ALL_READONLY",
    "ROLE_DTSS_CT_MANAGER",
    "ROLE_DEVOPSAPI_ADMIN_gus-trial",
    "ROLE_ADMIN_USER",
    "ACCEPT_CHANGE_REQUEST",
    "ROLE_INTEGRATION_CUSTOMER_ADMIN",
    "ROLE_DATA_PIPELINE_ADMIN",
    "ROLE_STORAGE_DETAILS_ADMIN",
    "ROLE_USER_MATCHIQ_TRAIN_MODEL",
    "ROLE_REVIEWER",
    "ROLE_FOR_UNMERGE",
    "ROLE_CLIENT_MANAGEMENT",
    "ROLE_ADMIN_TENANT",
    "ROLE_READ",
    "ROLE_READ_ALL",
    "ROLE_API",
    "ROLE_DNB_CONNECTOR_CONFIG",
    "ROLE_ADMIN_GRAPH",
    "ROLE_DATALOADER",
    "ROLE_STATISTICS_REPORTING",
    "ROLE_FREEMIUM_ADMIN",
    "ROLE_ADMIN_BQSU",
    "ROLE_ADMIN_SHIELD_READ",
    "ROLE_ADMIN_READONLY",
    "ROLE_INTEGRATION_SPECIALIST",
    "ROLE_SFDC_CONNECTOR",
    "ROLE_EXTERNAL_MATCH",
    "ROLE_DTSS_DT_MANAGER",
    "ROLE_WORKFLOW_READ",
    "ROLE_CASSANDRA_BROWSER",
    "ROLE_RDM_EDIT"
]